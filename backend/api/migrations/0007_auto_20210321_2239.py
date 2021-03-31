# Generated by Django 3.0.3 on 2021-03-21 22:39

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20210321_2239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='recurrenceDays',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('SUN', 'Sunday'), ('MON', 'Monday'), ('TUE', 'Tuesday'), ('WED', 'Wednesday'), ('THU', 'Thursday'), ('FRI', 'Friday'), ('SAT', 'Saturday')], default=[], max_length=27, null=True),
        ),
    ]