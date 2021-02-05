from api.models import Location, Resource
from rest_framework import serializers

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Location
        fields  = (
            'id', 'street_address', 'city', 'state', 'zip_code', 'latitude', 'longitude'
        )
        read_only_fields = ('id',)


class ResourceSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)
    class Meta:
        model   = Resource
        fields  = (
            'id', 'name','organization','category','startDate','endDate','time', 'flyer', 'zoom', 'description'
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        location_validated_data = validated_data.pop('location')
        resource = Resource.objects.create(**validated_data)
        location_serializer = self.fields['location']
        location_validated_data['resource'] = resource
        locations = location_serializer.create(location_validated_data)
        return resource