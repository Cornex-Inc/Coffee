import json
from django.shortcuts import render, redirect
import datetime ,calendar
from django.utils import timezone
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage
from django.db.models import Q,Case,When, CharField,Count,Sum
import operator
import functools
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from django.utils import timezone, translation


from .forms import *
from .models import *
from Patient.forms import PatientForm, HistoryForm
from Patient.models import Patient,History
from Account.models import User
from Doctor.models import *
from app.models import *
from Laboratory.models import *
from django.utils.translation import gettext as _
# Create your views here.

@login_required
def index(request):


    #reception
    patient_form = PatientForm()
    reception_form = ReceptionForm()
    history_form = HistoryForm()
    #search
    patientsearch_form = PatientSearchForm()
    receptionsearch_form = SearchReceptionStatusForm()
    payment_form = PaymentSearchForm()
    reservation_form = ReservationSearchForm()

    initial_report_q2_option = []
    initial_report_q2 = COMMCODE.objects.filter(commcode_grp = 'PM_IRQ2').values('id','seq','se1','se2','se4','se5')

    initial_report_q2_title = COMMCODE.objects.filter(commcode_grp = 'PM_IRQ2').values('se2','seq','se6','se7','se8').annotate(Count('se2')).extra(select={'tmp_seq':'CAST(seq AS INTERGER)'}).order_by('tmp_seq')
    for title in initial_report_q2_title:
        item = COMMCODE.objects.filter(commcode_grp = 'PM_IRQ2').values('se2').annotate(Count('se2'))
                
    list_depart = Depart.objects.all().values('id','name')
        
    return render(request,
    'Receptionist/index.html',
            {
                'patient': patient_form,
                'reception':reception_form,
                'history':history_form,
                'patientsearch':patientsearch_form,
                'receptionsearch':receptionsearch_form,
                'payment':payment_form,
                'reservation':reservation_form,

                'initial_report_q2':initial_report_q2,
                'initial_report_q2_title':initial_report_q2_title,
                'list_depart':list_depart,
            },
        )

def set_new_patient(request):

    
    #last = Patient.objects.last()
    #if last == None:
    #    chart_no = 1
    #else:
    #    chart_no = last.id + 1

    last = Patient.objects.last()
    if last is None: #or last.id <= 17000:
        chart_no =1
    else:
        chart_no = last.id + 1

    context = {'chart':"{:06d}".format(chart_no)}
    return JsonResponse(context)


def save_patient(request):
    cahrt_no = request.POST.get('cahrt_no')
    name_kor = request.POST.get('name_kor','')
    name_eng = request.POST.get('name_eng','')
    date_of_birth = request.POST.get('date_of_birth','')
    phone = request.POST.get('phone','')
    gender = request.POST.get('gender','')
    address = request.POST.get('address','')
    email = request.POST.get('email','')
    nationality = request.POST.get('nationality','')
    memo = request.POST.get('memo','')

    past_history = request.POST.get('past_history','')
    family_history = request.POST.get('family_history','')

    tax_invoice_number = request.POST.get('tax_invoice_number','')
    tax_invoice_company_name = request.POST.get('tax_invoice_company_name','')
    tax_invoice_address = request.POST.get('tax_invoice_address','')

    id = request.POST.get('id')
    if request.POST.get('id') is None or request.POST.get('id') is '':
        patient = Patient()
    else:
        patient = Patient.objects.get(pk = id)
    #try:
    #    patient = Patient.objects.get(pk = id)
    #except Patient.DoesNotExist:
    #    patient = Patient(pk = id)

    if name_kor != '' and name_kor != None:
        patient.name_kor = name_kor
    if name_eng != '' and name_eng != None:
        patient.name_eng = name_eng
    patient.date_of_birth = date_of_birth
    patient.phone = phone
    patient.gender = gender
    patient.address = address

    if nationality != '' and nationality != None:
        patient.nationality = nationality
    if email != '' and email != None:
        patient.email = email
    if memo != '' and memo != None:
        patient.memo = memo

    patient.save()

    try:
        history = History.objects.get(patient=patient)
    except History.DoesNotExist:
        history = History(patient = patient)

    if past_history != '' and past_history != None:
        history.past_history = past_history
    if family_history != '' and family_history != None:
        history.family_history = family_history
    history.save()

    if tax_invoice_number != '' or tax_invoice_company_name != '' or tax_invoice_address != '':
        try:
            taxinvoice = TaxInvoice.objects.get(patient=patient)
        except TaxInvoice.DoesNotExist:
            taxinvoice = TaxInvoice(patient = patient)

        taxinvoice.number = '' if tax_invoice_number == '' else tax_invoice_number
        taxinvoice.company_name = '' if tax_invoice_number == '' else tax_invoice_company_name
        taxinvoice.address = '' if tax_invoice_number == '' else tax_invoice_address
        taxinvoice.save()



    result = True







    patient = Patient.objects.get(pk = patient.id)
    context = {'result':result,
                'id':patient.id,
                'chart':patient.get_chart_no(),
                'name_kor':patient.name_kor,
                'name_eng':patient.name_eng,
                'gender':patient.get_gender_simple(),
                'date_of_birth':patient.date_of_birth,
                'phonenumber':patient.phone,
                'age' : patient.get_age(),
                'address':patient.address,
               }
    return JsonResponse(context)


def set_patient_data(request):
    patient_id = request.POST.get('patient_id')

    context={}
    patient = Patient.objects.get(pk=int(patient_id))
    try:
        history = History.objects.get(patient = patient)
        context.update({
            'history_past':history.past_history,
            'history_family':history.family_history,
            })
    except History.DoesNotExist:
        context.update({
            'history_past':'',
            'history_family':'',
            })

    try:
        taxinvoice = TaxInvoice.objects.get(patient = patient)
    except TaxInvoice.DoesNotExist:
        taxinvoice = None

    context.update({
        'id':patient.id,
        'chart':patient.get_chart_no(),
        'name_kor':patient.name_kor,
        'name_eng':patient.name_eng,
        'date_of_birth':patient.date_of_birth,
        'gender':patient.gender,
        'email':patient.email,
        'nationality':patient.nationality,
        'phone':patient.phone,
        'address':patient.address,
        'memo':patient.memo,

        'tax_invoice_number':'' if taxinvoice is None else taxinvoice.number,
        'tax_invoice_company_name':'' if taxinvoice is None else taxinvoice.company_name,
        'tax_invoice_address':'' if taxinvoice is None else taxinvoice.address,
        })
    return JsonResponse(context)

def Question(request,patient_id):

    return render(request,
    'Receptionist/Question.html',
            {
                'patient_id': patient_id,
            },
        )

def Question_save(request):
    patient_id = request.POST.get('patient_id')
    try:
        query = FIRST_VISIT_SURVEY.objects.get(PT_ID = patient_id)
    except FIRST_VISIT_SURVEY.DoesNotExist:
        query = FIRST_VISIT_SURVEY()

    query.PT_ID = patient_id
    query.pain_posi_text = request.POST.get('pain_posi_text')
    query.sick_date = request.POST.get('sick_date')
    query.cure_yn = request.POST.get('cure_yn')
    query.cure_phy_yn = request.POST.get('cure_phy_yn')
    query.cure_phy_cnt = request.POST.get('cure_phy_cnt')
    query.cure_inject_yn = request.POST.get('cure_inject_yn')
    query.cure_inject_cnt = request.POST.get('cure_inject_cnt')
    query.cure_medi_yn = request.POST.get('cure_medi_yn')
    query.cure_medi_cnt = request.POST.get('cure_medi_cnt')
    query.cure_needle_yn = request.POST.get('cure_needle_yn')
    query.cure_needle_cnt = request.POST.get('cure_needle_cnt')
    query.pain_level = request.POST.get('pain_level')
    query.surgery_yn = request.POST.get('surgery_yn')
    query.surgery_year = request.POST.get('surgery_year')
    query.surgery_name = request.POST.get('surgery_name')
    query.exam_kind = request.POST.get('exam_kind')
    query.exam_etc = request.POST.get('exam_etc')
    query.cd_film_yn = request.POST.get('cd_film_yn')
    query.disease_kind = request.POST.get('disease_kind')
    query.disease_etc = request.POST.get('disease_etc')
    query.medication = request.POST.get('medication')
    query.side_effect_yn = request.POST.get('side_effect_yn')
    query.pregnant_yn = request.POST.get('pregnant_yn')
    query.visit_motiv_item = request.POST.get('visit_motiv_item')
    query.visit_motiv_friend = request.POST.get('visit_motiv_friend')
    query.visit_motiv_etc = request.POST.get('visit_motiv_etc')

    if query.PT_vital is None:
        vital = Vital()
        vital.patient_id = patient_id
    else:
        vital = Vital.objects.get(id = query.PT_vital)

    vital.height = request.POST.get('vital_height')
    vital.weight = request.POST.get('vital_weight')
    vital.BMI = request.POST.get('vital_bmi')
    vital.blood_pressure = request.POST.get('vital_bp')
    vital.blood_temperature = request.POST.get('vital_bt')
    vital.save()

    query.PT_vital = vital.id
    query.save()


    result = True

    context = {'result':result}
    return JsonResponse(context)


