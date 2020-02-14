from django.db import models
from django.db.models import functions
import datetime


from Patient.models import *
from Receptionist.models import *
# Create your models here.
from django.utils.translation import gettext as _


def get_path(instance,filename):
    patient = Patient.objects.get(pk = instance.manager.diagnosis.reception.patient.id)

    name = patient.name_eng + '_' + patient.name_kor
    date = datetime.date.today().strftime('%Y%m%d')

    return "{:06}".format(patient.id) + '_' + name + '/' + instance.name_service +'_'+ name + date + '.jpg'


class RadiationManage(models.Model):
    progress_choice = (
        ('new',_('new')),
        ('done',_('done'))
        )

    manager = models.ForeignKey(
        to = PrecedureManager,
        on_delete = models.CASCADE,
        )

    
    remark = models.CharField(
        max_length=32,
        null = True,
        )

    date_ordered = models.DateTimeField(
        auto_now_add=True,
        )


    name_service = models.CharField(
        max_length=32,
        null=True,
        )

    progress = models.CharField(
        max_length = 16,
        choices=progress_choice,
        default = _('new'),
        )

    image = models.ImageField(upload_to =get_path)
                            
class RadiationImage(models.Model):

    radiation_manage = models.ForeignKey(
        to = RadiationManage,
        on_delete = models.DO_NOTHING,
        )

    image = models.ImageField(upload_to =get_path)