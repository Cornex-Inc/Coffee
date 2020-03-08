from django.shortcuts import render
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Count, Sum


from .forms import *
from Receptionist.models import *
from Doctor.models import *

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

    page_context = 10 # 페이지 컨텐츠 
    kwargs = {}
    datas = []

    doctor = request.POST.get('doctor')

    date_start = request.POST.get('start_end_date').split(' - ')[0]
    date_end = request.POST.get('start_end_date').split(' - ')[1]


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

            for precedure_set in tmp_precedure_set:
                    if 'R' in precedure_set.precedure.code:
                        radiographys.append({
                            'code':precedure_set.precedure.code,
                            'value':precedure_set.precedure.name,
                            'amount':precedure_set.amount,
                            })
                        sub_total += precedure_set.precedure.get_price(reception.recorded_date)
                    else:
                        precedures.append({
                            'code':precedure_set.precedure.code,
                            'value':precedure_set.precedure.name,
                            })
                        sub_total += precedure_set.precedure.get_price(reception.recorded_date)
                
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
                    query_total = Reception.objects.filter(**kwargs ,recorded_date__range = (date_min, date_max), progress = 'done').select_related('payment').filter(payment__progress='paid').annotate(
                        sub_total=Sum('payment__sub_total'),
                        discount=Sum('payment__discounted_amount'),
                        total=Sum('payment__total')).values('sub_total','discount','total')
                    query_total['sub_total']
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


        context.update({
            'amount_sub_total':query_total.sub_total,
            'amount_discount':query_total.discount,
            'amount_total':query_total.total,
            })
    
    

        
      
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