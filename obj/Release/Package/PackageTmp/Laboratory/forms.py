from django import forms
import datetime


from django.utils.translation import gettext as _

class TestManageForm(forms.Form):
    SEARCH_SEL = (
        ('name','Name'),
        ('chart','Chart'),
        ('depart','Depart'),
        )

    filter = forms.ChoiceField(
        widget=forms.Select(attrs={
            'id': 'laboratory_search_select',
            'class':'form-control costom-select laboratory_search_select',
            'placeholder':'',
            'aria-describedby':"basic-addon1",
        }),
        choices=SEARCH_SEL,
        label=_('Filter'),
        )

    search_input = forms.CharField(
        label=_('Input'),
        widget=forms.TextInput(attrs={
            'id': 'laboratory_search_input',
            'class':'form-control laboratory_search_input',
            'placeholder':'',
            'aria-describedby':"basic-addon1"
        }),
        )