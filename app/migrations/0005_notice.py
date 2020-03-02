# Generated by Django 2.1.15 on 2020-02-27 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20200224_0019'),
    ]

    operations = [
        migrations.CreateModel(
            name='notice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('writer', models.CharField(max_length=18, null=True)),
                ('ntce_title', models.CharField(max_length=200, null=True)),
                ('ntce_cn', models.CharField(max_length=5000, null=True)),
                ('reg_dd', models.DateTimeField(auto_now_add=True)),
                ('auth', models.CharField(max_length=8, null=True)),
                ('del_yn', models.CharField(default='N', max_length=1)),
                ('last_upd_dd', models.DateTimeField(null=True)),
                ('noti_yn', models.CharField(default='N', max_length=1)),
                ('se1', models.CharField(max_length=16, null=True)),
                ('se2', models.CharField(max_length=16, null=True)),
            ],
        ),
    ]