from django import forms
import datetime
from Receptionist.models import Reception, Diagnosis, Payment, PaymentRecord, Reservation
from Doctor.models import Depart, Doctor

from django.utils.translation import gettext as _
    
class ReceptionForm(forms.ModelForm):
    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget = forms.Select(attrs={ 
            'id':'depart_select',
            'class':'form-control costom-select ',
            'aria-describedby':"basic-addon1",
            }),
        required = True,
        )

    doctor = forms.ModelChoiceField(
        queryset = Doctor.objects.all(),
        widget = forms.Select(attrs={ 
            'id':'doctor_select',
            'class':'form-control costom-select',
            'aria-describedby':"basic-addon1",
            }),

        required = True,
        )

    chief_complaint = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'id':'chief_complaint',
                'class':'form-control',
                'aria-describedby':"basic-addon1",
                }
            )
        ,)

    follow_update = forms.DateField(
        widget=forms.DateInput(attrs={
            'id': 'Datepicker',
            'autocomplete':"off"
        }),
        required = False,
        )

    class Meta:
        model = Reception
        fields = ['depart','doctor','chief_complaint','follow_update',]


class PatientSearchForm(forms.Form):
    SEARCH_SEL = (
        ('name',_('Name')),
        ('chart',_('Chart No')),
        ('date_of_birth',_('Date of Birth')),
        ('phone',_('Phone Number')),
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'patient_search_select',
            'class':'form-control costom-select patient_search_select',
            'aria-describedby':"basic-addon1",
        }),
        choices=SEARCH_SEL,
        )

    search_input = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'patient_search_input',
            'class':'form-control patient_search_input',
            'aria-describedby':"basic-addon1",
        }),
        )


#지울 예정
class SearchPatientForm(forms.Form):
    SEARCH_SEL = (
        ('name_kor',_('Name Kor')),
        ('name_eng',_('Name Eng')),
        ('date_of_birth',_('Date of Birth')),
        ('phone',_('Phone Number')),
        )

    filter = forms.ChoiceField(
        widget=forms.Select, 
        choices=SEARCH_SEL,
        )
    search_input = forms.CharField(
        )
    
class SearchReceptionStatusForm(forms.Form):
    progress_choice = (
        ('all',_('All')),
        ('new',_('New')),
        ('hold',_('Saved')),
        ('done',_('Done'))
        )


    date = forms.DateField(
        initial= datetime.date.today,
        widget=forms.DateInput(attrs={
            'id': 'reception_waiting_date',
            'class':'form-control reception_waiting_date',
            'aria-describedby':"basic-addon1",
        }),
        )

    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget = forms.Select(attrs={ 
            'id':'reception_waiting_depart',
            'class':'form-control costom-select reception_waiting_depart',
            'aria-describedby':"basic-addon1",
            }),
        required = False,)

    doctor = forms.ModelChoiceField(
        queryset = Doctor.objects.all(),
        widget = forms.Select(attrs={ 
            'id':'reception_waiting_doctor',
            'class':'form-control costom-select reception_waiting_doctor',
            'aria-describedby':"basic-addon1",
            }),
        required = False,
        )

    progress = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'reception_progress',
            'class':'form-control costom-select reception_progress',
            'aria-describedby':"basic-addon1",
        }),
        choices=progress_choice,
        )


class PaymentForm(forms.ModelForm):
   
    method = forms.ChoiceField(
        widget=forms.RadioSelect(attrs={}),
        choices=PaymentRecord.method_choices,
        )


    class Meta:
        model = Payment
        fields = ['method','reception','memo']
        widgets = {'reception': forms.HiddenInput(),}

class PaymentSearchForm(forms.Form):
    progress_choice = (
        ('all',_('all')),
        ('paid',_('paid')),
        ('unpaid',_('unpaid')),
        )

    date = forms.DateTimeField(
        initial= datetime.date.today,
        widget=forms.DateInput(attrs={
            'id': 'Datepicker_payment',
            'autocomplete':"off"
        }),
        )

    progress = forms.ChoiceField(
        widget = forms.Select(attrs={ 'id':'payment_status'}),
        choices=progress_choice,
        )

class ReservationSearchForm(forms.Form):
    progress_choice = (
        ('all',_('all')),
        ('visited',_('visited')),
        ('unvisited',_('unvisited')),
        )


    date = forms.DateTimeField(
        initial= datetime.date.today,
        widget=forms.DateInput(attrs={
            'id': 'Datepicker_reservation',
            'autocomplete':"off"
        }),
        )

    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget = forms.Select(attrs={ 
            'id':'reservation_depart_select',
            'class':'form-control costom-select reservation_depart_select',
            'aria-describedby':"basic-addon1"
            ,}),
        required = False,)

    doctor = forms.ModelChoiceField(
        queryset = Doctor.objects.all(),
        widget = forms.Select(attrs={ 
            'id':'reservation_doctor_select',
            'class':'form-control costom-select reservation_doctor_select',
            'aria-describedby':"basic-addon1",
            }),
        required = False,)

    progress = forms.ChoiceField(
        widget = forms.Select(attrs={ 'id':'reservation_status'}),
        choices=progress_choice,
        )





class ReservationForm(forms.ModelForm):
    date = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={
            'id': 'reservation_date',
            'class':'form-control',
            'aria-describedby':"basic-addon1",
            'autocomplete':'off',
        }),
        required=False,
        )


    class Meta:
        model = Reservation
        fields = ['date',]


class StorageSearchForm(forms.Form):
    SEARCH_SEL = (
        ('name',_('Name')),
        ('Chart',_('Chart No')),
        ('Depart',_('Depart')),
        ('Doctor',_('Doctor')),
        )

    STATUS_SEL = (
        ('all',_('All')),
        ('paid',_('paid')),
        ('unpaid',_('unpaid')),
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'storage_search_select',
            'class':'form-control storage_search_select',
            'aria-describedby':"basic-addon1",
            'autocomplete':'off',
        }),
        choices=SEARCH_SEL,
        )

    status_filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'storage_search_select',
            'class':'form-control storage_search_select',
            'aria-describedby':"basic-addon1",
            'autocomplete':'off',
        }),
        choices=SEARCH_SEL,
        )

    search_input = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'storage_search_input',
            'class':'form-control custom-select storage_search_input' ,
            'aria-describedby':"basic-addon1",
        }),
        )

class StorageForm(forms.Form):
    METHOD = (
        ('remit',_('Remit')),
        ('card',_('Card')),
        ('cash',_('Cash')),
        )


    follow_update = forms.DateTimeField(
        widget=forms.TextInput({
                'class':'form-control costom-select',
                'aria-describedby':"basic-addon1",
            })
        )

    payment_info = forms.ChoiceField(
        choices=METHOD,
        widget=forms.Select(attrs={
            'class':'form-control costom-select',
            'aria-describedby':"basic-addon1",
        }),
        )

    pay = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class':'form-control storage_pay',
            'aria-describedby':"basic-addon1",
        }),
        )

    tax_invoice = forms.BooleanField(
        widget=forms.CheckboxInput(),
        )

    memo = forms.CharField(
        )


class ReservationDialogForm(forms.Form):
    
    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget=forms.Select(attrs={ 
            'id':'reservation_depart',
            'class':'form-control costom-select',
            'aria-describedby':"basic-addon1",}),
        )

    doctor = forms.ModelChoiceField(
        queryset = Doctor.objects.all(),
        widget=forms.Select(attrs={ 
            'id':'reservation_doctor',
            'class':'form-control costom-select',
            'aria-describedby':"basic-addon1",}),
        )

class ReservationSearchControl(forms.Form):
    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        widget=forms.Select(attrs={ 
            'id':'reservation_search_depart',
            'class':'form-control reservation_select',
            'aria-describedby':"basic-addon1",}),
        )

    doctor = forms.ModelChoiceField(
        queryset = Doctor.objects.filter(),
        widget=forms.Select(attrs={ 
            'id':'reservation_search_doctor',
            'class':'form-control reservation_select',
            'aria-describedby':"basic-addon1",}),
        )