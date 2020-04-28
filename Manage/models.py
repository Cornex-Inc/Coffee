from django.db import models

from django.utils.text import slugify
from django.dispatch import receiver
import datetime
import os

# Create your models here.

class Board_Contents(models.Model):
    #보드 종류
    board_type = models.CharField(
        max_length = 8,
        null=True,
        )

    #제목
    title = models.CharField(
        max_length = 64
        )
    #내용 - HTML 코드
    contents = models.TextField()

    #사용 유무
    use_yn = models.CharField(
        max_length = 2,
        default = 'Y',
        )

    #작성자 - 논리 FK = user_id
    creator = models.CharField(
        max_length = 8,
        )
    #최초 작성 일자
    created_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        )

    #마지막 수정자 - 논리 FK = user_id
    lastest_modifier = models.CharField(
        max_length = 8,
        )

    #마지막 수정 일
    lastest_modified_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        )

    #상위 출력
    top_seq = models.CharField(
        max_length = 1,
        null=True,
        default=0,
        )

    #구분
    options = models.CharField(
        max_length = 8,
        null=True,
        default="GENERAL",
        )

    #부서
    depart_from = models.CharField(
        max_length = 16,
        default=''
        )

    #요청부서
    depart_to = models.CharField(
        max_length = 8,
        default=''
        )
    
    #완료 예정일
    date_to_be_done = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #완료일
    date_done = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #상태
    status = models.CharField(
        max_length = 8,
        default=''
        )

    #조회수
    view_count = models.IntegerField(
        null=True,
        default=0,
        )

    def __str__(self):
        return self.title




class Board_Comment(models.Model):

    #게시글 번호 - 논리 FK
    content_id = models.CharField(
        max_length = 8,
        )

    #첫 글과, 그 글의 답글들에게 같은 groupno을 주어서 보여주기 위함
    groupno = models.IntegerField(
        default=0
        )

    #같은 groupno의 게시글들을 최신순으로 위로 올리기 위함
    orderno = models.IntegerField(
        default=0
        )

    #답글들을 한 칸씩 밀려서 보이게 하기 위함
    depth = models.IntegerField(
        default=0
        )
 

    #내용 - 
    comment = models.TextField()

    #사용 유무
    use_yn = models.CharField(
        max_length = 2,
        default = 'Y',
        )

    #작성자 - 논리 FK = user_id
    creator = models.CharField(
        max_length = 8,
        )
    #최초 작성 일자
    created_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        )

    #마지막 수정 일
    lastest_modified_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        )




    def __str__(self):
        return self.comment


class Board_File(models.Model):
    #보드 아이디 논리 연결
    board_id = models.CharField(
        max_length = 8,
        null=True
        )

    #실제 파일 경로
    file = models.FileField(
        upload_to='board/',
        null=True,
        blank=True,
        )

    registered_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True
        )

    #사용 유무
    use_yn = models.CharField(
        max_length = 2,
        default = 'Y',
        )

    #파일 오리지날 이름
    origin_name = models.CharField(
        max_length = 64,
        null=True,
        default = None,
        )

class Board_View_Log(models.Model):
    
    #보드 아이디 논리 연결
    board_id = models.CharField(
        max_length = 8,
        null=True
        )

    #사용자 아이디 논리 연결
    user_id = models.CharField(
        max_length = 8,
        null=True
        )

    
    registered_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True
        )


class Draft(models.Model):

    #상태
    status = models.CharField(
        max_length = 8,
        default ='',
        )
    #구분
    type = models.CharField(
        max_length = 8,
        default ='',
        )
    #부서
    depart = models.CharField(
        max_length = 8,
        default ='',
        )
    #작성자 - FK 논리
    creator = models.CharField(
        max_length = 8,
        default ='',
        )
    #작성 일 / 신청일
    date_registered = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )
    #제목
    title = models.CharField(
        max_length = 256,
        default ='',
        )
    #내용
    contents = models.TextField(
        default ='',
        )
    #추가의견
    additional = models.CharField(
        max_length = 256,
        null=True
        )
    #마지막 수정자  - FK 논리
    modifier = models.CharField(
        max_length = 8,
        null=True
        )

    #마지막 수정 일 / 신청일
    date_last_modified = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #결재 / 담당
    date_in_charge = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )
    #결재 / 팀장
    date_leader = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )
    #결재 / 회계
    date_accounting = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )
    #결재 / 대표
    date_ceo = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )





@receiver(models.signals.post_delete, sender=Board_File)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    print(sender)
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

