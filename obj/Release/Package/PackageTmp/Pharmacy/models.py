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
        verbose_name=_('Progress'),
        )

    date_received = models.DateTimeField(
        null=True,
        verbose_name=_('Date Received'),
        )

    date_ordered = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Date Ordered'),
        )

class MedicineLog(models.Model):
    type_chices = (
        ('new',_('new')),
        ('add',_('add')),
        )

    medicine = models.ForeignKey(
        to = Medicine,
        on_delete=models.DO_NOTHING,
        )

    reception = models.ForeignKey(
        to = Reception,
        on_delete=models.DO_NOTHING,
        )
    
    date = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Date'),
        )

    changes = models.IntegerField(
       verbose_name=_('Change'),
        )

    memo = models.CharField(
        max_length = 256,
         null=True,
         verbose_name=_('Memo'),
        )

    type = models.CharField(
        max_length = 4,
        choices=type_chices,
        verbose_name=_('Type'),
        )
                            

