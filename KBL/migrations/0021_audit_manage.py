# Generated by Django 2.1.15 on 2020-05-17 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0020_auto_20200516_2255'),
    ]

    operations = [
        migrations.CreateModel(
            name='Audit_Manage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.CharField(default='', max_length=8)),
                ('company_name', models.CharField(default='', max_length=64)),
                ('type', models.CharField(default='', max_length=16)),
                ('title', models.CharField(default='', max_length=64)),
                ('service_fee', models.CharField(default='', max_length=20)),
                ('service_fee_vat', models.CharField(default='', max_length=20)),
                ('service_fee_total', models.CharField(default='', max_length=20)),
                ('paid', models.CharField(default='', max_length=20)),
                ('date_paid', models.CharField(default='0000-00-00', max_length=10)),
                ('in_charge', models.CharField(default='', max_length=32)),
                ('check_in_charge', models.CharField(default='0000-00-00', max_length=10)),
                ('check_leader', models.CharField(default='0000-00-00', max_length=10)),
                ('status', models.CharField(default='', max_length=20)),
                ('invoice', models.CharField(default='', max_length=20)),
                ('note', models.CharField(default='', max_length=256)),
                ('use_yn', models.CharField(default='Y', max_length=2)),
                ('registrant', models.CharField(default='', max_length=4)),
                ('date_register', models.CharField(default='0000-00-00 00:00:00', max_length=20)),
                ('modifier', models.CharField(default='', max_length=4)),
                ('date_modify', models.CharField(default='0000-00-00 00:00:00', max_length=20)),
            ],
        ),
    ]