from django.conf import settings
import requests
import os
# getCoordinates
# Input: 
# Output: 

# load_dotenv()

def getCoordinates(address):
    curr_address = "1313+Disneyland+Dr,+Anaheim,+CA"

    response = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}".format(
        curr_address,
        os.getenv('GOOGLE_MAPS_API_KEY'),
    ))
    return response.json()
    # print(response['results'])

getCoordinates("nothing")


# https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters