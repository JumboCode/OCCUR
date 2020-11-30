from django.conf import settings
from dotenv import load_dotenv
import requests
import os

load_dotenv(verbose=True)


### getCoordinates
# Input: adress object
# Input Format: { 'Street_Address': '', 'City' : '', 'State' : '', 'Zip code' : ''}
# Output: lat and lng of given address
# Output Format: {'lat': '', 'lng': '' } or {} if no geocoordinates returned from API call

def getCoordinates(address):
    curr_address = "1313+Disneyland+Dr,+Anaheim,+CA"
    coordinates = {}

    response = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}".format(
        curr_address,
        os.getenv('GOOGLE_MAPS_API_KEY'),
    ))

    response = response.json()
    if response['status'] == "OK":
        coordinates['lat'] = response['results'][0]['geometry']['location']['lat']
        coordinates['lng'] = response['results'][0]['geometry']['location']['lng']
    
    return coordinates