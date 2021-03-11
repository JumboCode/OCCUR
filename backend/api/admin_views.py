from django.http import JsonResponse
import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
# special permissions needed because GET is usually readonly (and therefore visible to all),
# but we don't want just anyone seeing all of our admins' info
@permission_classes([IsAuthenticated])
def get_admins(request):
    # now we would perform different actions based on request method
    payload = request.data
    email = payload["email"]
    headers = request.headers
    response = {
        "email": email,
        "user_metadata": {},
        "blocked": False,
        "email_verified": False,
        "phone_verified": False,
        "app_metadata": {},
        "name": "John Doe",
        "connection": "email",
        "verify_email": False,
    }
    print(response)
    print(headers)
    
    #     r = requests.post('https://occur.us.auth0.com/api/v2/users', data=payload, headers=headers)

    #     r = requests.delete('https://occur.us.auth0.com/api/v2/users/{id}')
    #     r = requests.patch('https://occur.us.auth0.com/api/v2/users/{id}')
    return JsonResponse({'message': 'Hello World!'})
