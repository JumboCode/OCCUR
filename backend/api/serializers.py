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
            'id', 'name','organization','category','startDate','endDate','time', 'flyer', 'flyer_id', 'link', 'zoom', 'description', 'location'
        )
        read_only_fields = ('id',)
        write_only_field = ('location',)

    def create(self, validated_data):
        if 'location' in validated_data and validated_data['location']:
            location_validated_data = validated_data.pop('location')
            resource = Resource.objects.create(**validated_data)
            location_serializer = self.fields['location']
            location_validated_data['resource'] = resource
            locations = location_serializer.create(location_validated_data)
            return resource
            
        location_validated_data = validated_data.pop('location')
        return Resource.objects.create(**validated_data)

    def update(self, instance, validated_data):
       
        # *** ADD IF STATEMENT

        # Update location_validated_data to be equal to an empty dict {}, 
        # if all fields in validated_data['location'] are None or empty strings
        location_validated_data = validated_data.pop('location')
        
        # bool to track if location_validated_data is empty
        location_validated_data_empty = True
        # if all fields are "" or "None" set location validated data to an empty dictionary
        for key, item in location_validated_data.items():
            if not (item is "" or item is None):
                #print("item is {}".format(item))
                location_validated_data_empty = False
        
        # if all fields are empty or None, set location_validated_data to empty dictionary
        if location_validated_data_empty:
            location_validated_data = {}

        # Update the resource's fields 
        resource = super().update(instance, validated_data)

        # Find location that is has key to current resource. If it doesn't
        # exist create a new one
        try:
            location_instance = Location.objects.get(**{'resource':instance})
        except Location.DoesNotExist:
            location_instance = None
        
        # CREATE NEW LOCATION CASE
        if location_instance is None:
            location_serializer = self.fields['location']
            location_validated_data['resource'] = resource
            locations = location_serializer.create(location_validated_data)
        # UPDATE LOCATION CASE
        else:
            location_serializer = self.fields['location']
            location_validated_data['resource'] = resource
            locations = location_serializer.update(location_instance, location_validated_data)

        return resource


    # 1. Update location_validated_data
    #     - if fields are all empty or None -> reassign location_validated_data = {} (add as helper function - iterate)
    # 2. Update all fields for resource
    # 3. if location_validated_data isn't empty and there does not exist a location with a key to the given resource instance
    #     -> create a new location
    #     -> assign resource as parent resource of the new location
    # 4. if location_validated_data isn't empty and there exists a location with a key to the given resource instance
    #     -> get that location instance
    #     -> update that location with the fields in location_validated_data
    #     -> syntax: super().update(location_instance, location_validated_data)

