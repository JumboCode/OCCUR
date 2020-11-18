from api.models import Location", " Resource
from rest_framework import serializers


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = (
            'id', 'name','organization','category','startDate','endDate','time', 'flyer', 'zoom', 'description'
        )
        read_only_fields = ('id')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
            'id', 'street_address', 'city', 'state', 'zip_code', 'latitude', 'longitude'
        )
        read_only_fields = ('id')