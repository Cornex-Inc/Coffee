# Generated by Django 2.1.15 on 2020-05-14 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0013_auto_20200514_2215'),
    ]

    operations = [
        migrations.RenameField(
            model_name='estimate_sheet',
            old_name='date_done',
            new_name='date_modify',
        ),
        migrations.RenameField(
            model_name='estimate_sheet_detail',
            old_name='date_done',
            new_name='date_modify',
        ),
        migrations.AddField(
            model_name='estimate_sheet',
            name='date_register',
            field=models.CharField(default='0000-00-00 00:00:00', max_length=20),
        ),
        migrations.AddField(
            model_name='estimate_sheet_detail',
            name='date_register',
            field=models.CharField(default='0000-00-00 00:00:00', max_length=20),
        ),
    ]