def Question_get(request):
    patient_id = request.POST.get('patient_id')
    context = {}
    try:
        query = FIRST_VISIT_SURVEY.objects.get(PT_ID = patient_id)
        if query.PT_vital is None or query.PT_vital is '':
            context.update({
                'vital_height':'',
                'vital_weight':'',
                'vital_bmi':'',
                'vital_bp':'',
                'vital_bt':'',
                })
        else:
            vital = Vital.objects.get(id = query.PT_vital)
            context.update({
                'vital_height':vital.height,
                'vital_weight':vital.weight,
                'vital_bmi':vital.BMI,
                'vital_bp':vital.blood_pressure,
                'vital_bt':vital.blood_temperature,
                })



        context.update({
            
                'pain_posi_text':query.pain_posi_text,
                'sick_date':query.sick_date,
                'cure_yn':query.cure_yn,
                'cure_phy_yn':query.cure_phy_yn,
                'cure_phy_cnt':query.cure_phy_cnt,
                'cure_inject_yn':query.cure_inject_yn,
                'cure_inject_cnt':query.cure_inject_cnt,
                'cure_medi_yn':query.cure_medi_yn,
                'cure_medi_cnt':query.cure_medi_cnt,
                'cure_needle_yn':query.cure_needle_yn,
                'cure_needle_cnt':query.cure_needle_cnt,
                'pain_level':query.pain_level,
                'surgery_yn':query.surgery_yn,
                'surgery_year':query.surgery_year,
                'surgery_name':query.surgery_name,
                'exam_kind':query.exam_kind,
                'exam_etc':query.exam_etc,
                'cd_film_yn':query.cd_film_yn,
                'disease_kind':query.disease_kind,
                'disease_etc':query.disease_etc,
                'medication':query.medication,
                'side_effect_yn':query.side_effect_yn,
                'pregnant_yn':query.pregnant_yn,
                'visit_motiv_item':query.visit_motiv_item,
                'visit_motiv_friend':query.visit_motiv_friend,
                'visit_motiv_etc':query.visit_motiv_etc,
                 
            })

        context.update({'result':True})
    except FIRST_VISIT_SURVEY.DoesNotExist:
        context.update({'result':False})


    return JsonResponse(context)


def save_reception(request):
    cahrt_no = request.POST.get('cahrt_no')
    name_kor = request.POST.get('name_kor')
    name_eng = request.POST.get('name_eng')
    date_of_birth = request.POST.get('date_of_birth')
    phone = request.POST.get('phone')
    gender = request.POST.get('gender')
    address = request.POST.get('address')
    email = request.POST.get('email')
    nationality = request.POST.get('nationality','')
    memo = request.POST.get('memo','')

    past_history = request.POST.get('past_history','')
    family_history = request.POST.get('family_history','')

    depart = request.POST.get('depart')
    doctor = request.POST.get('doctor')
    chief_complaint = request.POST.get('chief_complaint')

    tax_invoice_number = request.POST.get('tax_invoice_number','')
    tax_invoice_company_name = request.POST.get('tax_invoice_company_name','')
    tax_invoice_address = request.POST.get('tax_invoice_address','')

    need_medical_report = request.POST.get('need_medical_report',False)
    need_invoice = request.POST.get('need_invoice',False)
    need_insurance = request.POST.get('need_insurance',False)

    id = request.POST.get('id')
    if request.POST.get('id') is None or request.POST.get('id') is '':
        patient = Patient()
    else:
        patient = Patient.objects.get(pk = id)
    #try:
    #    patient = Patient.objects.get(pk = int(id))
    #except Patient.DoesNotExist:
    #    patient = Patient(pk = int(id))

    patient.name_kor = name_kor
    patient.name_eng = name_eng
    patient.date_of_birth = date_of_birth
    patient.phone = phone
    patient.gender = gender
    patient.address = address
    patient.nationality = nationality
    patient.email = email
    patient.memo = memo
    patient.save()

    #try:
    #    history = History.objects.get(patient=patient)
    #except History.DoesNotExist:
    #    history = History(patient = patient)
    #
    #    
    #history.past_historyf = past_history
    #history.family_history = family_history
    #history.save()

    
    reception = Reception(patient = patient)
    reception.depart = Depart.objects.get(pk = depart)
    reception.doctor = Doctor.objects.get(pk = doctor)
    reception.chief_complaint = chief_complaint
        
    if need_medical_report == 'true':
        reception.need_medical_report = True
    if need_invoice == 'true':
        reception.need_invoice = True
    if need_insurance == 'true':
        reception.need_insurance = True

    reception.save()


    if tax_invoice_number != '' or tax_invoice_company_name != '' or tax_invoice_address != '':
        try:
            taxinvoice = TaxInvoice.objects.get(patient=patient)
        except TaxInvoice.DoesNotExist:
            taxinvoice = TaxInvoice(patient = patient)

        taxinvoice.number = '' if tax_invoice_number == '' else tax_invoice_number
        taxinvoice.company_name = '' if tax_invoice_number == '' else tax_invoice_company_name
        taxinvoice.address = '' if tax_invoice_number == '' else tax_invoice_address
        taxinvoice.save()


    vital_ht = request.POST.get('patient_table_vital_ht',None)
    vital_wt = request.POST.get('patient_table_vital_wt',None)
    vital_bp = request.POST.get('patient_table_vital_bp',None)
    vital_bt = request.POST.get('patient_table_vital_bt',None)
    vital_pr = request.POST.get('patient_table_vital_pr',None)
    vital_breath = request.POST.get('patient_table_vital_breath',None)


    if vital_ht is '' and vital_wt is '' and vital_bp is '' and vital_bt is '' and vital_pr is '' and vital_breath is '':
        pass
    else:
        vital = Vital()
        vital.patient = patient
        vital.weight = vital_wt
        vital.height = vital_ht
        vital.blood_pressure = vital_bp
        vital.blood_temperature = vital_bt
        vital.breath = vital_breath
        vital.pulse_rate = vital_breath
        vital.save()


    result = True

    patient = Patient.objects.get(pk = patient.id)
    context = {'result':result,
                'id':patient.id,
                'chart':patient.get_chart_no(),
                'name_kor':patient.name_kor,
                'name_eng':patient.name_eng,
                'gender':patient.get_gender_simple(),
                'date_of_birth':patient.date_of_birth,
                'phonenumber':patient.phone,
                'age' : patient.get_age(),
                'address':patient.address,
                }
    return JsonResponse(context)

def patient_search(request):
    category = request.POST.get('category')
    string = request.POST.get('string')

    argument_list = [] 
    if category=='':
        argument_list.append( Q(**{'patient__name_kor__icontains':string} ) )
        argument_list.append( Q(**{'patient__name_eng__icontains':string} ) )
        argument_list.append( Q(**{'patient__id__icontains':string} ) ) 
        argument_list.append( Q(**{'patient__phone__icontains':string} ) ) 
        argument_list.append( Q(**{'patient__date_of_birth__icontains':string} ) ) 
    elif category=='name':
        argument_list.append( Q(**{'patient__name_kor__icontains':string} ) )
        argument_list.append( Q(**{'patient__name_eng__icontains':string} ) )
    elif category=='chart':
        argument_list.append( Q(**{'patient__id__icontains':string} ) ) 
    elif category=='date_of_birth':
        argument_list.append( Q(**{'patient__date_of_birth__icontains':string} ) ) 
    elif category=='phone':
        argument_list.append( Q(**{'patient__phone__icontains':string} ) ) 



    receptions = Reception.objects.select_related('patient').values('patient_id','depart_id').filter( functools.reduce(operator.or_, argument_list) ).exclude(progress='deleted').annotate(c_pt=Count('patient_id'),c_dp=Count('depart_id'))

    datas=[]
    for reception in receptions:
        reception_last = Reception.objects.filter(patient = reception['patient_id'], depart = reception['depart_id']).last()

        data = {}
        data.update({
            'id':reception_last.patient.id,
            'chart':reception_last.patient.get_chart_no(),
            'name_kor':reception_last.patient.name_kor,
            'name_eng':reception_last.patient.name_eng,
            'gender':reception_last.patient.get_gender_simple(),
            'date_of_birth':reception_last.patient.date_of_birth.strftime('%Y-%m-%d'),
            'phonenumber':reception_last.patient.phone,
            'age' : reception_last.patient.get_age(),
            'address':reception_last.patient.address,
            'has_unpaid':reception_last.patient.has_unpaid(),
            'depart':reception_last.depart.name,
            'last_visit':reception_last.recorded_date.strftime('%Y-%m-%d'),

            })
        datas.append(data)


    context = {'datas':datas}
    return JsonResponse(context)


def reception_search(request):

    date_start = request.POST.get('date_start')
    date_end = request.POST.get('date_end')
    depart_id = request.POST.get('depart')
    doctor_id = request.POST.get('doctor')
    kwargs={}
    if depart_id != '':
        depart = Depart.objects.get(id = depart_id)
        kwargs['depart_id'] = depart

    #if doctor_id != '':
    #    doctor = Doctor.objects.get(id = doctor_id)
    #    kwargs['doctor'] = doctor
    

    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)

    receptions = Reception.objects.filter(recorded_date__range = (date_min, date_max),**kwargs).exclude(progress='deleted')

    datas=[]
    today = datetime.date.today()
    
    
    for reception in receptions:
        data={}
        
        is_new = Reception.objects.filter(patient = reception.patient, depart_id = reception.depart_id).count()
        if is_new == 1:
            data.update({'is_new':'N'})
        else:
            tmp_rec = Reception.objects.filter(patient = reception.patient, depart_id = reception.depart_id).first()
            if tmp_rec.id == reception.id:
                data.update({'is_new':'N'})
            else:
                data.update({'is_new':'R'})

        data.update({
            'id':reception.id,
            'chart':reception.patient.get_chart_no(),
            'name_kor':reception.patient.name_kor,
            'name_eng':reception.patient.name_eng,
            'age':reception.patient.get_age(),
            'gender':reception.patient.get_gender_simple(),
            'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),
            'reception_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M:%S'),
            'depart':reception.depart.name,
            'doctor':reception.doctor.name_kor,
            'has_unpaid':reception.patient.has_unpaid(),
            'time':reception.recorded_date.strftime('%H:%M'),
            })

        

        datas.append(data)

    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)


