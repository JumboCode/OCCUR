from django.db import models

# Models
class Resource(models.Model):
    
    RESOURCE_CATEGORIES = [
    ('FOOD', 'Food'),
    ('HOUSING', 'Housing'),
    ('COMM_GIVE', 'Community Giveaways'),
    ('MENTAL_HEALTH', 'Mental Health'),
    ('INFO', 'Info Sessions/Webinars'),
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

    name            = models.CharField(max_length=30, blank=False)
    organization    = models.CharField(max_length=30, blank=False)
    category        = models.CharField(choices=RESOURCE_CATEGORIES, default='OTHER', max_length=20, null=True, blank=False)
    startDate       = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    endDate         = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    startTime       = models.TimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    endTime         = models.TimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    isRecurring     = modules.BooleanField(null=True, blank=True)
    recurrenceDays  = modules.MultipleChoiceField(choices=DAYS_OF_WEEK,null=True, blank=False, default=[])
    flyer           = models.URLField(null=True, blank=True)
    flyerId         = models.CharField(max_length=30, null=True, blank=True)
    link            = models.URLField(null=True, blank=True)
    meetingLink     = models.URLField(null=True, blank=True)
    description     = models.TextField(blank=False)
    
    def __str__(self):
        return "Resource: {},\n Provided by: {}\n".format(
            self.name,
            self.organization,
        )

class Location(models.Model):
    resource        = models.OneToOneField(Resource, on_delete=models.CASCADE, null=True, blank=True)
    street_address  = models.CharField(max_length=30, blank=True)
    city            = models.CharField(max_length=15, blank=True)
    state           = models.CharField(max_length=30, blank=True)
    zip_code        = models.CharField(max_length=5, blank=True) 
    latitude        = models.FloatField(max_length=30, null=True, blank=True)
    longitude       = models.FloatField(max_length=30, null=True, blank=True)

    def __str__(self):
        return "{},\n{},\n{}, {}".format(
            self.street_address,
            self.city,
            self.state,
            self.zip_code,
        )


