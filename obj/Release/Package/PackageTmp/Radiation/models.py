from django.db import models
import datetime


from Patient.models import *
from Receptionist.models import *
# Create your models here.
from django.utils.translation import gettext as _


def get_path(instance,filename):
    patient = Patient.objects.get(pk = instance.manager.diagnosis.reception.patient.id)

    name = patient.name_eng +' _ ' + patient.name_kor
    date = datetime.date.today().strftime('%Y%m%d')

    return "{:06}".format(patient.id) + '_' + name + '/' + date + '/' + 'radiation_' + name + date + '.jpg'


class RadiationManage(models.Model):
    progress_choice = (
        ('new',_('new')),
        ('done',_('done'))
        )

    manager = models.OneToOneField(
        to = PrecedureManager,
        on_delete = models.CASCADE,
        verbose_name=_('Manager'),
        )

    
    remark = models.CharField(
        max_length=32,
        verbose_name=_('Remark'),
        )

    date_ordered = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Date Ordered'),
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

    image = models.ImageField(upload_to =get_path)
                            

