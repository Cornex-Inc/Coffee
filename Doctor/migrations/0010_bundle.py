# Generated by Django 2.1.15 on 2020-01-09 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0009_auto_20200105_2317'),
    ]

    operations = [
        migrations.CreateModel(
            name='bundle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upper', models.CharField(max_length=64)),
                ('group_code', models.CharField(max_length=64)),
                ('group_name', models.CharField(max_length=64)),
                ('type', models.CharField(max_length=64)),
                ('code', models.CharField(max_length=64)),
                ('amount', models.IntegerField(null=True)),
                ('days', models.IntegerField(null=True)),
            ],
        ),
    ]
