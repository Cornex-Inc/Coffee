# Generated by Django 2.1.15 on 2020-03-30 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Doctor', '0029_testreferenceinterval_gender'),
    ]

    operations = [
        migrations.RenameField(
            model_name='testreferenceinterval',
            old_name='remark',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='testreferenceinterval',
            name='gender',
        ),
        migrations.AddField(
            model_name='testreferenceinterval',
            name='name_vie',
            field=models.CharField(max_length=24, null=True),
        ),
    ]
