from django.shortcuts import render,redirect,HttpResponse
import datetime
from django.utils import timezone, translation

from django.http import JsonResponse
from django.core.paginator import Paginator,PageNotAnInteger,EmptyPage
from django.contrib.auth.decorators import login_required

from Receptionist.models import *
from Receptionist.forms import *
from Patient.models import *
from Patient.forms import *
from Pharmacy.models import *
from Laboratory.models import *
from Radiation.models import *

from Manage.forms import DoctorsSearchForm 

from .models import *
from app.models import *

from .forms import *
# Create your views here.
from django.utils.translation import gettext as _
from django.forms.models import model_to_dict
from django.db.models import Q, Count

@login_required
def index(request):


    try:
        myinfo = Doctor.objects.get(user = request.user)
        if myinfo.name_kor is None:
            return redirect('/doctor/information')
        
    except Doctor.DoesNotExist:
            return redirect('/doctor/information')
        

    patient_form = PatientForm_Doctor()
    history_form = HistoryForm()
    vital_form = VitalForm()
    receptionsearch_form = SearchReceptionStatusForm()

    #diagnosis
    reception_form = ReceptionForm()
    diagnosis_form = DiagnosisForm()

    reservation_form = ReservationForm()

    exam_list = []
    #exam_datas = ExamFee.objects.filter( doctor_id = request.user.doctor.id )
    exam_datas = ExamFee.objects.filter( doctor_id = request.user.doctor.id )
    if not exam_datas:
        exam_datas = ExamFee.objects.filter( doctor_id__isnull = True , code__icontains='E', use_yn='Y')

    for exam_data in exam_datas:
        exam_list.append({
            'id':exam_data.id,
            'name':exam_data.name,
            'price':format(exam_data.get_price(), ',') + ' VND',
            'code':exam_data.code,
            })


    #PM 은 별도로 출력
    if request.user.doctor.depart.name == 'PM':
        precedure_data = []
        precedures = Precedure.objects.filter( code__icontains='PM' ,use_yn='Y').order_by('code')
        for precedure in precedures:
            precedure_data.append({
                        'id':precedure.id,
                        'name':precedure.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                        'name_vie':precedure.name_vie,
                        'code':precedure.code,
                        'price':format(precedure.get_price(), ',') + ' VND',
                    })

        radiography_data = []
        radiography_s = Precedure.objects.filter( code__icontains='R',precedure_class_id = 10, use_yn='Y').order_by('id')
        for radiography in radiography_s:
            radiography_data.append({
                        'id':radiography.id,
                        'name':radiography.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                        'name_vie':radiography.name_vie,
                        'code':radiography.code,
                        'price':format(radiography.get_price(), ',') + ' VND',
                    })

        medicines_data = []
        medicine_s = Medicine.objects.filter( medicine_class_id=1, use_yn='Y').order_by('code')
        for medicine in medicine_s:
            medicines_data.append({
                        'id':medicine.id,
                        'name':medicine.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                        'name_vie':medicine.name_vie,
                        'code':medicine.code,
                        'price':format(medicine.get_price(), ',') + ' VND',
                    })


        initial_report_q2_option = []
        initial_report_q2 = COMMCODE.objects.filter(commcode_grp = 'PM_IRQ2').values('id','seq','se1','se2','se4','se5')
        initial_report_q2_title = COMMCODE.objects.values('se2','seq','se6','se7','se8').annotate(Count('se2')).extra(select={'tmp_seq':'CAST(seq AS INTERGER)'}).order_by('tmp_seq')
        for title in initial_report_q2_title:
            item = COMMCODE.objects.values('se2').annotate(Count('se2'))


        

        return render(request,
        'Doctor/index_PM.html',
            {
                'patient':patient_form,
                'history':history_form,
                'vital':vital_form,
                'receptionsearch':receptionsearch_form,
                'reception':reception_form,
                'diagnosis':diagnosis_form,

                'exam_list':exam_list,
                'precedures':precedure_data,
                'radiographys':radiography_data,
                'medicines':medicines_data,
                

                'reservation':reservation_form,
                'today_vital':datetime.date.today().strftime('%b-%d'),

                
                'initial_report_q2':initial_report_q2,
                'initial_report_q2_title':initial_report_q2_title,

            }
        )


    #"P0218"
    #"P0217"

    #test_classes = TestClass.objects.all()
    #test_data = {}
    #for test_class in test_classes:
    #    tests = Test.objects.filter(test_class = test_class, use_yn='Y')
    #    temp = []
    #    for test in tests:
    #        temp.append({
    #                    'id':test.id,
    #                    'name':test.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
    #                    'name_vie':test.name_vie,
    #                    'code':test.code,
    #                    'price':format(test.get_price(), ',') + ' VND',
    #                    'upper':test_class.name ,
    #                })
    #    test_data.update({ test_class.name : temp})

    tests = Test.objects.filter( use_yn='Y')
    test_data = []
    for test in tests:
        test_data.append({
                    'id':test.id,
                    'name':test.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                    'name_vie':test.name_vie,
                    'code':test.code,
                    'price':format(test.get_price(), ',') + ' VND',
                })


    #p_short_filter = PrecedureShort.objects.filter(doctor_id = request.user.doctor.id)
    #precedure_short = []
    #for p_short in p_short_filter:
    #    precedure_short.append({
    #        'id':p_short.precedure.id,
    #        'name':p_short.precedure.name,
    #        'name_vie':p_short.precedure.name_vie,
    #        'code':p_short.precedure.code,
    #        'price':format(p_short.precedure.get_price(), ',') + ' VND',
    #        #'upper':p_short.precedure_class.name ,
    #        })
    
   

    precedure_classes=PrecedureClass.objects.all().exclude(id=10).values()

    precedure_data = {}

    for precedure_class in precedure_classes:
        precedures = Precedure.objects.filter( precedure_class_id = precedure_class['id'],use_yn='Y')
        temp = []

        for precedure in precedures:
            temp.append({
                        'id':precedure.id,
                        'name':precedure.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                        'name_vie':precedure.name_vie,
                        'code':precedure.code,
                        'price':format(precedure.get_price(), ',') + ' VND',
                        'upper':precedure_class['name'],
                    })
        precedure_data.update({ precedure_class['name'] : temp})

    
    #m_short_filter = MedicineShort.objects.filter(doctor_id = request.user.doctor.id)
    #medicine_short = []
    #for m_short in m_short_filter:
    #    medicine_short.append({
    #            'id':m_short.medicine.id,
    #            'name':m_short.medicine.name,
    #            'name_vie':m_short.medicine.name_vie,
    #            'code':m_short.medicine.code,
    #            'unit':'' if m_short.medicine.unit is None else m_short.medicine.unit,
    #            'price':format(m_short.medicine.get_price(), ',') + ' VND',
    #        })

    medicine_classes = MedicineClass.objects.all()
    medicine_data = []
    medicines = Medicine.objects.filter(use_yn='Y').exclude(medicine_class_id=1).order_by('code')


    #for medicine_class in medicine_classes:
    #    medicines = Medicine.objects.filter(medicine_class_id = medicine_class.id)

    for medicine in medicines:
        tmp_data = {
                    'id':medicine.id,
                    'name':medicine.get_name_lang(request.session[translation.LANGUAGE_SESSION_KEY]),
                    'name_vie':medicine.name_vie,
                    'code':medicine.code,
                    'unit':'' if medicine.unit is None else medicine.unit,
                    'price':format(medicine.get_price(), ',') + ' VND',
                }
        medicine_data.append( tmp_data )
        #medicine_data.update({ medicine_class.name : temp})

    bundle_set = {}
    category = BundleClass.objects.values('upper').distinct()

    for upper in category:
        bundle_groups = BundleClass.objects.filter(upper = upper['upper'])
        temp = []
        for bundle_groups in bundle_groups:
            temp.append({
                        'id':bundle_groups.id,
                        'code':bundle_groups.group_code,
                        'name':bundle_groups.group_name
                    })
            
        bundle_set.update({ upper['upper'] : temp})
    




    
    return render(request,
        'Doctor/index.html',
            {
                'patient':patient_form,
                'history':history_form,
                'vital':vital_form,
                'receptionsearch':receptionsearch_form,
                'reception':reception_form,
                'diagnosis':diagnosis_form,

                #'test_class':test_class,
                'tests':test_data,

                #'precedure_short':precedure_short,
                'precedure_classes':precedure_classes,
                'precedures':precedure_data,

                #'medicine_short':medicine_short,
                'medicine_classes':medicine_classes,
                'medicines':medicine_data,

                'exam_list':exam_list,

                'bundle_set':bundle_set,

                'reservation':reservation_form,
                'today_vital':datetime.date.today().strftime('%b-%d'),
            }
        )


