from django.db import models
import datetime
from django.core.exceptions import ObjectDoesNotExist



from django.utils.translation import gettext as _
# Create your models here.
class Patient(models.Model):
    name_kor = models.CharField(
        max_length = 64,
        )
    name_eng = models.CharField(
        max_length = 64,
        )

    phone = models.CharField(
        max_length = 64,
        )
    gender = models.CharField(
        max_length = 8,
        )

    date_of_birth = models.DateField(
        blank=True,
        )
    date_registered = models.DateTimeField(
        auto_now_add=True,
        )
    
    address = models.CharField(
        max_length = 256,
        null=True,
        )

    past_id = models.CharField(
        null = True,
        default = None,
        max_length = 32,
        )


    def getID(self):
        self.gender 

        ID_Gender = 9
        if self.date_of_birth.year >= 1801 and self.date_of_birth.year <= 1900:
            ID_Gender += 0
        elif self.date_of_birth.year >= 1901  and self.date_of_birth.year <= 2000:
            ID_Gender += 2
        elif self.date_of_birth.year >= 2001   and self.date_of_birth.year <= 2100:
            ID_Gender += 4
    
        if self.gender == 'Female':
            ID_Gender += 1
        return self.date_of_birth.strftime('%y%m%d') + '-' + str(ID_Gender)[-1:] + '******'

    def get_gender_simple(self):
        if self.gender == 'Male':
            return 'M'
        else:
            return 'F'

    def get_age(self):
        today = datetime.date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))

    def get_name_kor_eng(self):
        return self.name_kor + ' / ' + self.name_eng

    def has_unpaid(self):
        unpaid = False
        receptions = self.reception_set.all()
        for reception in receptions:
            try:
                if reception.payment.progress != 'paid':
                    unpaid = True
            except ObjectDoesNotExist:# 에러 종류
                pass

        #return unpaid
        return False
    
    def get_chart_no(self):
        return "{:06d}".format(self.id) if self.past_id is None or self.past_id is '' else self.past_id
    
    

class History(models.Model):
    patient = models.OneToOneField(
        to = Patient,
        on_delete = models.CASCADE,
        )

    past_history = models.CharField(
        max_length = 2048,
        null = True,
        )
    family_history = models.CharField(
        max_length = 2048,
        null = True,
        )
    
class TaxInvoice(models.Model):
    patient = models.OneToOneField(
        to = Patient,
        on_delete = models.DO_NOTHING,
        null=True,
        )

    number = models.CharField(
        max_length = 2048,
        null = True,
        )

    company_name = models.CharField(
        max_length = 2048,
        null = True,
        )
    address = models.CharField(
        max_length = 2048,
        null = True,
        )






class Vital(models.Model):
    patient = models.ForeignKey(
        to = Patient,
        on_delete = models.DO_NOTHING,
        )

    date = models.DateTimeField(
        auto_now_add=True,
        )

    weight = models.CharField(
        max_length = 8,
        )

    height = models.CharField(
        max_length = 8,
        )

    blood_pressure = models.CharField(
        max_length = 8,
        )
    
    blood_temperature = models.CharField(
        max_length = 8,
        )
    
    breath = models.CharField(
        max_length = 8,
        )

    pulse_rate = models.CharField(
        max_length = 8,
        )