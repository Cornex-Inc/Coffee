from django.db import models

from Receptionist.models import *
from Doctor.models import *

from django.utils.translation import gettext as _
# Create your models here.

class TestManage(models.Model):
    progress_choice = (
        ('new',_('new')),
        ('hold',_('hold')),
        ('done',_('done'))
        )
    manager = models.OneToOneField(
        to = TestManager,
        on_delete = models.CASCADE,
        verbose_name=_('Manager'),
        )

    
    result = models.CharField(
        max_length=32,
        verbose_name=_('Result'),
        )

    date_ordered = models.DateTimeField(
        null=True,
        verbose_name=_('Date Ordered'),
        )

    date_examination= models.DateTimeField(
        null=True,
        verbose_name=_('Date Examination'),
        )

    date_expected= models.DateTimeField(
        null=True,
        verbose_name=_('Date Expected'),
        )

    name_service = models.CharField(
        max_length=32,
        null=True,
        verbose_name=_('Name of Service'),
        )

    progress = models.CharField(
        max_length = 16,
        choices=progress_choice,
        default = 'new',
        verbose_name=_('Progress'),
        )
                            