@login_required
def report(request):
    report_search_form = ReportSearchForm()
    patient_search_form = PatientSearchForm()


    return render(request,
    'Doctor/report.html',
            {
                'report_search':report_search_form,
                'patient_search':patient_search_form,
            }
        )


@login_required
def show_medical_report(request,reception_id=None):

    report_id = request.POST.get('report_id')
    context = {}


    report = Report.objects.get(pk=report_id)
        
    if report is not None:
        context.update({
                'selected_report':report.id,
                'reception_report':report.report,
                'reception_usage':report.usage,
                'serial':report.serial,
                'publication_date':report.date_of_publication.strftime('%Y-%m-%d'),
                'date_of_hospitalization':report.date_of_hospitalization.strftime('%Y-%m-%d'),
                
            })


    today = datetime.date.today()
    

    context.update({
                'patient_chart':report.patient.get_chart_no(),
                'patient_name':report.patient.name_kor,
                'patient_name_eng':report.patient.name_eng,
                'patient_gender':report.patient.gender,
                'patient_age':report.patient.get_age(),
                'patient_ID':report.patient.getID(),
                'patient_date_of_birth':report.patient.date_of_birth.strftime('%Y-%m-%d'),
                'patient_address':report.patient.address,
                'patient_phone':report.patient.phone,

                'report_today':today,
                'recept_date': today.strftime('%d/%m/%Y'),
                'lang': request.session['_language'],
                'doctor':report.doctor.name_kor,
                })

    if request.POST.get('report_id') is None :
        return render(request,
            'Doctor/reportwindow.html',context
            )
    else:
        return JsonResponse(context)

