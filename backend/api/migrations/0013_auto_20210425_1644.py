# Generated by Django 3.0.3 on 2021-04-25 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20210416_2351'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='location_title',
            field=models.CharField(blank=True, max_length=70),
        ),
        migrations.AlterField(
            model_name='location',
            name='street_address',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='resource',
            name='category',
            field=models.CharField(blank=True, choices=[('FOOD', 'Food'), ('HOUSING', 'Housing'), ('COMM_SERVE', 'Community Services'), ('MENTAL_HEALTH', 'Mental Health'), ('EDUCATION', 'Education/Information'), ('EVENTS', 'Events'), ('WIFI', 'Free Wifi'), ('OTHER', 'Other')], max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='flyerId',
            field=models.CharField(blank=True, max_length=70, null=True),
        ),
    ]
