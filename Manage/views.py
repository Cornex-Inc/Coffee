from django.shortcuts import render
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage

from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Count, F, Min,Sum
import operator
import functools

from django.utils import timezone, translation

from .forms import *
from app.models import *
from Receptionist.models import *
from Doctor.models import *
from Pharmacy.models import *

from dateutil import relativedelta


# Create your views here.
@login_required
def manage(request):
    doctor_search_form = DoctorsSearchForm()

    
    list_exam_fee = []
    list_precedures = []
    list_radiologys = []


    exam_fees = ExamFee.objects.filter(Q(code = 'E0010') | Q(code = 'E0011'))
    for exam_fee in exam_fees:
        list_exam_fee.append({'code':exam_fee.code,'value':exam_fee.name})

    precedures = Precedure.objects.filter(code__contains='PM')
    for precedure in precedures:
        list_precedures.append({'code':precedure.code,'value':precedure.name})

    radiologys = Precedure.objects.filter(code__contains='R', precedure_class_id = 10 )
    for radiology in radiologys:
        list_radiologys.append({'code':radiology.code,'value':radiology.name})

    return render(request,
    'Doctor/audit_PM.html',
        {
            'doctor_search':doctor_search_form,

            'list_exam_fee':list_exam_fee,
            'list_precedures':list_precedures,
            'list_radiologys':list_radiologys,

        }
    )



    #####################################################
    payment_search_form = PaymentSearchForm()
    doctor_search_form = DoctorsSearchForm()


    patient_search_form = PatientSearchForm()
    medicine_search_form = MedicineSearchForm()

    
    #filters
    list_exam_fee = []
    list_lab = []
    list_precedure = []
    list_medicine = []


        
    exams = ExamFee.objects.all().order_by('name')
    for exam in exams:
        list_exam_fee.append({'code':exam.code,'value':exam.name})

    tests = Test.objects.all().order_by('name')
    for test in tests:
        list_lab.append({'code':test.code,'value':test.name})

    precedures = Precedure.objects.all().order_by('name')
    for precedure in precedures:
        list_precedure.append({'code':precedure.code,'value':precedure.name})
        
    medicines = Medicine.objects.all().order_by('name')
    for medicine in medicines:
        list_medicine.append({'code':medicine.code,'value':medicine.name})
        


    return render(request,
        'Manage/manage.html',
            {
                'payment_search':payment_search_form,
                'patient_search':patient_search_form,
                'doctor_search':doctor_search_form,
                'doctors':Doctor.objects.all(),
                'medicine_search':medicine_search_form,

                'list_exam_fee':list_exam_fee, # general will be precedure in template
                'list_lab':list_lab,
                'list_precedure':list_precedure,
                'list_medicine':list_medicine,

            }
        )


def patient(request):
    return render(request,
        'Manage/patient.html',
            {

            }
        )

def payment(reqeust):
    return render(request,
        'Manage/payment.html',
            {

            }
        )



def search_payment(request):
    page_context = 10 # 페이지 컨텐츠 

    depart = request.POST.get('depart')
    doctor = request.POST.get('doctor')

    filter_general = request.POST.get('general')
    filter_medicine = request.POST.get('medicine')
    filter_lab = request.POST.get('lab')
    filter_scaling = request.POST.get('scaling')
    filter_panorama = request.POST.get('panorama')

    pup =request.POST.get('pup')
    paid_by = request.POST.get('paid_by')
    date_start = request.POST.get('start_end_date').split(' - ')[0]
    date_end = request.POST.get('start_end_date').split(' - ')[1]

    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)

    kwargs = {}


    if depart != '':
        kwargs.update({'depart_id':depart})
    if doctor != '':
        kwargs.update({'doctor_id':doctor})


    datas = []
    receptions = Reception.objects.filter(**kwargs ,recorded_date__range = (date_min, date_max), progress = 'done').order_by("-id")


    page = request.POST.get('page',1)
    payment_total_total = 0
    payment_total_paid = 0
    payment_total_unpaid = 0
    for reception in receptions:
        data = {}
        try:
            general = []
            lab = []
            medi = []
            scaling = []
            panorama = []
            total_payment=0
            if filter_general == '' and filter_medicine == '' and filter_lab == '':
                tmp_exam_set = reception.diagnosis.exammanager_set.all()
                for tmp_exam in tmp_exam_set:
                    if hasattr(tmp_exam,'doctor'):
                        general.append({
                            'code':tmp_exam.exam.code,
                            'value':tmp_exam.name + tmp_exam.exam.doctor.name_kor
                            })
                    else:
                        general.append({
                            'code':tmp_exam.exam.code,
                            'value':tmp_exam.exam.name
                            })
           
                tmp_test_set = reception.diagnosis.testmanager_set.all()
                for tmp_test in tmp_test_set:
                    lab.append({
                        'code':tmp_test.test.code,
                        'value':tmp_test.test.name,
                        })

                tmp_precedure_set = reception.diagnosis.preceduremanager_set.all()
                for tmp_precedure in tmp_precedure_set:
                    if 'scaling' in tmp_precedure.precedure.name.lower():
                        scaling.append({
                            'code':tmp_precedure.precedure.code,
                            'value':tmp_precedure.precedure.name
                            })

                    elif 'injection' in tmp_precedure.precedure.name.lower():
                        general.append({
                            'code':tmp_precedure.precedure.code,
                            'value':tmp_precedure.precedure.name
                            })

                    elif 'panorama' in tmp_precedure.precedure.name.lower():
                        panorama.append({
                            'code':tmp_precedure.precedure.code,
                            'value':tmp_precedure.precedure.name
                            })

                    else:
                        general.append({
                            'code':tmp_precedure.precedure.code,
                            'value':tmp_precedure.precedure.name
                            })
            

                tmp_medicine_set = reception.diagnosis.medicinemanager_set.all()
                for tmp_medicine in tmp_medicine_set:
                    if tmp_medicine.medicine.medicine_class_id is 31:
                        general.append({
                            'code':tmp_medicine.medicine.code,
                            'value':tmp_medicine.medicine.name + ' x ' + str(tmp_medicine.days * tmp_medicine.amount),
                            })
                    else:
                        medi.append({
                            'code':tmp_medicine.medicine.code,
                            'value':tmp_medicine.medicine.name + ' x ' + str(tmp_medicine.days * tmp_medicine.amount),
                            })


            else:
                if filter_general != '':
                    if 'E' in filter_general:
                        tmp_exam_set = reception.diagnosis.exammanager_set.all()
                        res = True
                        for tmp_exam_data in tmp_exam_set:
                            if 'E_NEW' in filter_general:
                                if 'New' not in tmp_exam_data.exam.name:
                                    res = False
                            elif 'E_REP' in filter_general:
                                if 'Rep' not in tmp_exam_data.exam.name:
                                    res = False
                            elif 'E_DNT' in filter_general:
                                if 'Ora' not in tmp_exam_data.exam.name:
                                    res = False
                            else:
                                tmp_exam = ExamFee.objects.get(code = filter_general)
                                if tmp_exam.code not in tmp_exam_data.exam.code:
                                    res = False
                            
                            if res:
                                general.append({
                                    'code':tmp_exam_data.exam.code,
                                    'value':tmp_exam_data.exam.name
                                    })
                                total_payment += tmp_exam_data.exam.get_price(reception.recorded_date)
                        if res is False or tmp_exam_set.count()==0:
                            continue
                                

                    elif 'MR' in filter_general:
                        tmp_exam = ExamFee.objects.get(code = filter_general)
                        tmp_exam_set = reception.diagnosis.exammanager_set.filter(exam_id = tmp_exam.id)
                        if tmp_exam_set.count() == 0:
                            continue
                        for tmp_exam_data in tmp_exam_set:
                            general.append({
                                'code':tmp_exam_data.exam.code,
                                'value':tmp_exam_data.exam.name
                                })
                            total_payment += tmp_exam_data.exam.get_price(reception.recorded_date)

                    elif 'M' in filter_general:
                        tmp_medicine = Medicine.objects.get(code = filter_general)
                        tmp_medi_set = reception.diagnosis.medicinemanager_set.filter(medicine_id = tmp_medicine.id)

                        if tmp_medi_set.count() == 0:
                            continue
                        for tmp_medi_data in tmp_medi_set:
                            general.append({
                                'code':tmp_medi_data.medicine.code,
                                'value':tmp_medi_data.medicine.name + ' x ' + str(tmp_medi_data.days * tmp_medi_data.amount),
                                })
                            total_payment += tmp_medi_data.medicine.get_price(reception.recorded_date) * tmp_medi_data.days * tmp_medi_data.amount

                    else: #P D G R U O OB
                        tmp_precedure = Precedure.objects.get(code = filter_general)
                        tmp_precedure_set = reception.diagnosis.preceduremanager_set.filter(precedure_id = tmp_precedure.id)

                        if tmp_precedure_set.count() == 0:
                            continue
                        for tmp_precedure_data in tmp_precedure_set:
                            general.append({
                                    'code':tmp_precedure_data.precedure.code,
                                    'value':tmp_precedure_data.precedure.name
                                    })
                            total_payment += tmp_precedure_data.precedure.get_price(reception.recorded_date)

                if filter_medicine != '':
                    tmp_medicine = Medicine.objects.get(code = filter_medicine)
                    tmp_set = reception.diagnosis.medicinemanager_set.filter(medicine_id = tmp_medicine.id)

                    if tmp_set.count() == 0:
                            continue
                    for tmp_data in tmp_set:
                        medi.append({
                            'code':tmp_data.exam.code,
                            'value':tmp_data.medicine.name + ' x ' + str(tmp_data.days * tmp_data.amount),
                            })
                        total_payment += tmp_precedure_data.precedure.get_price(reception.recorded_date)
                if filter_lab != '':
                    tmp_test = Test.objects.get(code = filter_lab)
                    tmp_set = reception.diagnosis.testmanager_set.filter(test_id = tmp_test.id)
                    if tmp_set.count() == 0:
                            continue
                    for tmp_data in tmp_set:
                        lab.append({
                           'code':tmp_data.exam.code,
                            'value':tmp_data.exam.name
                            })
                        total_payment += tmp_precedure_data.precedure.get_price(reception.recorded_date)
                

            data.update({'general':general})
            data.update({'medi':medi})
            data.update({'lab':lab})
            data.update({'scaling':scaling})
            data.update({'panorama':panorama})

            paid_set = reception.payment.paymentrecord_set.all()
            paid_sum = 0
            
            for paid in paid_set:
                paid_sum += paid.paid

            unpaid_sum = reception.payment.total - paid_sum
        
            if pup == 'Paid':
                if unpaid_sum != 0:
                    continue
            elif pup == 'Unpaid':
                if unpaid_sum == 0:
                    continue

            if filter_general == '' and filter_medicine == '' and filter_lab == '':
                payment_total_total += reception.payment.total
                payment_total_paid += reception.payment.total - unpaid_sum
                payment_total_unpaid += unpaid_sum
                total_payment = reception.payment.total
            else:
                payment_total_total += total_payment
                paid_sum = 0
                unpaid_sum = 0

            data.update({
                'no':reception.id,
                'date':reception.recorded_date.strftime('%d-%b-%y'),
                'Patient':reception.patient.name_kor,
                'patient_eng':reception.patient.name_eng,
                'date_of_birth':str(reception.patient.get_age()) + '/' + reception.patient.get_gender_simple(),
                'address':reception.patient.address,
                'gender':reception.patient.gender,
                'Depart':reception.depart.name,
                'Doctor':reception.doctor.get_name(),

                'paid_by_cash':'',
                'paid_by_card':'',
                'paid_by_remit':'',

                'total' :total_payment,
                'paid':paid_sum,
                'unpaid':unpaid_sum,
                })

            


            pay_records = PaymentRecord.objects.filter(payment = reception.payment)

            for pay_record in pay_records:
                if pay_record.method == 'card':
                    data.update({'paid_by_card':'card'})
                elif pay_record.method == 'cash':
                    data.update({'paid_by_card':'cash'})
                elif pay_record.method == 'remit':
                    data.update({'paid_by_card':'remit'})

            datas.append(data)
        except Diagnosis.DoesNotExist:
            pass

    
    paginator = Paginator(datas, page_context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)
    

    context = {
               'datas':list(paging_data),
               'page_range_start':paging_data.paginator.page_range.start,
               'page_range_stop':paging_data.paginator.page_range.stop,
               'page_number':paging_data.number,
               'has_previous':paging_data.has_previous(),
               'has_next':paging_data.has_next(),

               #for graph
               'days':(date_max - date_min).days +1 ,

               'payment_total_total':payment_total_total,
               'payment_total_paid':payment_total_paid,
               'payment_total_unpaid':payment_total_unpaid,

               }
    
    return JsonResponse(context)

@login_required
def doctor_profit(request):

    page_context = request.POST.get('page_context',10) # 페이지 컨텐츠 
    kwargs = {}
    datas = []

    doctor = request.POST.get('doctor')

    date_start = request.POST.get('start_date')
    date_end = request.POST.get('end_date')


    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)
    
    page = request.POST.get('page',1)
    
    if doctor != '':
        kwargs.update({'doctor_id':doctor})


    context = {}

    if request.user.is_admin or request.user.doctor.depart.name == 'PM' :
        total_amount = 0

        filter_search = request.POST.get('search')

        receptions = Reception.objects.filter(**kwargs ,recorded_date__range = (date_min, date_max), progress = 'done').select_related('payment').filter(payment__progress='paid').order_by("-id")
        
        for reception in receptions:
            exams = []
            precedures = []
            radiographys = []

            data={}
            sub_total = 0
            if filter_search == '':
                tmp_exam_set = reception.diagnosis.exammanager_set.all()
                tmp_precedure_set = reception.diagnosis.preceduremanager_set.all()
            else:
                if 'E' in filter_search:
                    tmp_exam_set = reception.diagnosis.exammanager_set.prefetch_related('exam').filter(exam__code=filter_search)
                    tmp_precedure_set = reception.diagnosis.preceduremanager_set.none()
                elif 'PM' in filter_search:
                    tmp_exam_set = reception.diagnosis.exammanager_set.none()
                    tmp_precedure_set = reception.diagnosis.preceduremanager_set.all().prefetch_related('precedure').filter(precedure__code=filter_search)

                elif 'R' in filter_search:
                    tmp_exam_set = reception.diagnosis.exammanager_set.none()
                    tmp_precedure_set = reception.diagnosis.preceduremanager_set.all().prefetch_related('precedure').filter(precedure__code__icontains='R')

                if tmp_exam_set.count() is 0 and tmp_precedure_set.count() is 0:
                    continue
                
            for tmp_exam in tmp_exam_set:
                    exams.append({
                        'code':tmp_exam.exam.code,
                        'value':tmp_exam.exam.name,
                        })
                    sub_total += tmp_exam.exam.get_price(reception.recorded_date)
                    total_amount += sub_total
            for precedure_set in tmp_precedure_set:
                    if 'R' in precedure_set.precedure.code:
                        radiographys.append({
                            'code':precedure_set.precedure.code,
                            'value':precedure_set.precedure.name,
                            'amount':precedure_set.amount,
                            })
                        sub_total += precedure_set.precedure.get_price(reception.recorded_date)
                        total_amount += sub_total
                    else:
                        precedures.append({
                            'code':precedure_set.precedure.code,
                            'value':precedure_set.precedure.name,
                            })
                        sub_total += precedure_set.precedure.get_price(reception.recorded_date)
                        total_amount += sub_total
                
            data.update({
                'exams':exams,
                'precedures':precedures,
                'radiographys':radiographys,
                
                'subtotal':reception.payment.sub_total if filter_search == '' else sub_total,
                'discount':reception.payment.discounted_amount if filter_search == '' else 0,
                'total':reception.payment.total if filter_search == '' else sub_total,


  
                'no':reception.id,
                'date':reception.recorded_date.strftime('%d-%b-%y'),
                'Patient':reception.patient.name_kor,
                'patient_eng':reception.patient.name_eng,
                'date_of_birth':str(reception.patient.get_age()) + '/' + reception.patient.get_gender_simple(),
                'address':reception.patient.address,
                'gender':reception.patient.gender,
                'Depart':reception.depart.name,
                'Doctor':reception.doctor.get_name(),
                })

            
            datas.append(data)

        context.update({
            'total_amount':total_amount,
            })
    else:
        filter_exam_fee = request.POST.get('exam_fee')
        filter_test = request.POST.get('test')
        filter_precedure = request.POST.get('precedure')
        filter_medicine = request.POST.get('medicine')

        pup =request.POST.get('pup')
        paid_by = request.POST.get('paid_by')


        receptions = Reception.objects.filter(**kwargs ,recorded_date__range = (date_min, date_max), progress = 'done').select_related('payment').filter(payment__progress='paid').order_by("-id")

        
        
        amount_exam_fee = 0
        amount_test = 0
        amount_precedure = 0
        amount_medicine = 0

        
        
        for reception in receptions:
            data = {}
            try:
                exam_fee = []
                test = []
                precedure = []
                medi = []

                
                #필터링 없을 때
                if filter_exam_fee == '' and filter_test == '' and filter_precedure == '' and filter_medicine=='':
                   
                    tmp_exam_set = reception.diagnosis.exammanager_set.all()
                    for tmp_exam in tmp_exam_set:
                        exam_fee.append({
                            'code':tmp_exam.exam.code,
                            'value':tmp_exam.exam.name
                            })

                    tmp_test_set = reception.diagnosis.testmanager_set.all()
                    for tmp_test in tmp_test_set:
                        test.append({
                            'code':tmp_test.test.code,
                            'value':tmp_test.test.name,
                            })

                    tmp_precedure_set = reception.diagnosis.preceduremanager_set.all()
                    for tmp_precedure in tmp_precedure_set:
                        precedure.append({
                            'code':tmp_precedure.precedure.code,
                            'value':tmp_precedure.precedure.name
                            })
            

                    tmp_medicine_set = reception.diagnosis.medicinemanager_set.all()
                    for tmp_medicine in tmp_medicine_set:
                        medi.append({
                            'code':tmp_medicine.medicine.code,
                            'value':tmp_medicine.medicine.name + ' x ' + str(tmp_medicine.days * tmp_medicine.amount),
                            })

                paid_set = reception.payment.paymentrecord_set.all()
                paid_sum = 0
                for paid in paid_set:
                    paid_sum  += paid.paid

                data.update({
                    'no':reception.id,
                    'date':reception.recorded_date.strftime('%d-%m-%Y'),
                    'Patient':reception.patient.name_kor,
                    'patient_eng':reception.patient.name_eng,
                    'date_of_birth':str(reception.patient.get_age()) + '/' + reception.patient.get_gender_simple(),
                    'address':reception.patient.address,
                    'gender':reception.patient.gender,
                    'Depart':reception.depart.name,
                    'Doctor':reception.doctor.get_name(),

                    'list_exam_fee':exam_fee,
                    'list_test':test,
                    'list_precedure':precedure,
                    'list_medi':medi,

                    'paid_by_cash':'',
                    'paid_by_card':'',
                    'paid_by_remit':'',

                    'sub_total':reception.payment.sub_total,
                    'total' :reception.payment.total,
                    'discount':reception.payment.discounted_amount,
                    })


                for pay_record in paid_set:
                    if pay_record.method == 'card':
                        data.update({'paid_by_card':'card'})
                    elif pay_record.method == 'cash':
                        data.update({'paid_by_card':'cash'})
                    elif pay_record.method == 'remit':
                        data.update({'paid_by_card':'remit'})

                datas.append(data)
            except Diagnosis.DoesNotExist:
                pass


        if (date_max - date_min).days == 0:  #단일 날짜는 당일을 Subtotal / 선택된 달의 금액을 Total
             first_day = datetime.datetime.strptime(date_start, "%Y-%m-%d").date().replace(day=1)
             last_day = (first_day + relativedelta.relativedelta(months=1)) - datetime.timedelta(seconds=1)
             
             receptions = Reception.objects.filter(**kwargs ,recorded_date__range = (first_day, last_day), progress = 'done').order_by("-id").select_related('payment')
             monthly_total = 0
             for reception in receptions:
                 monthly_total += reception.payment.total
             context.update({
                'monthly_total':monthly_total,
                })
        #else: #범위 날짜는 SubTotal 무시 /범위 계산을 Total로

    query_total = Reception.objects.filter(**kwargs ,recorded_date__range = (date_min, date_max), progress = 'done').select_related('payment').filter(payment__progress='paid')


    
    query_total = receptions.aggregate(
        amount_sub_total=Sum('payment__sub_total'),
        amount_discount = Sum('payment__discounted_amount'),
        amount_total = Sum('payment__total'),
        )

    context.update({
        'amount_sub_total':query_total['amount_sub_total'] if query_total['amount_sub_total'] is not None else 0,
        'amount_discount':query_total['amount_discount'] if query_total['amount_discount'] is not None else 0,
        'amount_total':query_total['amount_total'] if query_total['amount_total'] is not None else 0,
        })
    

    paginator = Paginator(datas, page_context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)
    

    context.update({
                'datas':list(paging_data),
                'page_range_start':paging_data.paginator.page_range.start,
                'page_range_stop':paging_data.paginator.page_range.stop,
                'page_number':paging_data.number,
                'has_previous':paging_data.has_previous(),
                'has_next':paging_data.has_next(),

                #for graph
                'days':(date_max - date_min).days +1 ,


                })
    return JsonResponse(context)



def search_medicine(request):
    filter = request.POST.get('filter')
    string = request.POST.get('string')

    date_start = request.POST.get('start_end_date').split(' - ')[0]
    date_end = request.POST.get('start_end_date').split(' - ')[1]

    date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)

    
    #if filter != '':
    #    kwargs.update({'depart_id':depart})


    datas_dict= {}
    receptions = Reception.objects.filter(recorded_date__range = (date_min, date_max), progress = 'done').order_by("-id")
    for reception in receptions:
        if hasattr(reception,'diagnosis'):
            medicine_manager_set = MedicineManager.objects.filter(diagnosis_id = reception.diagnosis.id)
            for medicine_manager in medicine_manager_set:
                medicine = Medicine.objects.get(pk = medicine_manager.medicine_id)
            
                if medicine.code in datas_dict.keys():
                    datas_dict[medicine.code]['sales'] += medicine_manager.amount * medicine_manager.days
                    datas_dict[medicine.code]['total_salse'] += medicine_manager.amount * medicine_manager.days * medicine.get_price(reception.recorded_date)

                else:
                    datas_dict.update({
                        medicine.code:{
                            'code':medicine.code,
                            'name':medicine.name,
                            'ingredient':'' if medicine.ingredient is None else medicine.ingredient,
                            'company':'' if medicine.company is None else medicine.company,
                            'count':medicine.inventory_count,
                            'price':medicine.get_price(reception.recorded_date),
                            'sales' : medicine_manager.amount * medicine_manager.days,
                            'total_salse' : medicine_manager.amount * medicine_manager.days * medicine.get_price(reception.recorded_date)
                            }
                        })

        
    id = 1
    total_amount = 0
    datas=[]
    datas_dict_sorted = sorted(datas_dict.items())
    for data_dict in datas_dict_sorted:
        data_dict[1].update({
            'id':id,
            })
        datas.append(data_dict)
        total_amount += data_dict[1]['total_salse']
        id += 1

    page = request.POST.get('page',1)
    page_context = request.POST.get('context_in_page',10)

    paginator = Paginator(datas, page_context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)
    

    context = {
            'datas':list(paging_data),
            'total_amount':total_amount,

            'page_range_start':paging_data.paginator.page_range.start,
            'page_range_stop':paging_data.paginator.page_range.stop,
            'page_number':paging_data.number,
            'has_previous':paging_data.has_previous(),
            'has_next':paging_data.has_next(),
        }

    return JsonResponse(context)


