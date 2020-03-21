from django.shortcuts import render 
from django.http import JsonResponse
import datetime
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict

from .models import *
from .forms import *
from Doctor.models import *
from Receptionist.models import *
from app.models import *
# Create your views here.
from django.utils import timezone, translation
from django.utils.translation import gettext as _
from django.db.models import Q, Count, F


@login_required
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
            'unit':'' if data.medicine.unit is None else data.medicine.unit,
            'amount':data.amount,
            'days':data.days,
            'total':data.amount * data.days,
            'memo':data.memo,
            })
        medicines.append(medicine)

    context = {'datas':medicines,
               'status':diagnosis.medicinemanage.progress,
               'patient_name':diagnosis.reception.patient.get_name_kor_eng(),
               }
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
            'chart':medicine_manage.diagnosis.reception.patient.get_chart_no(),
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
            log = MedicineLog(
                type='dec',
                )
            medicine = Medicine.objects.get(pk = data.medicine_id)
            medicine.inventory_count -= data.amount * data.days
            medicine.save()

            log.diagnosis_id = diagnosis_id
            log.changes = data.amount * data.days
            log.medicine = medicine
            log.save()


    
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
        medicines = Medicine.objects.all().order_by('name')
    else:
        medicines = Medicine.objects.filter(**kwargs).order_by("code")

    datas=[]
    for medicine in medicines:
        data = {
                'id' : medicine.id,
                'code': medicine.code,
                'name' : medicine.name,
                'company' : '' if medicine.company is None else medicine.company,
                'country' : '' if medicine.country is None else medicine.country,
                'ingredient' : '' if medicine.ingredient is None else medicine.ingredient,
                'unit' : '' if medicine.unit is None else medicine.unit,
                'price' : medicine.get_price(),
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
        'company':medicine.company,
        'country':medicine.country,
        'ingredient':medicine.ingredient,
        'unit':medicine.unit,
        'price':medicine.get_price(),
        }
    return JsonResponse(context)


def save_data_control(request):
    selected_option = request.POST.get('selected_option');
    name = request.POST.get('name');
    price = request.POST.get('price');
    company = request.POST.get('company');
    ingredient = request.POST.get('ingredient');
    unit = request.POST.get('unit');
    changes = request.POST.get('changes') if request.POST.get('changes') is not '' else 0;


    if selected_option == 'new':
        medicine = Medicine()
        log = MedicineLog(type='new')
        code = Medicine.objects.all().last()
        code = 'M{:04d}'.format(code.id)
        medicine.price = price
    else:
        medicine = Medicine.objects.get(pk = selected_option )
        if int(changes) < 0:
            log = MedicineLog(type='dec')
        else:
            log = MedicineLog(type='add')

    medicine.name = name
    #medicine.price = price
    medicine.company = company
    medicine.ingredient = ingredient
    medicine.unit = unit

    medicine.inventory_count += int(changes)
    medicine.save()
    log.medicine = medicine
    log.changes = int(changes)
    log.save()
     
    context = {'result':True}
    return JsonResponse(context)

def inventory(request):
    waiting_search_form = WaitingSearchForm()
    medicine_search_form = MedicineSearchForm()
    medicine_control_form = MedicineControl()

    price_multiple_level = COMMCODE.objects.filter(commcode_grp = 'MED_MULTI_CODE').values('commcode','se1','se2').order_by('commcode_grp')


    if request.session[translation.LANGUAGE_SESSION_KEY] == 'vi':
        medicine_class = MedicineClass.objects.all().annotate(name_display = F('name_vie')).values('id','name_display')
    else:
        medicine_class = MedicineClass.objects.all().annotate(name_display = F('name')).values('id','name_display')

    type = ["Medicine","Injection"]
    

    return render(request,
    'Pharmacy/inventory.html',
            {
                'waiting_search':waiting_search_form,
                'medicinesearch':medicine_search_form,
                'medicine_control':medicine_control_form,
                'price_multiple_level':price_multiple_level,
                'medicine_class':medicine_class,
                'type':type,

            },
        )


