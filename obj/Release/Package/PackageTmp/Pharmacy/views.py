from django.shortcuts import render 
from django.http import JsonResponse
import datetime
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage

from .models import *
from .forms import *
from Doctor.models import *
from Receptionist.models import *
# Create your views here.
def index(request):

    waiting_search_form = WaitingSearchForm()
    medicine_search_form = MedicineSearchForm()
    medicine_control_form = MedicineControl()

    return render(request,
    'Pharmacy/index.html',
            {
                'waiting_search':waiting_search_form,
                'medicinesearch':medicine_search_form,
                'medicine_control':medicine_control_form,
            },
        )

def waiting_selected(request):
    diagnosis_id = request.POST.get('diagnosis_id')

    diagnosis = Diagnosis.objects.get(pk = diagnosis_id)
    medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis_id)

    medicines = []
    for data in medicine_set:
        medicine = {}
        medicine.update({
            'code':data.medicine.id,
            'name':data.medicine.name,
            'depart':diagnosis.reception.depart.name,
            'doctor':diagnosis.reception.doctor.name_kor,
            'volume':data.volume,
            'amount':data.amount,
            'days':data.days,
            'total':data.volume * data.amount * data.days,
            'memo':data.memo,
            })
        medicines.append(medicine)

    context = {'datas':medicines,
               'status':diagnosis.medicinemanage.progress,}
    return JsonResponse(context)

def waiting_list(request):
    date_start = request.POST.get('start_date')
    #date_end = request.POST.get('end_date')

    kwargs={}

    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.max)

    medicine_manages = MedicineManage.objects.filter(date_ordered__range = (date_min, date_max),**kwargs)

    datas=[]
    today = datetime.date.today()

    for medicine_manage in medicine_manages:
        data={}
        data.update({
            'diagnosis_id':medicine_manage.diagnosis.id,
            'chart':"{:06d}".format(medicine_manage.diagnosis.reception.patient.id),
            'Name':medicine_manage.diagnosis.reception.patient.name_kor + ' / ' + 
                medicine_manage.diagnosis.reception.patient.name_eng,
            'Date_of_Birth':medicine_manage.diagnosis.reception.patient.date_of_birth.strftime('%Y-%m-%d') + ' ( ' + 
                str(medicine_manage.diagnosis.reception.patient.get_age()) + ' / ' + 
                medicine_manage.diagnosis.reception.patient.get_gender_simple() + ')',
            'Depart':medicine_manage.diagnosis.reception.depart.name + '( ' + medicine_manage.diagnosis.reception.doctor.name_kor +')',
            #'DateTime':medicine_manage.date_ordered.strftime('%Y-%m-%d %H:%M:%S'),
            'status':medicine_manage.progress,
            })
        datas.append(data)

    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)


def save(request):
    diagnosis_id = request.POST.get('diagnosis_id')
    status = request.POST.get('status')

    medicinmanage = MedicineManage.objects.get(diagnosis_id = diagnosis_id)

    if status == 'done':
        medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis_id)

        for data in medicine_set:
            medicine = Medicine.objects.get(pk = data.medicine_id)
            medicine.inventory_count -= data.amount * data.days
            medicine.save()


    
    medicinmanage.progress = status
    medicinmanage.save()

    context = {'result':True}
    return JsonResponse(context)


def medicine_search(request):

    string = request.POST.get('string');
    filter = request.POST.get('filter');
    
    kwargs = {
        '{0}__{1}'.format(filter, 'icontains'): string,
        }

    if string == '' :
        medicines = Medicine.objects.all()
    else:
        medicines = Medicine.objects.filter(**kwargs).order_by("-id")

    datas=[]
    for medicine in medicines:
        data = {
                'id' : medicine.id,
                'name' : medicine.name,
                'company' : '' if medicine.company is None else medicine.company,
                'country' : '' if medicine.country is None else medicine.country,
                'ingredient' : '' if medicine.ingredient is None else medicine.ingredient,
                'unit' : '' if medicine.unit is None else medicine.unit,
                'price' : medicine.price,
                'count' : medicine.inventory_count,
            }
        datas.append(data)


    page = request.POST.get('page',1)
    context_in_page = request.POST.get('context_in_page');
    paginator = Paginator(datas, context_in_page)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)


    

    context = {
        #'datas':datas,
        'datas':list(paging_data),
        'page_range_start':paging_data.paginator.page_range.start,
        'page_range_stop':paging_data.paginator.page_range.stop,
        'page_number':paging_data.number,
        'has_previous':paging_data.has_previous(),
        'has_next':paging_data.has_next(),
        
        }
    return JsonResponse(context)


def set_data_control(request):
    medicine_id = request.POST.get('medicine_id');


    medicine = Medicine.objects.get(pk = medicine_id)

    context = {
        'name':medicine.name,
        'price':medicine.price,
        'company':medicine.company,
        'ingredient':medicine.ingredient,
        'unit':medicine.unit,
        }
    return JsonResponse(context)


def save_data_control(request):
    selected_option = request.POST.get('selected_option');
    name = request.POST.get('name');
    price = request.POST.get('price');
    company = request.POST.get('company');
    ingredient = request.POST.get('ingredient');
    unit = request.POST.get('unit');
    changes = request.POST.get('changes');


    if selected_option == 'new':
        medicine = Medicine()
    else:
        medicine = Medicine.objects.get(pk = selected_option )
    medicine.name = name
    medicine.price = price
    medicine.company = company
    medicine.ingredient = ingredient
    medicine.unit = unit

    medicine.inventory_count += int(changes)

    medicine.save()


    context = {'result':True}
    return JsonResponse(context)