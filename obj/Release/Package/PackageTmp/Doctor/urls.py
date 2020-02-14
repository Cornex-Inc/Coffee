from django.urls import path
from Doctor import forms, views

app_name = 'Doctor'

urlpatterns = [
    path('',views.index,name='index'),
    path('reception_waiting/',views.reception_waiting,name='reception_waiting'),
    path('reception_select/',views.reception_select,name='reception_select'),
    
    path('get_vital/',views.get_vital,name='get_vital'),
    path('set_vital/',views.set_vital,name='set_vital'),

    path('diagnosis_save/',views.diagnosis_save,name='diagnosis_save'),
    path('diagnosis_past/',views.diagnosis_past,name='diagnosis_past'),
    path('get_diagnosis/',views.get_diagnosis,name='get_diagnosis'),

    path('get_test_contents/',views.get_test_contents, name='get_test_contents'),

    path('show_medical_report/<int:reception_id>',views.show_medical_report,name='show_medical_report'),
    path('show_medical_report/',views.show_medical_report,),

    path('report/',views.report,name='report'),
    path('patient_search/',views.patient_search,name='patient_search'),
    path('set_patient_data/',views.set_patient_data,name='set_patient_data'),
    path('medical_report_save/',views.medical_report_save,name='medical_report_save'),
    path('report_search/',views.report_search,name='report_search'),
    
    path('audit',views.audit,name='audit'),

    path('waiting',views.waiting,name='waiting'),
    path('diagnosis/',views.diagnosis,name='diagnosis'),
    path('diagnosis/<int:reception_num>',views.diagnosis),
    path('information',views.information,name ='information'),
]
