# Generated by Django 2.1.15 on 2020-04-21 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Manage', '0006_auto_20200421_0227'),
    ]

    operations = [
        migrations.AddField(
            model_name='board_file',
            name='origin_name',
            field=models.CharField(default=None, max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='board_file',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='board/'),
        ),
    ]