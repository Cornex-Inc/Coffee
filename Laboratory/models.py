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
        )

    
    result = models.CharField(
        max_length=32,
        )

    date_ordered = models.DateTimeField(
        null=True,
        )

    date_examination= models.DateTimeField(
        null=True,
        )

    date_expected= models.DateTimeField(
        null=True,
        )

    name_service = models.CharField(
        max_length=32,
        null=True,
        )

    progress = models.CharField(
        max_length = 16,
        choices=progress_choice,
        default = 'new',
        )

                            

