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
        verbose_name=_('Recorded Date'),
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
        verbose_name=_('Chief Complaint'),
        )


    progress = models.CharField(
        max_length = 16,
        choices=progress_choice,
        default = 'new',
        verbose_name=_('Progress'),
        )

    reservation = models.ForeignKey(
        to = Reservation,
        on_delete = models.DO_NOTHING,
        null = True,
        )

    
    

class Diagnosis(models.Model):
    reception = models.OneToOneField(
        to = Reception,
        on_delete = models.DO_NOTHING,
        verbose_name=_('Reception'),
        )

    plan = models.CharField(
        max_length = 2048,
        verbose_name=_('Plan'),
        null=True,
        )

    assessment = models.CharField(
        max_length = 2048,
        verbose_name=_('Assessment'),
        null=True,
        )

    objective_data = models.CharField(
        max_length = 2048,
        verbose_name=_('Objective Data'),
        null=True,
        )

    diagnosis = models.CharField(
        max_length = 2048,
        verbose_name=_('Diagnosis'),
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
        verbose_name=_('Volume'),
        )

    amount = models.IntegerField(
        null=True,
        verbose_name=_('Amount'),
        )

    days = models.IntegerField(
        null=True,
        verbose_name=_('Days'),
        )

    memo = models.CharField(
        max_length = 256,
        null=True,
        verbose_name=_('Memo'),
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
        verbose_name=_('Volume'),
        null=True,
        )

    amount = models.IntegerField(
        verbose_name=_('Amount'),
        null=True,
        )

    days = models.IntegerField(
        verbose_name=_('Days'),
        null=True,
        )
    
    memo = models.CharField(
        max_length = 256,
        verbose_name=_('Memo'),
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
        verbose_name=_('Volume'),
        null=True,
        )

    amount = models.IntegerField(
        verbose_name=_('Amount'),
        null=True,
        )

    days = models.IntegerField(
        verbose_name=_('Days'),
        null=True,
        )

    memo = models.CharField(
        max_length = 256,
        verbose_name=_('Memo'),
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
        verbose_name=_('Sub Total'),
        )

    discounted = models.IntegerField(
        null=True,
        verbose_name=_('Discount'),
        )

    total = models.IntegerField(
        null=True,
        verbose_name=_('Total'),
        )

    progress = models.CharField(
        max_length=6,
        choices = progress_choice,
        verbose_name=_('Progress'),
        )

    memo = models.CharField(
        max_length=256,
        null=True,
        verbose_name=_('Memo'),
        )




class PaymentRecord(models.Model):
    method_choices = (
        ('cash',_('CASH')),
        ('card',_('CARD')),
        ('lemit',_('LEMIT')),
        )

    method = models.CharField(
        max_length=4,
        choices = method_choices,
        verbose_name=_('Method'),
        )

    payment = models.ForeignKey(
        to = Payment,
        on_delete = models.DO_NOTHING,

        )

    date = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        verbose_name=_('Paid Date'),
        )

    paid = models.IntegerField(
        null=True,
        verbose_name=_('Paid'),
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
        verbose_name=_('Doctor Report'),
        )

    usage = models.TextField(
        max_length=512,
        null=True,
        verbose_name=_('Usage'),
        )


    date_of_hospitalization = models.DateTimeField(
        
        )

    date_of_publication = models.DateTimeField(
        )

    


    