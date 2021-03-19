from django.http import JsonResponse
import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import http.client
import dotenv
import os

def get_token():
    dotenv.load_dotenv()
    # get private info from .env
    client_id = os.getenv("MANAGEMENT_ID")
    secret = os.getenv("MANAGEMENT_SECRET")
    conn = http.client.HTTPSConnection("dev-9c5bh9r5.us.auth0.com")
    # request a token to access management api
    payload = "{\"client_id\":\"" + client_id+ "\",\"client_secret\":\"" + secret + "\",\"audience\":\"https://dev-9c5bh9r5.us.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}"
    headers = { 'content-type': "application/json" }
    conn.request("POST", "/oauth/token", payload, headers)
    res = conn.getresponse()
    data = json.loads(res.read().decode("utf-8"))
    return data['access_token']


@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
# special permissions needed because GET is usually readonly (and therefore visible to all),
# but we don't want just anyone seeing all of our admins' info
@permission_classes([IsAuthenticated])
def get_admins(request):
    # Get management api token
    token = 'Bearer ' + get_token()
    # add token to header
    headers = {"content-type":"application/json",
                'Authorization': token}  
    if request.method =='GET':
        # send request to management api to get list of users
        r = requests.get('https://dev-9c5bh9r5.us.auth0.com/api/v2/users', headers=headers)
        return JsonResponse(r.text, safe=False)
    if request.method == 'POST':
        payload = request.data
        email = payload["email"]
        name = payload["name"]
        payload = {
            "email": email,
            "user_metadata": {},
            "blocked": False,
            "email_verified": False,
            "app_metadata": {},
            "name": name,
            "connection": "email",
            "verify_email": False
        }
        # Get management api token
        token = 'Bearer ' + get_token()
        # add token to header
        headers = {"content-type":"application/json",
                    'Authorization': token}    
        conn = http.client.HTTPSConnection("dev-9c5bh9r5.us.auth0.com")
        conn.request("POST", "/api/v2/users", json.dumps(payload), headers)
        res = conn.getresponse()
        r = json.loads(res.read().decode("utf-8"))
        # send request to management api to get list of users
        # r = requests.post('https://dev-9c5bh9r5.us.auth0.com/api/v2/users', json=json, headers=headers)
        return JsonResponse(r, safe=False)
 
#     r = requests.delete('https://occur.us.auth0.com/api/v2/users/{id}')
#     r = requests.patch('https://occur.us.auth0.com/api/v2/users/{id}')

