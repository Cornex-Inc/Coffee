from django import forms

from Patient.models import Patient, History

from django.utils.translation import gettext as _

class PatientForm(forms.ModelForm):
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
                   'autocomplete':'off',
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
                'aria-describedby':"basic-addon1",
                'autocomplete':'off',
                }),
        required = True,
        )

    name_eng = forms.CharField(
        label=_('Name Eng'),
        widget=forms.TextInput(
            attrs={
                'id':'patient_name_eng',
                'class':'form-control',
                'aria-describedby':"basic-addon1",
                'autocomplete':'off',
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
                'autocomplete':'off',
                }),
        )

    phone = forms.CharField(
        label=_('Phone Number'),
        widget=forms.TextInput(
            attrs={
                'id':'patient_phone',
                'class':'form-control',
                'aria-describedby':"basic-addon1",
                'autocomplete':'off',
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
            'aria-describedby':"basic-addon1",
            'autocomplete':'off',
            }),
        )


    class Meta:
        model = Patient
        fields = ['id','name_kor','name_eng','phone','gender','date_of_birth','address']


class HistoryForm(forms.ModelForm):

    past_history = forms.CharField(
        required = False,
        label=_('Past History'),
        widget=forms.TextInput(
            attrs={
                'id':'history_past',
                'class':'form-control',
                'placeholder':'',
                'aria-describedby':"basic-addon1",
                }
            ),
        )

    family_history = forms.CharField(
        required = False,
        label=_('Family History'),
        widget=forms.TextInput(
            attrs={
                'id':'history_family',
                'class':'form-control',
                'placeholder':'',
                'aria-describedby':"basic-addon1",
                }
            ),
        )

    class Meta:
        model = History
        fields = ['past_history','family_history',]


class VitalForm(forms.Form):
    date = forms.DateTimeField(
        )

    weight = forms.CharField(
        )

    height = forms.CharField(
        )

    blood_pressure = forms.CharField(
        )
    
    blood_temperature = forms.CharField(
        )
    
    breath = forms.CharField(
        )

    purse_rate = forms.CharField(
        )