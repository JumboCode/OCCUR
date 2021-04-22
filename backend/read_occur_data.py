import csv 
import json
import re
import requests
from gen_token import get_token 
import sys
import http.client

# Reads an array of resources and makes a post req to 
# server to add new resources to db
def readData(jsonArray):
    for resource in jsonArray:
        resource_data = json.dumps(resource)
        access_token = get_token()
        token = 'Bearer ' + access_token
        headers = {'content-type': 'application/json', 'Authorization': token}
        response = requests.post('https://api.resources.occurnow.org/api/v1/new/resource/', data=resource_data, headers=headers)
        print(response.json)

# reads json file from argv
if len(sys.argv) == 2:
    filename = sys.argv[1]
    f = open(filename)
    jsonArray = json.load(f)
    readData(jsonArray)
else:
    print("Missing json filename path in argv")

