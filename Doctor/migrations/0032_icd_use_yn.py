# Generated by Django 2.1.15 on 2020-04-01 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0031_icd'),
    ]

    operations = [
        migrations.AddField(
            model_name='icd',
            name='use_yn',
            field=models.CharField(default='Y', max_length=1, null=True),
        ),
    ]