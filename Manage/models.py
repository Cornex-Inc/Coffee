from django.db import models

# Create your models here.

class Board_Contents(models.Model):
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

    is_notice = models.CharField(
        max_length = 1,
        default='N',
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
