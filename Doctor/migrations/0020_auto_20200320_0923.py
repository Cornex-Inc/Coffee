# Generated by Django 2.1.15 on 2020-03-20 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0019_auto_20200315_1032'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicine',
            name='price_dollar',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='precedure',
            name='price_dollar',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='test',
            name='price_dollar',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
