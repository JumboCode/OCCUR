from django.db import models

# Models

class Location(models.Model):
    street_address = models.CharField(max_length=30),
    city = models.CharField(max_length=15),
    state = models.CharField(max_length=30),
    zip_code = models.CharField(max_length=5), 
    latitude = models.FloatField(max_length=30),
    longitude = models.FloatField(max_length=30),

class Resource(models.Model):
    name = models.CharField(max_length=30),
    location = models.ForeignKey('Location', on_delete=models.CASCADE)

