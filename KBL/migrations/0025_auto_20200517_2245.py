# Generated by Django 2.1.15 on 2020-05-17 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0024_auto_20200517_1822'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice_manage',
            name='recipient',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AlterField(
            model_name='invoice_manage',
            name='status',
            field=models.CharField(default='NOT', max_length=20),
        ),
    ]
