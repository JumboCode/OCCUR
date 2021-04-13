import csv 
import json
import re
import requests
from gen_token import get_token 
import sys
import http.client

def readData(jsonArray):
    # Loop through json object to create 
    resource_data = json.dumps(jsonArray[0])
    print(jsonArray[0])
    access_token = get_token()
    token = 'Bearer ' + access_token
    headers = {'content-type': 'application/json', 'Authorization': token}
    response = requests.post('http://127.0.0.1:8000/api/v1/new/resource/', data=resource_data, headers=headers)
    if response.status_code == 201:
        print(response.json)

if len(sys.argv) == 2:
    filename = sys.argv[1]
    f = open(filename)
    jsonArray = json.load(f)
    readData(jsonArray)
else:
    print("Missing json filename path in argv")

