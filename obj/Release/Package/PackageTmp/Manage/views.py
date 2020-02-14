from django.shortcuts import render
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage

from django.http import JsonResponse

from .forms import *
from Receptionist.models import *
from Doctor.models import *

# Create your views here.
def manage(request):

    payment_search_form = PaymentSearchForm()
    doctor_search_form = DoctorsSearchForm()


    patient_search_form = PatientSearchForm()
    medicine_search_form = MedicineSearchForm()

    
    #filters
    general = []
    lab = []
    medi = []
    scaling = []
    panorama = []
    
    exams = ExamFee.objects.all()
    for exam in exams:
        if exam.doctor is None:
            general.append({exam.code:exam.name})
        else:
            general.append({exam.code:exam.name + exam.doctor.name_kor})
    
    tests = Test.objects.all()
    for test in tests:
        lab.append({test.code:test.name})

    precedures = Precedure.objects.all()
    for precedure in precedures:
        if 'scaling' in precedure.name.lower():
            scaling.append({precedure.code:precedure.name})
        elif 'injection' in precedure.name.lower():
            general.append({precedure.code:precedure.name})
        elif 'panorama' in precedure.name.lower():
            panorama.append({precedure.code:precedure.name})
        else:
            general.append({precedure.code:precedure.name})

    medicines = Medicine.objects.all()
    for medicine in medicines:
        if medicine.name is None:
            if 'injection' in medicine.name_vie.lower():
                general.append({medicine.code:medicine.name_vie})
            else:
                medi.append({medicine.code:medicine.name_vie})
        else:
            if 'injection' in medicine.name.lower():
                general.append(medicine.name)
            else:
                medi.append(medicine.name)



    return render(request,
        'Manage/manage.html',
            {
                'payment_search':payment_search_form,
                'patient_search':patient_search_form,
                'doctor_search':doctor_search_form,
                'doctors':Doctor.objects.all(),
                'medicine_search':medicine_search_form,

                'general_list':general,
                'lab_list':lab,
                'medi_list':medi,
                'scaling_list':scaling,
                'panorama_list':panorama,

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
            if filter_general != '':
                try:
                    tmp_exam = ExamFee.objects.get(code = filter_general)
                    tmp_exam_set = reception.diagnosis.exammanager_set.filter(exam_id = tmp_exam.id)
                except ExamFee.DoesNotExist:
                    tmp_exam_set = reception.diagnosis.exammanager_set.filter(exam_id = 0)
                try:
                    tmp_precedure = Precedure.objects.get(code = filter_general)
                    tmp_precedure_set = reception.diagnosis.preceduremanager_set.filter(precedure_id = tmp_precedure.id)
                except Precedure.DoesNotExist:
                    tmp_precedure_set = reception.diagnosis.preceduremanager_set.filter(precedure_id =0)
                try:
                    tmp_edi_smedicine = Medicine.objects.get(code = filter_general)
                    tmp_medi_set = reception.diagnosis.medicinemanager_set.filter(medicine_id = tmp_medicine.id)
                except Medicine.DoesNotExist:
                    tmp_medi_set = reception.diagnosis.medicinemanager_set.filter(medicine_id =0)
                if tmp_exam_set.count() == 0 and tmp_precedure_set.count() == 0 and tmp_medi_set.count()==0:
                    continue

            if filter_medicine != '':
                tmp_medicine = Medicine.objects.get(code = filter_medicine)
                tmp_set = reception.diagnosis.medicinemanager_set.filter(medicine_id = tmp_medicine.id)
                if tmp_set.count() == 0:
                    continue

            if filter_lab != '':
                tmp_test = Test.objects.get(code = filter_lab)
                tmp_set = reception.diagnosis.testmanager_set.filter(test_id = tmp_test.id)
                if tmp_set.count() == 0:
                    continue

            if filter_scaling != '':
                tmp_precedure = Precedure.objects.get(code = filter_scaling)
                tmp_set = reception.diagnosis.preceduremanager_set.filter(precedure_id = tmp_precedure.id)
                if tmp_set.count() == 0:
                    continue
                 
            if filter_panorama != '':
                tmp_precedure = Precedure.objects.get(code = filter_panorama)
                tmp_set = reception.diagnosis.preceduremanager_set.filter(precedure_id = tmp_precedure.id)
                if tmp_set.count() == 0:
                    continue

            general = []
            lab = []
            medi = []
            scaling = []
            panorama = []

            tmp_exam_set = reception.diagnosis.exammanager_set.all()
            
            for tmp_exam in tmp_exam_set:
                if hasattr(tmp_exam,'doctor'):
                    general.append({tmp_exam.exam.code:tmp_exam.name + tmp_exam.exam.doctor.name_kor})
                else:
                    general.append({tmp_exam.exam.code:tmp_exam.exam.name})

           
            tmp_test_set = reception.diagnosis.testmanager_set.all()
            for tmp_test in tmp_test_set:
                lab.append({tmp_test.test.code:tmp_test.test.name})
            

            tmp_precedure_set = reception.diagnosis.preceduremanager_set.all()
            for tmp_precedure in tmp_precedure_set:
                if 'scaling' in tmp_precedure.precedure.name.lower():
                    scaling.append({tmp_precedure.precedure.code:tmp_precedure.precedure.name})
                elif 'injection' in tmp_precedure.precedure.name.lower():
                    general.append({tmp_precedure.precedure.code:tmp_precedure.precedure.name})
                elif 'panorama' in tmp_precedure.precedure.name.lower():
                    panorama.append({tmp_precedure.code:tmp_precedure.precedure.name})
                else:
                    general.append({tmp_precedure.precedure.code:tmp_precedure.precedure.name})
            

            tmp_medicine_set = reception.diagnosis.medicinemanager_set.all()
            for tmp_medicine in tmp_medicine_set:
                if tmp_medicine.name is None:
                    if 'injection' in tmp_medicine.name_vie.lower():
                        general.append({tmp_medicine.medicine.code:tmp_medicine.medicine.name_vie})
                    else:
                        medi.append({tmp_medicine.medicine.code:tmp_medicine.medicine.name_vie})
                else:
                    if 'injection' in tmp_medicine.medicine.name.lower():
                        general.append(tmp_medicine.medicine.name)
                    else:
                        medi.append(tmp_medicine.medicine.name)

            data.update({'general':general})
            data.update({'medi':medi})
            data.update({'lab':lab})
            data.update({'scaling':scaling})
            data.update({'panorama':panorama})

            paid_set = reception.payment.paymentrecord_set.all()
            unpaid_sum = reception.payment.total
            for paid in paid_set:
                unpaid_sum -= paid.paid


        
            if pup == 'Paid':
                if unpaid_sum != 0:
                    continue
            elif pup == 'Unpaid':
                if unpaid_sum == 0:
                    continue

            



            data.update({
                'no':reception.id,
                'date':reception.recorded_date.strftime('%d-%b-%y'),
                'Patient':reception.patient.name_kor,
                'patient_eng':reception.patient.name_eng,
                'date_of_birth':str(reception.patient.get_age()) + '/' + reception.patient.get_gender_simple(),
                'address':reception.patient.address,
                'gender':reception.patient.gender,
                'Depart':reception.depart.name,
                'Doctor':reception.doctor.name_kor,

                'paid_by_cash':'',
                'paid_by_card':'',
                'paid_by_remit':'',

                'total' :reception.payment.total,
                'paid':reception.payment.total - unpaid_sum,
                'unpaid':unpaid_sum,
                })

            payment_total_total += reception.payment.total
            payment_total_paid += reception.payment.total - unpaid_sum
            payment_total_unpaid += unpaid_sum


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


def doctor_profit(request):






    return JsonResponse(context)











def search_patient(request):


    return JsonResponse(context)