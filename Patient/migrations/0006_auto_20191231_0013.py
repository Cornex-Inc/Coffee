# Generated by Django 2.1.15 on 2019-12-31 00:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Patient', '0005_patient_present'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='present',
            new_name='past_id',
        ),
    ]
