from django.db import models


from Patient.models import *
from Doctor.models import *
# Create your models here.

from django.utils.translation import gettext as _

class Reservation(models.Model):
    reservation_date = models.DateTimeField(
        )

    patient = models.ForeignKey(
        to = Patient,
        on_delete = models.DO_NOTHING,
        null= True,
        )

    name = models.CharField(
        max_length = 64,
        null= True,
        )

    date_of_birth = models.DateTimeField(
        null= True,
        )

    phone = models.CharField(
        max_length = 32,
        null= True,
        )

    depart = models.ForeignKey(
        to=Depart,
        on_delete=models.DO_NOTHING,
        )

    doctor = models.ForeignKey(
        to = Doctor,
        on_delete = models.DO_NOTHING,
        null = True,
        )

    memo = models.CharField(
        max_length = 2048,
        )

    
class ReceptionQueryManager(models.Manager):
    def get_queryset(self):
        return super(ReceptionQueryManager,self).get_queryset().filter()#need_invoice = 1,need_insurance = 1)

class Reception(models.Model):
    progress_choice = (
        ('new',_('new')),
        ('deleted',_('deleted')),
        ('done',_('done'))
        )


    recorded_date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        )

    patient = models.ForeignKey(
        to = Patient,
        on_delete = models.DO_NOTHING,
        null= True,
        )

    depart = models.ForeignKey(
        to = Depart,
        on_delete = models.DO_NOTHING,
        )

    doctor = models.ForeignKey(
        to = Doctor,
        on_delete = models.DO_NOTHING,
        )

    chief_complaint = models.CharField(
        max_length = 2048,
        )


    progress = models.CharField(
        max_length = 16,
        choices=progress_choice,
        default = 'new',
        )

    reservation = models.ForeignKey(
        to = Reservation,
        on_delete = models.DO_NOTHING,
        null = True,
        )

    need_medical_report = models.BooleanField(
        default = False,
        )

    need_invoice = models.BooleanField(
        default = False,
        )
    need_insurance = models.BooleanField(
        default = False,
        )

    objects=ReceptionQueryManager()
    
    

class Diagnosis(models.Model):
    reception = models.OneToOneField(
        to = Reception,
        on_delete = models.DO_NOTHING,
        )

    plan = models.CharField(
        max_length = 2048,
        null=True,
        )

    assessment = models.CharField(
        max_length = 2048,
        null=True,
        )

    objective_data = models.CharField(
        max_length = 2048,
        null=True,
        )

    diagnosis = models.CharField(
        max_length = 2048,
        null=True,
        )

    

    disease_code = models.ForeignKey(
        to = Disease_Code,
        on_delete = models.DO_NOTHING,
        null = True,
        )

    medical_report = models.CharField(
        max_length = 2048,
        null = True,
        )

    recorded_date = models.DateTimeField(
        auto_now_add=True,
        )

    recommendation = models.CharField(
        max_length = 2048,
        null = True,
        )

    ICD = models.CharField(
        max_length = 512,
        null = True,
        )

    ICD_code = models.CharField(
        max_length = 8,
        null = True,
        )


    posi_text = models.TextField(
        default='',
        )





class ExamManager(models.Model):
    diagnosis = models.ForeignKey(
        to = Diagnosis,
        on_delete = models.DO_NOTHING, 
        )
    exam = models.ForeignKey(
        to = ExamFee,
        on_delete = models.DO_NOTHING, 
        )

    #checking for discount
    is_checked_discount = models.CharField(
        max_length = 8,
        default = False,
        )

class TestManager(models.Model):
    diagnosis = models.ForeignKey(
        to = Diagnosis,
        on_delete = models.DO_NOTHING, 
        )

    test = models.ForeignKey(
        to = Test,
        on_delete = models.DO_NOTHING, 
        )

    volume = models.IntegerField(
        null=True,
        )

    amount = models.IntegerField(
        null=True,
        )

    days = models.IntegerField(
        null=True,
        )

    memo = models.CharField(
        max_length = 256,
        null=True,
        )

    #checking for discount
    is_checked_discount = models.CharField(
        max_length = 8,
        default = False,
        )

