# Generated by Django 3.0.3 on 2020-11-06 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_resource_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='city',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name='location',
            name='latitude',
            field=models.FloatField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='location',
            name='longitude',
            field=models.FloatField(max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='location',
            name='state',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='location',
            name='street_address',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='location',
            name='zip_code',
            field=models.CharField(blank=True, max_length=5),
        ),
        migrations.AddField(
            model_name='resource',
            name='category',
            field=models.CharField(choices=[('FOOD', 'Food'), ('HOUSING', 'Housing'), ('COMM_GIVE', 'Community Giveaways'), ('MENTAL_HEALTH', 'Mental Health'), ('INFO', 'Info Sessions/Webinars'), ('EVENTS', 'Events'), ('OTHER', 'Other')], default='OTHER', max_length=20),
        ),
        migrations.AddField(
            model_name='resource',
            name='endDate',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='resource',
            name='flyer',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='resource',
            name='link',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='resource',
            name='name',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='resource',
            name='organization',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='resource',
            name='startDate',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='resource',
            name='time',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='resource',
            name='zoom',
            field=models.URLField(null=True),
        ),
    ]
