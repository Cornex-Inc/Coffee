from django import forms
import datetime

from Doctor.models import *

from django.utils.translation import gettext as _


class PaymentSearchForm(forms.Form):
    SEARCH_OPTION =(
        ('All','All'),
        ('Paid','Paid'),
        ('Unpaid','Unpaid'),
        )

    # Wire / LEMIT /

    PAIDBY_FILTER =(
        ('All','All'),
        ('Lemit','Lemit'),
        ('Cash','Cash'),
        ('Card','Card'),
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
        ('All','All'),
        ('Doctor','Doctor'),
        ('Date','Date'),
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


    search_input = forms.CharField(
        label=_('Input'),
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_input'
        }),
        )