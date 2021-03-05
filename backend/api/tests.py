from rest_framework.test import APITestCase,APISimpleTestCase, APITransactionTestCase, APILiveServerTestCase
from api.models import Resource
from rest_framework.reverse import reverse as api_reverse
from api import gen_token
from api.serializers import ResourceSerializer
from api.serializers import LocationSerializer
from django.core import serializers
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
import base64
import os
import io

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

        # Make request to backend POSt req with resource_attrs
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

            
class ResourceDestroyTestCase(APITestCase):

    def setUp(self):
        # setting up auth
        access_token = gen_token.get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        my_path = os.path.abspath(os.path.dirname(__file__))
        path = os.path.join(my_path, "../static/img/Wics_Event.png")

        # retrieve a default image and encode it to base64 encoded image
        with open(path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode()
        img = 'data:image/png;base64,{}'.format(encoded_image)
            
        data = {
        "name": "TEST",
        "organization": "Test",
        "category": "MENTAL_HEALTH",
        "startDate": "2021-12-11",
        "endDate": "2021-12-11",
        "time": "18:00:00",
        "flyer": img,
        "zoom": "https://tufts.zoom.us/j/91768543077?pwd=Wm1JZDJBV2ZZNDI4UXhYVzUvdWE3Zz09",
        "description": "Test Data",
        "location": {
            "street_address": "Test St",
            "city": "Test City",
            "state": "TS",
            "zip_code": "00000"
            }
        }
        # creating resource before running delete function
        response = self.client.post('/api/v1/new/resource/', data, format='json')


    def test_delete_resource(self):
        num_initial_resources = Resource.objects.count()
        print(num_initial_resources)
        resource_id = Resource.objects.first().id

        self.client().delete('api/v1/{}/delete/resource/'.format(resource_id))
        self.assertEqual(Resource.objects.count(),initial_resource_count - 1)

'''
# Create your tests here.
class ResourceDestroyTestCase(APITestCase):
    def test_delete_resource(self):
        resource_attrs = {
        "name": "TEST",
        "organization": "Women in Computer Science",
        "category": "MENTAL_HEALTH",
        "startDate": "2020-12-11",
        "endDate": "2020-12-11",
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
        response = self.client.post('/api/v1/new/resource/', resource_attrs, format='json')
        data = response.data
        data_id = data.get('id')
        print("data id:", data_id)
        initial_resource_count = Resource.objects.count()

        rud_url = api_reverse('api:detail', kwargs={'id': data_id})

        delete_response = self.client.delete(rud_url, data_id, format='json')

        # print("*******", Resource.objects.count())
        # resource_id = Resource.objects.first().id
        # print("Resource Id: ", resource_id)
        # path = 'api/v1/' + str(resource_id) +'/delete/resource/'
        # print("Path:", path)

        # response = self.client.delete(path)
        print("Delete response: ", delete_response)
        self.assertEqual(
            Resource.objects.count(),
            initial_resource_count - 1,
        )
        # self.assertRaises(
        #     Resource.DoesNotExist,
        #     Resource.objects.get, id=resource_id,
        # )

        # data = self.create_item()
        # data_id = data.get('id')
        # rud_url = api_reverse('student:detail', kwargs={'pk': data_id})

        # delete_response = self.client.delete(rud_url, data_id, format='json')
        # self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        # get_response = self.client.delete(rud_url, format='json')
        # self.assertEqual(get_response.status_code, status.HTTP_404_NOT_FOUND)
'''