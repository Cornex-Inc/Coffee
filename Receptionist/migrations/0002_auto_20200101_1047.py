# Generated by Django 2.1.15 on 2020-01-01 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Receptionist', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='discounted',
        ),
        migrations.AddField(
            model_name='payment',
            name='discounted_amount',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='discounted_percent',
            field=models.IntegerField(null=True),
        ),
    ]
