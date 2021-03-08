from rest_framework.test import APITestCase,APISimpleTestCase, APITransactionTestCase, APILiveServerTestCase
from api.models import Resource
from api.models import Location
from rest_framework.reverse import reverse as api_reverse
from api import gen_token
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from django.core import serializers
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
import base64
import os
import io

#---------------------------- Resource Create Tests ---------------------------#

class ResourceTest(APITestCase):
    def test_create_resource(self):
        initial_resource_count = Resource.objects.count()

        # get image from static files
        my_path = os.path.abspath(os.path.dirname(__file__))
        path = os.path.join(my_path, "../static/img/Wics_Event.png")

        # retrieve a default image and encode it to base64 encoded image
        with open(path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode()
        img = 'data:image/png;base64,{}'.format(encoded_image)
        
        # resource data
        resource_attrs = {
            "name": "TEST",
            "organization": "Women in Computer Science",
            "category": "MENTAL_HEALTH",
            "startDate": "2021-12-11",
            "endDate": "2021-12-11",
            "time": "18:00:00",
            "flyer": img,
            "zoom": "https://tufts.zoom.us/j/91768543077?pwd=Wm1JZDJBV2ZZNDI4UXhYVzUvdWE3Zz09",
            "description": "Come and destress with WiCS!",
            "location": {
                "street_address": "20 Professor's Row",
                "city": "Medford",
                "state": "MA",
                "zip_code": "02155"
            }
    }
        # Authenticate API Client instance
        access_token = gen_token.get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        # Make request to backend POST req with resource_attrs
        response = self.client.post('/api/v1/new/resource/', resource_attrs, format='json')
        if response.status_code != 201:
            print(response.data)
        self.assertEqual(
            Resource.objects.count(),
            initial_resource_count + 1,
        )
        for attr, expected_value in resource_attrs.items():
            if attr == "flyer":
                # Flyer image is stored in cloudinary are stored in database as cloudinary URL
                continue
            elif attr == "location":
                # Handles nested location 
                location = LocationSerializer(response.data[attr])
                location_data = JSONRenderer().render(location.data)
                stream = io.BytesIO(location_data)
                location_data = JSONParser().parse(stream)

                for key, val in location_data.items():
                    # since id, long and lat are creaeted within POST req they will not
                    # be fields we need to assert are the same as initial request body
                    if not (key == 'id' or key == 'latitude' or key == 'longitude'):
                        self.assertEqual(location_data[key], expected_value[key])
            else:       
                self.assertEqual(response.data[attr], expected_value)
                

#---------------------------- Resource Delete Tests ---------------------------#
            
class ResourceDestroyTestCase(APITestCase):
    # setUp
    # Purpose: Add resources to default database and authenticate client
    def setUp(self):
        ###---- 1. Resource without nested location data ----###

        # Add resource to test case that will be deleted
        resource = Resource.objects.create(name="Oakland FoodBank", organization="Food 4 Food", category="FOOD", link="https://www.cs.tufts.edu/comp/11/", description="A resource for finding free communal food in Oakland and wider area")

        ###---- 2. Resource with all possible fields ----###
        # gets image from static files
        my_path = os.path.abspath(os.path.dirname(__file__))
        path = os.path.join(my_path, "../static/img/Wics_Event.png")

        # retrieve a default image and encode it to base64 encoded image
        with open(path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode()
        img = 'data:image/png;base64,{}'.format(encoded_image)
        
        # resource data
        resource_all_fields = {
            "name": "Resource with all fields",
            "organization": "Women in Computer Science",
            "category": "MENTAL_HEALTH",
            "startDate": "2021-12-11",
            "endDate": "2021-12-11",
            "time": "18:00:00",
            "flyer": img,
            "zoom": "https://tufts.zoom.us/j/91768543077?pwd=Wm1JZDJBV2ZZNDI4UXhYVzUvdWE3Zz09",
            "link": "https://google.com",
            "description": "Come and destress with WiCS!",
            "location": {
                "street_address": "20 Professor's Row",
                "city": "Medford",
                "state": "MA",
                "zip_code": "02155"
            }
        }
        resource_missing_flyer = {
            "name": "Resource with all fields",
            "organization": "Women in Computer Science",
            "category": "MENTAL_HEALTH",
            "startDate": "2021-12-11",
            "endDate": "2021-12-11",
            "time": "18:00:00",
            "flyer": "",
            "zoom": "https://tufts.zoom.us/j/91768543077?pwd=Wm1JZDJBV2ZZNDI4UXhYVzUvdWE3Zz09",
            "description": "Come and destress with WiCS!",
            "location": {
                "street_address": "20 Professor's Row",
                "city": "Medford",
                "state": "MA",
                "zip_code": "02155"
            }
        }
        resource_missing_dates = {
            "name": "Resource with all fields",
            "organization": "Women in Computer Science",
            "category": "MENTAL_HEALTH",
            "startDate": "",
            "endDate": "",
            "time": "18:00:00",
            "flyer": img,
            "zoom": "https://tufts.zoom.us/j/91768543077?pwd=Wm1JZDJBV2ZZNDI4UXhYVzUvdWE3Zz09",
            "link": "https://google.com",
            "description": "Come and destress with WiCS!",
            "location": {
                "street_address": "20 Professor's Row",
                "city": "Medford",
                "state": "MA",
                "zip_code": "02155"
            }
        }
        
        # Authenticate API Client instance
        access_token = gen_token.get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        # Make POST req with resource_attrs to create new resource
        response = self.client.post('/api/v1/new/resource/', resource_all_fields, format='json')

    # test_delete_default_resource
    # Purpose: 
    def test_delete_default_resource(self):
        num_initial_resources = Resource.objects.count()

        # retrieve id of default resource
        resource_id = Resource.objects.get(name__exact="Oakland FoodBank").id

        # Delete given resource
        response = self.client.delete('/api/v1/{}/delete/resource'.format(resource_id),format='json')
        # Check that resource ID is no longer in database and that 
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Resource.DoesNotExist,Resource.objects.get, id=resource_id)
        self.assertEqual(Resource.objects.count(), num_initial_resources - 1)

    # test_delete_default_resource
    # Purpose: 
    def test_delete_all_fields(self):
        num_initial_resources = Resource.objects.count()

        # retrieve id of default resource
        resource_id = Resource.objects.get(name__exact="Resource with all fields").id

        # EDlete given resource
        response = self.client.delete('/api/v1/{}/delete/resource'.format(resource_id),format='json')
        # Check that resource ID is no longer in database and that 
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Resource.DoesNotExist,Resource.objects.get, id=resource_id)
        self.assertEqual(Resource.objects.count(), num_initial_resources - 1)

#---------------------------- Resource List Tests ---------------------------#

class ResourceListTestCase(APITestCase):
    def test_list_resources(self):
        resources_count = Resource.objects.count()
        response = self.client.get('/api/v1/resources/')
        self.assertIsNone(response.status_code['next'])
        self.assertIsNone(response.status_code['previous'])
        self.assertEqual(response.status_code['count'], resources_count)
        self.assertEqual(len(response.status_code['results']), resources_count)



