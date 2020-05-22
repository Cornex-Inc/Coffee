"""
Definition of views.
"""
from app.forms import *
import datetime
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.http import JsonResponse

from django.conf import settings
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.utils.translation import gettext as _
from django.utils import translation
from django.utils import timezone



from django.db.models import Q, Count, F, Min,Sum
from Account.models import *
from Account.forms import *
from Receptionist.models import *
from .models import *

#@login_required
def home(request):

    """Renders the home page."""
    if not translation.LANGUAGE_SESSION_KEY in request.session:
        translation.activate('en')
        request.session[translation.LANGUAGE_SESSION_KEY] = 'en'

    
    #if request.META['SERVER_PORT'] == '9090':
    #    if request.user.is_anonymous:
    #        return redirect('login')
    #else:
    


    if request.user.is_anonymous:
        return redirect('login')

    request.session['is_KBL'] = False

    if request.META['SERVER_PORT'] == '9090' or request.META['SERVER_PORT'] == '11111':#테스트서버
        if request.user.is_doctor():
            return redirect('/doctor')
        if request.user.is_nurse():
            return redirect('/manage/inventory_medical_tool')
        elif request.user.is_receptionist():
            return redirect('/receptionist')
        elif request.user.is_pharmacy():
            return redirect('/pharmacy')
        elif request.user.is_laboratory():
            return redirect('/laboratory')
        elif request.user.is_radiation():
            return redirect('/radiation')
        elif request.user.is_physical_therapist():
            return redirect('/physical_therapist')
        elif request.user.is_admin:
            return redirect('/manage')
    elif request.META['SERVER_PORT'] == '8888':#경천애인 관리자
        request.session['is_KBL'] = True
        if request.user.is_admin:
            return redirect('/KBL')


def login(request):


    commcode = 0
    authentication_form=BootstrapAuthenticationForm()
    err_msg = ''
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        temp_user = User.objects.get(user_id = username)

        


        #아이메디
        if request.META['SERVER_PORT'] == '9090' or request.META['SERVER_PORT'] == '11111':#테스트서버
            commcode = COMMCODE.objects.filter(commcode_grp = 'DEPART_CLICINC',commcode = temp_user.depart ).count()
        elif request.META['SERVER_PORT'] == '8888':#경천애인
            commcode = COMMCODE.objects.filter(commcode_grp = 'DEPART_KBL',commcode = temp_user.depart ).count()


        if temp_user.depart == 'ADMIN':
            commcode = COMMCODE.objects.filter(commcode_grp = 'DEPART_ADMIN',commcode = temp_user.depart ).count()

    if commcode == 0:
        user = None
    else:
        user = auth.authenticate(request,username = username, password = password)

    if user is not None:
        auth.login(request,user)

        return redirect('/')
    else:
        err_msg = _('Please enter a correct user name and password.')

    if request.META['SERVER_PORT'] == '9090' or request.META['SERVER_PORT'] == '11111':
        url = 'app/login.html'
    elif request.META['SERVER_PORT'] == '8888':
        url = 'app/login_KBL.html'


    return render(request,
        url,
            {
                'title':_('Log in'),
                'form':authentication_form,
                'year':datetime.datetime.now().year,
                'register_user':UserRegisterForm(),
                'register_role':UserRuleChoiceForm(),
                'register_doctor':DoctorDepartChoiceForm(),
                'error':None if err_msg is '' else err_msg,
            }
        )
    



def logout(request):



    if request.META['SERVER_PORT'] == '9090' or request.META['SERVER_PORT'] == '11111':
        res_str = '/'
        if request.user.is_superuser is True:
            res_str = '/admin'
    elif request.META['SERVER_PORT'] == '8888':
        res_str = '/'

    auth.logout(request)


    return redirect(res_str)



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


