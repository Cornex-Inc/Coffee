# Generated by Django 2.1.15 on 2020-05-20 18:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Patient', '0013_sign_manage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sign_manage',
            name='patient',
        ),
        migrations.DeleteModel(
            name='sign_manage',
        ),
    ]