from django.shortcuts import render
import io
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
# Create your views here.
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.response import Response
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from api.models import Resource
from api.models import Location
from api.img_upload import cloudinary_url, cloudinary_delete
from api.maps import getCoordinates
from rest_framework import status

class ResourceCreate(CreateAPIView):
    def create(self, request, *args, **kwargs):
        address = request.data['location']

        #---- retrieve geoCoordinates 
        geoCoordinates = getCoordinates(address)
        # TO DO:
        # check that a valid lat and lng returned
        # set default lat and lng if nothing is returned
        request.data['location']['latitude'] = geoCoordinates['lat']
        request.data['location']['longitude'] = geoCoordinates['lng']

        #---- convert image to url reference

        image = request.data['flyer']
        # if the first part of the string is "data:image/", send to cloudinary
        if image[0: 11] == "data:image/":
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
        print("request: ", request)
        resource_id = id
        print("Resource id: ", resource_id)
        serializer = ResourceSerializer(Resource.objects.all().filter(id=resource_id)[0])
        json = JSONRenderer().render(serializer.data)
        stream = io.BytesIO(json)
        data = JSONParser().parse(stream)
        flyer_id = data['flyer_id']
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

class LocationList(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer