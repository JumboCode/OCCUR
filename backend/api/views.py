from django.shortcuts import render

# Create your views here.
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from api.models import Resource
from api.models import Location
from api.img_upload import cloudinary_url
from api.maps import getCoordinates
from rest_framework import status
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
    def create(self, request, *args, **kwargs):
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

class ResourceRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    lookup_field = 'id'
    serializer_class = ResourceSerializer

    def delete(self, request, *args, **kwargs):
        Resource_id = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            from django.core.cache import cache
            cache.delete('resource_data_{}'.format(Resource_id))
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            from django.core.cache import cache
            Resource = response.data
            cache.set('resource_data_{}'.format(Resource_id), {
                # 'id': Resource['id'], **** just making sure this is read only
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
            cache.set('location_data_{}'.format(Location_id), {
                # 'id': Location['id'], **** just making sure this is read only
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

class LocationList(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer