# Generated by Django 2.1.15 on 2020-03-15 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0018_auto_20200314_1723'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicine',
            name='country_vie',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='medicine',
            name='unit_vie',
            field=models.CharField(max_length=64, null=True),
        ),
    ]
