from django.urls import path
from Receptionist import views

app_name = 'Receptionist'

urlpatterns = [
    path('',views.index,name='reception_index'),
    path('set_new_patient/',views.set_new_patient,name='set_new_patient'),
    path('save_patient/',views.save_patient,name='save_patient'),
    path('save_reception/',views.save_reception,name='save_reception'),

    path('set_patient_data/',views.set_patient_data,name='set_patient_data'),
    path('patient_search/',views.patient_search,name='patient_search'),
    path('reception_search/',views.reception_search,name='reception_search'),
    path('payment_search/',views.payment_search,name='payment_search'),
    path('reservation_search/',views.reservation_search,name='reservation_search'),

    path('storage_page/',views.storage_page,name='storage_page'),
    path('waiting_list/',views.waiting_list,name='waiting_list'),
    path('waiting_selected/',views.waiting_selected,name='waiting_selected'),
    path('storage_page_save/',views.storage_page_save,name='storage_page_save'),
    path('get_bill_list/',views.get_bill_list,name='get_bill_list'),
    path('get_today_list/',views.get_today_list,name='get_today_list'),
    path('get_today_selected/',views.get_today_selected,name='get_today_selected'),

    path('report_list/',views.report_list,name='report_list'),
    

    path('reservation/',views.reservation,name = 'reservation'),
    path('reservation_new/',views.reservation_new, name = 'reservation_new'),
    path('reservation_del/',views.reservation_del, name = 'reservation_del'),


    path('reservation_events/',views.reservation_events,name='reservation_events'),
    path('reservation_events_modify/',views.reservation_events_modify,name='reservation_events_modify'),
    path('reservation_events_delete/',views.reservation_events_delete,name='reservation_events_delete'),
    #pharmacy
    
    #lab

    #radiation


    path('search',views.search,name='search'),
    path('reception/',views.reception, name ='reception'),
    path('reception/<int:patient_num>',views.reception, name ='reception'),
    path('get_depart_doctor/',views.get_depart_doctor,name='get_depart_doctor'),
    path('check_reservation/',views.check_reservation,name='check_reservation'),
    path('reception_status',views.reception_status, name ='reception_status'),

    path('storage/<int:reception_num>',views.storage,name='storage'),

]
