# Generated by Django 2.1.15 on 2020-05-15 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0015_estimate_sheet_classification'),
    ]

    operations = [
        migrations.AddField(
            model_name='estimate_sheet',
            name='email',
            field=models.CharField(default='', max_length=128),
        ),
    ]
