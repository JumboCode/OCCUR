# Generated by Django 3.0.3 on 2021-01-04 22:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20201118_2005'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resource',
            name='location',
        ),
        migrations.AddField(
            model_name='location',
            name='resource',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Resource'),
        ),
    ]