from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
class DummyAPI(APIView):
    def get(self, request, format=None):
        return Response({"message": "Hello, world!"})