def reception_waiting(request):
    date = request.POST.get('date')
    progress = request.POST.get('progress')
    kwargs={}
    kwargs['doctor'] = request.user.doctor
    kwargs['depart_id'] = request.user.doctor.depart
    if progress != 'all':
        kwargs['progress'] = request.POST.get('progress')

    date_min = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.min)
    date_max = datetime.datetime.combine(datetime.datetime.strptime(date, "%Y-%m-%d").date(), datetime.time.max)

    receptions = Reception.objects.filter(recorded_date__range = (date_min, date_max),**kwargs).exclude(progress='deleted')

    datas=[]
    today = datetime.date.today()

    for reception in receptions:
        data={}
        data.update({
            'id':reception.patient.id,
            'chart':reception.patient.get_chart_no(),
            'reception_no':reception.id,
            'name_kor':reception.patient.name_kor,
            'name_eng':reception.patient.name_eng,
            'date_of_birth':reception.patient.date_of_birth.strftime('%Y-%m-%d'),
            'age':reception.patient.get_age(),
            'gender':reception.patient.get_gender_simple(),
            'reception_time':reception.recorded_date.strftime('%H:%M'),
            'status': reception.progress,
            })
        datas.append(data)

    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)

def reception_select(request):
    reception_id = request.POST.get('reception_id')

    reception = Reception.objects.get(pk = reception_id)
    patient = Patient.objects.get(pk=reception.patient_id)
    history = History.objects.get(patient = patient)


    context = {
        'id':patient.id,
        'chart':patient.get_chart_no(),
        'reception_id':reception.id,
        'name_kor':patient.name_kor,
        'name_eng':patient.name_eng,
        'date_of_birth':patient.date_of_birth,
        'gender':patient.gender,
        'phone':patient.phone,
        'address':patient.address,
        'chief_complaint':reception.chief_complaint,
        'history_past':history.past_history,
        'history_family':history.family_history,
        'need_medical_report':reception.need_medical_report,
        }

    try:
        diagnosis = Diagnosis.objects.get(reception = reception)
        context.update({
            'assessment':diagnosis.assessment,
            'objective_data':diagnosis.objective_data,
            'plan':diagnosis.plan,
            'diagnosis':diagnosis.diagnosis,
            'recommendation':diagnosis.recommendation,
            })
    except Diagnosis.DoesNotExist:
        pass

    if reception.reservation:
        context.update({'reservation' : reception.reservation.reservation_date.strftime('%Y-%m-%d %H:%M:00')})


        
    return JsonResponse(context)


def get_vital(request):
    patient_id = request.POST.get('patient_id')
    vitals = Vital.objects.filter(patient_id = patient_id)

    datas =[]
    for vital in vitals:
        data={}
        data.update({
            'date':vital.date.strftime('%b-%d'),
            'weight':vital.weight,
            'height':vital.height,
            'blood_pressure':vital.blood_pressure,
            'blood_temperature':vital.blood_temperature,
            'breath':vital.breath,
            'pulse_rate':vital.pulse_rate,
            })
        datas.append(data)

    datas.reverse()
    context = {
        'datas':datas,
        }
    return JsonResponse(context)

def set_vital(request):
    reception_id = request.POST.get('reception_id')
    weight = request.POST.get('height')
    height = request.POST.get('height')
    blood_pressure = request.POST.get('blood_pressure')
    blood_temperature = request.POST.get('blood_temperature')
    breath = request.POST.get('breath')
    pulse_rate = request.POST.get('pulse_rate')
    vital_date = request.POST.get('vital_date')

    
    reception = Reception.objects.get(pk = reception_id)
    vital = Vital(patient = reception.patient,
                  weight = weight,
                  height = height,
                  blood_pressure = blood_pressure,
                  blood_temperature = blood_temperature,
                  breath = breath,
                  pulse_rate = pulse_rate,
                  date = datetime.datetime.now(),
                  )

    vital.save()

    context = {'datas':True}
    return JsonResponse(context)

