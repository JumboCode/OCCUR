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
            'id', 'name','organization','category','startDate','endDate','time', 'flyer', 'zoom', 'description', 'location'
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        location_validated_data = validated_data.pop('location')
        resource = Resource.objects.create(**validated_data)
        location_serializer = self.fields['location']
        location_validated_data['resource'] = resource
        locations = location_serializer.create(location_validated_data)
        return resource

    def update(self, validated_data):
        location_validated_data = validated_data.pop('location')
        resource = Resource.objects.update(**validated_data)
        location_serializer = self.fields['location']

        #---- if old loc is null, new loc not null
        if location_serializer is None and location_validated_data is not None:
            #---- create location
            location_validated_data['resource'] = resource
            locations = location_serializer.create(location_validated_data)
            return resource
        #---- if old loc is not null, new loc is null
        elif:
            #---- delete location & make null?
            #---- or just make fields null?

        #---- if both null or both not null
        else:
            #---- update regularly
            



