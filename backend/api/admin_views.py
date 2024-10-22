from django.http import HttpResponse, JsonResponse
import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import http.client
import dotenv
import os
from django.views.decorators.csrf import csrf_protect

class IsAuthenticatedOrOptions(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'OPTIONS':
            return True
        return super(IsAuthenticatedOrOptions, self).has_permission(request, view)

def validate_incoming_admin(data):
    def make_err_response(msg):
        return {
                "statusCode": 400,
                "error": "Bad Request",
                "message": msg,
                "errorCode": "invalid_body"
        }

    if not "email" in data:
        return make_err_response("Email field is missing")
    if not "name" in data:
        return make_err_response("Name field is missing")

    return None

@api_view(['GET', 'POST'])
# special permissions needed because GET is usually readonly (and therefore visible to all),
# but we don't want just anyone seeing all of our admins' info
@permission_classes([IsAuthenticatedOrOptions])
def get_create_admins(request):
    if request.method == 'GET':
        # send request to management api to get list of users
        r = requests.get('https://occur.us.auth0.com/api/v2/users', headers=get_header())
        return get_http_response(r)
    
    if request.method == 'POST':
        payload = request.data
        val_result = validate_incoming_admin(payload)
        if val_result != None:
            return JsonResponse(val_result)
        # get email and name out of request payload
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
        # send post request to auth0 management api 
        conn = http.client.HTTPSConnection("occur.us.auth0.com")
        conn.request("POST", "/api/v2/users", json.dumps(payload), get_header())
        res = conn.getresponse()
        return JsonResponse(json.loads(res.read()))

# send a request to 'api/v1/<id>/delete/admin' 
# can get the id from the get request (do not add email| on beginning)
@api_view(['DELETE', 'PUT'])
def update_delete_admin(request, id):
    if request.method == 'DELETE':
        url = 'https://occur.us.auth0.com/api/v2/users/email|' + id 
        r = requests.delete(url, headers=get_header())
        res = {}
        if r.status_code == 204:
            res['success'] = True
        else:
            res['success'] = False
        return JsonResponse(res)

    if request.method == 'PUT':
        payload = request.data
        val_result = validate_incoming_admin(payload)
        if val_result != None:
            return JsonResponse(val_result)
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
        # send patch request to auth0 management api 
        conn = http.client.HTTPSConnection("occur.us.auth0.com")
        conn.request("PATCH", "/api/v2/users/email|" + id, json.dumps(payload), get_header())
        res = conn.getresponse()
        return JsonResponse(json.loads(res.read()))

def get_http_response(r):
    return HttpResponse(
        content=r.content,
        status=r.status_code,
        content_type=r.headers['Content-Type']
        )

# Gets an authorization token from oauth api and puts it into a header format  
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

