# Generated by Django 2.1.15 on 2020-02-17 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Receptionist', '0010_first_visit_survey'),
    ]

    operations = [
        migrations.AddField(
            model_name='first_visit_survey',
            name='cure_yn',
            field=models.CharField(max_length=1, null=True),
        ),
    ]