def get_test_manage(request):
    
    chief_complaint = request.POST.get('test_manage_id')



    context = {'result':True}
    return JsonResponse(context)


def diagnosis_save(request):

    chief_complaint = request.POST.get('chief_complaint')
    reception_id = request.POST.get('reception_id')
    set = request.POST.get('set')
    reserve_date = request.POST.get('date')

    try:
        diagnosis_result = Diagnosis.objects.get(reception_id = reception_id)
        
        reception = Reception.objects.get(pk = reception_id)
        reception.chief_complaint = chief_complaint
        reception.save()
        
         #delete all order then save again

        if reserve_date:
            if reception.reservation:
                reservation = reception.reservation
            else:
                reservation = Reservation(patient = reception.patient)
            reserve_date = datetime.datetime.strptime(reserve_date, "%Y-%m-%d %H:%M:%S")
            reservation.reservation_date = reserve_date
            reservation.depart_id = request.user.doctor.depart_id
            reservation.doctor_id = request.user.doctor.id
            reservation.save()
            reception.reservation = reservation
            reception.save()
        else:
            if reception.reservation:
                reservation = reception.reservation
                reception.reservation = None
                reception.save()
                reservation.delete()

    except Diagnosis.DoesNotExist:
        diagnosis_result = Diagnosis(reception_id = reception_id)

    diagnosis_result.diagnosis = request.POST.get('diagnosis')
    diagnosis_result.objective_data = request.POST.get('objective_data')
    diagnosis_result.assessment = request.POST.get('assessment')
    diagnosis_result.plan = request.POST.get('plan')
    diagnosis_result.recommendation = request.POST.get('recommendation')
    
    diagnosis_result.save()
    #payment begin check
    try:
        tmp_payment = Payment.objects.get(reception_id=reception_id)
        if tmp_payment.paymentrecord_set.count() != 0:
            context = {'result':False}
            return JsonResponse(context)

    except Payment.DoesNotExist:
        pass


    #save orders
    
    datas=[]
    data ={}
    count=0
    for i,j in request.POST.items():
        if i.find('datas[') != -1:
            if count is int(i[i.find('[')+1:i.find(']')]):
                pass
            else:
                datas.append(data)
                data ={}
                count += 1

            data[i[i.find(']')+2:-1]] = j
    if len(data.keys()) is not 0:
        datas.append(data)

    total_amount=0
    exam_set = ExamManager.objects.filter(diagnosis_id = diagnosis_result.id)
    exam_dict = {}
    for data in exam_set:
        exam_dict.update({data.id:data.id})
    test_set = TestManager.objects.filter(diagnosis_id = diagnosis_result.id)
    test_dict = {}
    for data in test_set:
        test_dict.update({data.id:data.id})
    precedure_set = PrecedureManager.objects.filter(diagnosis_id = diagnosis_result.id)
    precedure_dict = {}
    for data in precedure_set:
        precedure_dict.update({data.id:data.id})
    medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis_result.id)
    medicine_dict = {}
    for data in medicine_set:
        medicine_dict.update({data.id:data.id})

    for data in datas:
        if data['type'] == 'Exam':
            if data['id'] == '':
                result = ExamManager(diagnosis_id = diagnosis_result.id)
            else:
                result = exam_set.get(pk = data['id'])
                exam_dict.pop(int(data['id']))
            
            exam = ExamFee.objects.get(code = data['code'])
            result.exam_id = exam.id
            result.save()

            total_amount += result.exam.price

        elif data['type'] == 'Test':
            if data['id']=='':
                result = TestManager(diagnosis_id = diagnosis_result.id)
            else:
                result = test_set.get(pk = data['id'])
                test_dict.pop(int(data['id']))

            test = Test.objects.get(code = data['code'])
            result.test_id = test.id
            result.save()
            try:
                test_manage = TestManage.objects.get(manager_id = result.id)
            except TestManage.DoesNotExist:
                test_manage = TestManage(
                    manager_id = result.id,
                    name_service = result.test.name,
                    date_ordered = datetime.datetime.now(),
                    )
            test_manage.save()
            
            total_amount += result.test.get_price()

        elif data['type'] == 'Precedure':
            if data['id'] == '':
                result = PrecedureManager(diagnosis_id = diagnosis_result.id)
            else:
                result = precedure_set.get(pk = data['id'])
                precedure_dict.pop(int(data['id']))
            
            precedure = Precedure.objects.get(code = data['code'])
            result.amount = data['amount']
            result.precedure_id = precedure.id
            result.save()

            #if 'R' in data['code']:
            #    try:
            #        radi_manage = RadiationManage.objects.get(manager_id = result.id)
            #    except RadiationManage.DoesNotExist:
            #        radi_manage = RadiationManage(
            #            manager_id = result.id,
            #            name_service = result.precedure.name,
            #            date_ordered = datetime.datetime.now(),
            #            )
            #    radi_manage.save()

            total_amount += result.precedure.get_price() * int(result.amount)

        elif data['type'] == 'Medicine':
            if data['id']=='':
                result = MedicineManager(diagnosis_id = diagnosis_result.id)
            else:
                result = medicine_set.get(pk = data['id'])
                medicine_dict.pop(int(data['id']))

            medicine = Medicine.objects.get(code = data['code'])
            result.medicine_id = medicine.id
            result.amount = data['amount']
            result.days = data['days']
            #result.memo = data['memo']
            result.save()
            try:
                medicine_manage = MedicineManage.objects.get(diagnosis_id = diagnosis_result.id)
            except MedicineManage.DoesNotExist:
                medicine_manage = MedicineManage(diagnosis_id = diagnosis_result.id)
                medicine_manage.save()

            total_amount +=  int(result.days) * int(result.amount) * int(result.medicine.get_price())


    for key in exam_dict:
        ExamManager.objects.get(pk = key).delete()
    for key in test_dict:
        TestManager.objects.get(pk = key).delete()
    for key in precedure_dict:
        PrecedureManager.objects.get(pk = key).delete()
    for key in medicine_dict:
        MedicineManager.objects.get(pk = key).delete()
    
    
    

    reception = Reception.objects.get(pk = reception_id)
    reception.progress = set
    reception.save()

    if set == 'done':
        try:
            payment = Payment.objects.get(reception_id=reception_id)
            payment.progress = 'unpaid'
        except Payment.DoesNotExist:
            payment = Payment(reception_id = reception_id)
        payment.sub_total = total_amount;
        payment.total = total_amount;
        payment.save()


            

    context = {'result':True}
    return JsonResponse(context)



