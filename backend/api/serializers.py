from api.models import Location, Resource
from rest_framework import serializers

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Location
        fields  = (
            'id', 'street_address', 'city', 'state', 'zip_code', 'latitude', 'longitude'
        )
        read_only_fields = ('id',)

    def update(self, instance, validated_data):
       
        instance.street_address = validated_data.get('street_address', instance.street_address)
        instance.city = validated_data.get('city', instance.city)
        instance.state = validated_data.get('state', instance.state)
        instance.zip_code = validated_data.get('zip_code', instance.zip_code)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        return instance


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

    def update(self, instance, validated_data):
        #---- new location not null && new location in validated data
        if 'location' in validated_data and validated_data['location']:
            location_validated_data = validated_data.pop('location')
            # resource = Resource.objects.get(validated_data['id']).update(validated_data)
            # resource = Resource.objects.get(validated_data['id'])
            instance.name = validated_data.get('name', instance.name)
            instance.organization = validated_data.get('organization', instance.organization)
            instance.category = validated_data.get('category', instance.category)
            instance.startDate = validated_data.get('startDate', instance.startDate)
            instance.endDate = validated_data.get('endDate', instance.endDate)
            instance.time = validated_data.get('time', instance.time)
            instance.flyer = validated_data.get('flyer', instance.flyer)
            instance.zoom = validated_data.get('zoom', instance.zoom)
            instance.description = validated_data.get('description', instance.description)
            instance.location = validated_data.get('location', instance.location)
            return instance






'''
            #---- if old location is null, create a location
            if not resource['location']:
                location_serializer = self.fields['location']
                location_validated_data['resource'] = resource
                locations = location_serializer.create(location_validated_data)

            #---- if old location isn't null, update location   
            else:
                

        #---- return resource


            #---- new location is null && new location in validated data
        elif 'location' in validated_data and validated_data['location']:
                #---- delete location & make null?
                #---- or just make fields null?

            #---- if both null or both not null
            else:
                #---- update regularly
                locations = location_serializer.update(location_validated_data)
                return resource

# 1. new location not null && new location in validated data

#   a. if old location is null
#        call get with validated_data['id'] like line 24
#        call create
#    b. if it's not null
#       call update

2. new location is null && new location in validated data

    a. only call update on validated data for resource data

3. new location is null && new location in validated data && old loc not null

4.  #---- create location
            location_validated_data['resource'] = resource
            locations = location_serializer.create(location_validated_data)
            return resource'''