class PrecedureManager(models.Model):
    diagnosis = models.ForeignKey(
        to = Diagnosis,
        on_delete = models.DO_NOTHING, 
        )

    precedure = models.ForeignKey(
        to = Precedure,
        on_delete = models.DO_NOTHING, 
        )

    volume = models.IntegerField(
        null=True,
        )

    amount = models.IntegerField(
        null=True,
        )

    days = models.IntegerField(
        null=True,
        )
    
    memo = models.CharField(
        max_length = 256,
        null=True,
        )

    #checking for discount
    is_checked_discount = models.CharField(
        max_length = 8,
        default = False,
        )



class MedicineManager(models.Model):
    diagnosis = models.ForeignKey(
        to = Diagnosis,
        on_delete = models.DO_NOTHING, 
        )

    medicine = models.ForeignKey(
        to = Medicine,
        on_delete = models.DO_NOTHING, 
        )

    volume = models.IntegerField(
        null=True,
        )

    amount = models.IntegerField(
        null=True,
        )

    days = models.IntegerField(
        null=True,
        )

    memo = models.CharField(
        max_length = 256,
        null=True,
        )

    #checking for discount
    is_checked_discount = models.CharField(
        max_length = 8,
        default = False,
        )


class Payment(models.Model):

    progress_choice = (
        ('paid',_('paid')),
        ('unpaid',_('unpaid')),
        )

    reception = models.OneToOneField(
        to = Reception,
        on_delete = models.DO_NOTHING,
        )

    sub_total = models.IntegerField(
        default=0
        )

    discounted = models.IntegerField(
        default=0
        )

    discounted_amount = models.IntegerField(
        default=0
        )

    total = models.IntegerField(
        default=0
        )

    progress = models.CharField(
        max_length=6,
        choices = progress_choice,
        )

    memo = models.CharField(
        max_length=256,
        default=''
        )

    is_emergency = models.BooleanField(
        default= False,
        )

    additional = models.IntegerField(
        default=0,
        )




class PaymentRecord(models.Model):
    method_choices = (
        ('cash',_('CASH')),
        ('card',_('CARD')),
        ('remit',_('Remit')),
        )

    method = models.CharField(
        max_length=6,
        choices = method_choices,
        )

    payment = models.ForeignKey(
        to = Payment,
        on_delete = models.DO_NOTHING,

        )

    date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        )

    paid = models.IntegerField(
        null=True,
        )

    def get_rest_total(self):
        records = PaymentRecord.objects.filter(payment = self.payment, date__lte = self.date)
        total = self.payment.total
        for record in records:
            total -= record.paid

        return total
        

        
class Report(models.Model):
    patient = models.ForeignKey(
        to = Patient,
        on_delete=models.DO_NOTHING,
        null=True,
        )

    

    doctor = models.ForeignKey(
        to = Doctor,
        on_delete=models.DO_NOTHING,
        null=True,
        )
    
    serial = models.CharField(
        max_length = 12,
        null=True
        )

    report = models.TextField(
        max_length=2048,
        null=True,
        )

    usage = models.TextField(
        max_length=512,
        null=True,
        )


    date_of_hospitalization = models.DateTimeField(
        null=True
        )

    date_of_publication = models.DateTimeField(
        null=True
        )

    reception = models.ForeignKey(
        to = Reception,
        on_delete=models.DO_NOTHING,
        null=True,
        )