def diagnosis_past(request):
    all = request.POST.get('all')
    patient_id = request.POST.get('patient_id')
    if all is not None:
        receptions = Reception.objects.filter(patient_id = patient_id)
    else:
        start_date = request.POST.get('start_date')
        end_date = request.POST.get('end_date')

        date_min = datetime.datetime.combine(datetime.datetime.strptime(start_date, "%Y-%m-%d").date(), datetime.time.min)
        date_max = datetime.datetime.combine(datetime.datetime.strptime(end_date, "%Y-%m-%d").date(), datetime.time.max)

        patient = Patient.objects.get(pk = patient_id)
        receptions = Reception.objects.filter(recorded_date__range = (date_min, date_max),patient_id = patient_id)

    datas =[]
    for reception in receptions:
        try:
            diagnosis = Diagnosis.objects.get(reception_id = reception.id)

            exam_set = ExamManager.objects.filter(diagnosis_id = diagnosis.id)
            test_set = TestManager.objects.filter(diagnosis_id = diagnosis.id)
            precedure_set = PrecedureManager.objects.filter(diagnosis_id = diagnosis.id)
            medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis.id)

            exams = []
            for data in exam_set:
                exam = {}
                exam.update({
                        'name':data.exam.name,
                    })
                exams.append(exam)

            tests = []
            for data in test_set:
                test = {}
                test.update({
                        'name':data.test.name,
                        'amount':data.amount,
                        'days':data.days,
                        'memo':data.memo,
                    })
                tests.append(test)

            precedures = []
            for data in precedure_set:
                precedure = {}
                precedure.update({
                        'name':data.precedure.name,
                        'amount':data.amount,
                        'days':data.days,
                        'memo':data.memo,
                    })
                precedures.append(precedure)

            medicines = []
            for data in medicine_set:
                medicine = {}
                medicine.update({
                        'name':data.medicine.name,
                        'amount':data.amount,
                        'days':data.days,
                        'memo':data.memo,
                        'unit':data.medicine.unit,
                    })
                medicines.append(medicine)

            data={}
            data.update({
                'date':diagnosis.recorded_date.strftime('%Y-%m-%d'),
                'day':diagnosis.recorded_date.strftime('%a'),
                'subjective':reception.chief_complaint,
                'objective':diagnosis.objective_data,
                'assessment':diagnosis.assessment,
                'plan':diagnosis.plan,
                'diagnosis':diagnosis.diagnosis,
                'recommendation':diagnosis.recommendation,
                

                'doctor':reception.doctor.name_kor,

                'exams':exams,
                'tests':tests,
                'precedures':precedures,
                'medicines':medicines,
                'amount':'null',
            })
            datas.append(data)

            
        except Diagnosis.DoesNotExist:
            pass



    datas.reverse()
    context = {'datas':datas}
    return JsonResponse(context)


