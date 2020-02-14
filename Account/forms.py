from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import User
from Doctor.models import Depart

from django.utils.translation import gettext as _

class UserCreationForm(forms.ModelForm):
    user_role_choices=(('ADMIN',_('Admin')),
            ('DOCTOR', _('Doctor')),
            ('RECEPTIONIST', _('Receptionist')),
            ('DENTREC',_('Receptionist for Dental')),
            ('PHARMACY', _('Pharmacy')),
            ('LABORATORY',_('Laboratory')),
            ('RADIATION', _('Radiation')),)


    password1 = forms.CharField(
        label=_('Password'), 
        widget=forms.PasswordInput,
        )

    password2 = forms.CharField(
        label=_('Password confirmation'),
        widget=forms.PasswordInput,
        )
    
    user_role = forms.ChoiceField(
        widget=forms.RadioSelect(), 
        choices=user_role_choices,
        required = True,
        )

    class Meta:
        model = User
        fields = ('email',)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user





class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label= ("Password"),
        help_text= ("Raw passwords are not stored, so there is no way to see "
                    "this user's password, but you can change the password "
                    "using <a href=\"../password/\">this form</a>."))

    class Meta:
        model = User
        fields = ('email', 'password',
                  'is_active','user_role')

    def clean_password(self):
        return self.initial["password"]




class UserRegisterForm(forms.Form):
    user_role_choices=(
        ('DOCTOR', _('DOCTOR')),)
        #('RECEPTIONIST', _('RECEPTIONIST')),
        #('PHARMACY', _('PHARMACY')),
        #('LABORATORY',_('LABORATORY')),
        #('RADIATION', _('RADIATION')),)


    ID = forms.CharField(
        max_length=64,
        required= True,
        widget=forms.TextInput(attrs={
            'id':'register_id',
            'class':'form-control register_id',
            'placeholder':'E-mail',
            })
        )

    Password = forms.CharField(
        max_length=64,
        required= True,
        widget=forms.PasswordInput(attrs={
            'id':'register_pw',
            'class':'form-control register_pw',
            'placeholder':'Password',
            }),
        )





class UserRuleChoiceForm(forms.Form):
    user_role_choices=(
        ('','---------'),
        ('DOCTOR', _('Doctor')),
        ('RECEPTION', _('Reception')),
        ('PHARMACY', _('Pharmacy')),
        ('LABORATORY',_('Laboratory')),
        ('RADIATION', _('Radiology')),)

    filter = forms.ChoiceField(
        required=True,
        choices=user_role_choices,
        widget=forms.Select(attrs={
            'id':'register_class',
            'class':'form-control custom-select register_class',
            'style':'width:19vw;',
            })
        )

class DoctorDepartChoiceForm(forms.Form):

    depart = forms.ModelChoiceField(
        queryset = Depart.objects.all(),
        required=True,
        widget=forms.Select(attrs={
            'id':'register_doctor_depart',
            'class':'form-control custom-select register_doctor_depart',
            'style':'width:19vw;',
            })
        )