def payment_search(request):
    date = request.POST.get('date')
    status = request.POST.get('status')
    show_all_unpaid = request.POST.get('show_all_unpaid')
    kwargs={}

    if show_all_unpaid == 'true':
        payments = Payment.objects.filter(progress = 'unpaid') 
    else:
        date_min = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.min)
        date_max = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.max)

        reception = Reception.objects.filter(recorded_date__range = (date_min, date_max))
        temp_list=[]
        for i in reception:
            temp_list.append(i.id)
        
        if status == 'all':
            payments = Payment.objects.filter(reception_id__in=temp_list)
        else:
            payments = Payment.objects.filter(reception_id__in=temp_list, progress=status)
        

    datas=[]
    for payment in payments:
        data.update({
            'chart':payment.reception.patient.get_chart_no(),
            'name_kor':payment.reception.patient.name_kor,
            'name_eng':payment.reception.patient.name_eng,
            'depart':payment.reception.depart.name,
            'doctor':payment.reception.doctor.name_kor,
            'test':'test',
            'precedure':'precedure',
            'medicine':'medicine',
            'total':payment.total,
            'status':payment.progress,
            'incomplete':'incomplete',
            })
        datas.append(data)

    context = {'datas':datas}
    return JsonResponse(context)


def reservation_search(request):
    date_start = request.POST.get('date_start')
    date_end = request.POST.get('date_end')
    status = request.POST.get('status')
    kwargs={}
    depart_id = request.POST.get('depart')
    
    #if request.POST.get('doctor') != '':
    #    doctor = Doctor.objects.get(pk = request.POST.get('doctor'))
    #    kwargs['doctor'] = doctor
    if depart_id != '':
        depart = Depart.objects.get(id = depart_id)
        kwargs['depart_id'] = depart

    #if status != 'all':
    #    if status == 'no':
    #        kwargs['is_visited']=False
    #    elif status == 'yes':
    #        kwargs['is_visited']=True

   
    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)

    reservations = Reservation.objects.filter(reservation_date__range = (date_min, date_max),**kwargs).order_by('reservation_date')

    datas=[]
    for reservation in reservations:
        data = { 
            'id':reservation.id, 
            'start':reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00'),
            'depart': reservation.depart.name,
            'doctor': reservation.doctor.name_kor,
            'time':reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00'),
            'memo':reservation.memo,
            }
      
        try:
            patient = Patient.objects.get(pk = reservation.patient_id)
            data.update({
                    'chart':reservation.patient.get_chart_no(),
                    'name':reservation.patient.name_kor + '<br />' + reservation.patient.name_eng,
                    'date_of_birth':reservation.patient.date_of_birth.strftime('%Y-%m-%d'),
                    'phone':reservation.patient.phone,
                    'has_unpaid':reservation.patient.has_unpaid(),
                })
            
        except Patient.DoesNotExist:
            data.update({
                    'chart':'',
                    'name':reservation.name,
                    'date_of_birth':reservation.date_of_birth.strftime('%Y-%m-%d'),
                    'phone':reservation.phone,
                })
            


        datas.append(data)


    context = {'datas':datas}
    return JsonResponse(context)


@login_required
def storage_page(request):
    today_filter = ReceptionForm()
    storage_search_form = StorageSearchForm()
    storage_form = StorageForm()
        
    depart = Depart.objects.all()

    return render(request,
    'Receptionist/storage_page.html',
            {
                'today_filter': today_filter,
                'storage_search':storage_search_form,
                'storage':storage_form,
                'depart':depart,
            },
        )

def waiting_list(request):
    date_start = request.POST.get('start_date')
    date_end = request.POST.get('end_date')
    depart_id = request.POST.get('depart')
    filter = request.POST.get('filter')
    string = request.POST.get('string')
 
    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)


    argument_list = [] 
    if filter=='':
        argument_list.append( Q(**{'patient__name_kor__icontains':string} ) )
        argument_list.append( Q(**{'patient__name_eng__icontains':string} ) )
        argument_list.append( Q(**{'patient__id__icontains':string} ) ) 
    elif filter=='name':
        argument_list.append( Q(**{'patient__name_kor__icontains':string} ) )
        argument_list.append( Q(**{'patient__name_eng__icontains':string} ) )
    elif filter=='chart':
        argument_list.append( Q(**{'patient__id__icontains':string} ) ) 



    kwargs={}
    
    if depart_id != '' :
        kwargs['depart_id'] = depart_id

    receptions = Reception.objects.select_related('patient').exclude(progress='deleted').filter( functools.reduce(operator.or_, argument_list), **kwargs, recorded_date__range = (date_min, date_max) )
    #if filter == 'name':
    #    filter_string.append(Q( ** {'patient__name_kor__icontains' : string } ))
    #    filter_string.append(Q( ** {'patient__name_eng__icontains' : string } ))
    #    receptions = Reception.objects.select_related('patient').exclude(progress='deleted').filter( functools.reduce(operator.or_, filter_string), recorded_date__range = (date_min, date_max) )
    ##if doctor_id != '':
    ##    doctor = Doctor.objects.get(id = doctor_id)
    ##    kwargs['doctor'] = doctor
    #else:
    #    receptions = Reception.objects.select_related('patient').filter(  recorded_date__range = (date_min, date_max) )
    #



    datas=[]
    for reception in receptions:
        if hasattr(reception,'payment'):
            if hasattr(reception.payment,'paymentrecord_set'):
                payment_set = PaymentRecord.objects.filter(payment_id = reception.payment.id)
                if payment_set.count() is 0:
                    if reception.recorded_date.strftime('%Y%m%d') == datetime.datetime.today().strftime('%Y%m%d'):
                        continue
                    record = {
                        'reception_id':reception.id,
                        'chart':reception.patient.get_chart_no(),
                        'name_kor':reception.patient.name_kor,
                        'name_eng':reception.patient.name_eng,
                        'Depart':reception.depart.name,
                        'Doctor':reception.doctor.name_kor,
                        'unpaid_total': reception.payment.sub_total,
                        'paid':0,
                        'date':reception.recorded_date.strftime('%Y-%m-%d'),
                        'status':'paid' if reception.payment.progress=='paid' else 'unpaid',
                        'has_unpaid':reception.patient.has_unpaid()
                        #'is_unpaid':pay_record.payment.reception.patient.has_unpaid(),
                        }  
                    datas.append(record)
                else:
                    for pay_record in payment_set:
                        record = {
                            'paymentrecord_id':pay_record.id,
                            'chart':pay_record.payment.reception.patient.get_chart_no(),
                            'name_kor':pay_record.payment.reception.patient.name_kor,
                            'name_eng':pay_record.payment.reception.patient.name_eng,
                            'Depart':pay_record.payment.reception.depart.name,
                            'Doctor':pay_record.payment.reception.doctor.name_kor,
                            'unpaid_total': pay_record.get_rest_total(),
                            'paid':pay_record.paid,
                            'date':reception.recorded_date.strftime('%Y-%m-%d'),
                            'status':'paid' if reception.payment.progress=='paid' else 'unpaid',
                            'has_unpaid':reception.patient.has_unpaid()
                            }

                        datas.append(record)



    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)

def get_today_list(request):
    kwargs ={}
    doctor_id = request.POST.get('doctor')
    depart_id = request.POST.get('depart')

    kwargs={}
    if depart_id != '' and depart_id != None:
        depart = Depart.objects.get(pk = depart_id)
        kwargs['depart_id'] = depart

    if doctor_id != '' and doctor_id != None:
        doctor = Doctor.objects.get(id = doctor_id)
        kwargs['doctor'] = doctor


    receptions = Reception.objects.filter( recorded_date__date = datetime.date.today(), progress = 'done',**kwargs,)

    

    datas=[]
    for reception in receptions:
        count = PaymentRecord.objects.filter(payment = reception.payment).count()
        if count is not 0:
            continue
        data={
            'reception_id':reception.id,
            'chart':reception.patient.get_chart_no(),
            'name_kor':reception.patient.name_kor,
            'name_eng':reception.patient.name_eng,
            'Depart':reception.depart.name,
            'Doctor':reception.doctor.name_kor,
            'status':reception.payment.progress,
            'total_amount':reception.payment.total,
            'DateTime':reception.recorded_date.strftime('%H:%M'),
            'has_unpaid':reception.patient.has_unpaid()
            }
        datas.append(data)
        
    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)

def get_today_selected(request):
    reception_id = request.POST.get('reception_id')

    reception = Reception.objects.get(pk = reception_id)
    diagnosis = Diagnosis.objects.get(reception_id = reception_id)
    payment = Payment.objects.get(reception_id = reception_id)

    exam_set = ExamManager.objects.filter(diagnosis_id = diagnosis.id)
    test_set = TestManager.objects.filter(diagnosis_id = diagnosis.id)
    precedure_set = PrecedureManager.objects.filter(diagnosis_id = diagnosis.id)
    medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis.id)




    exams = []
    for data in exam_set:
        exam = {}
        exam.update({
            'manager_id':data.id,
            'code':data.exam.code,
            'name':data.exam.name,
            'price':data.exam.get_price(),
            })
        exams.append(exam)

    tests = []
    for data in test_set:
        test = {}
        test.update({
            'manager_id':data.id,
            'code':data.test.code,
            'name':data.test.name,
            'price':data.test.get_price(),
            })
        tests.append(test)

    precedures = []
    for data in precedure_set:
        precedure = {}
        precedure.update({
            'manager_id':data.id,
            'code':data.precedure.code,
            'name':data.precedure.name,
            'amount': data.amount,
            'price':data.precedure.get_price(),
            })


        precedures.append(precedure)

    medicines = []
    for data in medicine_set:
        medicine = {}
        quantity = int(data.days) * int(data.amount)
        unit = data.medicine.get_price()
        price = quantity * int(data.medicine.get_price())
        medicine.update({
            'manager_id':data.id,
            'code':data.medicine.code,
            'name':data.medicine.name,
            'quantity':quantity,
            'price':price,
            'unit':unit,
            })
        medicines.append(medicine)

    paid = 0
    records = PaymentRecord.objects.filter(payment = payment)
    for record in records:
        paid += record.paid

    datas = {
        'chart':reception.patient.get_chart_no(),
        'name_kor':reception.patient.name_kor,
        'name_eng':reception.patient.name_eng,
        'date_of_birth':reception.patient.date_of_birth.strftime('%d/%m/%Y'),
        'gender':reception.patient.gender,
        'phone':reception.patient.phone,
        'address':reception.patient.address,

        'recommendation':diagnosis.recommendation,

        'exams':exams,
        'tests':tests,
        'precedures':precedures,
        'medicines':medicines,

        'doctor_kor':reception.doctor.name_kor,
        'doctor_eng':reception.doctor.name_eng,
        'depart':reception.doctor.depart.name,

        'total_amount': payment.total,
        'paid':paid,
        'unpaid':payment.total - paid,

        'discount':'' if payment.discounted is None else payment.discounted,
        'discount_amount':'' if payment.discounted_amount is None else payment.discounted_amount,

        'is_emergency':payment.is_emergency,
        'additional':0 if payment.additional is None else payment.additional,

        'date':reception.recorded_date.strftime('%d/%m/%Y'),


    }
    if reception.reservation:
        datas.update({
            'reservation': reception.reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00'),
            })

    #try:
    #    temp = Report.objects.get(reception_id = reception.id)
    #    report = temp.id
    #except Report.DoesNotExist:
    #    report= None;

    try:
        taxinvoice = TaxInvoice.objects.get(patient = reception.patient)
    except TaxInvoice.DoesNotExist:
        taxinvoice = None


    context = {
        'datas':datas,
        #'report':report,
        'tax_invoice_number':'' if taxinvoice is None else taxinvoice.number,
        'tax_invoice_company_name':'' if taxinvoice is None else taxinvoice.company_name,
        'tax_invoice_address':'' if taxinvoice is None else taxinvoice.address,

                
        'need_invoice':reception.need_invoice,
        'need_insurance':reception.need_insurance,


        }
    return JsonResponse(context)


