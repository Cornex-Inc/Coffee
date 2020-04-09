# Generated by Django 2.1.15 on 2020-04-01 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0030_auto_20200330_1031'),
    ]

    operations = [
        migrations.CreateModel(
            name='ICD',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=16, null=True)),
                ('name', models.CharField(max_length=128, null=True)),
                ('name_vie', models.CharField(max_length=128, null=True)),
            ],
        ),
    ]