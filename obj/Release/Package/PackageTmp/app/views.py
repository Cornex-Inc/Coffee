"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.http import JsonResponse


import django.contrib.auth
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
        

    
    #return render(request,
    #    'app/login.html',
    #        {
    #            'title':'Home Page',
    #            'year':datetime.now().year,
    #        }
    #    )



def TranslateEN(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('en')

    request.session[translation.LANGUAGE_SESSION_KEY] = 'en'
    return JsonResponse({'return':'success'})

def TranslateVIE(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('vie')

    request.session[translation.LANGUAGE_SESSION_KEY] = 'vie'
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