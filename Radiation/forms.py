
from django import forms
import datetime

from Radiation.models import *

from django.utils.translation import gettext as _


class RadiationForm(forms.ModelForm):

    id = forms.CharField(
        max_length=16,
        widget=forms.HiddenInput(
            attrs={
                'id':'selected_img_id',
                }),
        required = False,

        )


    class Meta:
        model=RadiationManage
        fields = ['image','remark',]
        widgets={
            'image':forms.FileInput(attrs={
                'id':'img_input',
                'class':'',
                'onchange':'LoadImg(this)',
                'style':'display:none',
                }),
            'remark':forms.TextInput(attrs={
                'id':'remark',
                'class':'form-control radiation_remark',
                }),
            }


class PrecedureManageForm(forms.Form):
    SEARCH_SEL = (
        ('name',_('Name')),
        ('chart',_('Chart')),
        ('depart',_('Depart')),
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'radiology_search_select',
            'class':'form-control costom-select radiology_search_select',
            'aria-describedby':"basic-addon1",
        }),
        choices=SEARCH_SEL,
        )

    search_input = forms.CharField(
        label=_('Input'),
        widget=forms.TextInput(attrs={
            'id': 'radiology_search_input',
            'class':'form-control radiology_search_input',
            'aria-describedby':"basic-addon1"
        }),
        )