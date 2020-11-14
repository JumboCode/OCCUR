from django.db import models

# Models
class Location(models.Model):
    street_address = models.CharField(max_length=30, blank=True)
    city = models.CharField(max_length=15, blank=True)
    state = models.CharField(max_length=30, blank=True)
    zip_code = models.CharField(max_length=5, blank=True) 
    latitude = models.FloatField(max_length=30, null=True)
    longitude = models.FloatField(max_length=30, null=True)

    def __str__(self):
        return "{},\n{},\n{}, {}".format(
            self.street_address,
            self.city,
            self.state,
            self.zip_code,
        )

class Resource(models.Model):
    
    RESOURCE_CATEGORIES = [
    ('FOOD', 'Food'),
    ('HOUSING', 'Housing'),
    ('COMM_GIVE', 'Community Giveaways'),
    ('MENTAL_HEALTH', 'Mental Health'),
    ('INFO', 'Info Sessions/Webinars'),
    ('EVENTS', 'Events'),
    ('OTHER', 'Other'),
]

    name = models.CharField(max_length=30, blank=True)
    organization = models.CharField(max_length=30, blank=True)
    category = models.CharField(choices=RESOURCE_CATEGORIES, default='OTHER', max_length=20)
    startDate = models.DateField(auto_now=False, auto_now_add=False, null=True)
    endDate = models.DateField(auto_now=False, auto_now_add=False, null=True)
    time = models.TimeField(auto_now=False, auto_now_add=False, null=True)
    flyer = models.URLField(null=True)
    link = models.URLField(null=True)
    location = models.ForeignKey('Location', on_delete=models.CASCADE)
    zoom = models.URLField(null=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return "Resource: {},\n Provided by: {}\n".format(
            self.name,
            self.organization,
        )