def waiting_selected(request):
    record_id = request.POST.get('paymentrecord_id')

    payment_record = PaymentRecord.objects.get(pk = record_id)
    
    payment = payment_record.payment
    reception = Reception.objects.get(pk = payment.reception_id)
    diagnosis = Diagnosis.objects.get(reception_id = reception.id)

    exam_set = ExamManager.objects.filter(diagnosis_id = diagnosis.id)
    test_set = TestManager.objects.filter(diagnosis_id = diagnosis.id)
    precedure_set = PrecedureManager.objects.filter(diagnosis_id = diagnosis.id)
    medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis.id)

    exams = []
    for data in exam_set:
        exam = {}
        exam.update({
            'manager_id':data.id,
            'is_checked':data.is_checked_discount,
            'code':data.exam.code,
            'name':data.exam.name,
            'price':data.exam.get_price(reception.recorded_date),
            })
        exams.append(exam)

    tests = []
    for data in test_set:
        test = {}
        test.update({
            'manager_id':data.id,
            'is_checked':data.is_checked_discount,
            'code':data.test.code,
            'name':data.test.name,
            'price':data.test.get_price(reception.recorded_date),
            })
        tests.append(test)

    precedures = []
    for data in precedure_set:
        precedure = {}
        precedure.update({
            'manager_id':data.id,
            'is_checked':data.is_checked_discount,
            'code':data.precedure.code,
            'name':data.precedure.name,
            'amount':data.amount,
            'price':data.precedure.get_price(reception.recorded_date),
            })
        precedures.append(precedure)

    medicines = []
    for data in medicine_set:
        medicine = {}
        quantity = int(data.days) * int(data.amount)
        unit = data.medicine.get_price(reception.recorded_date)
        price = quantity * int(data.medicine.get_price(reception.recorded_date))
        medicine.update({
            'manager_id':data.id,
            'is_checked':data.is_checked_discount,
            'code':data.medicine.code,
            'name':data.medicine.name,
            'quantity':quantity,
            'price':price,
            'unit':unit,
            })
        medicines.append(medicine)


    datas = {
        'chart':reception.patient.get_chart_no(),
        'name_kor':reception.patient.name_kor,
        'name_eng':reception.patient.name_eng,
        'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d '),
        'gender':reception.patient.gender,
        'phone':reception.patient.phone,
        'address':reception.patient.address,

        

        'exams':exams,
        'tests':tests,
        'precedures':precedures,
        'medicines':medicines,

        'doctor_kor':reception.doctor.name_kor,
        'doctor_eng':reception.doctor.name_eng,
        'depart':reception.doctor.depart.name,

        'sub_total':payment.sub_total,
        'unpaid_total': payment_record.get_rest_total(),
        'paid':payment_record.paid,
        'total_payment':payment.total,
        
        'paid_by':'' if payment.memo is None else payment.memo,
        'payment_memo':'' if payment.memo is None else payment.memo,
       
        'emergency_amount':payment.sub_total * 0.3 if payment.is_emergency is True else 0,
        'additional':0 if payment.additional is None else payment.additional,

        'discount':'' if payment.discounted is None else payment.discounted,
        'discount_amount':'' if payment.discounted_amount is None else payment.discounted_amount,

        'date':reception.recorded_date.strftime('%d/%m/%Y')
        
    }
    if reception.reservation:
        datas.update({
            'reservation': reception.reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00'),
            })

    try:
        taxinvoice = TaxInvoice.objects.get(patient = reception.patient)
    except TaxInvoice.DoesNotExist:
        taxinvoice = None


    context = {
        'datas':datas,
        'tax_invoice_number':'' if taxinvoice is None else taxinvoice.number,
        'tax_invoice_company_name':'' if taxinvoice is None else taxinvoice.company_name,
        'tax_invoice_address':'' if taxinvoice is None else taxinvoice.address,
        'reception_id':reception.id,

        'need_invoice':reception.need_invoice,
        'need_insurance':reception.need_insurance,

        }
    return JsonResponse(context)


def storage_page_save(request):
    reception_id = request.POST.get('reception_id')
    paid = request.POST.get('paid')
    paid = int(paid)
    method = request.POST.get('method')
    
    memo = request.POST.get('payment_memo')

    

    discount = request.POST.get('discount',0)
    discount_amount = request.POST.get('discount_amount',0)
    total = request.POST.get('total').split(' ')[0].replace(',','')

    is_emergency = request.POST.get('is_emergency',False)
    additional = request.POST.get('additional',0)

    payment = Payment.objects.get(reception_id = reception_id)
    payment.discounted = None if discount is '' else discount
    payment.discounted_amount = None if discount_amount is '' else discount_amount
    payment.is_emergency = True if is_emergency == 'true' else False
    payment.additional = additional
    payment.total = total
    payment.memo = memo

    #72시간 이후 수정 불가
    #혹시 모르니 관리자 계정만 가능
    if request.user.is_superuser == False:
        reception = Reception.objects.get(id = reception_id)
        print(reception.recorded_date)
        data_date = reception.recorded_date + datetime.timedelta(hours=72)
        print(data_date)
        today = datetime.datetime.now()
        print(today)

        if data_date < today:
            return JsonResponse({
                'result':False,
                'msg':_('Cannot edit past payment after 72 hours'),
                                 })


    if payment.progress == 'paid':
        context = {'result':'paid'}
        return JsonResponse(context)


    payment_recoreds = PaymentRecord.objects.filter(payment = payment)
    res = int(payment.total)
    for payment_recored in payment_recoreds:
        res -= payment_recored.paid
    
    if paid > res:
        context = {'result':'overflowed'}
        return JsonResponse(context)

    res -= paid

    add_record = PaymentRecord(payment = payment)
    add_record.date = datetime.datetime.now()
    add_record.method = method
    add_record.paid = int(paid)

    if res == 0:
        payment.progress = 'paid'
    else:
        payment.progress = 'unpaid'
    payment.save()
    add_record.save()

    list_checked = request.POST.get('list_checked')
    list_checked = json.loads(list_checked)
    print(list_checked)


    for data in list_checked:
        if data['type']=='exam':
            query = ExamManager.objects.get(id = data['id'])
        elif data['type']=='test':
            query = TestManager.objects.get(id = data['id'])
        elif data['type']=='precedure':
            query = PrecedureManager.objects.get(id = data['id'])
        elif data['type']=='medicine':
            query = MedicineManager.objects.get(id = data['id'])
        query.is_checked_discount = data['value']
        query.save()


    context = {'result':'done'}
    return JsonResponse(context)



def get_bill_list(request):
    reception_id = request.POST.get('reception_id')

    tmp_reception = Reception.objects.get(pk = reception_id)
    patient = Patient.objects.get(pk = tmp_reception.patient_id)

    receptions = patient.reception_set.all()

    datas=[]
    
    for reception in receptions:
        data={}
        paymentrecord_list=[]
        unpaid = reception.payment.total
        for paymentrecord in reception.payment.paymentrecord_set.all():
            unpaid -= paymentrecord.paid
            paymentrecord_data={
                    'method':paymentrecord.method,
                    'paid':paymentrecord.paid,
                    'date':paymentrecord.date.strftime('%d-%b-%y'),
                }
            paymentrecord_list.append(paymentrecord_data)
            
        data.update({
            'date':reception.recorded_date.strftime('%d-%b-%y'),
            'total':reception.payment.total,
            'unpaid':unpaid,
            'paymentrecords':paymentrecord_list,
            })
        datas.append(data)

    
    context = {'datas':datas}
    return JsonResponse(context)