@login_required
def temp_doctor_audit(request):
    doctor_search_form = DoctorsSearchForm()

    
    list_exam_fee = []
    list_precedures = []
    list_radiologys = []


    exam_fees = ExamFee.objects.filter(Q(code = 'E0010') | Q(code = 'E0011'))
    for exam_fee in exam_fees:
        list_exam_fee.append({'code':exam_fee.code,'value':exam_fee.name})

    precedures = Precedure.objects.filter(code__contains='PM')
    for precedure in precedures:
        list_precedures.append({'code':precedure.code,'value':precedure.name})

    radiologys = Precedure.objects.filter(code__contains='R', precedure_class_id = 10 )
    for radiology in radiologys:
        list_radiologys.append({'code':radiology.code,'value':radiology.name})

    return render(request,
    'Doctor/audit_PM.html',
        {
            'doctor_search':doctor_search_form,

            'list_exam_fee':list_exam_fee,
            'list_precedures':list_precedures,
            'list_radiologys':list_radiologys,

        }
    )


def search_patient(request):


    return JsonResponse(context)



def inventory_test(request):
    class_datas=[]
    test_class = TestClass.objects.all()
    for tmp_class in test_class:
        class_datas.append({
            'id':tmp_class.id,
            'name': tmp_class.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
            })


    return render(request,
    'Manage/inventory_test.html',
            {
                'test_class':class_datas,
            },
        )



