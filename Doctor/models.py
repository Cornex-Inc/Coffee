from django.db import models
import datetime
from Account.models import *

from django.utils.translation import gettext as _
# Create your models here.


class Depart(models.Model):
    name = models.CharField(
        max_length = 64,
        verbose_name=_('Name'),
        )

    full_name = models.CharField(
        max_length = 32,
        null=True,
        )

    full_name_vie = models.CharField(
        max_length = 32,
        null=True,
        )

    def __str__(self):
        return self.name

        
class Doctor(models.Model):
    name_kor = models.CharField(
        max_length = 64,
        )
    name_eng = models.CharField(
        max_length = 64,
        )

    name_short = models.CharField(
        max_length = 64,
        )
    
    depart = models.ForeignKey(
        to = Depart,
        on_delete= models.DO_NOTHING,
        null=True,
        )
    
    user = models.OneToOneField(
        to = User,
        on_delete = models.CASCADE,
        )

    def __str__(self):
        return self.name_kor

    def get_name(self):
        return self.name_kor + '(' + self.name_short + ')'


class Disease_Code(models.Model):
    name_kor = models.CharField(
        max_length=128,
        null = True,
        )

    name_eng = models.CharField(
        max_length=128,
        null = True,
        )

    code = models.CharField(
        max_length=128,
        null = True,
        )

    def __str__(self):
        return self.name_kor


class Pricechange(models.Model):

    # examfee , tests, Precedure, medicine ... 
    type = models.CharField(
        max_length=128,
        )


    #input / output ,,,
    type2 = models.CharField(
        max_length=128,
        null=True,
        default = None,
        )

    code = models.CharField(
        max_length=128,
        )

    date_start = models.CharField(
        max_length=18,
        )

    date_end = models.CharField(
        max_length=18,
        )

    price = models.IntegerField(
        )

    country = models.CharField(
        max_length=4,
        default="VI",
        )

class TestClass(models.Model):
    name = models.CharField(
        max_length = 64,
        )

    name_vie = models.CharField(
        max_length = 64,
        null=True,
        )

    def __str__(self):
        return self.name

    def get_name_lang(self,lang=None):
        if lang == 'vi':
            if self.name_vie == None:
                return self.name
            else:
                return self.name_vie
        else:
            return self.name


