# Generated by Django 3.0.3 on 2021-04-16 23:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20210401_2155'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='phone',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
    ]
