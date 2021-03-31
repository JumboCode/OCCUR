# Generated by Django 3.0.3 on 2021-03-19 20:59

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_resource_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='recurrenceDays',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('SUN', 'Sunday'), ('MON', 'Monday'), ('TUE', 'Tuesday'), ('WED', 'Wednesday'), ('THU', 'Thursday'), ('FRI', 'Friday'), ('SAT', 'Saturday')], default=[], max_length=27),
        ),
    ]