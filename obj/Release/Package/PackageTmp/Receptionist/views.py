from django.shortcuts import render, redirect
import datetime ,calendar
from django.utils import timezone
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage
from django.db.models import Q
import operator
import functools
from django.http import JsonResponse
from django.forms.models import model_to_dict

from .forms import *
from .models import *
from Patient.forms import PatientForm, HistoryForm
from Patient.models import Patient,History
from Account.models import User
from Doctor.models import *

# Create your views here.


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
            },
        )

def set_new_patient(request):


    last = Patient.objects.last()
    if last is None:
        chart_no =1
    else:
        chart_no = last.id + 1

    context = {'chart':"{:06d}".format(chart_no)}
    return JsonResponse(context)


def save_patient(request):
    cahrt_no = request.POST.get('cahrt_no')
    name_kor = request.POST.get('name_kor')
    name_eng = request.POST.get('name_eng')
    date_of_birth = request.POST.get('date_of_birth')
    phone = request.POST.get('phone')
    gender = request.POST.get('gender')
    address = request.POST.get('address')

    past_history = request.POST.get('past_history')
    family_history = request.POST.get('family_history')

    tax_invoice_number = request.POST.get('tax_invoice_number')
    tax_invoice_company_name = request.POST.get('tax_invoice_company_name')
    tax_invoice_address = request.POST.get('tax_invoice_address')

    try:
        patient = Patient.objects.get(pk = int(cahrt_no))
    except Patient.DoesNotExist:
        patient = Patient(pk = int(cahrt_no))

    patient.name_kor = name_kor
    patient.name_eng = name_eng
    patient.date_of_birth = date_of_birth
    patient.phone = phone
    patient.gender = gender
    patient.address = address
    patient.save()

    try:
        history = History.objects.get(patient=patient)
    except History.DoesNotExist:
        history = History(patient = patient)

        
    history.past_history = past_history
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

    context = {'result':result}
    return JsonResponse(context)


def set_patient_data(request):
    patient_id = request.POST.get('patient_id')

    patient = Patient.objects.get(pk=int(patient_id))
    history = History.objects.get(patient = patient)
    try:
        taxinvoice = TaxInvoice.objects.get(patient = patient)
    except TaxInvoice.DoesNotExist:
        taxinvoice = None

    context = {
        'chart':"{:06d}".format(patient.id),
        'name_kor':patient.name_kor,
        'name_eng':patient.name_eng,
        'date_of_birth':patient.date_of_birth,
        'gender':patient.gender,
        'phone':patient.phone,
        'address':patient.address,
        'history_past':history.past_history,
        'history_family':history.family_history,

        'tax_invoice_number':'' if taxinvoice is None else taxinvoice.number,
        'tax_invoice_company_name':'' if taxinvoice is None else taxinvoice.company_name,
        'tax_invoice_address':'' if taxinvoice is None else taxinvoice.address,
        }
    return JsonResponse(context)


def save_reception(request):
    cahrt_no = request.POST.get('cahrt_no')
    name_kor = request.POST.get('name_kor')
    name_eng = request.POST.get('name_eng')
    date_of_birth = request.POST.get('date_of_birth')
    phone = request.POST.get('phone')
    gender = request.POST.get('gender')
    address = request.POST.get('address')

    past_history = request.POST.get('past_history')
    family_history = request.POST.get('family_history')

    depart = request.POST.get('depart')
    doctor = request.POST.get('doctor')
    chief_complaint = request.POST.get('chief_complaint')

    tax_invoice_number = request.POST.get('tax_invoice_number')
    tax_invoice_company_name = request.POST.get('tax_invoice_company_name')
    tax_invoice_address = request.POST.get('tax_invoice_address')


    try:
        patient = Patient.objects.get(pk = int(cahrt_no))
    except Patient.DoesNotExist:
        patient = Patient(pk = int(cahrt_no))

    patient.name_kor = name_kor
    patient.name_eng = name_eng
    patient.date_of_birth = date_of_birth
    patient.phone = phone
    patient.gender = gender
    patient.address = address
    patient.save()

    try:
        history = History.objects.get(patient=patient)
    except History.DoesNotExist:
        history = History(patient = patient)

        
    history.past_historyf = past_history
    history.family_history = family_history
    history.save()

    
    reception = Reception(patient = patient)
    reception.depart = Depart.objects.get(pk = depart)
    reception.doctor = Doctor.objects.get(pk = doctor)
    reception.chief_complaint = chief_complaint
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




    result = True

    context = {'result':result}
    return JsonResponse(context)

def patient_search(request):
    category = request.POST.get('category')
    string = request.POST.get('string')

    #kwargs={}
    if category=='name':
        patients = Patient.objects.filter( Q(name_kor__icontains=string) | Q(name_eng__icontains=string) ).order_by("-id")
    else: 
        kwargs = {
            '{0}__{1}'.format(category, 'icontains'): string,
            }
        patients = Patient.objects.filter(**kwargs ).order_by("-id")

    datas=[]
    for patient in patients:
        data = {}

        data.update({
            'chart':"{:06d}".format(patient.id),
            'name_kor':patient.name_kor,
            'name_eng':patient.name_eng,
            'gender':patient.get_gender_simple(),
            'date_of_birth':patient.date_of_birth.strftime('%Y-%m-%d'),
            'phonenumber':patient.phone,
            'age' : patient.get_age(),
            'address':patient.address,
            'has_unpaid':patient.has_unpaid(),
            })
        datas.append(data)

    context = {'datas':datas}
    return JsonResponse(context)


def reception_search(request):

    date = request.POST.get('date')
    depart_id = request.POST.get('depart')
    doctor_id = request.POST.get('doctor')
    kwargs={}
    if depart_id != '':
        depart = Depart.objects.get(pk = depart_id)
        kwargs['depart_id'] = depart

    if doctor_id != '':
        doctor = Doctor.objects.get(id = doctor_id)
        kwargs['doctor'] = doctor


    date_min = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.max)

    receptions = Reception.objects.filter(recorded_date__range = (date_min, date_max),**kwargs)

    datas=[]
    today = datetime.date.today()
    
    
    for reception in receptions:
        data={}
        
        is_new = Reception.objects.filter(patient = reception.patient).count()

        if is_new == 1:
            data.update({'is_new':'N'})
        else:
            data.update({'is_new':'R'})
        data.update({
            'chart':"{:06d}".format(reception.patient_id),
            'name_kor':reception.patient.name_kor,
            'name_eng':reception.patient.name_eng,
            'age':reception.patient.get_age(),
            'gender':reception.patient.get_gender_simple(),
            'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),
            'reception_time':reception.recorded_date.strftime('%Y-%m-%d %H:%M:%S'),
            'depart':reception.depart.name,
            'doctor':reception.doctor.name_kor,
            'has_unpaid':reception.patient.has_unpaid(),
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
            'chart':"{:06d}".format(payment.reception.patient_id),
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
    date = request.POST.get('date')
    status = request.POST.get('status')

    kwargs={}
    
    
    if request.POST.get('doctor') != '':
        doctor = Doctor.objects.get(pk = request.POST.get('doctor'))
        kwargs['doctor'] = doctor
    elif request.POST.get('depart') != '':
        depart = Doctor.objects.filter(depart_id = request.POST.get('depart'))
        
        temp_list=[]
        for i in depart:
            temp_list.append(i.id)
        
        kwargs['doctor_id__in'] = temp_list 

    if status != 'all':
        if status == 'no':
            kwargs['is_visited']=False
        elif status == 'yes':
            kwargs['is_visited']=True

    date_min = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.max)


    reservations = Reservation.objects.filter(reservation_date__range = (date_min, date_max),**kwargs)

    datas=[]
    for reservation in reservations:
        data = { 
            'id':reservation.id, 
            'start':reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00'),
            'depart': reservation.depart.name,
            'doctor': reservation.doctor.name_kor,
            'time':reservation.reservation_date.strftime('%H:%M:00'),
            }

        if reservation.patient:
            data.update({
                    'chart':'{:06d}'.format(reservation.patient.id),
                    'name':reservation.patient.get_name_eng_kor(),
                    'date_of_birth':reservation.patient.date_of_birth.strftime('%Y-%m-%d'),
                    'phone':reservation.patient.phone,
                    'has_unpaid':reservation.patient.has_unpaid(),
                })
        else:
            data.update({
                    'chart':'',
                    'name':reservation.name,
                    'date_of_birth':reservation.date_of_birth.strftime('%Y-%m-%d'),
                    'phone':reservation.phone,
                    
                })

        datas.append(data)


    context = {'datas':datas}
    return JsonResponse(context)

def storage_page(request):
    storage_search_form = StorageSearchForm()
    storage_form = StorageForm()


    return render(request,
    'Receptionist/storage_page.html',
            {
                'storage_search':storage_search_form,
                'storage':storage_form,
            },
        )

def waiting_list(request):
    date_start = request.POST.get('start_date')
    date_end = request.POST.get('end_date')
    filter = request.POST.get('filter')
    string = request.POST.get('string')
 

    kwargs={}


    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)


    datas=[]
    receptions = Reception.objects.filter( recorded_date__range = (date_min, date_max), **kwargs)

    pay_records = PaymentRecord.objects.filter(date__range = (date_min, date_max) )

    

    for pay_record in pay_records:
        pay_record.get_rest_total()

        pay_record.payment.reception.patient.has_unpaid()
        record = {
            'paymentrecord_id':pay_record.id,
            'chart':'{:06d}'.format(pay_record.payment.reception.patient.id),
            'name_kor':pay_record.payment.reception.patient.name_kor,
            'name_eng':pay_record.payment.reception.patient.name_eng,
            'Depart':pay_record.payment.reception.depart.name,
            'Doctor':pay_record.payment.reception.doctor.name_kor,
            'unpaid_total': pay_record.get_rest_total(),
            'paid':pay_record.paid,
            'date':pay_record.date.strftime('%Y-%m-%d'),
            #'is_unpaid':pay_record.payment.reception.patient.has_unpaid(),
            }
        datas.append(record)
   



    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)

