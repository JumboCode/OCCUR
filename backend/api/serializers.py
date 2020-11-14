from api.models import Location, Resource
from rest_framework import serializers


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ()

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ()