def test_search(request):
    string = request.POST.get('string')
    filter = request.POST.get('filter')
    class_id = request.POST.get('class_id')

    kwargs = {}
    if class_id != '':
        kwargs.update({
            'test_class_id':class_id,
            })

    argument_list = [] 
    if string !='':
        argument_list.append( Q(**{'name__icontains':string} ) )
        argument_list.append( Q(**{'name_vie__icontains':string} ) )
   


    if string == '' :
        query_datas = Test.objects.filter(**kwargs).select_related('test_class').exclude(use_yn = 'N').order_by("name")
    #elif filter == 'name':
    #    query_datas = Test.objects.filter( Q(name__icontains = string) | Q(name_vie__icontains = string)).select_related('test_class').exclude(use_yn = 'N').order_by("name")
    else:
        query_datas = Test.objects.filter(functools.reduce(operator.or_, argument_list),**kwargs).select_related('test_class').exclude(use_yn = 'N').order_by("name")


    datas=[]
    for query_data in query_datas:
        data = {
                'id' : query_data.id,
                'code': query_data.code,
                'name' : query_data.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                'class':query_data.test_class.name,
                'price' : query_data.get_price(),
                'price_dollar' : query_data.get_price_dollar(),
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


def test_add_edit_get(request):
    id = request.POST.get('id');

    test = Test.objects.get(id=id)


    return JsonResponse({
        'id':test.id,
        'name':test.name,
        'name_vie':test.name_vie,
        'price':test.get_price(),
        'price_dollar':test.get_price_dollar(),
        'precedure_class_id':test.test_class_id,
        'result':True,
        })


def test_add_edit_set(request):
    id = request.POST.get('id');
    type = request.POST.get('type');
    test_class = request.POST.get('test_class');
    name = request.POST.get('name');
    name_vie = request.POST.get('name_vie');
    price = request.POST.get('price');
    price_dollar = request.POST.get('price_dollar');

    if int(id) == 0 :
        data = Test()
        data.price = price
        

        last_code = Test.objects.last()
        test_class = int(test_class)
        CODE = 'L'
            
        if last_code == None:
           data.code = CODE + str('0001')
        else:
            temp_code = last_code.code.split(CODE)
            data.code = CODE + str('%04d' % (int(temp_code[1]) + 1))
    else:
        data = Test.objects.get(id=id)
        now = datetime.datetime.now()
        now = now - datetime.timedelta(seconds = 1) 
        str_now = now.strftime('%Y%m%d%H%M%S')
        try: 
            old_price = Pricechange.objects.get(type="Test",country='VI',type2='OUTPUT',code=data.code, date_end="99999999999999")
            
            if old_price.price != int(price):
                old_price.date_end = str_now
                old_price.save()

                new_price = Pricechange(type="Test",country='VI',type2='OUTPUT',code=data.code)
                new_price.price = price
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price):
                new_price = Pricechange(type="Test",country='VI',type2='OUTPUT',code=data.code)
                new_price.price = price
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()
                
        try:
            old_price_dollar = Pricechange.objects.get(type="Test",country='US',type2='OUTPUT',code=data.code, date_end="99999999999999")
            
            if old_price_dollar.price != int(price_dollar):
                old_price_dollar.date_end = str_now
                old_price_dollar.save()

                new_price = Pricechange(type="Test",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price_dollar):
                new_price = Pricechange(type="Test",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

    data.test_class_id = test_class
    data.name = name
    data.name_vie = name_vie
    data.save()


    return JsonResponse({
        'result':True,
        })



    return JsonResponse({})

def test_add_edit_delete(request):

    id = request.POST.get('id')
    test = Test.objects.get(id=id)
    test.use_yn = 'N'
    test.save()

    return JsonResponse({
        'result':True,
        })


def inventory_precedure(request):

    class_datas=[]
    precedure_class = PrecedureClass.objects.all()
    for tmp_class in precedure_class:
        class_datas.append({
            'id':tmp_class.id,
            'name': tmp_class.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
            })


    return render(request,
    'Manage/inventory_precedure.html',
            {
                'precedure_class':class_datas,
            },
        )


def precedure_search(request):
    string = request.POST.get('string')
    filter = request.POST.get('filter')
    class_id = request.POST.get('class_id')

    kwargs = {}
    if class_id != '':
        kwargs.update({
            'precedure_class_id':class_id,
            })

    argument_list = [] 
    if string !='':
        argument_list.append( Q(**{'name__icontains':string} ) )
        argument_list.append( Q(**{'name_vie__icontains':string} ) )
   


    if string == '' :
        query_datas = Precedure.objects.filter(**kwargs).select_related('precedure_class').exclude(use_yn = 'N').order_by("name")
    #elif filter == 'name':
    #    query_datas = Test.objects.filter( Q(name__icontains = string) | Q(name_vie__icontains = string)).select_related('test_class').exclude(use_yn = 'N').order_by("name")
    else:
        query_datas = Precedure.objects.filter(functools.reduce(operator.or_, argument_list),**kwargs).select_related('precedure_class').exclude(use_yn = 'N').order_by("name")



    datas=[]
    for query_data in query_datas:
        data = {
                'id' : query_data.id,
                'code': query_data.code,
                'name' : query_data.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                'class':query_data.precedure_class.name,
                'price' : query_data.get_price(),
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

def precedure_add_edit_get(request):
    id = request.POST.get('id');

    precedure = Precedure.objects.get(id=id)


    return JsonResponse({
        'id':precedure.id,
        'name':precedure.name,
        'name_vie':precedure.name_vie,
        'price':precedure.get_price(),
        'price_dollar':precedure.get_price_dollar(),
        'precedure_class_id':precedure.precedure_class_id,
        'result':True,
        })


def precedure_add_edit_set(request):
    id = request.POST.get('id');
    type = request.POST.get('type');
    precedure_class = request.POST.get('precedure_class');
    name = request.POST.get('name');
    name_vie = request.POST.get('name_vie');
    price = request.POST.get('price');
    price_dollar = request.POST.get('price_dollar');

    if int(id) == 0 :
        data = Precedure()
        data.price = price
        data.price_dollar = price_dollar
        

        last_code = Precedure.objects.filter(precedure_class_id=precedure_class).last()
        precedure_class = int(precedure_class)
        if precedure_class ==1: #D
            CODE = 'D'
        elif precedure_class == 2: #CT
            CODE = 'CT'
        elif precedure_class == 3: #ENT
            CODE = 'E'
        elif precedure_class == 4: #GE
            CODE = 'GE'
        elif precedure_class == 5: #Radi
            CODE = 'R'
        elif precedure_class == 6: #U
            CODE = 'U'
        elif precedure_class == 7: #P
            CODE = 'P'
        elif precedure_class == 8: #T
            CODE = 'T'
        elif precedure_class == 10: #PM
            CODE = 'PM'
        elif precedure_class >= 11 or precedure_class <= 30 or precedure_class == 9: #: #DERM
            CODE = 'DM'
        elif precedure_class >= 31 or precedure_class <=40 or precedure_class == 42: #PS
            CODE = 'PS'
        elif precedure_class == 41: #MRI
            CODE = 'MRI'
        elif precedure_class == 44: #IM
            CODE = 'IM'

        if last_code == None:
           data.code = CODE + str('0001')
        else:
            temp_code = last_code.code.split(CODE)
            data.code = CODE + str('%04d' % (int(temp_code[1]) + 1))

    else:
        data = Precedure.objects.get(id=id)
        str_now = datetime.datetime.now().strftime('%Y%m%d%H%M%S')

        try: 
            old_price = Pricechange.objects.get(type="Precedure",country='VI',type2='OUTPUT',code=data.code, date_end="99999999999999")
            
            if old_price.price != int(price):
                old_price.date_end = str_now
                old_price.save()

                new_price = Pricechange(type="Precedure",country='VI',type2='OUTPUT',code=data.code)
                new_price.price = price
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price):
                new_price = Pricechange(type="Precedure",country='VI',type2='OUTPUT',code=data.code)
                new_price.price = price
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()
                
        try:
            old_price_dollar = Pricechange.objects.get(type="Precedure",country='US',type2='OUTPUT',code=data.code, date_end="99999999999999")
            
            if old_price_dollar.price != int(price_dollar):
                old_price_dollar.date_end = str_now
                old_price_dollar.save()

                new_price = Pricechange(type="Precedure",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

        except Pricechange.DoesNotExist:
            if data.price != int(price_dollar):
                new_price = Pricechange(type="Precedure",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()

    data.precedure_class_id = precedure_class
    data.name = name
    data.name_vie = name_vie
    data.save()


    return JsonResponse({
        'result':True,
        })


def precedure_add_edit_delete(request):
    id = request.POST.get('id')
    precedure = Precedure.objects.get(id=id)
    precedure.use_yn = 'N'
    precedure.save()

    return JsonResponse({
        'result':True,
        })




def medicine_search(request):
    string = request.POST.get('string')
    filter = request.POST.get('filter')
    class_id = request.POST.get('class_id')
    

    kwargs = {}
    if class_id != '':
        kwargs.update({
            'medicine_class_id':class_id,
            'type':"TOOL",
            })

    
    datas=[]
    if string == '':
        argument_list_expriry_date = []
        argument_list_expriry_date.append( Q(**{'medicine__code__icontains':'T'} ) )

        expiry_date = datetime.datetime.now() + datetime.timedelta(days=180)
        #medicine_tmp = MedicineLog.objects.filter(type='add',expiry_date__lte = expiry_date ).select_related('medicine').exclude(medicine__use_yn='N' ,expiry_date=None,tmp_count=0).order_by('expiry_date')
        medicine_tmp= MedicineLog.objects.filter( medicine__type="TOOL", type='add', expiry_date__lte = expiry_date, tmp_count__gte= 0 ).select_related('medicine').values(
            'medicine_id',
            ).annotate(Count('medicine_id')).order_by('expiry_date')
       
        #medicine_tmp = MedicineLog.objects.filter( type='add', expiry_date__lte = expiry_date).exclude(tmp_count__lt = 0,medicine__use_yn='N',expiry_date=None).order_by('expiry_date').select_related('medicine')
        for tmp in medicine_tmp:
            medicine = Medicine.objects.get(id = tmp['medicine_id'])
            data = {
                    'id' : medicine.id,
                    'code': medicine.code,
                    'name' : medicine.name,
                    'company' : '' if medicine.company is None else medicine.company,
                    'unit' : '' if medicine.get_unit_lang(request.session[translation.LANGUAGE_SESSION_KEY]) is None else medicine.get_unit_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                    'price' : medicine.get_price(),
                    'count' : medicine.inventory_count,
                    'alaert_expiry':True,
                }
            datas.append(data)
            
        medicines = Medicine.objects.filter(**kwargs, type="TOOL").exclude(use_yn='N').order_by('name')
    else:
        argument_list = [] 
        #argument_list = [] 
        argument_list.append( Q(**{'name__icontains':string} ) )
        argument_list.append( Q(**{'name_vie__icontains':string} ) )
        argument_list.append( Q(**{'name_display__icontains':string} ) )

        medicines = Medicine.objects.filter(functools.reduce(operator.or_, argument_list),**kwargs,type="TOOL").exclude(use_yn='N').order_by("name")#.select_related('medicine_class').exclude(use_yn = 'N').order_by("name")



    
    for medicine in medicines:
        data = {
                'id' : medicine.id,
                'code': medicine.code,
                'name' : medicine.name,
                'company' : '' if medicine.company is None else medicine.company,
                'unit' : '' if medicine.get_unit_lang(request.session[translation.LANGUAGE_SESSION_KEY]) is None else medicine.get_unit_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
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

def inventory_medical_tool(request):
    medicine_search_form = MedicineSearchForm()

    price_multiple_level = COMMCODE.objects.filter(commcode_grp = 'MED_MULTI_CODE').values('commcode','se1','se2').order_by('commcode_grp')


    if request.session[translation.LANGUAGE_SESSION_KEY] == 'vi':
        medicine_class = MedicineClass.objects.all().annotate(name_display = F('name_vie')).values('id','name_display')
    else:
        medicine_class = MedicineClass.objects.all().annotate(name_display = F('name')).values('id','name_display')

    type = ["Medical Tool"]
    

    return render(request,
    'Manage/inventory_medical_tool.html',
            {
                'medicinesearch':medicine_search_form,
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
            'unit':medicine.unit,
            'unit_vie':medicine.unit_vie,
            'company':medicine.company,

            'type':'Medical Tool' if 'T' in medicine.code else 'Medical Tool',

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
    unit = request.POST.get('unit')
    unit_vie = request.POST.get('unit_vie')
    company = request.POST.get('company')
    price_input = request.POST.get('price_input')
    multiple_level = request.POST.get('multiple_level')
    price = request.POST.get('price')   
    price_dollar = request.POST.get('price_dollar')

    if int(id) == 0 :
        data = Medicine()
        if type in 'Medical Tool':
            last_code =Medicine.objects.filter(code__icontains="T").last()
            temp_code = last_code.code.split('T')
            code = 'T' + str('%04d' % (int(temp_code[1]) + 1))

        data.code = code
        data.price = int(price)
        data.price_input = int(price_input)
        data.price_dollar = int(price_dollar)
        data.type = 'TOOL'
       
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
            if data.price_input != int(price_input):
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
            if data.price_dollar != int(price_dollar):
                new_price = Pricechange(type="Medicine",country='US',type2='OUTPUT',code=data.code)
                new_price.price = price_dollar
                new_price.date_start = str_now
                new_price.date_end = "99999999999999"
                new_price.save()


    data.medicine_class_id = medicine_class
    data.name = name
    data.name_vie = name_vie
    data.unit = unit
    data.unit_vie = unit_vie
    data.company = company
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
    except Medicine.DoesNotExist:
        res = "Y"

    context = {'result':res}

    return JsonResponse(context)


def medicine_add_edit_delete(request):
    id = request.POST.get('id')

    medicine = Medicine.objects.get(id=id)
    medicine.use_yn = 'N'
    medicine.save()

    log = MedicineLog()
    log.medicine = medicine
    log.type='del'
    log.save()



    return JsonResponse({'result':True})

def get_inventory_history(request):
    id = request.POST.get('id')
    date = request.POST.get('date')


    #date_min = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.min)
    #date_max = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.max)

    #medicine_logs = MedicineLog.objects.filter(date__range = (date_min, date_max), medicine_id = id).values('date','changes','type','memo').order_by('-date')
    medicine_logs = MedicineLog.objects.filter(medicine_id = id).values('date','changes','type','memo').order_by('-date')
    datas = []
    for medicine_log in medicine_logs:
        data = {
            'date':medicine_log['date'].strftime('%Y-%m-%d %H:%M:%S'),
            'changes':medicine_log['changes'],
            'type':medicine_log['type'],
            'memo':'' if medicine_log['memo'] is None else medicine_log['memo'],
            }
        datas.append(data)

    medicine = Medicine.objects.get(id=id)
    return JsonResponse({
        'datas':datas,
        'count':medicine.inventory_count,
        })

def save_database_add_medicine(request):
    id = request.POST.get('id')
    registration_date= request.POST.get('registration_date')
    expiry_date= request.POST.get('expiry_date')
    changes= request.POST.get('changes')
    memo= request.POST.get('memo')
    check= request.POST.get('check')
    
    if int(check)==0 :
        medicine = Medicine.objects.get(id=id)
        count = medicine.inventory_count
        medicine.inventory_count =  count + int(changes)
        medicine.save()

        medicine_logs = MedicineLog()
        medicine_logs.changes = changes
        medicine_logs.medicine = medicine
    else:
        medicine_logs = MedicineLog.objects.get(id = check)
        medicine_logs.date = datetime.datetime.strptime(registration_date, '%Y-%m-%d')

    medicine_logs.memo = memo
    if expiry_date != '' :
        medicine_logs.expiry_date = datetime.datetime.strptime(expiry_date, '%Y-%m-%d')
    
 
    medicine_logs.tmp_count = changes
    medicine_logs.type='add'
    medicine_logs.save()


    return JsonResponse({'result':True})


def get_expiry_date(request):

    id = request.POST.get('id')
    medicine = Medicine.objects.get(id=id)

    medicine_logs = MedicineLog.objects.filter(medicine = medicine, type='add').exclude(tmp_count__lte = 0).order_by('expiry_date').values('id','date','tmp_count','expiry_date')
    
    datas = []
    for medicine_log in medicine_logs:
        
        data = {
            'id':medicine_log['id'],
            'date':medicine_log['date'].strftime('%Y-%m-%d'),
            'expiry_date':0 if medicine_log['expiry_date'] is None else medicine_log['expiry_date'].strftime('%Y-%m-%d'),
            'tmp_count':medicine_log['tmp_count'] if medicine_log['tmp_count'] is not None else 0,
            }
        datas.append(data)

    return JsonResponse({
        'result':True,
        'datas':datas,
        })


def get_edit_database_add_medicine(request):
    id = request.POST.get('id')

    data = MedicineLog.objects.values('id','date','expiry_date','memo','tmp_count').get(id=id)

    return JsonResponse({
        'result':True,
        'data':{
            'id':data['id'],
            'date':data['date'].strftime('%Y-%m-%d'),
            'expiry_date':'' if data['expiry_date'] is None else data['expiry_date'].strftime('%Y-%m-%d'),
            'memo':data['memo'],
            'tmp_count':data['tmp_count'],
            },
        })


def save_database_disposal_medicine(request):
    id = request.POST.get('id')
    disposial = request.POST.get('disposial')
    memo = request.POST.get('memo')


    disposal_data = MedicineLog.objects.get(id=id)
    if disposal_data.tmp_count < int(disposial):
        return JsonResponse({
            'result':False,
            'msg':1, # tmp 카운트가 더 적을 경우
                             })
    else:
        medicine = Medicine.objects.get(id = disposal_data.medicine_id)
        disposal_data.tmp_count -= int(disposial)
        
        disposal_data.save()

        medicine_log = MedicineLog()
        medicine_log.type = 'dec'
        medicine_log.changes = disposial
        medicine_log.memo = memo
        medicine_log.medicine_id = disposal_data.medicine_id
        medicine_log.save()

        
        medicine.inventory_count -= int(disposial)
        medicine.save()



    return JsonResponse({'result':True,})


@login_required
def board_list(request,id=None):

    #content
    
    content = None;
    if id is not None:
        try:
            read_page = Board_Contents.objects.get(id = id )
            content = {
                'id':read_page.id,
                'title':read_page.title,
                'contents':read_page.contents,
                }
        except Board_Contents.DoesNotExist:
            content = None;



        #댓글



    #search filter
    kwargs = {}
    kwargs['use_yn'] = 'Y' # 기본 



    contents_list = []
    query = Board_Contents.objects.filter(**kwargs)
    for item in query:
        creator = User.objects.get(id= int(item.creator))
        contents_list.append({
            'id':item.id,
            'title':item.title,
            'creator':creator.email,
            'date':item.created_date.strftime('%Y-%m-%d %H:%M'),
            })

    return render(request,
        'board/list.html',
            {
                'content':content,
                'contents_list':contents_list,
            }
        )




@login_required
def board_create_edit(request,id=None):

    
    #language
    lang = ''
    if request.session[translation.LANGUAGE_SESSION_KEY] == 'vi':
        lang = 'vi-VN'
    elif request.session[translation.LANGUAGE_SESSION_KEY] == 'ko':
        lang = 'ko-KR'
    else:
        lang = 'en-US'


    if id is None:
        load_contents = Board_Contents()
        form = board_form()

        load_contents.creator = request.user.id
    else:
        load_contents = Board_Contents.objects.get(id = id)
        form = board_form(instance = load_contents)
    
    if request.method == 'POST':
        form = board_form(request.POST)
        
        if form.is_valid():
            load_contents.title = form.cleaned_data['title']
            load_contents.contents = form.cleaned_data['contents']
            
            load_contents.lastest_modifier = request.user.id
            load_contents.lastest_modified_date = datetime.datetime.now()
            

            load_contents.save()
            if id is None:
                return HttpResponseRedirect('./../' + str(load_contents.pk))
            else:
                return HttpResponseRedirect('./../../' + str(load_contents.pk))
        else:
            form = board_form(instance=profile)


    return render(request,
        'board/create_edit.html',
            {
                'form':form,
                'lang':lang,
            }
        )



@login_required
def board_delete(request,id):

    try:
        content = Board_Contents.objects.get(id = id)
        content.use_yn = 'N'
        content.save()

    except Board_Contents.DoesNotExist:
        pass


    return HttpResponseRedirect('./../')



def board_comment_get(request):
    content_id = request.POST.get('content_id')


    #set user data
    user_dict = {}
    users = User.objects.all().values('id','email')
    for user in users:
        user_dict[user['id']] = user['email']



    list_comment = []
    query = Board_Comment.objects.filter(content_id = content_id,use_yn = 'Y').order_by('orderno').values()
    
   
    for data in query:
        type(data['creator'])
        list_comment.append({
            'id':data['id'],
            'user_id':data['creator'],
            'user':user_dict[ int(data['creator']) ],
            'comment':data['comment'],
            'datetime':data['created_date'],
            'depth':data['depth'],
            })

    return JsonResponse({
        'result':True,
        'list_comment':list_comment,
        })


def board_comment_set_seq(input_data):
    



    return

def board_comment_add(request,comment_id=None):
    content_id = request.POST.get('content_id')
    comment = request.POST.get('comment',None)
    upper_id = request.POST.get('upper_id',None)


    new_comment = Board_Comment()




    if upper_id != '':#대댓글
        upper = Board_Comment.objects.get(pk = upper_id)
        new_comment.depth = upper.depth + 1
        
        try:
            check = Board_Comment.objects.filter(content_id = content_id, orderno__gt = upper.orderno, depth__lte = upper.depth,).order_by('orderno')[:1]
            print(check)
            new_comment.orderno = check[0].orderno
        except IndexError:
            print('indexError')
            check = Board_Comment.objects.filter(content_id = content_id, ).order_by('-orderno')[:1]
            print(check)
            new_comment.orderno = check[0].orderno + 1
        

        #저장 전 sequence 자리 비우기
        query_set = Board_Comment.objects.filter(content_id = content_id, orderno__gte = new_comment.orderno ,).order_by('orderno')
        print(query_set)
        for query in query_set:
            query.orderno += 1
            
            query.save()

          
    else:#첫번째 뎁스 댓글
        check = Board_Comment.objects.filter(content_id = content_id, ).order_by('orderno')
        print(check.count())
        if check.count() != 0:
            check_last = check.last()
            new_comment.orderno = check_last.orderno + 1




    new_comment.content_id = content_id
    new_comment.comment = comment
    new_comment.creator = request.user.id


    new_comment.save()

    return JsonResponse({
        'result':True,
        })


def board_comment_edit(request,id):



    return JsonResponse({
        'result':True,
        })


def board_comment_delete(request,id):#Comment ID
    content_id = request.POST.get('content_id')

    comment = Board_Comment.objects.get(id=id)
    comment.use_yn = 'N'
    comment.save()


    return JsonResponse({
        'result':True,
        })


