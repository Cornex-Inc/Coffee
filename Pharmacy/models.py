from django.db import models

from Receptionist.models import *
from Doctor.models import *
# Create your models here.
from django.utils.translation import gettext as _

class MedicineManage(models.Model):
    progress_choice = (
        ('new',_('new')),
        ('hold',_('hold')),
        ('done',_('done'))
        )

    diagnosis = models.OneToOneField(
        to = Diagnosis,
        on_delete = models.DO_NOTHING,
        )

    progress = models.CharField(
        max_length = 16,
        choices=progress_choice,
        default = 'new',
        )

    date_received = models.DateTimeField(
        null=True,
        )

    date_ordered = models.DateTimeField(
        auto_now_add=True,
        )

class MedicineLogQueryManage(models.Manager):
    def get_queryset(self):
        return super(MedicineLogQueryManage,self).get_queryset().filter(medicine__is_showing = 'Y')



class MedicineLog(models.Model):
    type_chices = (
        ('new',_('new')),
        ('add',_('add')),
        ('dec',_('decrese')),
        ('del',_('deleted')),
        )

    medicine = models.ForeignKey(
        to = Medicine,
        on_delete=models.DO_NOTHING,
        )

    diagnosis = models.ForeignKey(
        to = Diagnosis,
        on_delete=models.DO_NOTHING,
        null=True,
        )
    
    date = models.DateTimeField(
        auto_now_add=True,
        )

    changes = models.IntegerField(
        default=0
        )

    memo = models.CharField(
        max_length = 256,
        null=True,
        )


    type = models.CharField(
        max_length = 4,
        choices=type_chices,
        )

    expiry_date = models.DateTimeField(
        null = True,
        )

    tmp_count = models.IntegerField(
        null = True,
        )

    objects = MedicineLogQueryManage()