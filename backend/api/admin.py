from django.contrib import admin

# Register your models here.
from api.models import Resource
from api.models import Location

admin.site.register(Resource)
admin.site.register(Location)