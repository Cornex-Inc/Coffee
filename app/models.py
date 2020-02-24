"""
Definition of models.
"""

from django.db import models

# Create your models here.
class COMMCODE(models.Model):
    #공통코드
    commcode = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 명
    commcode_name = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 별칭
    commcode_ncm = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 그룹
    commcode_grp= models.CharField(
        null=True,
        max_length = 18,
        )
    #사용유무
    use_yn = models.CharField(
        max_length = 1,
        default='Y'
        )
    #순번
    seq = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분1
    se1 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분2
    se2 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분3
    se3 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분4
    se4 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분5
    se5 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분6
    se6 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분7
    se7 = models.CharField(
        null=True,
        max_length = 18,
        )
    #구분8
    se8 = models.CharField(
        null=True,
        max_length = 18,
        )
