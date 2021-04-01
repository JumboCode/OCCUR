# Generated by Django 3.0.3 on 2021-03-26 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210210_0252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='category',
            field=models.CharField(choices=[('FOOD', 'Food'), ('HOUSING', 'Housing'), ('COMM_GIVE', 'Community Giveaways'), ('MENTAL_HEALTH', 'Mental Health'), ('INFO', 'Info Sessions/Webinars'), ('EVENTS', 'Events'), ('WIFI', 'Free Wifi'), ('OTHER', 'Other')], default='OTHER', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='endDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='startDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