def medicine_add_edit_get(request):
    id = request.POST.get('id')

    try:
        medicine = Medicine.objects.get(id=id)

        context = {
            'result':True,
            'id':medicine.id,
            'code':medicine.code,
            'name':medicine.name,
            'name_vie':medicine.name_vie,
            'name_display':medicine.name_display,
            'country':medicine.country,
            'country_vie':medicine.country_vie,
            'ingredient':medicine.ingredient,
            'ingredient_vie':medicine.ingredient_vie,
            'unit':medicine.unit,
            'unit_vie':medicine.unit_vie,
            'company':medicine.company,

            'type':'Medicine' if 'M' in medicine.code else 'Injection',

            'price':medicine.get_price(),
            'price_input':medicine.get_price_input(),
            'price_dollar':medicine.get_price_dollar(),
            'multiple_level':medicine.multiple_level,

            'inventory_count':medicine.inventory_count,
            'medicine_class_id':medicine.medicine_class_id,

            }
    except Medicine.DoesNotExist:
        context = {'result':False}




    return JsonResponse(context)


def medicine_add_edit_set(request):
    id = int(request.POST.get('id'))
    code = request.POST.get('code')
    type = request.POST.get('type')
    medicine_class = request.POST.get('medicine_class')
    name = request.POST.get('name')
    name_vie = request.POST.get('name_vie')
    ingredient = request.POST.get('ingredient')
    ingredient_vie = request.POST.get('ingredient_vie')
    unit = request.POST.get('unit')
    unit_vie = request.POST.get('unit_vie')
    country = request.POST.get('country')
    country_vie = request.POST.get('country_vie')
    company = request.POST.get('company')
    name_display = request.POST.get('name_display')
    price_input = request.POST.get('price_input')
    multiple_level = request.POST.get('multiple_level')
    price = request.POST.get('price')   
    price_dollar = request.POST.get('price_dollar')

    if id == 0 :
        data = Medicine()
        if type in 'Medicine':
            last_code =Medicine.objects.filter(code__icontains="M").last()
            print(last_code)
            temp_code = last_code.code.split('M')
            code = 'M' + str('%04d' % (int(temp_code[1]) + 1))

        elif type in 'Injection':
            last_code =Medicine.objects.filter(code__icontains="I").last()
            temp_code = last_code.code.split('I')
            code = 'M' + str('%04d' % (int(temp_code[1]) + 1))
        
        data.code = code

       
    else:
        data = Medicine.objects.get(id=id)
        str_now = datetime.datetime.now().strftime('%Y%m%d%H%M%S')

        try: 
            old_price = Pricechange.objects.get(type="Medicine",country='VI',type2='OUTPUT',code=data.code, date_end="99999999999999")
            
            if old_price.price != int(price):
                old_price.date_end = str_now
                old_price.save()

                new_price = Pricechange(type="Medicine",country='VI',type2='OUTPUT',code=data.code)
                new_price.price = price
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price):
                new_price = Pricechange(type="Medicine",country='VI',type2='OUTPUT',code=data.code)
                new_price.price = price
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()


        try:
            old_price_input = Pricechange.objects.get(type="Medicine",country='VI',type2='INPUT',code=data.code, date_end="99999999999999")
            
            if old_price_input.price != int(price_input):
                old_price_input.date_end = str_now
                old_price_input.save()

                new_price = Pricechange(type="Medicine",country='VI',type2='INPUT',code=data.code)
                new_price.price = price_input
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price_input):
                new_price = Pricechange(type="Medicine",country='VI',type2='INPUT',code=data.code)
                new_price.price = price_input
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        try:
            old_price_dollar = Pricechange.objects.get(type="Medicine",country='US',type2='OUTPUT',code=data.code, date_end="99999999999999")
            
            if old_price_dollar.price != int(price_dollar):
                old_price_dollar.date_end = str_now
                old_price_dollar.save()

                new_price = Pricechange(type="Medicine",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price_dollar):
                new_price = Pricechange(type="Medicine",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()


    data.medicine_class_id = medicine_class
    data.name = name
    data.name_vie = name_vie
    data.ingredient = ingredient
    data.ingredient_vie = ingredient_vie
    data.unit = unit
    data.unit_vie = unit_vie
    data.country = country
    data.country_vie = country_vie
    data.company = company
    data.name_display = name_display
    data.multiple_level = multiple_level
    

    data.save()

    context = {'result':True}




    return JsonResponse(context)


def medicine_add_edit_check_code(request):
    code = request.POST.get('code')
    id = request.POST.get('id')
    try:
        medicine = Medicine.objects.get(code=code)
        res = "N"
        
        if medicine.id == int(id):
            res = 'Same'
            print(res)
    except Medicine.DoesNotExist:
        res = "Y"

    context = {'result':res}

    return JsonResponse(context)