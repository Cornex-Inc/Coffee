"""
Definition of models.
"""

from django.db import models

# Create your models here.
class COMMCODE(models.Model):
    #상위코드
    upper_commcode = models.CharField(
        null=True,
        max_length = 18,
        )

    #상위코드 명
    upper_commcode_name = models.CharField(
        null=True,
        max_length = 18,
        )

    #공통코드 그룹
    commcode_grp= models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 그룹명
    commcode_grp_name= models.CharField(
        null=True,
        max_length = 18,
        )

    #공통코드
    commcode = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 명_ko
    commcode_name_ko = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 명_en
    commcode_name_en = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 명_vi
    commcode_name_vi = models.CharField(
        null=True,
        max_length = 18,
        )
    #공통코드 별칭
    commcode_ncm = models.CharField(
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

    #등록자 - 논리 FK = user_id
    registrerer = models.CharField(
        max_length = 8,
        null=True,
        )

    #최초 작성 일자
    date_of_registered = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True,
        )

    #마지막 수정자 - 논리 FK = user_id
    lastest_modifier = models.CharField(
        max_length = 8,
        null=True,
        )

    #마지막 수정 일
    lastest_modified_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True,
        )


class notice(models.Model):
    #작성자
    writer = models.CharField(
        null=True,
        max_length = 18,
        )
    #제목
    ntce_title = models.CharField(
        null=True,
        max_length = 200,
        )
    #내용
    ntce_cn = models.CharField(
        null=True,
        max_length =5000,
        )
    #등록일
    reg_dd = models.DateTimeField(
        auto_now_add=True,
        )
    #권한
    auth = models.CharField(
        null=True,
        max_length =8,
        )
    #삭제 여부
    del_yn = models.CharField(
        default='N',
        max_length =1,
        )
    #마지막 수정
    last_upd_dd = models.DateTimeField(
        null=True,
        )
    #공지 유무
    noti_yn = models.CharField(
        default='N',
        max_length =1,
        )
    #구분1
    se1 = models.CharField(
        null=True,
        max_length =16,
        )
    #구분2
    se2 = models.CharField(
        null=True,
        max_length =16,
        )


class sms_test(models.Model):

    phone = models.CharField(
        null=True,
        max_length =16,
        )

    contents = models.CharField(
        null=True,
        max_length =80,
        )

    # 0 failed 
    # 1 success
    # 2 sending
    status = models.CharField(
        null=True,
        max_length =1,
        default = '2',
        )

    res_code = models.CharField(
        null=True,
        max_length =16,
        )

    #최초 작성 일자
    date_of_registered = models.DateTimeField(
        auto_now_add=True,
        )

    #수신 시간
    date_of_recieved = models.DateTimeField(
        null=True,
        )