def get_today_list(request):

    receptions = Reception.objects.filter( recorded_date__date = datetime.date.today(), progress = 'done')

    datas=[]
    for reception in receptions:

        data={
            'reception_id':reception.id,
            'chart':"{:06d}".format(reception.patient.id),
            'name_kor':reception.patient.name_kor,
            'name_eng':reception.patient.name_eng,
            'Depart':reception.depart.name,
            'Doctor':reception.doctor.name_kor,
            'status':reception.payment.progress,
            'total_amount':reception.payment.total,
            'DateTime':reception.recorded_date.strftime('%H:%M'),
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
            'code':data.exam.code,
            'name':data.exam.name,
            'price':data.exam.price,
            })
        exams.append(exam)

    tests = []
    for data in test_set:
        test = {}
        test.update({
            'code':data.test.code,
            'name':data.test.name,
            'price':data.test.price,
            })
        tests.append(test)

    precedures = []
    for data in precedure_set:
        precedure = {}
        precedure.update({
            'code':data.precedure.code,
            'name':data.precedure.name,
            'price':data.precedure.price,
            })
        precedures.append(precedure)

    medicines = []
    for data in medicine_set:
        medicine = {}
        quantity = int(data.days) * int(data.amount)
        unit = data.medicine.price
        price = quantity * int(data.medicine.price)
        medicine.update({
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
        'chart':"{:06d}".format(reception.patient.id),
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

        'total_amount': payment.total,
        'paid':paid,
        'unpaid':payment.total - paid,

        'discount':payment.discounted,
        

        'date':reception.recorded_date.strftime('%d/%m/%Y')
        
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
            'code':data.exam.code,
            'name':data.exam.name,
            'price':data.exam.price,
            })
        exams.append(exam)

    tests = []
    for data in test_set:
        test = {}
        test.update({
            'code':data.test.code,
            'name':data.test.name,
            'price':data.test.price,
            })
        tests.append(test)

    precedures = []
    for data in precedure_set:
        precedure = {}
        precedure.update({
            'code':data.precedure.code,
            'name':data.precedure.name,
            'price':data.precedure.price,
            })
        precedures.append(precedure)

    medicines = []
    for data in medicine_set:
        medicine = {}
        quantity = int(data.days) * int(data.amount)
        unit = data.medicine.price
        price = quantity * int(data.medicine.price)
        medicine.update({
            'code':data.medicine.code,
            'name':data.medicine.name,
            'quantity':quantity,
            'price':price,
            'unit':unit,
            })
        medicines.append(medicine)


    datas = {
        'chart':"{:06d}".format(reception.patient.id),
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

        'unpaid_total': payment_record.get_rest_total(),
        'paid':payment_record.paid,

        'discount':payment.discounted,

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
        }
    return JsonResponse(context)


