from django.shortcuts import render 
from django.http import JsonResponse
import datetime
from django.contrib.auth.decorators import login_required
from django.utils import timezone, translation

import functools
import operator
from django.db.models import Q,Case,When, CharField,Count,Sum

from .models import *
from .forms import *
from Doctor.models import *
from Receptionist.models import *


# Create your views here.
@login_required
def index(request):

    waiting_search_form = TestManageForm()
    depart = Depart.objects.all()


    return render(request,
    'Laboratory/index.html',
            {
                'waiting_search':waiting_search_form,
                'depart':depart,
            },
        )


def get_test_manage(request):
    test_manage_id = request.POST.get('test_manage_id')
    
    test_manage = TestManage.objects.get(pk = test_manage_id)
    


    context = {
            'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
            'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
            'Date_of_birth':test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                            '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                            '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',

            'Lab':test_manage.name_service,
            'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d %H:%M') ,
            'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d %H:%M:%S') ,
            'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
            'result':test_manage.result,
            'unit': '' ,#if test_manage.manager.test.unit is None else '(' + test_manage.manager.test.unit + ')',
        }

    return JsonResponse(context)

def waiting_selected(request):
    test_manage_id = request.POST.get('test_manage_id')
    
    
    test_manage = TestManage.objects.get(pk = test_manage_id)
    
    context = {
            'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
            'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
            'Date_of_birth':test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                            '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                            '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',

            'Lab':test_manage.name_service,
            'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d %H:%M') ,
            'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d %H:%M:%S') ,
            'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
            'result':test_manage.result,
            'unit': '' ,#if test_manage.manager.test.unit is None else '(' + test_manage.manager.test.unit + ')',
        }
    return JsonResponse(context)



def waiting_list(request):
    date_start = request.POST.get('start_date')
    date_end = request.POST.get('end_date')
    filter = request.POST.get('filter')
    input = request.POST.get('input').lower() 
    depart_id = request.POST.get('depart_id')

   
    kwargs={}
    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)
    
    argument_list = [] 
    kwargs={}
    if depart_id != '' :
        kwargs['depart_id'] = depart_id

    if hasattr(request.user,'doctor'):
        kwargs['depart_id'] = request.user.doctor.depart.id

    if input !='':
        argument_list.append( Q(**{'patient__name_kor__icontains':input} ) )
        argument_list.append( Q(**{'patient__name_eng__icontains':input} ) )
        argument_list.append( Q(**{'patient__id__icontains':input} ) ) 


        test_patient_list = Reception.objects.select_related('diagnosis').filter(
                            functools.reduce(operator.or_, argument_list), 
                            **kwargs,
                            recorded_date__range= (date_min,date_max),
                        ).exclude(
                            progress='deleted',
                        ).order_by('-recorded_date')

    else:
        test_patient_list =  Reception.objects.select_related('diagnosis').filter(
                            **kwargs,
                            recorded_date__range= (date_min,date_max),
                        ).exclude(
                            progress='deleted',
                        ).order_by('-recorded_date')

    datas=[] 
    for test_patient in test_patient_list:
        if hasattr(test_patient,'diagnosis') is False:
            continue
        
        if test_patient.diagnosis.testmanager_set.count() !=0:
            datas.append({
                'id':test_patient.diagnosis.id,
                'chart':test_patient.diagnosis.reception.patient.get_chart_no(),
                'Name':test_patient.diagnosis.reception.patient.name_kor + ' ' + test_patient.diagnosis.reception.patient.name_eng,
                'Depart':test_patient.diagnosis.reception.depart.name + ' ( ' + test_patient.diagnosis.reception.doctor.name_kor + ' )',
                'Date_of_Birth': test_patient.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                '(' + test_patient.diagnosis.reception.patient.get_gender_simple() +
                                '/' + str(test_patient.diagnosis.reception.patient.get_age()) + ')',
                })


    context = {'datas':datas}
    return JsonResponse(context)


def save(request):
    status = request.POST.get('status')
    test_manage_id = request.POST.get('test_manage_id')
    test_examination = request.POST.get('test_examination')
    test_expected = request.POST.get('test_expected')
    test_result = request.POST.get('test_result')



    testmanage = TestManage.objects.get(pk = test_manage_id)
    testmanage.progress = status


    if test_examination:
        testmanage.date_examination = datetime.datetime.strptime(test_examination,('%Y-%m-%d %H:%M:%S'))
    else:
        testmanage.date_examination = None

    if test_expected:
        testmanage.date_expected = datetime.datetime.strptime(test_expected,('%Y-%m-%d'))
    else:
        testmanage.date_expected = None

    testmanage.result = test_result
    testmanage.save()

    context = {'result':True}
    return JsonResponse(context)


def get_test_list(request):

    diagnosis_id = request.POST.get('diagnosis_id')


    test_query = TestManager.objects.select_related('testmanage').select_related('diagnosis').filter(diagnosis_id = diagnosis_id)
    datas=[]
    for test in test_query:
        intervals = TestReferenceInterval.objects.filter(use_yn='Y',test_id = test.test.id).values('minimum','maximum','unit','unit_vie','name','name_vie')
        list_interval = []
        for interval in intervals:
            list_interval.append({
                'minimum':interval['minimum'],
                'maximum':interval['maximum'],
                'unit':interval['unit_vie'] if request.session[translation.LANGUAGE_SESSION_KEY] == 'vi' else interval['unit'],
                'name':interval['name_vie'] if request.session[translation.LANGUAGE_SESSION_KEY] == 'vi' else interval['name'],
                })


        datas.append({
            'id':test.testmanage.id,
                'name_service':test.testmanage.name_service,
                'date_ordered':'' if test.testmanage.date_ordered is None else test.testmanage.date_ordered.strftime('%Y-%m-%d'),
                'date_examination':'' if test.testmanage.date_examination is None else test.testmanage.date_examination.strftime('%Y-%m-%d') ,
                'date_expected':'' if test.testmanage.date_expected is None else test.testmanage.date_expected.strftime('%Y-%m-%d') ,
                'result':'' if test.testmanage.result is None or '' else test.testmanage.result,
                'progress':test.testmanage.progress,
                'test_manage_id':test.testmanage.id,   
                'list_interval':list_interval,
            })

      
    return JsonResponse({'datas':datas})


@login_required
def checklist(request):
    

     return render(request,
    'Laboratory/checklist.html',
            {
                
            },
        )