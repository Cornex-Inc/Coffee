"""
Definition of views.
"""
from app.forms import BootstrapAuthenticationForm
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.http import JsonResponse


from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from django.utils import translation
from django.utils import timezone

from django.contrib.auth.views import LoginView


from Account.models import *
from Account.forms import *
#@login_required
def home(request):


    """Renders the home page."""
    if not translation.LANGUAGE_SESSION_KEY in request.session:
        translation.activate('en')
        request.session[translation.LANGUAGE_SESSION_KEY] = 'en'


    if request.user.is_anonymous:
        return redirect('login')

    if request.user.is_doctor():
        return redirect('/doctor')
    elif request.user.is_receptionist():
        return redirect('/receptionist')
    elif request.user.is_pharmacy():
        return redirect('/pharmacy')
    elif request.user.is_laboratory():
        return redirect('/laboratory')
    elif request.user.is_admin:
        return redirect('/manage')
    elif request.user.is_radiation:
        return redirect('/radiation')
        

def login(request):
    authentication_form=BootstrapAuthenticationForm()
    err_msg = ''
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = auth.authenticate(request,username = username, password = password)
        if user is not None:
            auth.login(request,user)
            return redirect('/')
        else:
            err_msg = _('Please enter a correct user name and password.')


    return render(request,
        'app/login.html',
            {
                'title':_('Log in'),
                'form':authentication_form,
                'year':datetime.now().year,
                'register_user':UserRegisterForm(),
                'register_role':UserRuleChoiceForm(),
                'register_doctor':DoctorDepartChoiceForm(),
                'error':None if err_msg is '' else err_msg,
            }
        )



def TranslateEN(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('en')

    request.session[translation.LANGUAGE_SESSION_KEY] = 'en'
    return JsonResponse({'return':'success'})

def TranslateVIE(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('vi')
    
    request.session[translation.LANGUAGE_SESSION_KEY] = 'vi'
    return JsonResponse({'return':'success'})

def TranslateKO(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('ko')

    request.session[translation.LANGUAGE_SESSION_KEY] = 'ko'
    return JsonResponse({'return':'success'})

def register(request):
    id = request.POST.get('id')
    password = request.POST.get('password')
    name_kor = request.POST.get('name_kor')
    name_eng = request.POST.get('name_eng')
    name_short = request.POST.get('name_short')
    depart = request.POST.get('depart')


    form = UserCreationForm(initial={
        'email': id,
        'password': password,
        })

    form
    #try:
    #    account = User.objects.get(id = id)




    return JsonResponse({'return':'success'})