def get_diagnosis(request):
    
    reception_no = request.POST.get('reception_no')
    datas={}
    try:
        reception = Reception.objects.get(pk = reception_no)
        diagnosis = Diagnosis.objects.get(reception_id = reception_no)

        exam_set = ExamManager.objects.filter(diagnosis_id = diagnosis.id)
        test_set = TestManager.objects.filter(diagnosis_id = diagnosis.id)
        precedure_set = PrecedureManager.objects.filter(diagnosis_id = diagnosis.id)
        medicine_set = MedicineManager.objects.filter(diagnosis_id = diagnosis.id)


        
        exams = []
        for data in exam_set:
            exam = {}
            exam.update({
                'id':data.id,
                'code':data.exam.code,
                'name':data.exam.name,
                'price':data.exam.get_price(),
                })
            exams.append(exam)

        tests = []
        for data in test_set:
            test = {}
            test.update({
                'id':data.id,
                'code':data.test.code,
                'name':data.test.name,
                'amount':data.amount,
                'days':data.days,
                'memo':data.memo,
                'price':data.test.get_price(),
                })
            tests.append(test)

        precedures = []
        for data in precedure_set:
            precedure = {}
            precedure.update({
                'id':data.id,
                'code':data.precedure.code,
                'name':data.precedure.name,
                'amount':data.amount,
                'days':data.days,
                'memo':data.memo,
                'price':data.precedure.price,
                })
            precedures.append(precedure)

        medicines = []
        for data in medicine_set:
            medicine = {}
            medicine.update({
                'id':data.id,
                'code':data.medicine.code,
                'name':data.medicine.name,
                'amount':data.amount,
                'days':data.days,
                'memo':data.memo,
                'unit':data.medicine.unit,
                'price':data.medicine.price,
                })
            medicines.append(medicine)


        datas = {
            'diagnosis':diagnosis.diagnosis,
            'exams':exams,
            'tests':tests,
            'precedures':precedures,
            'medicines':medicines,
            'chief_complaint':'' if reception.chief_complaint is None else reception.chief_complaint,
        }

    
    except Diagnosis.DoesNotExist:
        pass

    context = {'datas':datas,
               'patient_id':reception.patient_id,
               }
    return JsonResponse(context)

def show_medical_report_save(request):
    reception_no = request.POST.get('reception_no')
    


    context = {'datas':datas}
    return JsonResponse(context)

def waiting(request):

    try:
        myinfo = Doctor.objects.get(user = request.user)
        if myinfo.name_kor is None:
            return redirect('/doctor/information')
    except Doctor.DoesNotExist:
        return redirect('/doctor/information')

    kwargs={}
    #fine my patient only
    kwargs['doctor'] = myinfo
    if 'search' in request.POST:
        search_form = SearchReceptionStatusForm(data = request.POST)
        if search_form.is_valid():
            date_min = datetime.datetime.combine(search_form.cleaned_data['date'], datetime.time.min)
            date_max = datetime.datetime.combine(search_form.cleaned_data['date'], datetime.time.max)
    else:
        search_form = SearchReceptionStatusForm()
        date_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        date_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)

    datas = Reception.objects.filter(recorded_date__range = (date_min, date_max),**kwargs)

    return render(request,
    'Doctor/waiting.html',
            {
                'search':search_form,
                'datas':datas,
            }
        )

def diagnosis(request,reception_num = None):
    if reception_num is None:
        #print 잘못된 접근
        return redirect('/')

    reception = Reception.objects.get(pk = reception_num)
    patient = Patient.objects.get(pk = reception.patient_id)
    history = History.objects.get(patient = patient)

    if 'save' in request.POST:
        reception_form = ReceptionForm(data = request.POST)
        patient_form = PatientForm(data = request.POST)
        history_form = HistoryForm(data = request.POST)

        test_list = TestForm(data = request.POST)
        precedure_list = PrecedureForm(data = request.POST)
        madicine_list = MedicineForm(data = request.POST)
        
        diagnosis_form = DiagnosisForm(data = request.POST)
        reservation_form = ReservationForm(data = request.POST)
        if reception_form.is_valid() and patient_form.is_valid() and history_form.is_valid() and test_list.is_valid() and precedure_list.is_valid() and madicine_list.is_valid() and diagnosis_form.is_valid() and reservation_form.is_valid():
            try:
                diagnosis_save = Diagnosis.objects.get(reception = reception)
                diagnosis_save.test.clear()
                diagnosis_save.precedure.clear()
                diagnosis_save.medicine.clear()
            except Diagnosis.DoesNotExist:
                diagnosis_save = Diagnosis.objects.create(reception = reception, 
                                                          diagnosis = diagnosis_form.cleaned_data['diagnosis'],
                                                          medical_report = diagnosis_form.cleaned_data['medical_report'],
                                                          )
            diagnosis_save.test.add(*test_list.cleaned_data['tests'])
            diagnosis_save.precedure.add(*precedure_list.cleaned_data['precedures'])
            diagnosis_save.medicine.add(*madicine_list.cleaned_data['medicines'])
            
            if reservation_form.cleaned_data['date'] is not None:
                reservation = Reservation.objects.create(
                    date = reservation_form.cleaned_data['date'],
                    patient = patient,
                    doctor = reception.doctor,
                    )
                reception.follow_update = reservation
                reception.save()
            #검사실
            #약국
            

            return redirect('/')
        else:
            visit_history = Reception.objects.filter(patient = patient).exclude(pk = reception.id)
            diagnosis_form = DiagnosisForm(data = request.POST)
    else:
        reception_form = ReceptionForm(instance = reception)
        patient_form = PatientForm(instance = patient)
        history_form = HistoryForm(instance = history)

        visit_history = Reception.objects.filter(patient = patient).exclude(pk = reception.id)

        diagnosis_form = DiagnosisForm()
    
        test_list = TestForm()
        precedure_list = PrecedureForm()
        madicine_list = MedicineForm()

        reservation_form = ReservationForm()
    return render(request,
    'Doctor/diagnosis.html',
            {
                'reception_num':reception_num,
                'test_list':test_list,
                'precedure_list':precedure_list,
                'madicine_list':madicine_list,
                'chart_no':patient.get_chart_no(),
                'visit_history': visit_history,
                'patient' : patient_form,
                'reception' : reception_form,
                'history' : history_form,
                'diagnosis' : diagnosis_form,
                'reservation_form':reservation_form,
            }
        )


