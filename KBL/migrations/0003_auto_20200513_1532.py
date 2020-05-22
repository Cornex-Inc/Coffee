# Generated by Django 2.1.15 on 2020-05-13 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KBL', '0002_customer_employee_rank'),
    ]

    operations = [
        migrations.CreateModel(
            name='Estimate_Sheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(default='', max_length=16)),
                ('recipient', models.CharField(default='', max_length=16)),
                ('title', models.CharField(default='', max_length=32)),
                ('remark', models.CharField(default='', max_length=256)),
                ('paid_by', models.CharField(default='', max_length=8)),
                ('status', models.CharField(default='', max_length=16)),
                ('date_sent', models.CharField(default='0000-00-00 00:00:00', max_length=20)),
                ('use_yn', models.CharField(default='Y', max_length=2)),
                ('registrant', models.CharField(default='', max_length=4)),
                ('modifier', models.CharField(default='', max_length=4)),
                ('date_done', models.CharField(default='0000-00-00 00:00:00', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Estimate_Sheet_Detail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estimate_id', models.CharField(default='', max_length=16)),
                ('content', models.TextField(default='')),
                ('unit_price', models.CharField(default='', max_length=16)),
                ('quantity', models.CharField(default='', max_length=32)),
                ('cost', models.CharField(default='', max_length=256)),
                ('note', models.CharField(default='', max_length=8)),
                ('use_yn', models.CharField(default='Y', max_length=2)),
                ('registrant', models.CharField(default='', max_length=4)),
                ('modifier', models.CharField(default='', max_length=4)),
                ('date_done', models.CharField(default='0000-00-00 00:00:00', max_length=20)),
            ],
        ),
        migrations.RenameField(
            model_name='customer_employee',
            old_name='rank',
            new_name='position',
        ),
    ]