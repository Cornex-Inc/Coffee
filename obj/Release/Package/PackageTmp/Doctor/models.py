from django.db import models

from Account.models import *

from django.utils.translation import gettext as _
# Create your models here.


class Depart(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    def __str__(self):
        return self.name

        
class Doctor(models.Model):
    name_kor = models.CharField(
        max_length = 64,
        verbose_name=_('Korean Name'),
        )
    name_eng = models.CharField(
        max_length = 64,
        verbose_name=_('English Name'),
        )

    name_short = models.CharField(
        max_length = 64,
        verbose_name=_('Nickname'),
        )
    
    depart = models.ForeignKey(
        to = Depart,
        on_delete= models.DO_NOTHING,
        null=True,
        verbose_name=_('depart')
        )
    
    user = models.OneToOneField(
        to = User,
        on_delete = models.CASCADE,
        verbose_name=_('user')
        )

    def __str__(self):
        return self.name_kor


class Disease_Code(models.Model):
    name_kor = models.CharField(
        max_length=128,
        null = True,
        verbose_name=_('name_kor')
        )

    name_eng = models.CharField(
        max_length=128,
        null = True,
        verbose_name=_('name_eng'),
        )

    code = models.CharField(
        max_length=128,
        null = True,
        verbose_name=_('code'),
        )

    def __str__(self):
        return self.name_kor


class TestClass(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    def __str__(self):
        return self.name

class Test(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    name_vie = models.CharField(
        max_length = 64,
        verbose_name=_('Vietnamese Name'),
        null=True,
        )

    test_class = models.ForeignKey(
        to = TestClass,
        on_delete= models.DO_NOTHING,
        verbose_name=_('Category'),
        null=True,
        )

    code = models.CharField(
        max_length = 8,
        verbose_name=_('Code'),
        null=True,
        )

    price = models.IntegerField(
        verbose_name=_('price'),
        default=0,
        )

    def __str__(self):
        return self.name
    


class PrecedureClass(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    def __str__(self):
        return self.name

class Precedure(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        null=True,
        )
    name_vie = models.CharField(
        max_length = 64,
        verbose_name=_('Vietnamese Name'),
        null=True,
        )
    
    code = models.CharField(
        max_length = 8,
        verbose_name=_('Code'),
        null=True,
        )

    precedure_class = models.ForeignKey(
        to = PrecedureClass,
        on_delete= models.DO_NOTHING,
        verbose_name=_('Category'),
        null=True,
        )

    price = models.IntegerField(
        verbose_name=_('Price'),
        default=0,
        )

    def __str__(self):
        return self.name

class MedicineClass(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    def __str__(self):
        return self.name

class Medicine(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        null=True,
        blank=True,
        )
    name_vie = models.CharField(
        max_length = 64,
        verbose_name=_('Vietnamese Name'),
        null=True,
        )

    medicine_class = models.ForeignKey(
        to = MedicineClass,
        on_delete= models.DO_NOTHING,
        verbose_name=_('Category'),
        null=True,
        )

    unit = models.CharField(
        max_length = 64,
        verbose_name=_('Unit'),
        null=True,
        )

    company = models.CharField(
        max_length = 64,
        verbose_name=_('Company'),
        null=True,
        )

    country = models.CharField(
        max_length = 64,
        verbose_name=_('Country'),
        null=True,
        )

    ingredient = models.CharField(
        max_length = 64,
        verbose_name=_('Ingredient'),
        null=True,
        )

    code = models.CharField(
        max_length = 8,
        verbose_name=_('Code'),
        null=True,
        )

    price = models.IntegerField(
        verbose_name=_('Price'),
        default=0,
        )

    inventory_count = models.IntegerField(
        verbose_name=_('Count'),
        default=0,
        )



    def __str__(self):
        if self.name is None:
            return self.name_vie
        return self.name


class ExamFee(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    code = models.CharField(
        max_length = 8,
        verbose_name=_('Code'),
        null=True,
        )

    price = models.IntegerField(
        verbose_name=_('Price'),
        default=0,
        )

    doctor = models.ForeignKey(
        to = Doctor,
        on_delete= models.DO_NOTHING,
        null=True,
        verbose_name=_('Doctor')
        )

    def __str__(self):
        return self.name