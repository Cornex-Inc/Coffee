# Generated by Django 2.1.15 on 2020-04-16 22:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Account', '0009_user_classification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='user_role',
        ),
        migrations.AlterField(
            model_name='user',
            name='depart',
            field=models.CharField(choices=[('ADMIN', 'Admin'), ('DOCTOR', 'Doctor'), ('PT', 'Physical Therapist'), ('RECEPTIONIST', 'Receptionist'), ('DENTREC', 'Receptionist for Dental'), ('PHARMACY', 'Pharmacy'), ('LABORATORY', 'Laboratory'), ('RADIATION', 'Radiation')], default='ADMIN', max_length=30),
        ),
    ]