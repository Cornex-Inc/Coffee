# Generated by Django 2.1.15 on 2020-05-05 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Manage', '0016_draft_use_yn'),
    ]

    operations = [
        migrations.AddField(
            model_name='board_file',
            name='board_type',
            field=models.CharField(default='', max_length=64),
        ),
    ]
