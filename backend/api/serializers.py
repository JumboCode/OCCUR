from api.models import Location, Resource
from rest_framework import serializers

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Location
        fields  = (
            'id', 'location_title', 'street_address', 'city', 'state', 'zip_code', 'latitude', 'longitude'
        )
        read_only_fields = ('id',)

class ResourceSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)
    recurrenceDays = serializers.MultipleChoiceField(choices=[ ('SUN', 'Sunday'),('MON', 'Monday'),('TUE', 'Tuesday'),('WED', 'Wednesday'),('THU', 'Thursday'),('FRI', 'Friday'),('SAT', 'Saturday')], required=False)
    class Meta:
        model   = Resource
        fields  = (
            'id', 'name','organization','category','startDate','endDate','startTime', 'endTime', 'isRecurring', 'recurrenceDays', 'flyer', 'flyerId', 'link', 'meetingLink', 'phone', 'email', 'description', 'location'
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
        # Update location_validated_data to be equal to an empty dict {}, 
        # if all fields in validated_data['location'] are None or empty strings

        # bool to track if location_validated_data is empty
        location_validated_data_empty = True

        if 'location' in validated_data:
            location_validated_data = validated_data.pop('location')
        
        # if all fields are "" or "None" set location validated data to an empty dictionary
            for key, item in location_validated_data.items():
                if not (item == "" or item == None):
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
        if location_instance == None and not location_validated_data_empty:
            location_serializer = self.fields['location']
            location_validated_data['resource'] = resource
            locations = location_serializer.create(location_validated_data)
        # UPDATE LOCATION CASE
        elif location_instance != None and not location_validated_data_empty:
            location_serializer = self.fields['location']
            location_validated_data['resource'] = resource
            locations = location_serializer.update(location_instance, location_validated_data)

        return resource
