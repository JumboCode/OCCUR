from django.db import models
from django import forms
from multiselectfield import MultiSelectField
from phonenumber_field.modelfields import PhoneNumberField

# Models
class Resource(models.Model):

    RESOURCE_CATEGORIES = [
    ('FOOD', 'Food'),
    ('HOUSING', 'Housing'),
    ('COMM_SERVE', 'Community Services'),
    ('MENTAL_HEALTH', 'Mental Health'),
    ('EDUCATION', 'Education/Information'),
    ('EVENTS', 'Events'),
    ('WIFI', 'Free Wifi'),
    ('OTHER', 'Other'),
    ]

    DAYS_OF_WEEK = [
        ('SUN', 'Sunday'),
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday')
    ]
    name            = models.CharField(max_length=70, blank=False)
    organization    = models.CharField(max_length=70, blank=False)
    category        = models.CharField(max_length=30, choices=RESOURCE_CATEGORIES, null=True, blank=True)
    startDate       = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    endDate         = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    startTime       = models.TimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    endTime         = models.TimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    isRecurring     = models.BooleanField(null=True, blank=True)
    recurrenceDays  = MultiSelectField(choices=DAYS_OF_WEEK, default=[], null=True, blank=True)
    flyer           = models.URLField(null=True, blank=True)
    flyerId         = models.CharField(max_length=70, null=True, blank=True)
    link            = models.URLField(null=True, blank=True)
    meetingLink     = models.URLField(null=True, blank=True)
    phone           = models.CharField(null=True, blank=True,max_length=12)
    email           = models.EmailField(null=True, blank=True)
    description     = models.TextField(blank=False)

    def __str__(self):
        return "Resource: {},\n Provided by: {}\n".format(
            self.name,
            self.organization,
        )

class Location(models.Model):
    resource        = models.OneToOneField(Resource, on_delete=models.CASCADE, null=True, blank=True)
    location_title  = models.CharField(max_length=70, blank=True)
    street_address  = models.CharField(max_length=50, blank=True)
    city            = models.CharField(max_length=15, blank=True)
    state           = models.CharField(max_length=30, blank=True)
    zip_code        = models.CharField(max_length=5, blank=True)
    latitude        = models.FloatField(max_length=30, null=True, blank=True)
    longitude       = models.FloatField(max_length=30, null=True, blank=True)

    def __str__(self):
        return "{}:\n{},\n{},\n{}, {}".format(
            self.location_title,
            self.street_address,
            self.city,
            self.state,
            self.zip_code,
        )


