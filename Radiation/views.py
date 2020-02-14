from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .forms import *
from Laboratory.forms import *

from .models import *
# Create your views here.
@login_required
def index(request):

    form = RadiationForm()
    search_form=PrecedureManageForm()
    error = False
    if 'save' in request.POST:
        form = RadiationForm(request.POST, request.FILES,)
        selected_radi_manage = request.POST['selected_test_manage']
        if selected_radi_manage is not '':
            selected_img_id = request.POST['id']
            precedure = PrecedureManager.objects.get(pk = selected_radi_manage)
            if selected_img_id is '': #new
                radi_manage = RadiationManage()

                radi_manage.progress = 'done'
                radi_manage.name_service = precedure.precedure.name
                radi_manage.manager = precedure
                
                radi_manage.save()
                
            else:
                radi_manage = RadiationManage.objects.get(pk = selected_img_id)

            if form.is_valid():
                form.instance.id = radi_manage.id
                form.instance.manager_id= radi_manage.manager.id
                form.instance.progress = 'done'
                form.instance.date_ordered = radi_manage.date_ordered
                form.instance.name_service = radi_manage.name_service
                form.save()
                return redirect('/radiation/')
        else:
            error = 'select patient.'

    request.POST = request.POST.copy()
    if 'selected_test_manage' in request.POST:
        request.POST['selected_test_manage']=''
    if 'id' in request.POST:
        request.POST['id']=''
    if 'save' in request.POST:
        request.POST['save']=''
    request.FILES['image'] = None
    return render(request,
        'Radiation/index.html',
            {
                'form':form,
                'search':search_form,
                'error':error,
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

    #radi_manages = RadiationManage.objects.filter(date_ordered__range = (date_min, date_max),**kwargs)#.values('manager_id').distinct()
    #radi_manages = RadiationManage.objects.raw('select * from Radiation_radiationmanage where substr(DATE(date_ordered),1,10) == substr(date("now"),1,10)  group by manager_id')
    
    datas = []
    precedures = Precedure.objects.filter(code__icontains='R')
    diagnosiss = Diagnosis.objects.filter(recorded_date__range = (date_min, date_max))
    for diagnosis in diagnosiss:
        manager_datas = PrecedureManager.objects.filter(precedure__in=precedures,diagnosis = diagnosis)
        for manager_data in manager_datas:
            if input=='':
                data= {
                    'chart':diagnosis.reception.patient.get_chart_no(),
                    'name_kor':diagnosis.reception.patient.name_kor,
                    'name_eng':diagnosis.reception.patient.name_eng,
                    'Depart':diagnosis.reception.depart.name,
                    'Doctor':diagnosis.reception.doctor.name_kor,
                    'Date_of_Birth': diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d'),
                    'Gender/Age':'(' + diagnosis.reception.patient.get_gender_simple() +
                                    '/' + str(diagnosis.reception.patient.get_age()) + ')',
                    'name_service':manager_data.precedure.name if manager_data.precedure.name else manager_data.precedure.name_vie,
                    'date_ordered':'' if diagnosis.reception.recorded_date is None else diagnosis.reception.recorded_date.strftime('%Y-%m-%d %H:%M'),
                    'precedure_manage_id':manager_data.id,#radi_manage_id
                    }
            elif filter == 'name':
                if input in reception.patient.name_kor.lower()  or input in reception.patient.name_eng.lower() :
                    data= {
                        'chart':diagnosis.reception.patient.get_chart_no(),
                        'name_kor':diagnosis.reception.patient.name_kor,
                        'name_eng':diagnosis.reception.patient.name_eng,
                        'Depart':diagnosis.reception.depart.name,
                        'Doctor':diagnosis.reception.doctor.name_kor,
                        'Date_of_Birth': diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d'),
                        'Gender/Age':'(' + diagnosis.reception.patient.get_gender_simple() +
                                        '/' + str(diagnosis.reception.patient.get_age()) + ')',
                        'name_service':manager_data.precedure.name if manager_data.precedure.name else manager_data.precedure.name_vie,
                        'date_ordered':'' if diagnosis.reception.recorded_date is None else diagnosis.reception.recorded_date.strftime('%Y-%m-%d %H:%M'),
                        'precedure_manage_id':manager_data.id,#radi_manage_id
                        }
            elif filter == 'depart':
                if input in reception.doctor.name_kor.lower()  or input in reception.doctor.name_eng.lower()  or input in reception.doctor.depart.name.lower() : 
                    data= {
                        'chart':diagnosis.reception.patient.get_chart_no(),
                        'name_kor':diagnosis.reception.patient.name_kor,
                        'name_eng':diagnosis.reception.patient.name_eng,
                        'Depart':diagnosis.reception.depart.name,
                        'Doctor':diagnosis.reception.doctor.name_kor,
                        'Date_of_Birth': diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d'),
                        'Gender/Age':'(' + diagnosis.reception.patient.get_gender_simple() +
                                        '/' + str(diagnosis.reception.patient.get_age()) + ')',
                        'name_service':manager_data.precedure.name if manager_data.precedure.name else manager_data.precedure.name_vie,
                        'date_ordered':'' if diagnosis.reception.recorded_date is None else diagnosis.reception.recorded_date.strftime('%Y-%m-%d %H:%M'),
                        'precedure_manage_id':manager_data.id,#radi_manage_id
                        }
            elif filter == 'chart':
                if input in reception.patient.get_chart_no():
                    data= {
                        'chart':diagnosis.reception.patient.get_chart_no(),
                        'name_kor':diagnosis.reception.patient.name_kor,
                        'name_eng':diagnosis.reception.patient.name_eng,
                        'Depart':diagnosis.reception.depart.name,
                        'Doctor':diagnosis.reception.doctor.name_kor,
                        'Date_of_Birth': diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d'),
                        'Gender/Age':'(' + diagnosis.reception.patient.get_gender_simple() +
                                        '/' + str(diagnosis.reception.patient.get_age()) + ')',
                        'name_service':manager_data.precedure.name if manager_data.precedure.name else manager_data.precedure.name_vie,
                        'date_ordered':'' if diagnosis.reception.recorded_date is None else diagnosis.reception.recorded_date.strftime('%Y-%m-%d %H:%M'),
                        'precedure_manage_id':manager_data.id,#radi_manage_id
                        }
                    datas.append(data)
            check_done = RadiationManage.objects.filter(manager_id = manager_data.id).count()
            if check_done == 0:
                data.update({ 'progress':'new', })
            else:
                data.update({ 'progress':'done', })
            datas.append(data)
    
    context = {'datas':datas}
    return JsonResponse(context)


def waiting_selected(request):
    radi_manage_id = request.POST.get('radi_manage_id')
    precedure = PrecedureManager.objects.get(pk = radi_manage_id)
    radi_images = RadiationManage.objects.filter(manager_id = radi_manage_id)
    
    datas = {}
    for radi_image in radi_images:
        date = radi_image.date_ordered.strftime('%Y-%m-%d')
        if date not in datas:
            datas[date] = []
        data = {
            'path':radi_image.image.url if radi_image.image else '',
            'id':radi_image.id,
            'service':radi_image.name_service,
            'remark':radi_image.remark,
            }

        datas[date].append(data)

    context = {
        'datas':datas,
        'chart':precedure.diagnosis.reception.patient.get_chart_no(),
        'Name':precedure.diagnosis.reception.patient.name_kor + ' ' + precedure.diagnosis.reception.patient.name_eng,
        'Date_of_birth':precedure.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') +
                    '(' + precedure.diagnosis.reception.patient.get_gender_simple() +
                    '/' + str(precedure.diagnosis.reception.patient.get_age()) + ')',};

    context.update({
        'Lab':precedure.precedure.name if precedure.precedure.name else precedure.precedure.name_vie,
        'date_ordered':'' if precedure.diagnosis.reception.recorded_date is None else precedure.diagnosis.reception.recorded_date.strftime('%Y-%m-%d %H:%M') ,
        'Depart':precedure.diagnosis.reception.depart.name + ' ( ' + precedure.diagnosis.reception.doctor.name_kor + ' )',
    })
    return JsonResponse(context)

def delete_image(request):
    image_id = request.POST.get('image_id')
    RadiationManage.objects.get(pk = image_id).delete()

    res = 'success'

    return JsonResponse({'result':res})