# Generated by Django 2.1.15 on 2020-04-06 01:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0033_auto_20200401_1317'),
    ]

    operations = [
        migrations.AddField(
            model_name='testreferenceinterval',
            name='use_yn',
            field=models.CharField(default='Y', max_length=12),
        ),
    ]
