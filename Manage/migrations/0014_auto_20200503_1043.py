# Generated by Django 2.1.15 on 2020-05-03 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Manage', '0013_draft'),
    ]

    operations = [
        migrations.AddField(
            model_name='draft',
            name='consultation',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='draft',
            name='additional',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='draft',
            name='modifier',
            field=models.CharField(default='', max_length=8),
        ),
    ]
