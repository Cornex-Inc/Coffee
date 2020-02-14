# Generated by Django 2.1.15 on 2019-12-29 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Patient', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='tax',
        ),
        migrations.AlterField(
            model_name='patient',
            name='address',
            field=models.CharField(max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='patient',
            name='date_of_birth',
            field=models.CharField(blank=True, max_length=64),
        ),
    ]
