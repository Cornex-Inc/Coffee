# Generated by Django 2.1.15 on 2020-05-06 23:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Manage', '0018_auto_20200505_2237'),
    ]

    operations = [
        migrations.AddField(
            model_name='board_file',
            name='title',
            field=models.CharField(default='', max_length=128),
        ),
    ]