#관리자 로그인
def admin(request):
    
    authentication_form=BootstrapAuthenticationForm()
    err_msg = ''
    if request.method == 'POST':
        username = request.POST['username']
        if username != 'ADMIN':
            user = None
        else:
            password = request.POST['password']
            user = auth.authenticate(request,username = username, password = password)
        if user is not None:
            depart = request.POST['depart']

            if depart == 'ADMIN':
                auth.login(request,user)
                return redirect('/')

            if depart=='DOCTOR':
                doctor_depart = request.POST['doctor_depart']
                temp_user = User.objects.filter(depart = depart, depart_doctor = doctor_depart ).first()
            else:
                temp_user = User.objects.filter(depart = depart).first()

            temp_user.backend = 'django.contrib.auth.backends.ModelBackend'
            auth.login(request,temp_user)

            return redirect('/')
        else:
            err_msg = _('Please enter a correct user name and password.')






    #부서 - KBL
    list_depart_kbl = []
    if request.session[translation.LANGUAGE_SESSION_KEY] == 'ko':
        query_depart= COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_KBL').annotate(code = F('commcode'),name = F('commcode_name_ko')).values('code','name')
    elif request.session[translation.LANGUAGE_SESSION_KEY] == 'en':
        query_depart= COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_KBL').annotate(code = F('commcode'),name = F('commcode_name_en')).values('code','name')
    elif request.session[translation.LANGUAGE_SESSION_KEY] == 'vi':
        query_depart= COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_KBL').annotate(code = F('commcode'),name = F('commcode_name_vi')).values('code','name')

    for data in query_depart:
        list_depart_kbl.append({
            'id':data['code'],
            'name':data['name']
            })

    #부서 - 병원
    list_depart_clinic = []
    list_depart_doctor = []
    str_doctor = 'Doctor'
    if request.session[translation.LANGUAGE_SESSION_KEY] == 'ko':
        query_depart= COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_CLICINC').annotate(code = F('commcode'),name = F('commcode_name_ko')).values('code','name','id').exclude(commcode = 'DOCTOR')
        query_depart_doctor = COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_CLICINC', commcode='DOCTOR').annotate(code = F('se1'),name = F('commcode_name_ko')).values('code','name','id')
        str_doctor = '의사'
    elif request.session[translation.LANGUAGE_SESSION_KEY] == 'en':
        query_depart= COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_CLICINC').annotate(code = F('commcode'),name = F('commcode_name_en')).values('code','name','id').exclude(commcode = 'DOCTOR')
        query_depart_doctor = COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_CLICINC', commcode='DOCTOR').annotate(code = F('se1'),name = F('commcode_name_en')).values('code','name','id')
        str_doctor = 'Doctor'
    elif request.session[translation.LANGUAGE_SESSION_KEY] == 'vi':
        query_depart= COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_CLICINC').annotate(code = F('commcode'),name = F('commcode_name_vi')).values('code','name','id').exclude(commcode = 'DOCTOR')
        query_depart_doctor = COMMCODE.objects.filter(use_yn = 'Y',commcode_grp='DEPART_CLICINC', commcode='DOCTOR').annotate(code = F('se1'),name = F('commcode_name_vi')).values('code','name','id')
        str_doctor = 'Bác sĩ'

    for data in query_depart:
        list_depart_clinic.append({
            'id':data['code'],
            'name':data['name']
            })

    list_depart_clinic.append({
        'id':'DOCTOR',
        'name':str_doctor
        })

    for data in query_depart_doctor:
        list_depart_doctor.append({
            'id':data['code'],
            'name':data['name'],
            })


    


    return render(request,
        'admin/login_admin.html',
            {
                'title':_('Log in'),
                'form':authentication_form,
                'year':datetime.datetime.now().year,
                'register_user':UserRegisterForm(),
                'register_role':UserRuleChoiceForm(),
                'register_doctor':DoctorDepartChoiceForm(),
                'error':None if err_msg is '' else err_msg,


                'list_depart_kbl':list_depart_kbl,
                'list_depart_clinic':list_depart_clinic,
                'list_depart_doctor':list_depart_doctor,

            }
        )








def TranslateEN(request):
    
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('en')
    

    request.session[translation.LANGUAGE_SESSION_KEY] = 'en'

    response = JsonResponse({'return':'success'})
    #response.set_cookie(settings.LANGUAGE_COOKIE_NAME, 'en')
    return response

def TranslateVIE(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('vi')

    request.session[translation.LANGUAGE_SESSION_KEY] = 'vi'

    response = JsonResponse({'return':'success'})
    #response.set_cookie(settings.LANGUAGE_COOKIE_NAME, 'vi')
    return response

def TranslateKO(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del(request.session[translation.LANGUAGE_SESSION_KEY])
    translation.activate('ko')

    request.session[translation.LANGUAGE_SESSION_KEY] = 'ko'

    response = JsonResponse({'return':'success'})
    #response.set_cookie(settings.LANGUAGE_COOKIE_NAME, 'ko')
    return response







def test(request):

    
    
    return render(request,
        'app/test.html',
            {
            }
        )


def test_send(request):

    phone = request.POST.get('phone',None)
    contents = request.POST.get('contents',None)

    temp_test = sms_test()
    temp_test.phone = phone
    temp_test.contents = contents
    temp_test.status = '2'
    temp_test.save()

    return JsonResponse({
        'res':True,
        'id':temp_test.id,
        })


def test_recv(request):

    context = {}
    msg_id = request.POST.get('msg_id',None)
    if msg_id is not None:
        status = request.POST.get('status',None)
        code = request.POST.get('code',None)
        tranId = request.POST.get('tranId',None)

        temp_test = sms_test.objects.get(id = msg_id)

        if status is "success":
            temp_test.status = 1
        else:
            temp_test.status = 0

        temp_test.res_code = code
        temp_test.date_of_recieved = datetime.datetime.now()
        temp_test.save()


    return JsonResponse({
        'res':True,
        'id':temp_test.id,
        })



def get_res_table(request):

    query = sms_test.objects.all().order_by('-id')
    list_res = []

    for data in query:
        list_res.append({
            'id':data.id,
            'phone':data.phone,
            'contents':data.contents,
            'status':data.status,
            'date_of_registered':data.date_of_registered.strftime('%Y-%m-%d %H:%M:%S'),
            'code':data.res_code,
            'date_of_recieved':'' if data.date_of_recieved is None else data.date_of_recieved.strftime('%Y-%m-%d %H:%M:%S'),
            })



    
    return JsonResponse({
        'res':True,
        'list_res':list_res,
        })



def signpad(request):


        
    return render(request,
        'app/signpad.html',
            {
            }
        )


def search_waiting_sign(request):


    datas = []
    query = Sign_Manage.objects.filter(is_sign='N', use_yn = 'Y')

    for data in query:
        datas.append({
            'id':data.id,
            'chart':data.reception.patient.get_chart_no(),
            'name_kor':data.reception.patient.name_kor,
            'name_eng':data.reception.patient.name_eng,
            'age':data.reception.patient.get_age(),
            'gender':data.reception.patient.get_gender_simple(),
            'date_of_birth':data.reception.patient.date_of_birth.strftime('%Y-%m-%d'),
            })




    return JsonResponse({
        'result':True,
        'datas':datas,
        })


def save_sign(request):


    id = request.POST.get('id')
    sign_data = request.POST.get('sign_data')

    print(id)

    data = Sign_Manage.objects.get(id = id)
    data.is_sign = 'Y'
    data.sign_data = sign_data
    data.date_modify = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data.save()



    return JsonResponse({
        'result':True,
        })
