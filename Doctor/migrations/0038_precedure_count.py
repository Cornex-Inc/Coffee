# Generated by Django 2.1.15 on 2020-05-19 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0037_medicine_is_showing'),
    ]

    operations = [
        migrations.AddField(
            model_name='precedure',
            name='count',
            field=models.CharField(default='', max_length=4),
        ),
    ]