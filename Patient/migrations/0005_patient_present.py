# Generated by Django 2.1.15 on 2019-12-31 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Patient', '0004_auto_20191229_0419'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='present',
            field=models.CharField(default=None, max_length=32, null=True),
        ),
    ]
