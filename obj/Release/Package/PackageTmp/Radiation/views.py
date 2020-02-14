from django.shortcuts import render
from django.http import JsonResponse


from .forms import *
from Laboratory.forms import *

from .models import *
# Create your views here.

def index(request):

    form = RadiationForm(request.POST, request.FILES,)
    search_form=PrecedureManageForm()

    if 'save' in request.POST:
        if form.is_valid():
            img_id = form['image'].data
            selected_radi_manage = request.POST['selected_test_manage']

            radi_manage = RadiationManage.objects.get(pk = selected_radi_manage)

            form.instance.id = selected_radi_manage
            form.instance.manager_id= radi_manage.manager.id
            form.instance.progress = 'done'
            form.instance.date_ordered = radi_manage.date_ordered
            form.instance.name_service = radi_manage.name_service
            form.save()



    return render(request,
        'Radiation/index.html',
            {
                'form':form,
                'search':search_form,
            },
        )


def get_image(request):
    manage_id = request.POST.get('manage_id')
    manage = RadiationManage.objects.get(pk = manage_id)
    datas={
        'id':manage.id,
        }
    if manage.image:
        datas.update({
            'id':manage.id,
            'path':manage.image.url,
            'remark':manage.remark,
            })

    return JsonResponse(datas)


def zoom_in(request,img_id):
    
    try:
        img = RadiationManage.objects.get(pk = img_id)
    except RadiationManage.DoesNotExist:
        return

    return render(request,
    'Radiation/zoomin.html',
            {
                'img_url':img.image.url,
            },
        )



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

    radi_manages = RadiationManage.objects.filter(date_ordered__range = (date_min, date_max),**kwargs)

    datas=[]
    today = datetime.date.today()

    for radi_manage in radi_manages:
        data={}

        if input=='':
            data.update({
                'chart':"{:06d}".format(radi_manage.manager.diagnosis.reception.patient.id),
                'name_kor':radi_manage.manager.diagnosis.reception.patient.name_kor,
                'name_eng':radi_manage.manager.diagnosis.reception.patient.name_eng,
                'Depart':radi_manage.manager.diagnosis.reception.depart.name,
                'Doctor':radi_manage.manager.diagnosis.reception.doctor.name_kor,
                'Date_of_Birth': radi_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d'),
                'Gender/Age':'(' + radi_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                '/' + str(radi_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                'name_service':radi_manage.name_service,
                'date_ordered':'' if radi_manage.date_ordered is None else radi_manage.date_ordered.strftime('%Y-%m-%d %H:%M'),
                'remark':radi_manage.remark,
                'progress':radi_manage.progress,
                'radi_manage_id':radi_manage.id,
                })
            datas.append(data)
        elif filter == 'name':
            if input in radi_manage.manager.diagnosis.reception.patient.name_kor.lower()  or input in radi_manage.manager.diagnosis.reception.patient.name_eng.lower() :
                data.update({
                    'chart':"{:06d}".format(radi_manage.manager.diagnosis.reception.patient.id),
                    'Name':radi_manage.manager.diagnosis.reception.patient.name_kor + ' ' + radi_manage.manager.diagnosis.reception.patient.name_eng,
                    'Depart':radi_manage.manager.diagnosis.reception.depart.name + ' ( ' + radi_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                    'Date_of_Birth': radi_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                    '(' + radi_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(radi_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                    'name_service':radi_manage.name_service,
                    'date_ordered':'' if radi_manage.date_ordered is None else radi_manage.date_ordered.strftime('%Y-%m-%d %H:%M'),
                    'remark':radi_manage.remark,
                    'progress':radi_manage.progress,
                    'radi_manage_id':radi_manage.id,
                    })
                datas.append(data)
        elif filter == 'depart':
            if input in radi_manage.manager.diagnosis.reception.doctor.name_kor.lower()  or input in radi_manage.manager.diagnosis.reception.doctor.name_eng.lower()  or input in radi_manage.manager.diagnosis.reception.doctor.depart.name.lower() :
                
                data.update({
                    'chart':"{:06d}".format(radi_manage.manager.diagnosis.reception.patient.id),
                    'Name':radi_manage.manager.diagnosis.reception.patient.name_kor + ' ' + radi_manage.manager.diagnosis.reception.patient.name_eng,
                    'Depart':radi_manage.manager.diagnosis.reception.depart.name + ' ( ' + radi_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                    'Date_of_Birth': radi_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                    '(' + radi_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(radi_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                    'name_service':radi_manage.name_service,
                    'date_ordered':'' if radi_manage.date_ordered is None else radi_manage.date_ordered.strftime('%Y-%m-%d %H:%M'),
                    'remark':radi_manage.remark,
                    'progress':radi_manage.progress,
                    'radi_manage_id':radi_manage.id,
                    })
                datas.append(data)
        elif filter == 'chart':
            if input in "{:06d}".format(radi_manage.manager.diagnosis.reception.patient.id):
                data.update({
                    'chart':"{:06d}".format(radi_manage.manager.diagnosis.reception.patient.id),
                    'Name':radi_manage.manager.diagnosis.reception.patient.name_kor + ' ' + radi_manage.manager.diagnosis.reception.patient.name_eng,
                    'Depart':radi_manage.manager.diagnosis.reception.depart.name + ' ( ' + radi_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
                    'Date_of_Birth': radi_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                                    '(' + radi_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(radi_manage.manager.diagnosis.reception.patient.get_age()) + ')',
                    'name_service':radi_manage.name_service,
                    'date_ordered':'' if radi_manage.date_ordered is None else radi_manage.date_ordered.strftime('%Y-%m-%d %H:%M'),
                    'remark':radi_manage.remark,
                    'progress':radi_manage.progress,
                    'radi_manage_id':radi_manage.id,
                    })
                datas.append(data)

            

    context = {'datas':datas}
    return JsonResponse(context)


def waiting_selected(request):
    radi_manage_id = request.POST.get('radi_manage_id')
    
    
    radi_manage = RadiationManage.objects.get(pk = radi_manage_id)
    
    context = {
        'chart':"{:06d}".format(radi_manage.manager.diagnosis.reception.patient.id),
        'Name':radi_manage.manager.diagnosis.reception.patient.name_kor + ' ' + radi_manage.manager.diagnosis.reception.patient.name_eng,
        'Date_of_birth':radi_manage.manager.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                    '(' + radi_manage.manager.diagnosis.reception.patient.get_gender_simple() +
                    '/' + str(radi_manage.manager.diagnosis.reception.patient.get_age()) + ')',};

    context.update({
        'Lab':radi_manage.name_service,
        'date_ordered':'' if radi_manage.date_ordered is None else radi_manage.date_ordered.strftime('%Y-%m-%d %H:%M') ,
        'remark':radi_manage.remark,
        'Depart':radi_manage.manager.diagnosis.reception.depart.name + ' ( ' + radi_manage.manager.diagnosis.reception.doctor.name_kor + ' )',
    })
    return JsonResponse(context)