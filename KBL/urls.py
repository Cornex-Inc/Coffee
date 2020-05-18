from django.urls import path
from . import forms, views

app_name = 'KBL' 

urlpatterns = [
    path('',views.index,name='index'),

    #고객 정보
    path('customer_management',views.customer_management,name='customer_management'),
    path('customer_management_search/',views.customer_management_search,),
    path('customer_management_delete/',views.customer_management_delete,),
    path('customer_management_add_save/',views.customer_management_add_save,),
    path('customer_management_set_basic_info/',views.customer_management_set_basic_info,),

    path('customer_management_employee_add_save/',views.customer_management_employee_add_save,),
    path('customer_management_set_employee_list/',views.customer_management_set_employee_list,),
    path('customer_management_set_employee_info/',views.customer_management_set_employee_info,),
    path('customer_management_delete_employee/',views.customer_management_delete_employee,),



    #견적서
    path('estimate_sheet',views.estimate_sheet,name='estimate_sheet'),
    path('estimate_sheet_search/',views.estimate_sheet_search),
    path('estimate_sheet_get/',views.estimate_sheet_get,),
    path('estimate_sheet_save/',views.estimate_sheet_save),
    path('estimate_sheet_delete/',views.estimate_sheet_delete),

    path('estimate_sheet_detail_list/',views.estimate_sheet_detail_list),
    path('estimate_sheet_detail_save/',views.estimate_sheet_detail_save),
    path('estimate_sheet_detail_get/',views.estimate_sheet_detail_get),
    path('estimate_sheet_detail_delete/',views.estimate_sheet_detail_delete),

    path('print_estimate_sheet/<int:id>',views.print_estimate_sheet),
    path('send_email_estimate/',views.send_email_estimate),

    #프로젝트 관리
    path('project_management',views.project_management,name='project_management'),
    path('project_search/',views.project_search,),

    path('project_get/',views.project_get),
    path('project_save/',views.project_save),
    path('project_delete/',views.project_delete),


    path('detail_search/',views.detail_search),
    path('detail_save/',views.detail_save),
    path('detail_get/',views.detail_get),
    path('detail_delete/',views.detail_delete),
    path('detail_check/',views.detail_check),

    #노동허가서 관리
    path('work_permit',views.work_permit,name='work_permit'),

    path('work_permit_search/',views.work_permit_search,),
    path('work_permit_save/',views.work_permit_save,),
    path('work_permit_get/',views.work_permit_get,),
    path('work_permit_delete/',views.work_permit_delete,),

    #비자 관리
    path('visa_management',views.visa_management,name='visa_management'),

    path('visa_search/',views.visa_search,),
    path('visa_save/',views.visa_save,),
    path('visa_get/',views.visa_get,),
    path('visa_delete/',views.visa_delete,),

    #스케쥴러
    path('scheduler',views.scheduler,name='scheduler'),
    path('scheduler_events/',views.scheduler_events),


    #문서 관리
    path('document_management',views.document_management,name='document_management'),

    path('document_search/',views.document_search,),

    #정산 관리
    path('audit_management',views.audit_management,name='audit_management'),


    path('audit_search/',views.audit_search,),
    path('audit_save/',views.audit_save,),
    path('audit_get/',views.audit_get,),
    path('audit_delete/',views.audit_delete,),

    path('audit_check_appraove/',views.audit_check_appraove ),

    #인보이스 관리
    path('invoice_management',views.invoice_management,name='invoice_management'),

    path('invoice_search/',views. invoice_search),

    path('invoice_add/',views.invoice_add,),
    path('invoice_get/',views.invoice_get,),
    path('invoice_edit/',views.invoice_edit,),
    path('invoice_delete/',views.invoice_delete,),

    path('print_invoice/<int:id>',views.print_invoice),
    path('send_email_invoice/',views.send_email_invoice),

    #유틸
    ##오토컴플릿
    path('selectbox_search_company/',views.selectbox_search_company,name='selectbox_search_company'),
    path('selectbox_search_employee/',views.selectbox_search_employee,name='selectbox_search_employee'),
    ##파일
    path('file_list/',views.file_list,),
    path('file_get/',views.file_get,),
    path('file_save/',views.file_save,),
    path('file_delete/',views.file_delete,),

]
