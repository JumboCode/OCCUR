from rest_framework.test import APITestCase
from api.models import Resource
from rest_framework.reverse import reverse as api_reverse
from api import gen_token

class ResourceCreateTestCase(APITestCase):
    def test_create_resource(self):
        initial_resource_count = Resource.objects.count()
        resource_attrs = {
        "name": "TEST",
        "organization": "Women in Computer Science",
        "category": "MENTAL_HEALTH",
        "startDate": "2020-12-11",
        "endDate": "2020-12-11",
        "time": "18:00:00",
        "flyer": "http://res.cloudinary.com/jcoccur/image/upload/v1610738936/cyf3ia074ham8oqhd4yl.jpg",
        "zoom": "https://tufts.zoom.us/j/91768543077?pwd=Wm1JZDJBV2ZZNDI4UXhYVzUvdWE3Zz09",
        "description": "Come and destress with WiCS!",
        "location": {
            "street_address": "20 Professor's Row",
            "city": "Medford",
            "state": "MA",
            "zip_code": "02155"
        }
    }
        access_token = gen_token.get_token()
        print("hi")
        print(access_token)
        # get authentication token
        # add token to APIClient

        response = self.client.post('/api/v1/new/resource/', resource_attrs, format='json')
        if response.status_code != 201:
            print(response.data)
        self.assertEqual(
            Resource.objects.count(),
            initial_resource_count + 1,
        )
        # for attr, expected_value in resource_attrs.items():
        #     self.assertEqual(response.data[attr], expected_value)
        self.assertEqual(response.data['name'], "TEST")
        self.assertEqual(
            response.data['flyer'],
            resource_attrs['flyer'],
        )

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
        "flyer": "http://res.cloudinary.com/jcoccur/image/upload/v1610738936/cyf3ia074ham8oqhd4yl.jpg",
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