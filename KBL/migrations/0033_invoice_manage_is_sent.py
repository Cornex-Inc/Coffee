# Generated by Django 2.1.15 on 2020-05-22 00:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0032_auto_20200522_0001'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice_manage',
            name='is_sent',
            field=models.CharField(default='N', max_length=2),
        ),
    ]
