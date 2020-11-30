from django.conf import settings
from dotenv import load_dotenv
import requests
import os

# loading dotenv
load_dotenv(verbose=True)


### getCoordinates
# Input: adress object
#    Format : {“Location”: {
#       “Street_Address”: “”,
#       “City” : “”,
#       “State” : “”,
#       “Zip code” : “”}}

# Output: 
def getCoordinates(address):
    coordinates = {}
    curr_address = "1313+Disneyland+Dr,+Anaheim,+CA"

    response = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}".format(
        curr_address,
        os.getenv('GOOGLE_MAPS_API_KEY'),
    ))

    response = response.json()
    coordinates['lat'] = response['results'][0]['geometry']['location']['lat']
    coordinates['lng'] = response['results'][0]['geometry']['location']['lng']
    
    return coordinates