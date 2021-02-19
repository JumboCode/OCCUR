from django.shortcuts import render
import io
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
# Create your views here.
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from api.models import Resource
from api.models import Location
from api.img_upload import cloudinary_url, cloudinary_delete
from api.maps import getCoordinates
from rest_framework import status

from datetime import datetime
import re

from rest_framework.decorators import api_view

@api_view(['GET'])
def apiUrlsList(request):
    Urls = {
        'list all resources': 'api/v1/list/resource',
        'list all locations': 'api/v1/list/location',
        'create a new resource': 'api/v1/new/resource/',
        'delete a resource': 'api/v1/<int:id>/delete/resource',
    }
    return Response(Urls)

class ResourceCreate(CreateAPIView):
    def inputValidator(self, data):
        if data['startDate'] > data['endDate']:
            return (False, 'Start date must be before end date!')
        
        nowStr = datetime.now().strftime('%Y-%m-%d')
        if data['startDate'] < nowStr:
            return (False, 'Start date must be in the future')

        if 'location' in data and data['location'] and len(data['location']['zip_code']) != 5 and len(data['location']['zip_code']) != 0:
            return (False, 'Invalid zipcode')

        dataURLPattern = r"data:.+;base64,"
        if 'flyer' in data and not re.match(dataURLPattern, data['flyer']):
            return (False, 'Data URL for `flyer` is either missing or invalid')

        correctDataURLStart = 'data:image'
        if 'flyer' in data and not correctDataURLStart == data['flyer'][:len(correctDataURLStart)]:
            return (False, 'Attribute `flyer` is not a valid image')

        # Add empty / blank values for attributes that
        # do not have to be passed in to create a new resource
        # -> zoom, flyer, location
        if not 'flyer' in data:
            # return (False, 'Missing `flyer` attribute')
            data['flyer'] = None
        
        if not 'zoom' in data:
            data['zoom'] = None

        if not 'location' in  data:
            data['location'] = {}
        return (True, '')

    def create(self, request, *args, **kwargs): 
        success, message = self.inputValidator(request.data)  
        if not success:
            print('Error: ', message)
            

        #---- retrieve geoCoordinates 
        if 'location' in request.data and request.data['location']:
            print(bool(request.data['location']))
            address = request.data['location']
            geoCoordinates = getCoordinates(address)

            request.data['location']['latitude'] = geoCoordinates['lat']
            request.data['location']['longitude'] = geoCoordinates['lng']

        #---- convert image to url reference

        image = request.data['flyer']
        # if the first part of the string is "data:image/", send to cloudinary
        if image[0: 5] == "data:":
            request.data['flyer'] = cloudinary_url(image)["url"]
            request.data['flyer_id'] = cloudinary_url(image)["public_id"]

        # if it's a url, don't do anything

        serializer = ResourceSerializer(data=request.data)

        if serializer.is_valid():
            resource = serializer.save()
            serializer = ResourceSerializer(resource)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResourceDestroy(DestroyAPIView):
    queryset = Resource.objects.all()
    lookup_field = 'id'
    serializer_class = ResourceSerializer

    def delete(self, request, id=None,*args, **kwargs):
        resource_id = id
        serializer = ResourceSerializer(Resource.objects.all().filter(id=resource_id)[0])
        json = JSONRenderer().render(serializer.data)
        stream = io.BytesIO(json)
        data = JSONParser().parse(stream)
        flyer_id = data['flyer_id']
        if flyer_id:
            cloudinary_delete(flyer_id)
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('resource_data_{}'.format(resource_id))
        return response



class LocationDestroy(DestroyAPIView):
    queryset = Location.objects.all()
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        Location_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('location_data_{}'.format(Location_id))
        return response


class ResourceList(ListAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id','category',)
    search_fields = ('name', 'organization',)

    def get_queryset(self):
        start_date_r = self.request.query_params.get('start_date_r', None)
        end_date_r = self.request.query_params.get('end_date_r', None)

        queryset = Resource.objects.all()

        if start_date_r == None and end_date_r == None:
            return super().get_queryset()
        elif start_date_r != None and end_date_r != None:
            start_date_r = datetime.strptime(start_date_r, '%Y-%m-%d')
            end_date_r = datetime.strptime(end_date_r, '%Y-%m-%d')
            q1 = queryset.filter(
                startDate__lte = end_date_r,
                endDate__gte = end_date_r,
            )
            q2 = queryset.filter(
                startDate__lte = start_date_r,
                endDate__gte = start_date_r,
            )
            return q1.union(q2)
        elif start_date_r != None:
            start_date_r = datetime.strptime(start_date_r, '%Y-%m-%d')
            return queryset.filter(endDate__gte = start_date_r)     
        elif end_date_r != None:
            end_date_r = datetime.strptime(start_date_r, '%Y-%m-%d')
            return queryset.filter(startDate__lte = end_date_r)


class LocationList(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