def reservation_events(request):
    kwargs ={}
    search_string = request.POST.get('search_string')

    #if search_string != '':#환자 검색 필요
    #    patients = Patient.objects.filter( Q(name_kor__icontains=search_string) | Q(name_eng__icontains=search_string) )
    #    reservations = Reservation.objects.filter(patients_set=patients)

    date_start = request.POST.get('date_start').split('T')[0]
    date_end = request.POST.get('date_end').split('T')[0]
    
    depart = request.POST.get('depart')
    if depart != '' and depart is not None:
        kwargs.update({ 'depart_id':depart })
    doctor = request.POST.get('doctor')
    if doctor != '' and doctor is not None:
        kwargs.update({ 'doctor_id':doctor} )
    
    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)

    reservations = Reservation.objects.filter(reservation_date__range = (date_min, date_max),**kwargs)


    datas=[]
    for reservation in reservations:
        data = { 
            'id':reservation.id, 
            'start':reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00'),
            #'backgroundColor':'red',
            }

        if reservation.depart.id == 1:  #1	PED
            pass
            #data.update({
            #    'backgroundColor':'grba(249,167,82,0.5)',
            #    'eventBorderColor':'grba(249,167,82,1)',
            #    })
        elif reservation.depart.id == 2:  #2	IM
            data.update({
                'backgroundColor':'rgb(254,154,202)',
                'borderColor':'rgb(254,154,202)',
                })
        elif reservation.depart.id == 3:  #3	URO
            pass
            #data.update({
            #    'backgroundColor':'rgb(249,167,82)',
            #    'borderColor':'rgb(249,167,82)',
            #    })
        elif reservation.depart.id == 4:  #4	PS
            data.update({
                'backgroundColor':'rgb(255,81,255)',
                'borderColor':'rgb(255,81,255)',
                })
        elif reservation.depart.id == 5:  #5	ENT
            data.update({
                'backgroundColor':'rgb(255,205,100)',
                'borderColor':'rgb(255,205,100)',
                })
        elif reservation.depart.id == 6:  #6	DERM
            data.update({
                'backgroundColor':'rgb(183,164,210)',
                'borderColor':'rgb(183,164,210)',
                })
        elif reservation.depart.id == 7:  #7	PM
            data.update({
                'backgroundColor':'rgb(147,203,249)',
                'borderColor':'rgb(147,203,249)',
                })


        try:
            patient = Patient.objects.get(pk = reservation.patient_id)
            data.update({
                'title': reservation.patient.get_name_kor_eng() + ' - (' + reservation.depart.name + ' / ' + reservation.doctor.name_kor + ')',
                })
        except Patient.DoesNotExist:
            data.update({
                'title': reservation.name + ' - (' + reservation.depart.name + ' / ' + ('' if reservation.doctor is None else reservation.doctor.name_kor) + ')',
                })
    
        datas.append(data)

    


    #각 날짜 별로 환자 토탈 표시
    delta = date_max - date_min
    date_list = {}
    for i in range(delta.days + 1):
        tmp_date = date_min + datetime.timedelta(days=i)
        
        tmp_date_min = datetime.datetime.combine(tmp_date.date(), datetime.time.min)
        tmp_date_max = datetime.datetime.combine(tmp_date.date(), datetime.time.max)

        tmp_count = Reservation.objects.filter(reservation_date__range = (tmp_date_min, tmp_date_max),**kwargs)

        date_list.update({
            tmp_date.strftime('%Y-%m-%d') : {
                'count':tmp_count.count(),
                'date': tmp_date.strftime('%a %m/%d')
                }
            })


    context = {
        'datas':datas,
        'count_patient':date_list,
        }
    return JsonResponse(context)


def reservation_events_modify(request):
    id = request.POST.get('id')
    date_start = request.POST.get('date_start').split('GMT')[0].strip()
    datetime_object = datetime.datetime.strptime(date_start, '%a %b %d %Y %H:%M:%S')

    try:
        reservation = Reservation.objects.get(pk = id)
        reservation.reservation_date = datetime_object
        reservation.save()
    except:
        pass

    context = {'datas':True}
    return JsonResponse(context)

def reservation_events_delete(request):
    id = request.POST.get('id')

    try:
        reception = Reception.objects.get(reservation_id = id)
        reception.reservation_id = None
        reception.save()
    except Reception.DoesNotExist:
        pass

    reservation = Reservation.objects.get(pk = id)
    reservation.delete()

    context = {'datas':True}
    return JsonResponse(context)

def search(request):

    search_form = SearchPatientForm()
    page_context = 10 # 페이지 컨텐츠 갯수

    if 'search' in request.POST:
        search_form = SearchPatientForm(data = request.POST)
        if search_form.is_valid():

            category = search_form.cleaned_data['select']
            string = search_form.cleaned_data['search_input']
            kwargs = {
                    '{0}__{1}'.format(category, 'icontains'): string,
                }
            datas = Patient.objects.filter(**kwargs ).order_by("-id")
    else:
        datas = Patient.objects.all().order_by("-id")

    page = request.GET.get('page',1)
 
    paginator = Paginator(datas, page_context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)

    return render(request,
    'Receptionist/search.html',
            {
                'search': search_form,
                'datas':paging_data,
            },
        )

def check_reservation(request):
    patient_id = request.POST.get('patient_id')

    try:
        reservation = Reservation.objects.filter(patient_id = patient_id)
    except Exception as ex: # 에러 종류
        print('에러가 발생 했습니다', ex) 
    
    datas={}
    for data in reservation:
        datas.update({
            id:data.id,
            date:data.date,
            doctor:data.doctor,
            patient:data.patient,
            test:data.test,
            })
    
    context = {'datas':datas}
    return JsonResponse(context)




def reception(request,patient_num=None):
    reception_form = ReceptionForm()
    patient_form = PatientForm()
    history_form = HistoryForm()
    

    if 'save' in request.POST:
        patient_form = PatientForm(data = request.POST,)
        reception_form = ReceptionForm(data = request.POST,)
        history_form = HistoryForm(data = request.POST,)

        if patient_form.is_valid() and reception_form.is_valid() and history_form.is_valid():
            if request.POST['is_revisit']:#re-visit
                
                if patient_form.has_changed():
                    patient = Patient.objects.get(pk=request.POST['is_revisit'])
                    Patient.objects.filter(pk=request.POST['is_revisit']).update(
                        name_kor = patient_form.cleaned_data['name_kor'],
                        name_eng = patient_form.cleaned_data['name_eng'],
                        phone = patient_form.cleaned_data['phone'],
                        gender = patient_form.cleaned_data['gender'],
                        date_of_birth = patient_form.cleaned_data['date_of_birth'],
                        )

                if history_form.has_changed():
                    history_form = History.objects.filter(patient = patient).update(
                        past_history = history_form.cleaned_data['past_history'],
                        family_history = history_form.cleaned_data['family_history'],
                        )

                reception = Reception.objects.create(
                    patient = patient,
                    depart = reception_form.cleaned_data['depart'],
                    doctor = reception_form.cleaned_data['doctor'],
                    chief_complaint = reception_form.cleaned_data['chief_complaint'],
                    )
            else:#first-visit
                
                patient = Patient.objects.create(
                    id = int(request.POST['chart_no']),
                    name_kor = patient_form.cleaned_data['name_kor'],
                    name_eng = patient_form.cleaned_data['name_eng'],
                    phone = patient_form.cleaned_data['phone'],
                    gender = patient_form.cleaned_data['gender'],
                    date_of_birth = patient_form.cleaned_data['date_of_birth'],
                    )

                reception = Reception.objects.create(
                    patient = patient,
                    depart = reception_form.cleaned_data['depart'],
                    doctor = reception_form.cleaned_data['doctor'],
                    chief_complaint = reception_form.cleaned_data['chief_complaint'],
                    )

                history = History.objects.create(
                    patient = patient,
                    past_history = history_form.cleaned_data['past_history'],
                    family_history = history_form.cleaned_data['family_history'],
                    )

                #접수 등록

            return redirect('/receptionist')
        else:
            return render(request,
            'Receptionist/Reception.html',
                {
                    'patient' : patient_form,
                    'reception' : reception_form,
                    'history' : history_form,
                },
            )
    else:
        is_revisit = patient_num
        if patient_num is None: # first-visit
            visit_history = None
            is_revisit = ''

            last = Patient.objects.last()
            if last is None:
                chart_no =1
            else:
                chart_no = last.id + 1
        else: # re-visit
            try:
                patient = Patient.objects.get(id = patient_num)
                history = History.objects.get(patient = patient)

                patient_form = PatientForm(instance = patient)
                history_form = HistoryForm(instance = history)

                chart_no = patient.id
                visit_history = Reception.objects.filter(patient = patient)

            except Patient.DoesNotExist:
                pass
            except History.DoesNotExist:
                pass

        return render(request,
        'Receptionist/Reception.html',
            {
                'chart_no':"{:06d}".format(chart_no),
                'is_revisit' : is_revisit,
                'patient' : patient_form,
                'reception' : reception_form,
                'visit_history':visit_history,
                'history' : history_form,
            },
        )


def get_depart_doctor(request):
    depart_id = request.POST.get('depart')

    try:
        doctor = Doctor.objects.filter(depart_id = depart_id)
    except Exception as ex: # 에러 종류
        print('에러가 발생 했습니다', ex) 
    
    datas={}
    for data in doctor:
        datas.update({data.get_name():data.id})
    
    context = {'datas':datas}
    return JsonResponse(context)


def reception_status(request):
    kwargs={}
    if 'search' in request.POST:
        form = SearchReceptionStatusForm(data = request.POST)
        if form.is_valid():
            if form.cleaned_data['depart'] is not None:
                kwargs['depart'] = form.cleaned_data['depart']
            if form.cleaned_data['doctor'] is not None:
                kwargs['doctor'] = form.cleaned_data['doctor']

            date_min = datetime.datetime.combine(form.cleaned_data['date'], datetime.time.min)
            date_max = datetime.datetime.combine(form.cleaned_data['date'], datetime.time.max)

    else:
        form = SearchReceptionStatusForm()
        date_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        date_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
    
    reception = Reception.objects.filter(recorded_date__range = (date_min, date_max),**kwargs)


    return render(request,
    'Receptionist/Reception_Status.html',
            {
                'form':form,
                'datas':reception,
            },
        )



def storage(request,reception_num):

    try:
        reception = Reception.objects.get(pk = reception_num)
    except Reception.DoesNotExist:
        return redirect('/')

    if 'save' in request.POST:
        #저장
        payment_form = PaymentForm(request.POST)
        patient_form = PatientForm(request.POST)
        reservation_form = ReservationForm(request.POST)

        if payment_form.is_valid() and patient_form.is_valid():
            
            payment_form.save()
            pass
        
    else:
        payment_form = PaymentForm( initial={'reception': reception})
        patient_form = PatientForm(instance = reception.patient)
        reservation_form = ReservationForm(reception.follow_update)
        

    diagnosis = Diagnosis.objects.get(reception = reception)

    tests = diagnosis.test.all()
    precedures = diagnosis.precedure.all()
    medicines = diagnosis.medicine.all()

    total_amount = 0
    for data in tests:
        total_amount += data.get_price(reception.recorded_date)
    for data in precedures:
        total_amount += data.get_price(reception.recorded_date)
    for data in medicines:
        total_amount += data.get_price(reception.recorded_date)

    return render(request,
    'Receptionist/storage.html',
            {
                'reception':reception,
                'patient':patient_form,
                'payment':payment_form,
                'tests':tests,
                'precedures':precedures,
                'medicines':medicines,
                'total_amount':total_amount,
                #'reservation':reservation_form,
            },
        )


