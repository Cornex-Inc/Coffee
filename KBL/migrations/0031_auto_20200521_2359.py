# Generated by Django 2.1.15 on 2020-05-21 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0030_audit_manage_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='estimate_sheet',
            name='date_sent',
            field=models.CharField(default='N', max_length=2),
        ),
    ]
