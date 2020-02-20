# Generated by Django 2.1.15 on 2020-02-19 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Patient', '0006_auto_20191231_0013'),
    ]

    operations = [
        migrations.AddField(
            model_name='vital',
            name='BMI',
            field=models.CharField(max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='vital',
            name='blood_pressure',
            field=models.CharField(max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='vital',
            name='blood_temperature',
            field=models.CharField(max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='vital',
            name='breath',
            field=models.CharField(max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='vital',
            name='height',
            field=models.CharField(max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='vital',
            name='pulse_rate',
            field=models.CharField(max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='vital',
            name='weight',
            field=models.CharField(max_length=8, null=True),
        ),
    ]