@login_required
def reservation(request):

    today =datetime.datetime.today()
    reservation_dialog_form = ReservationDialogForm()
    reservation_search_form = ReservationSearchControl()
    datas = Reservation.objects.filter(reservation_date__month = today.month).order_by('reservation_date')
    
    reception_form = ReceptionForm()

    list_depart = Depart.objects.all()

    return render(request,
    'Receptionist/reservation.html',
            {
                'datas':datas,
                'reservation_dialog':reservation_dialog_form,
                'reservation_search':reservation_search_form,

                'list_depart':list_depart,
            },
        )

@login_required
def reservation_save(request):
    reception_id = request.POST.get('reception')
    date =request.POST.get('reservation_date')
    if reception_id == '' or reception_id is None:
        patient=request.POST.get('reservation_patient')
        chart=request.POST.get('reservation_chart')

        memo=request.POST.get('reservation_memo')
        depart=request.POST.get('reservation_depart')
        doctor=request.POST.get('reservation_doctor')

        selected_reservation=request.POST.get('selected_reservation')
        if selected_reservation == '' or selected_reservation is None:
            reservation = Reservation()
        else:
            reservation = Reservation.objects.get(pk = selected_reservation)

        if chart == '':
            name=request.POST.get('reservation_name')
            date_of_birth=request.POST.get('reservation_date_of_birth')
            phone=request.POST.get('reservation_phone')

            reservation.name = name
            reservation.date_of_birth= datetime.datetime.strptime(date_of_birth,'%Y-%m-%d')
            reservation.phone = phone
        
            reservation.patient = None
        else:
            patient = Patient.objects.get(pk = chart)
            reservation.patient = patient

        reservation.depart = Depart.objects.get(pk = depart)
        if doctor == '':
            pass
        else:
            reservation.doctor = Doctor.objects.get(pk = doctor)

        reservation.memo = memo
        reservation.reservation_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
        reservation.save()


    else:
        reception = Reception.objects.get(pk=reception_id)
        try:
            if reception.reservation is None:
                reservation = Reservation()
            else:
                reservation = reception.reservation
        except ObjectDoesNotExist:# 에러 종류
            reservation = Reservation()

        
        reservation.reservation_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
        reservation.patient = reception.patient
        reservation.depart = reception.depart
        reservation.doctor = reception.doctor
        reservation.save()

        reception.reservation = reservation
        reception.save()




    context = {'result':True}
    return JsonResponse(context)


def reservation_info(request):
    
    reservation_id = request.POST.get('reservation_id')

    reservation = Reservation.objects.get(pk = reservation_id)



    context = {
        'reservation_id':reservation.id,
        'reservation_date': reservation.reservation_date.strftime('%Y-%m-%d %H:%M:%S'),
        'reservation_patient': reservation.name if reservation.patient is None else reservation.patient.get_name_kor_eng(),
        'reservation_patient_id':'' if reservation.patient is None else reservation.patient.id,
        'reservation_chart':'' if reservation.patient is None else reservation.patient.get_chart_no(),
        'reservation_date_of_birth':(reservation.date_of_birth if reservation.patient is None else reservation.patient.date_of_birth).strftime('%Y-%m-%d'),
        'reservation_phone':reservation.phone if reservation.patient is None else reservation.patient.phone,
        'reservation_depart':reservation.depart.id,
        'reservation_doctor':reservation.doctor.id,
        'reservation_memo':reservation.memo,
        }
    return JsonResponse(context)

def reservation_del(request):
    reception_id = request.POST.get('reception')

    try:
        reception = Reception.objects.get(pk = reception_id)

        tmp_reservation = reception.reservation
        reception.reservation = None
        reception.save()
        tmp_reservation.delete()

    except Reception.DoesNotExist:
        pass

    context = {'result':True}
    return JsonResponse(context)



def report_list(request):
    
    reception_id = request.POST.get('reception_id')
    reception = Reception.objects.get(pk = reception_id)

    reports = Report.objects.filter(patient = reception.patient)

    datas=[]
    for report in reports:
        datas.append({
            'id':report.id,
            'chart':report.patient.get_chart_no(),
            'name_eng':report.patient.name_eng,
            'name_kor':report.patient.name_kor,
            'date_of_birth':report.patient.date_of_birth.strftime('%Y-%m-%d'),
            'depart':report.doctor.depart.name,
            'doctor':report.doctor.name_kor,
            'hospitalization':report.date_of_hospitalization.strftime('%Y-%m-%d'),
            })

    datas.reverse()


    page = request.POST.get('page',1)
    context = request.POST.get('context')
    paginator = Paginator(datas, context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)



    context = {
        'datas':datas,
        'page_range_start':paging_data.paginator.page_range.start,
        'page_range_stop':paging_data.paginator.page_range.stop,
        'page_number':paging_data.number,
        'has_previous':paging_data.has_previous(),
        'has_next':paging_data.has_next(),
        }
    return JsonResponse(context)


def payment_record_list(request):
    reception_id = request.POST.get('reception_id')
    reception = Reception.objects.get(pk = reception_id)

    payment_records = reception.payment.paymentrecord_set.all()
    datas = []
    for payment_record in payment_records:
        data = {
            'id':payment_record.id,
            'date':payment_record.date.strftime('%Y-%m-%d %H:%M'),
            'paid':payment_record.paid,
            'method':payment_record.method,
            'name_eng':reception.patient.name_eng,
            'name_kor':reception.patient.name_kor,
            'chart':reception.patient.get_chart_no(),
            }
        datas.append(data)


    
    page = request.POST.get('page',1)
    context = request.POST.get('context')
    paginator = Paginator(datas, context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)


    context = {
        'datas':datas,
        'page_range_start':paging_data.paginator.page_range.start,
        'page_range_stop':paging_data.paginator.page_range.stop,
        'page_number':paging_data.number,
        'has_previous':paging_data.has_previous(),
        'has_next':paging_data.has_next(),
        }
    return JsonResponse(context)


def delete_payment(request):
    record_id = request.POST.get('record_id')

    record = PaymentRecord.objects.get(pk = record_id)
    
    payment = record.payment
    payment.progress = 'unpaid'
    payment.save()

    record.delete()

    

    return JsonResponse({'result':'done'})


def get_patient_past(request):
    reception_id = request.POST.get('reception_id')
    reception = Reception.objects.get(pk = reception_id)
    
    today = datetime.date.today()
    date_min = datetime.datetime.combine(today, datetime.time.min)
    date_max = datetime.datetime.combine(today, datetime.time.max)

    datas=[]
    receptions = Reception.objects.filter(patient_id = reception.patient_id)
    for reception in receptions:
        if hasattr(reception,'payment'):
            if hasattr(reception.payment,'paymentrecord_set'):
                payment_set = PaymentRecord.objects.filter(payment_id = reception.payment, date__range = (date_min, date_max))
                if payment_set.count() is 0:
                    if reception.recorded_date.strftime('%Y%m%d') == datetime.datetime.today().strftime('%Y%m%d'):
                        continue
                    record = {
                        'reception_id':reception.id,
                        'chart':reception.patient.get_chart_no(),
                        'name_kor':reception.patient.name_kor,
                        'name_eng':reception.patient.name_eng,
                        'Depart':reception.depart.name,
                        'Doctor':reception.doctor.name_kor,
                        'unpaid_total': reception.payment.total,
                        'paid':0,
                        'date':reception.recorded_date.strftime('%Y-%m-%d'),
                        'status':'paid' if reception.payment.progress=='paid' else 'unpaid',
                        'has_unpaid':reception.patient.has_unpaid()
                        #'is_unpaid':pay_record.payment.reception.patient.has_unpaid(),
                        }
                    datas.append(record)
                else:
                    for pay_record in payment_set:
                        record = {
                            'paymentrecord_id':pay_record.id,
                            'chart':pay_record.payment.reception.patient.get_chart_no(),
                            'name_kor':pay_record.payment.reception.patient.name_kor,
                            'name_eng':pay_record.payment.reception.patient.name_eng,
                            'Depart':pay_record.payment.reception.depart.name,
                            'Doctor':pay_record.payment.reception.doctor.name_kor,
                            'unpaid_total': pay_record.total,
                            'paid':pay_record.paid,
                            'date':pay_record.date.strftime('%Y-%m-%d'),
                            'status':'paid' if reception.payment.progress=='paid' else 'unpaid',
                            'has_unpaid':reception.patient.has_unpaid()
                            }

                        datas.append(record)

    datas.reverse()
  

    return JsonResponse({'datas':datas})




def Edit_Reception_get(request):

    reception_id = request.POST.get('reception_id')

    reception = Reception.objects.get(id=reception_id)

    context = {
            'id':reception.id,
            'chart':reception.patient.get_chart_no(),
            'name_kor':reception.patient.name_kor,
            'name_eng':reception.patient.name_eng,
            'age':reception.patient.get_age(),
            'gender':reception.patient.get_gender_simple(),
            'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),
            'depart_id':reception.depart.id,

            'doctor':reception.doctor.name_kor,
            'doctor_id':reception.doctor.id,
            'chief_complaint':reception.chief_complaint,
            'medical_report':reception.need_medical_report,
        }



    return JsonResponse(context)