def information(request):

    #try:
    #    info = Doctor.objects.get(user = request.user)
    #except Doctor.DoesNotExist:
    #    info = Doctor.objects.create(user = request.user)
    #
    #
    #
    #if 'save' in request.POST:
    #    form = DoctorForm(data = request.POST)
    #    if form.is_valid():
    #        info.name_kor = form.cleaned_data['name_kor']
    #        info.name_eng = form.cleaned_data['name_eng']
    #        info.depart = form.cleaned_data['depart']
    #        info.user = request.user
    #        info.save()
    #
    #        return redirect('/')


    form = DoctorForm(instance = info)


    return render(request,
    'Doctor/information.html',
            {
                'form':form,
            }
        )


def patient_search(request):
    category = request.POST.get('category')
    string = request.POST.get('string')

    kwargs = {
        '{0}__{1}'.format(category, 'icontains'): string,
        }
    patients = Patient.objects.filter(**kwargs ).order_by("-id")

    datas=[]
    for patient in patients:
        data = {}
        data.update({
            'id':patient.id,
            'chart':patient.get_chart_no(),
            'name_kor':patient.name_kor,
            'name_eng':patient.name_eng,
            'gender':patient.gender,
            'date_of_birth':patient.date_of_birth,
            'phonenumber':patient.phone,
            })
        datas.append(data)

    context = {'datas':datas}
    return JsonResponse(context)

def set_patient_data(request):
    patient_id = request.POST.get('patient_id')

    patient = Patient.objects.get(pk = patient_id)

    if patient.gender is '' or patient.gender is None:
        context = { 
            'error':'The Pathet\'s gender is not proper. Check patient\' gender first.',
            }
        return JsonResponse(context)

    today = datetime.date.today()
    context = {
        'chart':patient.get_chart_no(),
        'name':patient.name_eng + ' ' + patient.name_kor,
        'date_of_birth':patient.date_of_birth.strftime('%Y-%m-%d'),
        'gender':patient.gender,
        'address':patient.address,
        'ID':patient.getID(),
        'age':patient.get_age(),
        'today':today.strftime('%Y-%m-%d'),
        'doctor':request.user.doctor.name_kor,
        }
    return JsonResponse(context)

def medical_report_save(request):
    
    doctor_id = request.POST.get('doctor')
    str_report = request.POST.get('report')
    usage = request.POST.get('usage')
    hospitalization = request.POST.get('hospitalization')
    publication = request.POST.get('publication')
    selected_report = request.POST.get('selected_report')
    selected_patient = request.POST.get('selected_patient')
    if selected_report == 'new':
        report = Report(patient_id = selected_patient)

        today = datetime.date.today().strftime('%Y%m%d')

        num = Report.objects.filter(serial__icontains = today).count() + 1
        serial = str(today) + "{:04d}".format(num)
        report.serial = serial
        report.doctor_id = doctor_id
    else:
        report = Report.objects.get(pk = selected_report)

    report.report = str_report
    report.usage = usage
    report.date_of_hospitalization = datetime.datetime.combine(datetime.datetime.strptime(hospitalization, "%Y-%m-%d").date(), datetime.time.min)
    report.date_of_publication = datetime.datetime.combine(datetime.datetime.strptime(publication, "%Y-%m-%d").date(), datetime.time.min)
    

    report.save()


    return JsonResponse({'serial':report.serial})