class Test(models.Model):
    name = models.CharField(
        max_length = 64,
        )

    name_vie = models.CharField(
        max_length = 64,
        null=True,
        )

    test_class = models.ForeignKey(
        to = TestClass,
        on_delete= models.DO_NOTHING,
        null=True,
        )


    is_external = models.BooleanField(
        default=False,
        )


    code = models.CharField(
        max_length = 8,
        unique=True,
        )

    price = models.IntegerField(
        default=0,
        )

    price_dollar = models.IntegerField(
        default=0,
        null=True,
        )

    use_yn = models.CharField(
        max_length = 1,
        null=True,
        default='Y',
        )

    

    def __str__(self):
        return self.name

    def get_price(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Test',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='VI',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price

    def get_price_dollar(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Test',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='US',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price_dollar

    def get_name_lang(self,lang=None):
        if lang == 'vi':
            if self.name_vie == None:
                return self.name
            else:
                return self.name_vie
        else:
            return self.name


    
class TestReferenceInterval(models.Model):
    test = models.ForeignKey(
        to = Test,
        on_delete=models.CASCADE,
        )

    minimum = models.FloatField(
        null= True,
        )

    maximum = models.FloatField(
        null= True,
        )

    name = models.CharField(
        max_length = 24,
        null=True,
        )

    name_vie = models.CharField(
        max_length = 24,
        null=True,
        )

    unit = models.CharField(
        max_length = 12,
        null=True,
        )

    unit_vie = models.CharField(
        max_length = 12,
        null=True,
        )

    use_yn = models.CharField(
        max_length = 12,
        default='Y',
        )


    def get_range(self):
        range_min = '' if self.minimum is None else str(self.minimum)
        range_max = '' if self.maximum is None else str(self.maximum)
        if range_min is not '' and range_max is not '': 
            range_ret = range_min  + ' - ' + range_max
        else:
            range_ret = range_min  + ' < ' + range_max
        return range_ret

    def check_interval(self,value):
        value = float(value)
        if self.minimum is not None and self.maximum is not None:
            res = self.minimum < value and  value < maximum
        elif self.minimum is None:
            res = value < self.maximum
        elif self.maximum is None:
            res = self.minimum < value

        return res

    def get_unit_lang(self,lang=None):
        if lang == 'vi':
            if self.unit_vie == None:
                return self.unit
            else:
                return self.unit_vie
        else:
            return self.unit

    def get_name_lang(self,lang=None):
        if lang == 'vi':
            if self.name_vie == None:
                return self.name
            else:
                return self.name_vie
        else:
            return self.name





class PrecedureClass(models.Model):
    name = models.CharField(
        max_length = 64,
        )

    name_vie = models.CharField(
        max_length = 64,
        null=True,
        )

    def get_name_lang(self,lang=None):
        if lang == 'vi':
            if self.name_vie == None:
                return self.name
            else:
                return self.name_vie
        else:
            return self.name

    def __str__(self):
        return self.name

class Precedure(models.Model):
    name = models.CharField(
        max_length = 64,
        null=True,
        )
    name_vie = models.CharField(
        max_length = 64,
        null=True,
        )
    
    code = models.CharField(
        max_length = 8,
        unique=True,
        )

    precedure_class = models.ForeignKey(
        to = PrecedureClass,
        on_delete= models.DO_NOTHING,
        null=True,
        )

    price = models.IntegerField(
        default=0,
        )

    price_dollar = models.IntegerField(
        default=0,
        null=True,
        )

    use_yn = models.CharField(
        max_length = 1,
        null=True,
        default='Y',
        )

    type = models.CharField(
        max_length = 4,
        default='NM',
    )

    #expiry_date = models.CharField(
    #    max_length = 6,
    #    null=True,
    #)

    def __str__(self):
        return self.name

    def get_price(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Precedure',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='VI',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price

    def get_price_dollar(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Precedure',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='US',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price
        
    def get_name_lang(self,lang=None):
        if lang == 'vi':
            if self.name_vie == None:
                return self.name
            else:
                return self.name_vie
        else:
            return self.name

class PrecedureShort(models.Model):
    doctor = models.ForeignKey(
        to = Doctor,
        on_delete= models.DO_NOTHING,
        null=True,
        )

    precedure = models.ForeignKey(
        to = Precedure,
        on_delete= models.DO_NOTHING,
        null=True,
        )

class MedicineClass(models.Model):
    name = models.CharField(
        max_length = 64,
        )

    name_vie = models.CharField(
        max_length = 64,
        null=True,
        )

    def __str__(self):
        return self.name


class MedicineQueryManage(models.Manager):
    def get_queryset(self):
        return super(MedicineQueryManage,self).get_queryset().filter(is_showing = 'Y')


class Medicine(models.Model):
    name_display = models.CharField(
        max_length = 128,
        null=True,
        blank=True,
        )

    name = models.CharField(
        max_length = 128,
        null=True,
        blank=True,
        )
    name_vie = models.CharField(
        max_length = 128,
        null=True,
        )

    medicine_class = models.ForeignKey(
        to = MedicineClass,
        on_delete= models.DO_NOTHING,
        null=True,
        )

    unit = models.CharField(
        max_length = 12,
        null=True,
        )

    unit_vie = models.CharField(
        max_length = 12,
        null=True,
        )

    company = models.CharField(
        max_length = 64,
        null=True,
        )

    country = models.CharField(
        max_length = 24,
        null=True,
        )

    country_vie = models.CharField(
        max_length = 24,
        null=True,
        )

    ingredient = models.CharField(
        max_length = 128,
        null=True,
        )

    ingredient_vie = models.CharField(
        max_length = 128,
        null=True,
        )

    code = models.CharField(
        max_length = 8,
        unique=True,
        )

    price = models.IntegerField(
        default=0,
        )

    price_dollar = models.IntegerField(
        default=0,
        null=True,
        )

    price_input = models.IntegerField(
        default=0,
        )

    inventory_count = models.IntegerField(
        default=0,
        )

    use_yn = models.CharField(
        max_length = 1,
        null=True,
        default='Y',
        )

    multiple_level = models.CharField(
        max_length = 10,
        null=True,
        )

    type = models.CharField(
        max_length = 10,
        default = 'PHARM',
        )

    is_showing = models.CharField(
        max_length = 2,
        default = 'Y',
        )

    def __str__(self):
        if self.name is None:
            return self.name_vie
        return self.name


    def get_price_input(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Medicine',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='VI',
                type2 = 'INPUT',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price_input

    def get_price(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Medicine',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='VI',
                type2 = 'OUTPUT',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price

    def get_price_dollar(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'Medicine',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='US',
                type2 = 'OUTPUT',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price



        


    def get_name_lang(self,lang=None):
        res = ''
        if lang == 'vi':
            if self.name_vie == None:
                res =  self.name
            else:
                res =  self.name_vie
        else:
            res =  self.name
        print(self.code)
        if self.code == 'I0018' or self.code =='I0019':
            res += '<text sylte="color:red;">(AST !!)</text>'

        return res;


    def get_ingredient_lang(self,lang=None):
        if lang == 'vi':
            if self.ingredient_vie == None:
                return self.ingredient
            else:
                return self.ingredient_vie
        else:
            return self.ingredient

    def get_unit_lang(self,lang=None):
        if lang == 'vi':
            if self.unit_vie == None:
                return self.unit
            else:
                return self.unit_vie
        else:
            return self.unit

    def get_country_lang(self,lang=None):
        if lang == 'vi':
            if self.country_vie == None:
                return self.country
            else:
                return self.country_vie
        else:
            return self.country

    objects = MedicineQueryManage()


class MedicineShort(models.Model):
    doctor = models.ForeignKey(
        to = Doctor,
        on_delete= models.DO_NOTHING,
        null=True,
        )

    medicine = models.ForeignKey(
        to = Medicine,
        on_delete= models.DO_NOTHING,
        null=True,
        )

class ExamFee(models.Model):

    name = models.CharField(
        max_length = 64,
        )

    code = models.CharField(
        max_length = 8,
        unique=True,
        )

    price = models.IntegerField(
        default=0,
        )
    doctor = models.ForeignKey(
        to = Doctor,
        on_delete= models.DO_NOTHING,
        null=True,
        )

    use_yn = models.CharField(
        max_length = 1,
        null=True,
        default='Y',
        )

    def __str__(self):
        return self.name

    def get_price(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'ExamFee',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='VI',
                )
            return check.price
        except Pricechange.DoesNotExist:
            return self.price

    def get_price_dollar(self,get_date = None):
        date = datetime.datetime.now().strftime("%Y%m%d%H%M%S") if get_date is None else get_date.strftime("%Y%m%d%H%M%S")
        try:
            check = Pricechange.objects.get(
                type = 'ExamFee',
                code = self.code, 
                date_start__lte = date,
                date_end__gte = date,
                country='US',
                )
            return check.price_dollar
        except Pricechange.DoesNotExist:
            return self.price_dollar


    def get_name_lang(self,lang=None):
        if lang == 'vi':
            if self.name_vie == None:
                return self.name
            else:
                return self.name_vie
        else:
            return self.name




class BundleClass(models.Model):
    upper = models.CharField(
        max_length = 64,
        )

    group_code = models.CharField(
        max_length = 64,
        )

    group_name = models.CharField(
        max_length = 64,
        )

class Bundle(models.Model):
    upper = models.ForeignKey(
        to = BundleClass,
        on_delete = models.DO_NOTHING,
        )

    type = models.CharField(
        max_length = 64,
        )

    code = models.CharField(
        max_length = 64,
        )

    amount = models.IntegerField(
        null=True,
        )

    days = models.IntegerField(
        null=True,
        )

    use_yn = models.CharField(
        max_length = 1,
        null=True,
        default='Y',
        )


class ICD(models.Model):
    code = models.CharField(
        max_length = 16,
        unique=True,
        )

    name = models.CharField(
        max_length = 128,
        null=True,
        )

    name_vie = models.CharField(
        max_length = 128,
        null=True,
        )

    use_yn = models.CharField(
        max_length = 1,
        null=True,
        default='Y',
        )