def Edit_Reception_save(request):
    reception_id = request.POST.get('reception_id')
    depart = request.POST.get('depart')
    doctor = request.POST.get('doctor')
    chief_complaint = request.POST.get('chief_complaint')
    medical_report = request.POST.get('medical_report')

    rec = Reception.objects.get(id = reception_id)
    rec.depart_id = depart
    rec.doctor_id = doctor
    rec.chief_complaint = chief_complaint
    rec.need_medical_report = 1 if medical_report =='true' else 0
    rec.save()



    return JsonResponse({'result':True})


def Edit_Reception_delete(request):
    reception_id = request.POST.get('reception_id')
    rec = Reception.objects.get(id = reception_id)
    rec.progress = 'deleted'
    rec.save()

    return JsonResponse({'result':True})


def Tax_Invoice_get(request):
    patient_id = request.POST.get('patient_id')

    context = {}

    patient = Patient.objects.select_related('taxinvoice').get(id = patient_id)

    
    context.update({
        'id':patient.id,
        'chart':patient.get_chart_no(),
        'name_kor':patient.name_kor,
        'name_eng':patient.name_eng,
        'age':patient.get_age(),
        'gender':patient.get_gender_simple(),
        'date_of_birth':patient.date_of_birth.strftime('%Y-%m-%d'),
        })


    try:
        context.update({
            'number':patient.taxinvoice.number,
            'company_name':patient.taxinvoice.company_name,
            'address':patient.taxinvoice.address,
            })
    except TaxInvoice.DoesNotExist:
        context.update({
            'number':'',
            'company_name':'',
            'address':'',
            })


    return JsonResponse(context)


def Tax_Invoice_save(request):
    patient_id = request.POST.get('patient_id')
    number = request.POST.get('number')
    company_name = request.POST.get('company_name')
    address = request.POST.get('address')


    try:
        tax_invoice = TaxInvoice.objects.get(patient_id = patient_id)
    except:
        tax_invoice = TaxInvoice()
        tax_invoice.patient_id = patient_id

    tax_invoice.number = number
    tax_invoice.company_name = company_name
    tax_invoice.address = address
    tax_invoice.save()

    return JsonResponse({'result':True})



def Documents(request):

    departs = Depart.objects.all()

    return render(request,
    'Receptionist/Documents.html',
            {
                'departs':departs,
            },
        )


def document_search(request):
    start = request.POST.get('document_control_start')
    end = request.POST.get('document_control_end')
    depart = request.POST.get('document_control_depart')
    input = request.POST.get('document_control_input')

    
    
    kwargs={}
    if depart != '':
        kwargs['depart_id'] = depart
        #argument_list.append( Q(**{'depart_id':depart} ) ) 

    argument_list = [] 

    argument_list.append( Q(**{'patient__name_kor__icontains':input} ) ) 
    argument_list.append( Q(**{'patient__name_eng__icontains':input} ) ) 


    date_min = datetime.datetime.combine(datetime.datetime.strptime(start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(end, "%Y-%m-%d").date(), datetime.time.max)

    datas=[]
    receptions = Reception.objects.select_related(
                    'patient'
                ).select_related(
                    'depart'
                ).select_related(
                    'doctor'
                ).select_related(
                    'diagnosis'
                ).select_related(
                    'payment'
                ).prefetch_related(
                    'diagnosis__medicinemanager_set'
                ).prefetch_related(
                    'diagnosis__testmanager_set'
                ).order_by(
                    '-recorded_date'
                ).filter(
                    functools.reduce(operator.or_, argument_list),
                    **kwargs,
                    recorded_date__range = (date_min, date_max) 
                    ,progress = 'done'
                ).exclude(progress='deleted')
    for reception in receptions:
        data= {
            'id':reception.id,
            'chart':reception.patient.get_chart_no(),
            'name':reception.patient.get_name_kor_eng(),
            'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
            'age':reception.patient.get_age(),
            'gender':reception.patient.get_gender_simple(),
            'depart':reception.depart.name,
            'doctor':reception.doctor.name_short,
            'address':reception.patient.address,
            'phone':reception.patient.phone,
            'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),         
            }


        if reception.diagnosis.medicinemanager_set.count() !=0:
            data.update({
                'prescription':True,
                'medicine_receipt':True,
                })
            
        if reception.diagnosis.testmanager_set.count() !=0:
            data.update({
                'lab_report':True,
                })

        check = False
        for check in reception.diagnosis.preceduremanager_set.all():
            #2,4,5,6,8
            class_id = check.precedure.precedure_class_id 
            if class_id is 2 or class_id is 4 or class_id is 5 or class_id is 6 or class_id is 8 :
                check = True
            elif class_id is 10:
                if 'R' in check.precedure.code:
                    check = True

        if reception.diagnosis.testmanager_set.count() !=0 or check is True:
            data.update({
                'subclinical':True,
                })
        try:
            report = Report.objects.get(reception_id = reception.id)
            data.update({
                'medical_report':True,
                })

        except Report.DoesNotExist:
            pass

        if reception.payment is not None:
            data.update({
                'medical_receipt':True,
                })
        

        datas.append(data)
    


    return JsonResponse({
        'result':True,
        'datas':datas,
        })




def document_lab(request,reception_id):
    reception = Reception.objects.get(id = reception_id)

    
    test_res = []
    manager_set = reception.diagnosis.testmanager_set.all()
    no = 0
    for lab in manager_set:
        test = TestManage.objects.get(manager_id = lab.id)
        reference_query = TestReferenceInterval.objects.filter(test_id = lab.test_id)
        list_interval = []
        unit = ''
        unit_vie = ''
        for reference in reference_query:
            list_interval.append({
                'normal_range':reference.get_range(),
                'minimum':reference.minimum,
                'maximum':reference.maximum,
                'name':'' if reference.name is None else reference.name + ' : ',
                })
            unit = reference.unit
            unit_vie = reference.unit_vie

        no+=1
        test_res.append({
            'no':no,
            'name':lab.test.name,
            'name_vie':lab.test.name_vie,
            'specimens':'',
            'result':test.result,
            'normal_range':list_interval,
            'procedure_method':'',
            'unit':unit,
            'unit_vie':unit_vie,
            })


    diagnostic = reception.diagnosis.diagnosis
    return render(request,
    'Receptionist/form_medical_lab.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'test_res':test_res,
                'nationality':reception.patient.nationality,


                'date_today':datetime.datetime.now().strftime('%Y-%m-%d'),

                'diagnostic':diagnostic,
            },
        )


def document_prescription(request,reception_id):
    reception = Reception.objects.get(id = reception_id)

    
    medicine_res = []
    manager_set = reception.diagnosis.medicinemanager_set.all()
    no = 0
    for manager in manager_set:
        no+=1
        medicine_res.append({
            'no':no,
            'name':manager.medicine.name,
            'name_vie':manager.medicine.name_vie,
            'unit':'' if manager.medicine.unit is None else manager.medicine.unit,
            'unit_vie':'' if manager.medicine.unit_vie is None else manager.medicine.unit_vie,
            'quantity':manager.amount * manager.days,
            'direction_for_use':manager.memo,
            'note':'',
            })


    diagnostic = reception.diagnosis.diagnosis
    return render(request,
    'Receptionist/form_prescription.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'medicine_res':medicine_res,
                'reservation_date':'' if reception.reservation_id is None else reception.reservation.reservation_date.strftime('%Y-%m-%d %H:%M'),
                'doctor':reception.doctor.name_eng,
                'nationality':reception.patient.nationality,


                'date_today':datetime.datetime.now().strftime('%Y-%m-%d'),

                'diagnostic':diagnostic
            },
        )


def document_medical_receipt(request,reception_id):

    reception = Reception.objects.get(id = reception_id)

    exam_set = ExamManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    test_set = TestManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    precedure_set = PrecedureManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    medicine_set = MedicineManager.objects.filter(diagnosis_id = reception.diagnosis.id)


    amount_consult = 0
    amount_image = 0
    amount_test = 0
    aount_other_exam = 0

    total = 0
    sub_total = 0
    discount = 0 

    exams = []
    no = 1
    for data in exam_set:
        #exam = {}
        #exam.update({
        #    'no':no,
        #    'name':data.exam.name,
        #    'price':f"{data.exam.get_price(reception.recorded_date):,}",
        #    })
        #no += 1
        #exams.append(exam)
        amount_consult += data.exam.get_price(reception.recorded_date)

    tests = []
    for data in test_set:
        #test = {}
        #test.update({
        #    'no':no,
        #    'name':data.test.name,
        #    'price':f"{data.test.get_price(reception.recorded_date):,}",
        #    })
        #no += 1
        #tests.append(test)
        amount_test += data.test.get_price(reception.recorded_date)

    #2,4,5,6,10(pm 의 R)
    no = 1
    no_other = 1
    for precedure in precedure_set:
        #if precedure.precedure.precedure_class_id == 8:
        #    other_tests.append({
        #        'no':no_other,
        #        'name':precedure.precedure.name,
        #        'amount':f"{precedure.precedure.get_price(reception.recorded_date):,}",
        #        'waiting_time':''
        #        })
        #    no_other += 1
        #8
        if precedure.precedure.precedure_class_id == 2 or precedure.precedure.precedure_class_id == 4 or precedure.precedure.precedure_class_id == 5 or precedure.precedure.precedure_class_id == 6 or precedure.precedure.precedure_class_id == 8:
            #image_analysations.append({
            #    'no':no,
            #    'name':precedure.precedure.name,
            #    'amount':f"{precedure.precedure.get_price(reception.recorded_date):,}",
            #    'waiting_time':''
            #    })
            #no += 1
            amount_image+= precedure.precedure.get_price(reception.recorded_date) * precedure.amount
        elif precedure.precedure.precedure_class_id == 10:
            if 'R' in precedure.precedure.code:
               #image_analysations.append({
               #'no':no,
               #'name':precedure.precedure.name,
               #'amount':f"{precedure.precedure.get_price(reception.recorded_date):,}",
               #'waiting_time':''
               #})
               #no += 1
               amount_image+= precedure.precedure.get_price(reception.recorded_date) * precedure.amount
            else:
                aount_other_exam += precedure.precedure.get_price(reception.recorded_date)
        else:
            aount_other_exam += precedure.precedure.get_price(reception.recorded_date)

    sub_total +=amount_consult
    sub_total +=amount_image
    sub_total +=amount_test
    sub_total +=aount_other_exam

    
    

    if reception.payment.discounted is not None :
        discount = (reception.payment.discounted / 100) * reception.payment.sub_total
    elif reception.payment.discounted_amount is not None:
        discount = reception.payment.discounted_amount
    else:
        discount = 0

    total = sub_total - discount

    return render(request,
    'Receptionist/form_medical_receipt.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'doctor':reception.doctor.name_eng,
                'diagnostic':reception.diagnosis.diagnosis,
                'nationality':reception.patient.nationality,


                #'exams':exams,
                #'tests':tests,
                #'precedures':precedures,
                #'medicines':medicines,
                'amount_consult':f"{amount_consult:,}",
                'amount_image':f"{amount_image:,}",
                'amount_test':f"{amount_test:,}",
                'aount_other_exam':f"{aount_other_exam:,}",

                'sub_total':f"{sub_total:,}",
                #'discount':discount,#'' if reception.payment.discounted is None else reception.payment.discounted,

                'discount':f"{discount:,}",
                'total_payment':f"{total:,}",

                'date_today':reception.recorded_date.strftime('%Y-%m-%d'),
            },
        )


