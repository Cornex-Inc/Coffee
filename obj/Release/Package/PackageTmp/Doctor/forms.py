
from django import forms

from .models import *
from Receptionist.models import Diagnosis

from django.utils.translation import gettext as _

                   

class PatientForm_Doctor(forms.Form):
    GENDER_CHOICE = (
        ('Male',_('Male')),
        ('Female',_('Female'))
        )

    id = forms.CharField(
        widget=forms.TextInput(
            attrs={'readonly':'readonly',
                   'text-align':'right',
                   'id':'patient_chart',
                   'class':'form-control',
                   'placeholder':'000000',
                   'aria-describedby':"basic-addon1",
                   'style':'width:6vw',
                   }
            ),
        required = False,
        label=_('Chart No'),
        )

    name_kor = forms.CharField(
        label=_('Name Kor'),
        widget=forms.TextInput(
            attrs={
                'id':'patient_name_kor',
                'class':'form-control',
                'placeholder':'',
                'aria-describedby':"basic-addon1",
                }),
        required = True,
        )

    name_eng = forms.CharField(
        label=_('Name Eng'),
        widget=forms.TextInput(
            attrs={
                'id':'patient_name_eng',
                'class':'form-control',
                'placeholder':'',
                'aria-describedby':"basic-addon1",
                }),
        required = True,
        )

    date_of_birth = forms.DateField(
        required = True,
        label=_('Date of Birth'),
        widget=forms.DateInput(
            attrs={
                'id':'patient_date_of_birth',
                'class':'form-control',
                'placeholder':'0000-00-00',
                'aria-describedby':"basic-addon1",
                'style':'width:6vw',
                }),
        )

    phone = forms.CharField(
        label=_('Phone Number'),
        widget=forms.TextInput(
            attrs={
                'id':'patient_phone',
                'class':'form-control',
                'placeholder':'',
                'aria-describedby':"basic-addon1",
                'style':'width:6vw',
                }),
        )

    
    gender = forms.ChoiceField(
        widget=forms.RadioSelect(attrs={'id':'patient_gender'}),
        choices = GENDER_CHOICE,
        label=_('Gender'),
        required = True,
        )

    address = forms.CharField(
        label=_('Address'),
        widget=forms.TextInput(attrs={
            'id':'patient_address',
            'class':'form-control',
            'placeholder':'',
            'aria-describedby':"basic-addon1",
            }),
        )



class DiagnosisForm(forms.ModelForm):
    history_taking = forms.CharField(
        label=_('History Taking'),
        widget=forms.Textarea(
            attrs={
                'id':'history_taking',
                'class':'diagnosis_textarea',
                }
            )
        ,)

    class Meta:
        model = Diagnosis
        fields = ['history_taking','medical_report',]

class TestForm(forms.Form):

    tests = forms.ModelMultipleChoiceField(
        widget  = forms.CheckboxSelectMultiple,
        queryset = Test.objects.all(),
        label=_('Test'),
    )

class PrecedureForm(forms.Form):

    precedures = forms.ModelMultipleChoiceField(
        widget  = forms.CheckboxSelectMultiple,
        queryset = Precedure.objects.all(),
        label=_('Precedure'),
    )

class MedicineForm(forms.Form):

    medicines = forms.ModelMultipleChoiceField(
        widget  = forms.CheckboxSelectMultiple,
        queryset = Medicine.objects.all(),
        label=_('Medicine'),
    )

class DoctorForm(forms.ModelForm):

    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget = forms.Select(attrs={ 'id':'depart_select'}),
        required=True,
        label=_('Depart'),)

    name_kor = forms.CharField(
        required=True,
        label=_('Name Kor'),)

    name_eng = forms.CharField(
        required=True,
        label=_('Name Eng'),)

    class Meta:
        model = Doctor
        fields = ['name_kor','name_eng','depart']


class ReportSearchForm(forms.Form):
    SEARCH_SEL = (
        ('all',_('All')),
        ('doctor',_('Doctor')),
        ('patient',_('Patient')),
        )

    date = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'search_date',
            'class':'form-control search_date',
            'placeholder':'',
            'aria-describedby':"basic-addon1",
        }),
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'search_select',
            'class':'form-control custom-select search_select',
            'placeholder':'',
            'aria-describedby':"basic-addon1",
        }),
        choices=SEARCH_SEL,
        )

    search_input = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'search_input',
            'class':'form-control search_input',
            'placeholder':'',
            'aria-describedby':"basic-addon1",
        }),
        )