def report_search(request):
    #date = request.POST.get('date')
    filter = request.POST.get('filter')
    input = request.POST.get('input').lower()

    #date_start = date.split(' - ')[0]
    #date_end = date.split(' - ')[1]
    #date_min = datetime.datetime.combine(datetime.datetime.strptime(date_start, "%Y-%m-%d").date(), datetime.time.min)
    #date_max = datetime.datetime.combine(datetime.datetime.strptime(date_end, "%Y-%m-%d").date(), datetime.time.max)


    #reports = Report.objects.filter(date_of_publication__range = (date_min, date_max),**kwargs )[:20]
    reports = Report.objects.all()

    kwargs = {}

    page_context = request.POST.get('page_context',10)
    page = request.POST.get('page',1)
    datas = []
    for report in reports:
        if input == '':
            pass
        elif filter == 'all':
            if (input in report.patient.name_kor.lower() or
                input in report.patient.name_eng.lower() or
                input in report.doctor.name_kor.lower() or 
                input in report.doctor.name_eng.lower() or
                input in report.doctor.depart.name.lower()) is False:
                continue

        elif filter =='patient':
            if (input in report.patient.name_kor.lower() or input in report.patient.name_eng.lower()) is False:
                continue
        elif filter == 'doctor':
            if (input in report.doctor.name_kor.lower() or input in report.doctor.name_eng.lower() or input in report.doctor.depart.name.lower()) is False:
                continue
        data={
            'report_id':report.id,
            'chart':report.patient.get_chart_no(),
            'No':report.id,
            'patient_name_eng':report.patient.name_eng,
            'patient_name_kor':report.patient.name_kor,
            'ID':report.patient.getID(),
            'Doctor':report.doctor.name_kor,
            'PublicationDate':report.date_of_publication.strftime('%Y-%m-%d'),
            }
        datas.append(data)

    datas.reverse()
    paginator = Paginator(datas, page_context)
    try:
        paging_data = paginator.page(page)
    except PageNotAnInteger:
        paging_data = paginator.page(1)
    except EmptyPage:
        paging_data = paginator.page(paginator.num_pages)

    datas.reverse()
    return JsonResponse({
        'datas':datas,
        'datas':list(paging_data),
        'page_range_start':paging_data.paginator.page_range.start,
        'page_range_stop':paging_data.paginator.page_range.stop,
        'page_number':paging_data.number,
        'has_previous':paging_data.has_previous(),
        'has_next':paging_data.has_next(),
        })


def get_test_contents(request):
    date = request.POST.get('date')

    return JsonResponse({'datas':datas})


@login_required
def audit(request):
    doctor_search_form = DoctorsSearchForm()

    if request.user.doctor.depart.name == 'PM':
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

    else:
        #filters
        list_exam_fee = []
        list_test = []
        list_precedure = []
        list_medicine = []
    
        
        exams = ExamFee.objects.filter(Q(code = 'E0001') | Q(code = 'E0002')).order_by('name')
        for exam in exams:
            list_exam_fee.append({'code':exam.code,'value':exam.name})

    
        tests = Test.objects.all().order_by('name')
        for test in tests:
            list_test.append({'code':test.code,'value':test.name})


        precedures = Precedure.objects.all().order_by('name')
        for precedure in precedures:
            list_precedure.append({'code':precedure.code,'value':precedure.name})


        medicines = Medicine.objects.all().order_by('name')
        for medicine in medicines:
            list_medicine.append({'code':medicine.code,'value':medicine.name})


        #sorted_datas = sorted(temp_list_general,key = lambda order: (order['value']))
        #for sorted_data in sorted_datas:
        #    general.append({'code':sorted_data['code'],'value':sorted_data['value']})



        return render(request,
            'Doctor/audit.html',
                {
                    'doctor_search':doctor_search_form,

                    'list_exam_fee':list_exam_fee,
                    'list_test':list_test,
                    'list_precedure':list_precedure,
                    'list_medicine':list_medicine,

                }
            )

def get_bundle(request):

    bundle_id = request.POST.get('bundle_id')

    res_datas=[]
    items = Bundle.objects.filter(upper_id = bundle_id)
    for item in items:
        if item.type == 'Medicine':
            data = Medicine.objects.get(code=item.code)
        elif item.type == 'Precedure':
            data = Precedure.objects.get(code=item.code)
        elif item.type == 'Test':
            data = Test.objects.get(code=item.code)

        res_datas.append({
            'id':data.id,
            'type':item.type,
            'name':data.name,
            'code':data.code,
            'days':0 if item.days is None else item.days,
            'amount':0 if item.amount is None else item.amount,
            'price':data.price,
            })
        

    return JsonResponse({'datas':res_datas})