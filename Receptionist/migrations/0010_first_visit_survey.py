# Generated by Django 2.1.15 on 2020-02-17 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Receptionist', '0009_delete_first_visit_survey'),
    ]

    operations = [
        migrations.CreateModel(
            name='FIRST_VISIT_SURVEY',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PT_ID', models.CharField(max_length=18, null=True)),
                ('pain_posi_pic', models.CharField(max_length=50, null=True)),
                ('pain_posi_text', models.CharField(max_length=100, null=True)),
                ('sick_date', models.CharField(max_length=50, null=True)),
                ('cure_phy_yn', models.CharField(max_length=1, null=True)),
                ('cure_phy_cnt', models.CharField(max_length=10, null=True)),
                ('cure_inject_yn', models.CharField(max_length=1, null=True)),
                ('cure_inject_cnt', models.CharField(max_length=10, null=True)),
                ('cure_medi_yn', models.CharField(max_length=1, null=True)),
                ('cure_medi_cnt', models.CharField(max_length=10, null=True)),
                ('cure_needle_yn', models.CharField(max_length=1, null=True)),
                ('cure_needle_cnt', models.CharField(max_length=10, null=True)),
                ('pain_level', models.CharField(max_length=2, null=True)),
                ('surgery_yn', models.CharField(max_length=1, null=True)),
                ('surgery_name', models.CharField(max_length=50, null=True)),
                ('surgery_year', models.CharField(max_length=10, null=True)),
                ('exam_kind', models.CharField(max_length=50, null=True)),
                ('exam_etc', models.CharField(max_length=50, null=True)),
                ('disease_kind', models.CharField(max_length=50, null=True)),
                ('disease_etc', models.CharField(max_length=50, null=True)),
                ('medication', models.CharField(max_length=50, null=True)),
                ('side_effect_yn', models.CharField(max_length=1, null=True)),
                ('pregnant_yn', models.CharField(max_length=18, null=True)),
                ('visit_motiv', models.CharField(max_length=50, null=True)),
                ('cd_film_yn', models.CharField(max_length=50, null=True)),
                ('reg_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('resv_date', models.DateTimeField(null=True)),
            ],
        ),
    ]
