from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
# from occur_cloudinary import upload_image
class DummyAPI(APIView):
    def get(self, request, format=None):
        return Response({"message": "Hello, world!"})

"""
class TestCloudinaryAPI(APIView):
    def get(self, request, format=None):
        image_url = upload_image(base64-encoded img)
        return Response({"message": "Hello, world!"})
"""
