import os
import cloudinary
import cloudinary.uploader
import cloudinary.api

from dotenv import load_dotenv
load_dotenv(verbose=True)

cloudinary.config(
    cloud_name = str(os.getenv('CLOUDINARY_CLOUD_NAME')),
    api_key = str(os.getenv('CLOUDINARY_API_KEY')), 
    api_secret = str(os.getenv('CLOUDINARY_API_SECRET')) 
)

def cloudinary_url(encoded_img):
    #Image validation
    image = cloudinary.uploader.upload(encoded_img)
    return image["url"]