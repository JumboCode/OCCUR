from django.shortcuts import render

# Create your views here.
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from api.serializers import ResourceSerializer
from api.models import Resource
from api.models import Location

class ResourceCreate(CreateAPIView):
    serializer_class = ResourceSerializer
    
    def create(self, request, format=None):
        # validate resource
        # Checks image and processes image_data
            # If image is url store URL 
            # If image is binary data call image_upload(resource[‘Image_Of_Flyer’])
        # Checks address and retrieves latitude and longitude
        # Creates location object
        # Creates resource object
        # Returns resource object

        return Response({"message": "Hello, world!"})
