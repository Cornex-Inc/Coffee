from django.shortcuts import render 
from django.http import JsonResponse
import datetime
from django.contrib.auth.decorators import login_required

from .models import *
from .forms import *
from Doctor.models import *
from Receptionist.models import *


# Create your views here.
@login_required
def index(request):

    waiting_search_form = TestManageForm()

    return render(request,
    'Laboratory/index.html',
            {
                'waiting_search':waiting_search_form,
            },
        )


def get_test_manage(request):
    test_manage_id = request.POST.get('test_manage_id')

    test_manage = TestManage.objects.get(pk = test_manage_id)
    patient = Patient.objects.get(pk = test_manage.manager.diagnosis.reception.patient.id)

    today = datetime.date.today()

    datas= {}
    datas.update({
        'test_result':test_manage.result,
        'test_reservation':test_manage.date_reservation,
        'test_examination':test_manage.date_examination,
        'test_expected':test_manage.date_expected,
        'test_name':test_manage.manager.test.name,
        'test_ordered':test_manage.date_ordered.strftime('%Y-%m-%d %H:%M:%S'),
        'patient_chart':patient.get_chart_no(),
        'patient_name':patient.name_kor,
        'patient_age':today.year - patient.date_of_birth.year - ((today.month, today.day) < (patient.date_of_birth.month, patient.date_of_birth.day)),
        'patient_gender':patient.gender,
        })


    context = {'datas':datas}
    return JsonResponse(context)

def waiting_selected(request):
    test_manage_id = request.POST.get('test_manage_id')
    
    
    test_manage = TestManage.objects.get(pk = test_manage_id)
    
    context = {
            'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
            'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
            'Date_of_birth':test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                            '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                            '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',};
    

    if 'L' in test_manage.manager.test.code:
        context.update({
            'Lab':test_manage.name_service,
            'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d %H:%M') ,
            'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d %H:%M:%S') ,
            'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
            'result':test_manage.result,
            'unit': '' if test_manage.manager.test.unit is None else '(' + test_manage.manager.test.unit + ')',
            'Depart':test_manage.manager.diagnosis.reception.depart.name + ' ( ' + test_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
        })
    return JsonResponse(context)

def waiting_list(request):
    date_start = request.POST.get('start_date')
    filter = request.POST.get('filter')
    input = request.POST.get('input').lower() 
    #date_end = request.POST.get('end_date')

   
    kwargs={}

    
    #if progress != 'all':
    #    kwargs['progress'] = request.POST.get('progress')
     
    
    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.max)

    test_manages = TestManage.objects.filter(date_ordered__range = (date_min, date_max),**kwargs).select_related('manager__diagnosis__reception').exclude(manager__diagnosis__reception__progress='deleted').order_by('-date_ordered')

    datas=[]
    today = datetime.date.today()

   

    for test_manage in test_manages:
        data={}
        is_interval = False
        try:
            reference_query = TestReferenceInterval.objects.get(test_id = test_manage.manager.test_id)
            reference = reference_query.get_range()

            if test_manage.result is not None and test_manage.result is not '':
                is_interval = reference_query.check_interval(test_manage.result)

        except TestReferenceInterval.DoesNotExist:
            reference = ''


        if input=='':
            data.update({
                'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
                'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
                'Depart':test_manage.manager.diagnosis.reception.depart.name + ' ( ' + test_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                'Date_of_Birth': test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                'name_service':test_manage.name_service,
                'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d'),
                'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d') ,
                'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
                'result':'' if test_manage.result is None or '' else test_manage.result,
                'progress':test_manage.progress,
                'test_manage_id':test_manage.id,
                'reference_interval':reference + ' / ' + ('' if test_manage.manager.test.unit is None or '' else '(' + test_manage.manager.test.unit + ')'),
                'is_interval':is_interval,
                })
            datas.append(data)
        elif filter == 'name':
            if input in test_manage.manager.diagnosis.reception.patient.name_kor.lower()  or input in test_manage.manager.diagnosis.reception.patient.name_eng.lower() :
                data.update({
                    'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
                    'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
                    'Depart':test_manage.manager.diagnosis.reception.depart.name + ' ( ' + test_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                    'Date_of_Birth': test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                    '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                    'name_service':test_manage.name_service,
                    'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d'),
                    'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d') ,
                    'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
                    'result':'' if test_manage.result is None or '' else test_manage.result,
                    'progress':test_manage.progress,
                    'test_manage_id':test_manage.id,
                    'reference_interval':reference + ' / ' + ('' if test_manage.manager.test.unit is None or '' else '(' + test_manage.manager.test.unit + ')'),
                    'is_interval':is_interval,
                    })
                datas.append(data)
        elif filter == 'depart':
            if input in test_manage.manager.diagnosis.reception.doctor.name_kor.lower()  or input in test_manage.manager.diagnosis.reception.doctor.name_eng.lower()  or input in test_manage.manager.diagnosis.reception.doctor.depart.name.lower() :
                
                data.update({
                    'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
                    'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
                    'Depart':test_manage.manager.diagnosis.reception.depart.name + ' ( ' + test_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                    'Date_of_Birth': test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                    '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                    'name_service':test_manage.name_service,
                    'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d'),
                    'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d') ,
                    'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
                    'result':'' if test_manage.result is None or '' else test_manage.result,
                    'progress':test_manage.progress,
                    'test_manage_id':test_manage.id,
                    'reference_interval':reference + ' / ' + ('' if test_manage.manager.test.unit is None or '' else '(' + test_manage.manager.test.unit + ')'),
                    'is_interval':is_interval,
                    })
                datas.append(data)
        elif filter == 'chart':
            if input in test_manage.manager.diagnosis.reception.patient.get_chart_no():
                data.update({
                    'chart':test_manage.manager.diagnosis.reception.patient.get_chart_no(),
                    'Name':test_manage.manager.diagnosis.reception.patient.name_kor + ' ' + test_manage.manager.diagnosis.reception.patient.name_eng,
                    'Depart':test_manage.manager.diagnosis.reception.depart.name + ' ( ' + test_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                    'Date_of_Birth': test_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                    '(' + test_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(test_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                    'name_service':test_manage.name_service,
                    'date_ordered':'' if test_manage.date_ordered is None else test_manage.date_ordered.strftime('%Y-%m-%d'),
                    'date_examination':'' if test_manage.date_examination is None else test_manage.date_examination.strftime('%Y-%m-%d') ,
                    'date_expected':'' if test_manage.date_expected is None else test_manage.date_expected.strftime('%Y-%m-%d') ,
                    'result':'' if test_manage.result is None or '' else test_manage.result,
                    'progress':test_manage.progress,
                    'test_manage_id':test_manage.id,
                    'reference_interval':reference + ' / ' + ('' if test_manage.manager.test.unit is None or '' else '(' + test_manage.manager.test.unit + ')'),
                    'is_interval':is_interval,
                    })
                datas.append(data)

            

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



@login_required
def checklist(request):
    

     return render(request,
    'Laboratory/checklist.html',
            {
                
            },
        )