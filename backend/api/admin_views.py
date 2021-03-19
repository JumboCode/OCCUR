from django.http import JsonResponse
import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import http.client
def get_token():
    conn = http.client.HTTPSConnection("dev-9c5bh9r5.us.auth0.com")
    payload = "{\"client_id\":\"Rnnb0iqZ4b1ohSQAU7ubmCisTOFqN6Lg\",\"client_secret\":\"Xm2u3A_59jdJWvP3VrnwlbiBTpK_5JEOX4ZYgXaMvzf7Vnxsqj3NwUsJcXsmBZhR\",\"audience\":\"https://dev-9c5bh9r5.us.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}"
    headers = { 'content-type': "application/json" }
    conn.request("POST", "/oauth/token", payload, headers)
    res = conn.getresponse()
    data = json.loads(res.read().decode("utf-8"))
    print(data)
    return data['access_token']


@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
# special permissions needed because GET is usually readonly (and therefore visible to all),
# but we don't want just anyone seeing all of our admins' info
@permission_classes([IsAuthenticated])
def get_admins(request):
    # now we would perform different actions based on request method
    # payload = request.data
    # email = payload["email"]
    token = 'Bearer ' + get_token()
    headers = {"content-type":"application/json",
    'Authorization': token}
    # response = {
    #     "email": email,
    #     "user_metadata": {},
    #     "blocked": False,
    #     "email_verified": False,
    #     "phone_verified": False,
    #     "app_metadata": {},
    #     "name": "John Doe",
    #     "connection": "email",
    #     "verify_email": False,
    # }
    # print(response)
    print(headers)
    
    r = requests.get('https://dev-9c5bh9r5.us.auth0.com/api/v2/users', headers=headers)
    print(r.content)
    #     r = requests.delete('https://occur.us.auth0.com/api/v2/users/{id}')
    #     r = requests.patch('https://occur.us.auth0.com/api/v2/users/{id}')
    return JsonResponse({'message': 'Hello World!'})
