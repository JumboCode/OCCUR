"""
Use this script to generate access tokens for use in development.
This requires that you configure in your .env the username and password for the OCCUR Test User
account. Reach out to Luke for help using this script.
"""

import requests
import os
import dotenv
from datetime import datetime, timedelta

dotenv.load_dotenv()

username = os.getenv("TEST_USERNAME")
password = os.getenv("TEST_PASSWORD")

r = requests.post('https://occur.us.auth0.com/oauth/token', data={
    "grant_type": "password",
    "client_id": "OUr5pR1GCGKp7krFCbcZ1SwkxZLwTYo8",
    "audience": "occur-api",
    "username": username,
    "password": password,
})

# ANSI escape sequences for colorful output
set_bold_red = "\033[1m\033[91m"
set_bold_green = "\033[1m\033[92m"
set_bold_yellow = "\033[1m\033[93m"
clear = "\033[0m"

if r.ok:
    data = r.json()
    print(set_bold_green, "Access token:", clear, sep="", end=" ")
    print(data["access_token"])
    print(set_bold_yellow, f"Valid until:", clear, sep="", end=" ")
    expiration = datetime.now() + timedelta(seconds=data["expires_in"])
    print(expiration.strftime('%B %-d at %-I:%M %p'))

else:
    print(set_bold_red, f"Something went wrong ({r.status_code}):", clear, sep="", end=" ")
    if not (username and password):
        print("You must configure TEST_USERNAME and TEST_PASSWORD in .env to use this script.")
    else:
        print(r.json()["error_description"])
