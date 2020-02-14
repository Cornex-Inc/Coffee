from django import forms
import datetime


from django.utils.translation import gettext as _

class WaitingSearchForm(forms.Form):
    SEARCH_SEL = (
        ('name',_('Name')),
        ('Chart',_('Chart')),
        ('Doctor',_('Doctor'))
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'pharmacy_search_select',
            'class':'form-control costom-select pharmacy_search_select',
            'aria-describedby':"basic-addon1"
        }),
        choices=SEARCH_SEL,
        )

    search_input = forms.CharField(
        label=_('Input'),
        widget=forms.TextInput(attrs={
            'id': 'pharmacy_search_input ',
            'class':'form-control pharmacy_search_input',
            'aria-describedby':"basic-addon1"
        }),
        )

class MedicineSearchForm(forms.Form):
    SEARCH_SEL = (
        ('name',_('name')),
        )

    filter = forms.ChoiceField(
         widget=forms.Select(attrs={
            'id': 'medicine_search_select',
            'class':'form-control costom-select medicine_search_select',
            'aria-describedby':"basic-addon1"
        }),
        choices=SEARCH_SEL,
        )
    search_input = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_input',
            'class':'form-control medicine_search_input',
            'aria-describedby':"basic-addon1"
        }),
        )

class MedicineControl(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(attrs={
            'id': 'medicine_control_name',
            'class':'form-control medicine_control_input',
            'aria-describedby':"basic-addon1"
        }),
        )

    price = forms.IntegerField(
        widget=forms.TextInput(attrs={
            'id': 'medicine_control_price',
            'class':'form-control medicine_control_input',
            'aria-describedby':"basic-addon1",
        }),
        )

    changes = forms.IntegerField(
        initial=0,
        widget=forms.NumberInput(attrs={
            'id': 'medicine_search_changes',
            'class':'form-control medicine_control_input',
            'aria-describedby':"basic-addon1",
        }),
        )

    unit = forms.CharField(
        max_length = 16,
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_unit',
            'class':'form-control medicine_control_input',
            'aria-describedby':"basic-addon1"
        }),
        )

    company = forms.CharField(
        max_length = 64,
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_company',
            'class':'form-control medicine_control_input',
            'aria-describedby':"basic-addon1"
        }),
        )

    ingredient = forms.CharField(
        max_length = 64,
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_ingredient',
            'class':'form-control medicine_search_ingredient',
            'aria-describedby':"basic-addon1"
        }),
        )

    country = forms.CharField(
        max_length = 64,
        widget=forms.TextInput(attrs={
            'id': 'medicine_search_country ',
            'class':'form-control medicine_control_country',
            'aria-describedby':"basic-addon1"
        }),
        )