def document_medical_receipt_old(request,reception_id):
    reception = Reception.objects.get(id = reception_id)

    exam_set = ExamManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    test_set = TestManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    precedure_set = PrecedureManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    medicine_set = MedicineManager.objects.filter(diagnosis_id = reception.diagnosis.id)

    exams = []
    no = 1
    for data in exam_set:
        exam = {}
        exam.update({
            'no':no,
            'name':data.exam.name,
            'price':f"{data.exam.get_price(reception.recorded_date):,}",
            })
        no += 1
        exams.append(exam)

    tests = []
    for data in test_set:
        test = {}
        test.update({
            'no':no,
            'name':data.test.name,
            'price':f"{data.test.get_price(reception.recorded_date):,}",
            })
        no += 1
        tests.append(test)

    precedures = []
    for data in precedure_set:
        precedure = {}
        precedure.update({
            'no':no,
            'name':data.precedure.name,
            'amount':data.amount,
            'price':f"{data.precedure.get_price(reception.recorded_date):,}",
            'sub_total':f"{data.precedure.get_price(reception.recorded_date) * data.amount:,}",
            })
        no += 1
        precedures.append(precedure)


    medicines= []
    for data in medicine_set:
        medicine = {}
        medicine.update({
            'no':no,
            'name':data.medicine.name,
            'amount':data.amount * data.days,
            'price':f"{data.medicine.get_price(reception.recorded_date):,}",
            'sub_total':f"{data.medicine.get_price(reception.recorded_date) * data.amount * data.days:,}",
            })
        no += 1
        medicines.append(medicine)

    type= request.GET.get('type')
    if type == 'bf':
        discount_input= request.GET.get('discount_input',0) 
        discount_amount= request.GET.get('discount_amount',0) 
        additional_amount= int( request.GET.get('additional_amount',0) )
        total_amount= request.GET.get('total_amount',0)
        total_amount = int(total_amount.replace(',', ''))

        print(discount_input)
        if discount_input is not 0 and discount_input is not '':
            discount = round( ( int( discount_input) / 100) * total_amount )
        elif discount_amount is not 0 and discount_amount is not '':
            discount = int( discount_amount )
        else:
            discount = 0

        additional = additional_amount
        sub_total = total_amount + additional
        total = total_amount - discount + additional


    else:

        if reception.payment.discounted is not 0 :
            discount = (reception.payment.discounted / 100) * reception.payment.sub_total
        elif reception.payment.discounted_amount is not 0:
            discount = reception.payment.discounted_amount
        else:
            discount = 0

        additional = reception.payment.additional
        sub_total = reception.payment.sub_total + additional
        total = reception.payment.sub_total - discount + additional
    

    return render(request,
    'Receptionist/form_medical_receipt_old.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'doctor':reception.doctor.name_eng,
                'diagnostic':reception.diagnosis.diagnosis,
                'nationality':reception.patient.nationality,
                'date_today':reception.recorded_date.strftime('%Y-%m-%d'),

                'sub_total':f"{sub_total:,}",
                'total':f"{total:,}",
                'discount':f"{discount:,}",
                'additional':f"{additional:,}",
                'additional_no':no,

                'exams':exams,
                'tests':tests,
                'precedures':precedures,
                'medicines':medicines,
                }
    )



def document_medicine_receipt(request,reception_id):
    reception = Reception.objects.get(id = reception_id)

    medicine_set = MedicineManager.objects.filter(diagnosis_id = reception.diagnosis.id)

    no=1
    medicines = []
    
    
    sub_total = 0
    vat = 0
    total = 0

    diagnostic = reception.diagnosis.diagnosis
    for data in medicine_set:
        medicine = {}
        quantity = int(data.days) * int(data.amount)
        price = quantity * int(data.medicine.get_price(reception.recorded_date))
        medicine.update({
            'no':no,
            'name':data.medicine.name,
            'quantity':quantity,
            'price':f"{price:,}",
            'unit':data.medicine.unit,
            'unit_vie':data.medicine.unit_vie,
            'unit_price':f"{data.medicine.get_price(reception.recorded_date):,}",
            })
        no += 1
        sub_total += price

        medicines.append(medicine)

    total = sub_total + (sub_total * vat / 100 )
    return render(request,
    'Receptionist/form_medicine_receipt.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'doctor':reception.doctor.name_eng,
                'nationality':reception.patient.nationality,


                'date_reception':reception.recorded_date.strftime('%Y-%m-%d'),

                'medicines':medicines,
                
                'sub_total':f"{sub_total:,}",
                'vat':vat,
                'total':f"{int(total):,}",

                'diagnostic':diagnostic
            },
        )


def document_subclinical(request,reception_id):
    reception = Reception.objects.get(id = reception_id)

    test_set = TestManager.objects.filter(diagnosis_id = reception.diagnosis.id)
    precedure_set = PrecedureManager.objects.filter(diagnosis_id = reception.diagnosis.id)

    

    tests = []

    no = 1
    for test in test_set:
        tests.append({
            'no':no,
            'name':test.test.name,
            'amount':1,
            'waiting_time':''
            })
        no += 1



    image_analysations = []
    other_tests = []
    #2,4,5,6,10(pm 의 R)
    no = 1
    no_other = 1
    for precedure in precedure_set:
        if precedure.precedure.precedure_class_id == 8:
            other_tests.append({
                'no':no_other,
                'name':precedure.precedure.name,
                'amount':precedure.amount,
                'waiting_time':''
                })
            no_other += 1
        #8
        elif precedure.precedure.precedure_class_id == 2 or precedure.precedure.precedure_class_id == 4 or precedure.precedure.precedure_class_id == 5 or precedure.precedure.precedure_class_id == 6 or precedure.precedure.precedure_class_id == 8:
            image_analysations.append({
                'no':no,
                'name':precedure.precedure.name,
                'amount':precedure.amount,
                'waiting_time':''
                })
            no += 1
        elif precedure.precedure.precedure_class_id == 10:
            if 'R' in precedure.precedure.code:
                image_analysations.append({
                'no':no,
                'name':precedure.precedure.name,
                'amount':precedure.amount,
                'waiting_time':''
                })
                no += 1


    return render(request,
    'Receptionist/form_subclinical.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'doctor':reception.doctor.name_eng,
                'diagnostic':reception.diagnosis.diagnosis,
                'nationality':reception.patient.nationality,


                'date_today':reception.recorded_date.strftime('%Y-%m-%d'),

                'tests':tests,
                'image_analysations':image_analysations,
                'other_tests':other_tests,
            },
        )


def document_medical_report(request,reception_id):
    reception = Reception.objects.get(id = reception_id)
    report = Report.objects.get(reception_id = reception_id)

    next_visit = '' if reception.reservation is None else reception.reservation.reservation_date.strftime("%Y-%m-%d %H:%M")
    ICD_code_vie =''
    ICD_ =''
    ICD_code_en =''
    try:
        icd_code = ICD.objects.get(code = reception.diagnosis.ICD_code )
        ICD_code_vie =icd_code.name_vie
        ICD_ =icd_code.code
        ICD_code_en =icd_code.name

    except ICD.DoesNotExist:
        ICD_code_vie =''
        ICD_ =''
        ICD_code_en =''


    return render(request,
    'Receptionist/form_medical_report.html',
            {
                'chart':reception.patient.get_chart_no(),
                'name':reception.patient.get_name_kor_eng(),
                'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),   
                'age':reception.patient.get_age(),
                'gender':reception.patient.get_gender_simple(),
                'depart_full':reception.depart.full_name,
                'depart_full_vie':reception.depart.full_name_vie,
                'doctor':reception.doctor.name_short,
                'address':reception.patient.address,
                'phone':reception.patient.phone,
                'date_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M'),    
                'doctor':reception.doctor.name_eng,
                'nationality':reception.patient.nationality,
                'date_today':reception.recorded_date.strftime('%Y-%m-%d'),

                'chief_complaint':'<br />' if reception.chief_complaint is None else reception.chief_complaint,
                'past_history':reception.patient.history.past_history,
                'assessment':'<br />' if reception.diagnosis.assessment is None else reception.diagnosis.assessment,
                'object':'<br />' if reception.diagnosis.objective_data is None else reception.diagnosis.objective_data,
                'diagnosis':'<br />' if reception.diagnosis.diagnosis is None else reception.diagnosis.diagnosis,
                'icd_code':ICD_ ,
                'ICD_code_vie':ICD_code_vie,
                'ICD_code_en':ICD_code_en,


                'plan':'<br />'if reception.diagnosis.plan is None else reception.diagnosis.plan,
                'doctor_reommend':report.report,

                'recorded_date':reception.recorded_date.strftime('%Y-%m-%d'),
                'next_visit':next_visit,
            },
        )