# Generated by Django 2.1.15 on 2020-04-01 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0032_icd_use_yn'),
    ]

    operations = [
        migrations.AlterField(
            model_name='icd',
            name='code',
            field=models.CharField(max_length=16, unique=True),
        ),
    ]
