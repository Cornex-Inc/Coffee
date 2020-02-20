
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
                   'class':'form-control doctor_patient_table_contents',
                   'placeholder':'000000',
                   'aria-describedby':"basic-addon1",
                   'style':'width:6vw',
                   'autocomplete':'off',
                   }
            ),
        required = False,
        )

    name_kor = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'id':'patient_name_kor',
                'class':'form-control doctor_patient_table_contents',
                'aria-describedby':"basic-addon1",
                'autocomplete':'off',
                }),
        required = True,
        )

    name_eng = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'id':'patient_name_eng',
                'class':'form-control doctor_patient_table_contents',
                'aria-describedby':"basic-addon1",
                'autocomplete':'off',
                }),
        required = True,
        )

    date_of_birth = forms.DateField(
        required = True,
        widget=forms.DateInput(
            attrs={
                'id':'patient_date_of_birth',
                'class':'form-control doctor_patient_table_contents',
                'placeholder':'0000-00-00',
                'aria-describedby':"basic-addon1",
                'style':'width:6vw',
                'autocomplete':'off',
                }),
        )

    phone = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'id':'patient_phone',
                'class':'form-control doctor_patient_table_contents',
                'aria-describedby':"basic-addon1",
                'style':'width:6vw',
                'autocomplete':'off',
                }),
        )

    
    gender = forms.ChoiceField(
        widget=forms.RadioSelect(
            attrs={'id':'patient_gender'}
            ),
        choices = GENDER_CHOICE,
        required = True,
        )

    address = forms.CharField(
        widget=forms.TextInput(attrs={
            'id':'patient_address',
            'class':'form-control doctor_patient_table_contents',
            'aria-describedby':"basic-addon1",
            'autocomplete':'off',
            }),
        )



class DiagnosisForm(forms.ModelForm):
    history_taking = forms.CharField(
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
    )

class PrecedureForm(forms.Form):

    precedures = forms.ModelMultipleChoiceField(
        widget  = forms.CheckboxSelectMultiple,
        queryset = Precedure.objects.all(),
    )

class MedicineForm(forms.Form):

    medicines = forms.ModelMultipleChoiceField(
        widget  = forms.CheckboxSelectMultiple,
        queryset = Medicine.objects.all(),
    )

class DoctorForm(forms.ModelForm):

    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget = forms.Select(attrs={ 'id':'depart_select'}),
        required=True,
        )

    name_kor = forms.CharField(
        required=True,
        )

    name_eng = forms.CharField(
        required=True,
        )

    class Meta:
        model = Doctor
        fields = ['name_kor','name_eng','depart']


class ReportSearchForm(forms.Form):
    SEARCH_SEL = (
        ('Name',_('Name')),
        ('doctor',_('Doctor')),
        )

    date = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'search_date',
            'class':'form-control search_date',
            'aria-describedby':"basic-addon1",
        }),
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'search_select',
            'class':'form-control custom-select search_select',
            'aria-describedby':"basic-addon1",
        }),
        choices=SEARCH_SEL,
        )

    search_input = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'search_input',
            'class':'form-control search_input',
            'aria-describedby':"basic-addon1",
        }),
        )