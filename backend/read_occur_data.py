import csv 
import json
import re
import requests
from gen_token import get_token 
import sys
import http.client

def readData(jsonArray):
    # Loop through json object to create 
    resource_data = json.loads(json.dumps(jsonArray[0]))
    # print(jsonArray[0])
    access_token = get_token()
    token = 'Bearer ' + access_token
    # print(access_token)
    headers = {'content-type': 'application/json', 'Authorization': token}
    response = requests.post('http://127.0.0.1:8000/api/v1/new/resource/', data=resource_data, headers=headers)
    print(response.status_code)
    print(type(resource_data))
    # print(response.headers['content-type'])
    # print(response.json)
    # if response.status_code == 201:``
    #     print(response.json)



    conn = http.client.HTTPSConnection('http://127.0.0.1:8000')

    headers = {'Content-type': 'application/json', 'Authentication':token}

    # iterate over jsonarray and try to add each object to DB 
    # json_data = json.dumps(foo)

    # conn.request('POST', '/post', json_data, headers)

    # response = conn.getresponse()
    # print(response.read().decode())


if len(sys.argv) == 2:
    filename = sys.argv[1]
    f = open(filename)
    jsonArray = json.load(f)
    readData(jsonArray)
else:
    print("Missing json filename path in argv")

