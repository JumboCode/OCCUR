from django.shortcuts import render
import io
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
# Create your views here.
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
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
from collections import defaultdict

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

#class ResourceRetrieveUpdate

class ResourceCreate(CreateAPIView):

    defaultOptionalVals = { 'flyer': None, 'zoom': None, 'location': {}, 'flyer_id': None } 

    def inputValidator(self, data):
        # dict of list matches the format of serializer.errors
        errorCatalog = defaultdict(list)

        if data['startDate'] > data['endDate']:
            errorCatalog['startDate'].append('Start date must occur after end date.')
        
        nowStr = datetime.now().strftime('%Y-%m-%d')
        if data['startDate'] < nowStr:
            errorCatalog['startDate'].append('Start date must occur in the future.')

        if data['location'] != {} and data['location'] and len(data['location']['zip_code']) != 5 and len(data['location']['zip_code']) != 0:
            # matching format of error in foreign key field
            errorCatalog['location'] = {}
            errorCatalog['location']['zip_code'] = ['Invalid zipcode.']

        dataURLPattern = r"data:.+;base64,"
        if data['flyer'] != None and not re.match(dataURLPattern, data['flyer']):
            errorCatalog['flyer'].append('Data URL for `flyer` is either missing or invalid.')

        correctDataURLStart = 'data:image'
        if data['flyer'] != None and not correctDataURLStart == data['flyer'][:len(correctDataURLStart)]:
            errorCatalog['flyer'].append('The flyer is not a valid image.')

        return dict(errorCatalog)

    def fillRequestBlanks(self, data, optionalsToDefaults):
        for (fieldName,defaultVal) in optionalsToDefaults.items():
            if not fieldName in data:
                data[fieldName] = defaultVal

    def mergeFieldErrors(self, vErrors, sErrors):
        result = sErrors
        for (vFieldName,vFieldErrors) in vErrors.items():
            if vFieldName == 'location':
                # recursively merge location errors, since it is a foreign key field
                sLocationErrors = sErrors['location'] if 'location' in sErrors else {}
                result['location'] = self.mergeFieldErrors(vFieldErrors, sLocationErrors)
            else:
                # combine both lists of errors
                sFieldErrors = sErrors[vFieldName] if vFieldName in sErrors else []
                result[vFieldName] = sFieldErrors + vFieldErrors
                
        return result

    def create(self, request, *args, **kwargs): 
        self.fillRequestBlanks(request.data, self.defaultOptionalVals)
        vErrors = self.inputValidator(request.data)  

        #---- retrieve geoCoordinates 
        if 'location' in request.data and request.data['location']:
            print(bool(request.data['location']))
            address = request.data['location']
            geoCoordinates = getCoordinates(address)

            request.data['location']['latitude'] = geoCoordinates['lat']
            request.data['location']['longitude'] = geoCoordinates['lng']

        #---- convert image to url reference
        image = request.data['flyer']
        # if optional flyer was not passed or this object will not
        # go on to be added to DB, don't add img to cloudinary
        if image != None and len(vErrors) == 0:
            request.data['flyer'] = cloudinary_url(image)["url"]
            request.data['flyer_id'] = cloudinary_url(image)["public_id"]

        serializer = ResourceSerializer(data=request.data)

        if serializer.is_valid() and len(vErrors) == 0:
            resource = serializer.save()
            serializer = ResourceSerializer(resource)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        errors = self.mergeFieldErrors(vErrors, serializer.errors)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class ResourceRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
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

    def update(self, request, *args, **kwargs):
        address = request.data['location']

        #---- retrieve geoCoordinates 
        geoCoordinates = getCoordinates(address)

        request.data['location']['latitude'] = geoCoordinates['lat']
        request.data['location']['longitude'] = geoCoordinates['lng']

        response = super().update(request, *args, **kwargs)
        
        if response.status_code == 200:
            from django.core.cache import cache
            Resource = response.data
            cache.set('Resource_data_{}'.format(Resource['id']), {
                'name': Resource['name'],
                'organization': Resource['organization'],
                'category': Resource['category'],
                'startDate': Resource['startDate'],
                'endDate': Resource['endDate'],
                'time': Resource['time'],
                'flyer': Resource['flyer'],
                'zoom': Resource['zoom'],
                'description': Resource['description'],
                'location': Resource['location'],
            })
        return response


class LocationRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    lookup_field = 'id'
    serializer_class = LocationSerializer

    def delete(self, request, *args, **kwargs):
        Location_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('location_data_{}'.format(Location_id))
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            from django.core.cache import cache
            Location = response.data
            cache.set('Location_data_{}'.format(Location['id']), {
                'street_address': Location['street_address'],
                'city': Location['city'],
                'state': Location['state'],
                'zip_code': Location['zip_code'],
                'latitude': Location['latitude'],
                'longitude': Location['longitude'],
            })
        return response

class ResourceList(ListAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id','category',)
    search_fields = ('name', 'organization',)

    def get_queryset(self):
        # retrieving query params from request
        start_date_r = self.request.query_params.get('start_date_r', None)
        end_date_r = self.request.query_params.get('end_date_r', None)
        min_long = self.request.query_params.get('min_long', None)
        max_long = self.request.query_params.get('max_long', None)
        min_lat = self.request.query_params.get('min_lat', None)
        max_lat = self.request.query_params.get('max_lat', None)

        queryset = Resource.objects.all()

        # Base case, no filters
        if start_date_r == None and end_date_r == None and min_long == None and max_long == None and min_lat == None and max_lat == None:
            return super().get_queryset()
        
        # if both are supplied
        if start_date_r != None and end_date_r != None:
            # parsing as dates
            start_date_r = datetime.strptime(start_date_r, '%Y-%m-%d')
            end_date_r = datetime.strptime(end_date_r, '%Y-%m-%d')

            if start_date_r > end_date_r:
                return Resource.objects.none()

            # getting resources with dates in the given range
            q1 = queryset.filter(
                startDate__lte = end_date_r,
                endDate__gte = end_date_r,
            )
            q2 = queryset.filter(
                startDate__lte = start_date_r,
                endDate__gte = start_date_r,
            )
            q3 = queryset.filter(
                startDate__gte = start_date_r,
                endDate__lte = end_date_r
            )

            # combining all results
            queryset = q1.union(q2)
            queryset = queryset.union(q3)

        # if only one date range param is supplied
        elif start_date_r != None:
            start_date_r = datetime.strptime(start_date_r, '%Y-%m-%d')
            queryset = queryset.filter(endDate__gte = start_date_r)     
        elif end_date_r != None:
            end_date_r = datetime.strptime(end_date_r, '%Y-%m-%d')
            queryset = queryset.filter(startDate__lte = end_date_r)

        # filtering by lat. & long. ranges passed
        if min_long != None:
            queryset = queryset.filter(location__longitude__gte = min_long)

        if max_long != None:
            queryset = queryset.filter(location__longitude__lte = max_long)

        if min_lat != None:
            queryset = queryset.filter(location__latitude__gte = min_lat)

        if max_lat != None:
            queryset = queryset.filter(location__latitude__lte = max_lat)

        return queryset
        


class LocationList(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_queryset(self):
        min_long = self.request.query_params.get('min_long', None)
        max_long = self.request.query_params.get('max_long', None)
        min_lat = self.request.query_params.get('min_lat', None)
        max_lat = self.request.query_params.get('max_lat', None)

        queryset = Location.objects.all()

        if min_long != None:
            queryset = queryset.filter(longitude__gte = min_long)

        if max_long != None:
            queryset = queryset.filter(longitude__lte = max_long)

        if min_lat != None:
            queryset = queryset.filter(latitude__gte = min_lat)

        if max_lat != None:
            queryset = queryset.filter(latitude__lte = max_lat)

        return queryset
