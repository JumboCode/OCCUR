from django.shortcuts import render

# Create your views here.
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.response import Response
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from api.models import Resource
from api.models import Location
from api.img_upload import cloudinary_url
from api.maps import getCoordinates
from rest_framework import status
from datetime import datetime

class ResourceCreate(CreateAPIView):
    def inputValidator(self, data):
        if data['startDate'] > data['endDate']:
            return (False, 'Start date must be before end date!')
        
        nowStr = datetime.now().strftime('%Y-%m-%d')
        if data['startDate'] < nowStr:
            return (False, 'Start date must be in the future')

        if bool(data['location']) and len(data['location']['zip_code']) != 5 or len(data['location']['zip_code']) != 0:
            return (False, 'Invalid zipcode')

        return (True, '')

    def create(self, request, *args, **kwargs): 
        success, message = self.inputValidator(request.data)  
        if not success:
            print('error:', message)
        address = request.data['location']

        #---- retrieve geoCoordinates 
        geoCoordinates = getCoordinates(address)
        # TO DO:
        # check that a valid lat and lng returned
        # set default lat and lng if nothing is returned
        print (geoCoordinates)
        request.data['location']['latitude'] = geoCoordinates['lat']
        request.data['location']['longitude'] = geoCoordinates['lng']

        #---- convert image to url reference
        if request.data.get('flyer'):
            image = request.data['flyer']
            request.data['flyer'] = cloudinary_url(image)

        serializer = ResourceSerializer(data=request.data)
        if serializer.is_valid():
            resource = serializer.save()
            serializer = ResourceSerializer(resource)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResourceDestroy(DestroyAPIView):
    queryset = Resource.objects.all()
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        Resource_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('resource_data_{}'.format(Resource_id))
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

class LocationList(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
