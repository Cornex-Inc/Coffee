from django.db import models
import datetime
from django.core.exceptions import ObjectDoesNotExist



from django.utils.translation import gettext as _
# Create your models here.
class Patient(models.Model):
    name_kor = models.CharField(
        max_length = 64,
        verbose_name=_('Name Kor'),
        )
    name_eng = models.CharField(
        max_length = 64,
        verbose_name=_('Name Eng'),
        )

    phone = models.CharField(
        max_length = 64,
        verbose_name=_('Phone Numer'),
        )
    gender = models.CharField(
        max_length = 8,
        verbose_name=_('Gender'),
        )

    date_of_birth = models.DateField(
        blank=True,
        verbose_name=_('Date of Birth'),
        )
    date_registered = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Date Registered'),
        )
    tax = models.CharField(
        max_length = 64,
        null=True,
        verbose_name=_('Tax Invoice'),
        )
    
    address = models.CharField(
        max_length = 64,
        null=True,
        verbose_name=_('Adress'),
        )

    def getID(self):
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

    def get_name_eng_kor(self):
        return self.name_kor + ' / ' + self.name_eng

    def has_unpaid(self):
        unpaid = False
        receptions = self.reception_set.all()
        for reception in receptions:
            try:
                if reception.payment.progress == 'unpaid':
                    unpaid = True
            except ObjectDoesNotExist:# 에러 종류
                pass

        return unpaid
    
    

class History(models.Model):
    patient = models.OneToOneField(
        to = Patient,
        on_delete = models.CASCADE,
        verbose_name=_('Patient'),
        )

    past_history = models.CharField(
        max_length = 2048,
        null = True,
        verbose_name=_('Past History'),
        )
    family_history = models.CharField(
        max_length = 2048,
        null = True,
        verbose_name=_('Family History'),
        )
    
class TaxInvoice(models.Model):
    patient = models.OneToOneField(
        to = Patient,
        on_delete = models.DO_NOTHING,
        verbose_name=_('Patient'),
        null=True,
        )

    number = models.CharField(
        max_length = 2048,
        null = True,
        verbose_name=_('Number'),
        )

    company_name = models.CharField(
        max_length = 2048,
        null = True,
        verbose_name=_('Company Name'),
        )
    address = models.CharField(
        max_length = 2048,
        null = True,
        verbose_name=_('Address'),
        )






class Vital(models.Model):
    patient = models.ForeignKey(
        to = Patient,
        on_delete = models.DO_NOTHING,
        verbose_name=_('Patient'),
        )

    date = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Date'),
        )

    weight = models.CharField(
        max_length = 8,
        verbose_name=_('Weight'),
        )

    height = models.CharField(
        max_length = 8,
        verbose_name=_('Height'),
        )

    blood_pressure = models.CharField(
        max_length = 8,
        verbose_name=_('Blood Pressure'),
        )
    
    blood_temperature = models.CharField(
        max_length = 8,
        verbose_name=_('Blood Temperature'),
        )
    
    breath = models.CharField(
        max_length = 8,
        verbose_name=_('Breath'),
        )

    purse_rate = models.CharField(
        max_length = 8,
        verbose_name=_('Purse Rate'),
        )