# Generated by Django 2.1.15 on 2020-02-23 15:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commcode',
            old_name='refr_col',
            new_name='commcode_grp',
        ),
    ]