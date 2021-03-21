from django.http import HttpResponse, JsonResponse
import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import http.client
import dotenv
import os

def get_header():
    dotenv.load_dotenv()
    # get private info from .env
    client_id = os.getenv("MANAGEMENT_ID")
    secret = os.getenv("MANAGEMENT_SECRET")
    conn = http.client.HTTPSConnection("occur.us.auth0.com")
    # request a token to access management api
    payload = "{\"client_id\":\"" + client_id+ "\",\"client_secret\":\"" + secret + "\",\"audience\":\"https://occur.us.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}"
    headers = { 'content-type': "application/json" }
    conn.request("POST", "/oauth/token", payload, headers)
    res = conn.getresponse()
    data = json.loads(res.read().decode("utf-8"))
    # Get management api token
    token = 'Bearer ' + data['access_token']
    # add token to header
    headers = {"content-type":"application/json",
                'Authorization': token}  
    return headers


@api_view(['GET'])
# special permissions needed because GET is usually readonly (and therefore visible to all),
# but we don't want just anyone seeing all of our admins' info
@permission_classes([IsAuthenticated])
def get_admins(request):
    # send request to management api to get list of users
    r = requests.get('https://occur.us.auth0.com/api/v2/users', headers=get_header())
    return HttpResponse(r)

@api_view(['DELETE'])
def delete_admin(request, id):
    return HttpResponse({"id": id})

def new_admin(request):
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
    conn = http.client.HTTPSConnection("occur.us.auth0.com")
    conn.request("POST", "/api/v2/users", json.dumps(payload), get_header())
    res = conn.getresponse()
    r = res.read().decode("utf-8")
    return HttpResponse(r)

def update_admin(request):
    return {}
