from django.shortcuts import render

# Create your views here.
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.response import Response
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from api.models import Resource
from api.models import Location

class ResourceCreate(CreateAPIView):
    serializer_class = ResourceSerializer
    
    def create(self, request, *args, **kwargs):
        # validate resource
        # Checks image and processes image_data
            # If image is url store URL 
            # If image is binary data call image_upload(resource[‘Image_Of_Flyer’])
        # Checks address and retrieves latitude and longitude
        # Creates location object
        # Creates resource object
        # Returns resource object

        return Response({"message": "Hello, world!"})

class LocationCreate(CreateAPIView):
    serializer_class = LocationSerializer
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

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