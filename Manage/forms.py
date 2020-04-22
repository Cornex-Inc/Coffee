from django import forms
import datetime

from django.utils import translation
from django.utils.translation import gettext as _

from django_summernote.widgets import SummernoteWidget
from django.db.models import Q, Count, F, Min,Sum


from .models import *
from app.models import *
from Doctor.models import *






class PaymentSearchForm(forms.Form):
    SEARCH_OPTION =(
        ('All',_('All')),
        ('Paid',_('Paid')),
        ('Unpaid',_('Unpaid')),
        )


    PAIDBY_FILTER =(
        ('All',_('All')),
        ('Remit',_('Remit')),
        ('Card',_('Card')),
        ('Cash',_('Cash')),
        )

    depart_filter = forms.ModelChoiceField(
        widget=forms.Select(attrs={
            'id': 'payment_search_depart',
            'class':'form-control costom-select payment_search_depart',
            'aria-describedby':"basic-addon1",
        }),
        queryset = Depart.objects.all(),
        label=_('Depart'),
        )

    doctor_filter = forms.ModelChoiceField(
        widget=forms.Select(attrs={
            'id': 'payment_search_doctor',
            'class':'form-control costom-select payment_search_doctor',
            'placeholder':'',
            'aria-describedby':"basic-addon1",
        }),
        queryset = Doctor.objects.all(),
        label=_('Doctor'),
        )


    check_paid = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'payment_search_check_paid',
            'class':'form-control costom-select payment_search_check_paid',
            'aria-describedby':"basic-addon1",
        }),
        choices=SEARCH_OPTION,
        label=('Paid'),
        )


    paid_by = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'payment_search_paid_by',
            'class':'form-control costom-select payment_search_paid_by',
            'aria-describedby':"basic-addon1",
        }),
        choices=PAIDBY_FILTER,
        label=('Paid by'),
        )





class PatientSearchForm(forms.Form):
    SEARCH_OPTION =(
        ('All',_('All')),
        ('Doctor',_('Doctor')),
        ('Date',_('Date')),
        )



    depart_filter = forms.ModelChoiceField(
        widget=forms.Select(attrs={
            'id': 'patient_search_depart'
        }),
        queryset = Depart.objects.all(),
        )


    input_filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'patient_search_filter'
        }),
        choices=SEARCH_OPTION,
        label=('Filter'),
        )

    search_input = forms.CharField(
        label=_('Input'),
        widget=forms.TextInput(attrs={
            'id': 'patient_search_input'
        }),
        )


class DoctorsSearchForm(forms.Form):
    depart_filter = forms.ModelChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_depart',
            'class':'form-control costom-select doctors_search_depart',
        }),
        queryset = Depart.objects.all(),
        label=_('Depart'),
        )

    doctor_filter = forms.ModelChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_doctor',
            'class':'form-control costom-select doctors_search_doctor',
        }),
    queryset = Doctor.objects.all(),
        label=_('Doctor'),
        ) 

    general = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_general',
            'class':'form-control costom-select doctors_search_general',
            }),
        label=_('General'),
            )

    medicine = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_medicine',
            'class':'form-control costom-select doctors_search_medicine',
            }),
        label=_('Medicine'),
            )

    lab = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_lab',
            'class':'form-control costom-select doctors_search_lab',
            }),
        label=_('Lab'),
            )

    scaling = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_scaling',
            'class':'form-control costom-select doctors_search_scaling',
            }),
        label=_('Scaling'),
            )

    panorama = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'doctors_search_panorama',
            'class':'form-control costom-select doctors_search_panorama',
            }),
        label=_('Panorama'),
            )



class MedicineSearchForm(forms.Form):
    
    MEDICINE_FILTER = (
        ('name',_('Nmae')),
        ('code',_('Code')),
        ('ingredient',_('Ingredient')),
        ('country',_('Country')),
        )

    search_filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'medicine_search_filter',
            'class':'form-control costom-select medicine_search_filter',
            }),
        choices=MEDICINE_FILTER,
            )


    search_input = forms.CharField(
        label=_('Input'),
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_input',
            'class':'form-control medicine_search_input',
        }),
        )


class board_form(forms.ModelForm):


    class Meta:
        model = Board_Contents
        fields = ['title','contents'] 
        widgets = {
            'title':forms.TextInput(attrs={'class':'form-control'} ),
            'contents': SummernoteWidget( attrs={'summernote': {'width': '1200px', 'height': '400px'}} ),
        }


class board_file_form(forms.ModelForm):
    class Meta:
        model = Board_File
        fields = ['file']

        files = forms.FileField(required=False)#widget=forms.ClearableFileInput(attrs={'multiple': True,'required':False}))