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

    


class Reception(models.Model):
    progress_choice = (
        ('new',_('new')),
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




class ExamManager(models.Model):
    diagnosis = models.ForeignKey(
        to = Diagnosis,
        on_delete = models.DO_NOTHING, 
        )
    exam = models.ForeignKey(
        to = ExamFee,
        on_delete = models.DO_NOTHING, 
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
        null=True,
        )

    discounted = models.IntegerField(
        null=True,
        )

    discounted_amount = models.IntegerField(
        null=True,
        )

    total = models.IntegerField(
        null=True,
        )

    progress = models.CharField(
        max_length=6,
        choices = progress_choice,
        )

    memo = models.CharField(
        max_length=256,
        null=True,
        )

    is_emergency = models.BooleanField(
        default= False
        )

    additional = models.IntegerField(
        null=True,
        default=None,
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
        null=False)

    report = models.TextField(
        max_length=2048,
        null=True,
        )

    usage = models.TextField(
        max_length=512,
        null=True,
        )


    date_of_hospitalization = models.DateTimeField(
        
        )

    date_of_publication = models.DateTimeField(
        )

    

class FIRST_VISIT_SURVEY(models.Model):
    PT_ID = models.CharField(
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

    visit_motiv = models.CharField(
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
    