class FIRST_VISIT_SURVEY(models.Model):
    PT_ID = models.CharField(
        max_length = 18,
        null=True)

    PT_vital = models.CharField(
        max_length = 18,
        null=True)

    pain_posi_pic = models.CharField(
        max_length = 50,
        null=True)

    pain_posi_text = models.CharField(
        max_length = 100,
        null=True)

    sick_date = models.CharField(
        max_length = 50,
        null=True)

    cure_yn = models.CharField(
        max_length = 1,
        null=True)

    cure_phy_yn = models.CharField(
        max_length = 1,
        null=True)

    cure_phy_cnt = models.CharField(
        max_length = 10,
        null=True)

    cure_inject_yn = models.CharField(
        max_length = 1,
        null=True)

    cure_inject_cnt = models.CharField(
        max_length = 10,
        null=True)

    cure_medi_yn = models.CharField(
        max_length = 1,
        null=True)

    cure_medi_cnt = models.CharField(
        max_length = 10,
        null=True)

    cure_needle_yn = models.CharField(
        max_length = 1,
        null=True)

    cure_needle_cnt = models.CharField(
        max_length = 10,
        null=True)

    pain_level = models.CharField(
        max_length = 2,
        null=True)

    surgery_yn = models.CharField(
        max_length = 1,
        null=True)

    surgery_name = models.CharField(
        max_length = 50,
        null=True)

    surgery_year = models.CharField(
        max_length = 10,
        null=True)

    exam_kind = models.CharField(
        max_length = 50,
        null=True)

    exam_etc = models.CharField(
        max_length = 50,
        null=True)

    disease_kind = models.CharField(
        max_length = 50,
        null=True)

    disease_etc = models.CharField(
        max_length = 50,
        null=True)

    medication = models.CharField(
        max_length = 50,
        null=True)

    side_effect_yn = models.CharField(
        max_length = 1,
        null=True)

    pregnant_yn = models.CharField(
        max_length = 18,
        null=True)

    visit_motiv_item = models.CharField(
        max_length = 50,
        null=True)

    visit_motiv_friend = models.CharField(
        max_length = 18,
        null=True)

    visit_motiv_etc = models.CharField(
        max_length = 50,
        null=True)

    cd_film_yn = models.CharField(
        max_length = 50,
        null=True)

    reg_date = models.DateTimeField(
        auto_now_add=True,
        null=True
        )

    resv_date = models.DateTimeField(
        null=True
        )
    


class Package_Manage(models.Model):

    #환자 ID - 물리 FK
    patient = models.ForeignKey(
        to=Patient,
        on_delete=models.DO_NOTHING,
        )

    #과 ID - 논리 FK
    depart = models.CharField(
        max_length = 4,
        default=''
        )

    #의사 ID - 논리 FK
    doctor= models.CharField(
        max_length = 4,
        default=''
        ) 

    #접수 아이디 - 물리 FK
    reception = models.ForeignKey(
        to=Reception,
        on_delete=models.DO_NOTHING,
        null= True,
        )

    #처치 ID = 물리 FK
    precedure = models.ForeignKey(
        to=Precedure,
        on_delete=models.DO_NOTHING,
        null= True,
        )

    #처치 이름 - 아이템 변경 방지
    precedure_name = models.CharField(
        max_length = 64,
        default='',
        )

    #패키지 그루핑
    grouping = models.CharField(
        max_length = 4,
        default='1',
        )



    #횟차 - 아이템 갯수 만큼 생성 ex. 4개면 개의 아이템 별로 1~4 생성
    itme_round = models.CharField(
        max_length = 4,
        default='0'
        )

    #메모
    memo = models.CharField(
        max_length = 256,
        default='0'
        )

    #구매날
    date_bought = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #사용날
    date_used = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #환불날.. ? - 일단 필드만.. 
    date_refund = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #환불.. ? - 일단 필드만.. 
    use_yn = models.CharField(
        max_length = 2,
        default='N',
        )

    #유효기간.. ? - 일단 필드만..
    date_expired = models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )
    
    #삭제 유무
    use_yn = models.CharField(
        max_length = 2,
        default='Y',
        )

    #등록자 - 논리 FK
    registrant = models.CharField(
        max_length = 4,
        default='',
        )

    #등록 날짜 시간
    date_register= models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #마지막 수정자 - 논리 FK
    modifier = models.CharField(
        max_length = 4,
        default='',
        )

    #마지막 수정 날짜 시간
    date_modify= models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )






class Sign_Manage(models.Model):

    #환자 
    reception = models.ForeignKey(
        to = Reception,
        on_delete = models.DO_NOTHING,
        null=True,
        )




    #사인 데이타 - base64
    sign_data = models.TextField(
        default='',
        )

    #사인 확인
    is_sign = models.CharField(
        max_length = 2,
        default='N',
        )

    
    #사용 유무
    use_yn = models.CharField(
        max_length = 2,
        default='Y',
        )

    #등록자 - 논리 FK
    registrant = models.CharField(
        max_length = 4,
        default='',
        )

    #등록 날짜 시간
    date_register= models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )

    #마지막 수정자 - 논리 FK
    modifier = models.CharField(
        max_length = 4,
        default='',
        )

    #마지막 수정 날짜 시간
    date_modify= models.CharField(
        max_length = 20,
        default='0000-00-00 00:00:00'
        )