def storage_page_save(request):
    reception_id = request.POST.get('reception_id')
    paid = request.POST.get('paid')
    method = request.POST.get('method')
    discount = request.POST.get('discount')
    total = request.POST.get('total').split(' ')[0].replace(',','')

    payment = Payment.objects.get(reception_id = reception_id)
    payment.discounted = discount
    payment.total = total
    if payment.progress == 'paid':
        context = {'result':False}
        return JsonResponse(context)
    payment_recoreds = PaymentRecord.objects.filter(payment = payment)
    res = int(payment.total)
    for payment_recored in payment_recoreds:
        res -= payment_recored.paid
    
    res -= int(paid)

    add_record = PaymentRecord(payment = payment)
    add_record.date = datetime.datetime.now()
    add_record.method = method
    add_record.paid = int(paid)

    if res == 0:
        payment.progress = 'paid'
    payment.save()
    add_record.save()

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
            }
        if reservation.patient:
            data.update({
                'title': reservation.patient.get_name_eng_kor() + ' - (' + reservation.depart.name + ' / ' + reservation.doctor.name_kor + ')',
                })
        else:
            data.update({
                'title': reservation.name + ' - (' + reservation.depart.name + ' / ' + reservation.doctor.name_kor + ')',
                })
    
        datas.append(data)

    
    context = {'datas':datas}
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
        datas.update({data.name_kor:data.id})
    
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
        total_amount += data.price
    for data in precedures:
        total_amount += data.price
    for data in medicines:
        total_amount += data.price

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

def reservation(request):

    today =datetime.datetime.today()
    reservation_dialog_form = ReservationDialogForm()
    reservation_search_form = ReservationSearchControl()
    datas = Reservation.objects.filter(reservation_date__month = today.month)
    
    reception_form = ReceptionForm()
    return render(request,
    'Receptionist/reservation.html',
            {
                'datas':datas,
                'reservation_dialog':reservation_dialog_form,
                'reservation_search':reservation_search_form,
            },
        )

def reservation_new(request):
    reception_id = request.POST.get('reception')
    date =request.POST.get('reservation_date')
    if reception_id == '':
        patient=request.POST.get('reservation_patient')
        chart=request.POST.get('reservation_chart')

        memo=request.POST.get('reservation_memo')
        depart=request.POST.get('reservation_depart')
        doctor=request.POST.get('reservation_doctor')

        reservation = Reservation()
        if chart == '':
            name=request.POST.get('reservation_name')
            date_of_birth=request.POST.get('reservation_date_of_birth')
            phone=request.POST.get('reservation_phone')

            reservation.name = name
            reservation.date_of_birth= datetime.datetime.strptime(date_of_birth,'%Y-%m-%d')
            reservation.phon = phone
        
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
            'chart':'{:06d}'.format(report.patient.id),
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