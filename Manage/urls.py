from django.urls import path,include
from django.conf.urls import url
from . import views


app_name = 'Manage'

urlpatterns = [



    path('',views.manage,name='manage'),
    path('patient/',views.patient,name='manage_patient'),
    path('payment/',views.payment,name='manage_payment'),
    path('doctor_profit/',views.doctor_profit,name='doctor_profit'),
    
    path('search_payment/',views.search_payment,name='search_payment'),
    path('search_patient/',views.search_patient,name='search_patient'),
    path('search_medicine/',views.search_medicine,name='search_medicine'),

    #엑셀 다운로드
    path('audit_excel/',views.audit_excel),
    path('rec_report_excel/',views.rec_report_excel),
    path('cumstomer_management_excel/',views.cumstomer_management_excel),


    #검사 아이템
    path('inventory_test/',views.inventory_test,name='inventory_test'),
    path('test_search/',views.test_search,name='test_search'),
    path('test_add_edit_get/',views.test_add_edit_get,name='test_add_edit_get'),
    path('test_add_edit_set/',views.test_add_edit_set,name='test_add_edit_set'),
    path('test_add_edit_delete/',views.test_add_edit_delete,name='test_add_edit_delete'),

    #처치 아이템
    path('inventory_precedure/',views.inventory_precedure,name='inventory_precedure'),
    path('precedure_search/',views.precedure_search,name='precedure_search'),
    path('precedure_add_edit_get/',views.precedure_add_edit_get,name='precedure_add_edit_get'),
    path('precedure_add_edit_set/',views.precedure_add_edit_set,name='precedure_add_edit_set'),
    path('precedure_add_edit_delete/',views.precedure_add_edit_delete,name='precedure_add_edit_delete'),

    #소모품 및 의료도구
    path('inventory_medical_tool/',views.inventory_medical_tool,name='inventory_medical_tool'),
    path('medical_tool_search/',views.medicine_search,name='medicine_search'),
    path('medical_tool_add_edit_get/',views.medicine_add_edit_get,name='medicine_add_edit_get'),
    path('medical_tool_add_edit_set/',views.medicine_add_edit_set,name='medicine_add_edit_set'),
    path('medical_tool_add_edit_check_code/',views.medicine_add_edit_check_code,name='medicine_add_edit_check_code'),
    path('medical_tool_add_edit_delete/',views.medicine_add_edit_delete,name='medicine_add_edit_delete'),
    
    path('get_inventory_history/',views.get_inventory_history,name='get_inventory_history'),
    path('save_database_add_medicine/',views.save_database_add_medicine,name='save_database_add_medicine'),
    path('get_expiry_date/',views.get_expiry_date,name='get_expiry_date'),
    path('get_edit_database_add_medicine/',views.get_edit_database_add_medicine,name='get_edit_database_add_medicine'),
    path('save_database_disposal_medicine/',views.save_database_disposal_medicine,name='save_database_disposal_medicine'),

    #기안서
    path('draft/',views.draft,name='draft'),
    path('draft/search/',views.draft_search),
    path('draft/get_data/',views.draft_get_data),
    path('draft/get_form/',views.draft_get_form),

    path('draft/save/',views.draft_save),
    path('draft/delete/',views.draft_delete),
   
    path('draft/list_file/',views.draft_list_file),
    path('draft/get_file/',views.draft_get_file),
    path('draft/save_file/',views.draft_save_file),
    path('draft/delete_file/',views.draft_delete_file),

    path('draft/check_appraove/',views.check_appraove),



    #기안서 출력
    path('draft/print/<int:id>/',views.draft_print),


    #고객 관리
    path('customer_manage/',views.customer_manage,name='customer_manage'),
    path('customer_manage_get_patient_list/',views.customer_manage_get_patient_list),
    path('customer_manage_get_patient_info/',views.customer_manage_get_patient_info),
    path('customer_manage_get_patient_visit/',views.customer_manage_get_patient_visit),
    path('customer_manage_get_patient_visit_history/',views.customer_manage_get_patient_visit_history ),
    path('customer_manage_get_patient_sms_info/',views.customer_manage_get_patient_sms_info),


    #사원 관리
    path('manage_employee/',views.manage_employee,name='manage_employee'),
    path('employee_search/',views.employee_search,name='employee_search'),
    path('employee_check_id/',views.employee_check_id,name='employee_check_id'),
    path('employee_add_edit/',views.employee_add_edit,name='employee_add_edit'),
    path('employee_add_edit_get/',views.employee_add_edit_get,name='employee_add_edit_get'),
    path('employee_delete/',views.employee_delete,name='employee_delete'),
    path('employee_change_password/',views.employee_change_password,name='employee_change_password'),


    #baord
    path('board/',views.board_list,name='board_list'),
    path('board/<int:id>',views.board_list,name='board_list'),
    path('board/new/',views.board_create_edit,name='board_create_edit'),
    path('board/edit/<int:id>/',views.board_create_edit,name='board_create_edit'),
    path('board/delete/<int:id>',views.board_delete,name='board_delete'),
    path('board/delete_file/',views.board_delete_file,name='board_delete_file'),

    path('board/comment/get',views.board_comment_get,name='board_comment_new'),
    path('board/comment/add',views.board_comment_add,name='board_comment_new'),
    path('board/comment/add/<int:comment_id>',views.board_comment_add,name='board_comment_new'),
    path('board/comment/edit/<int:id>/',views.board_comment_edit,name='board_comment_new'),
    path('board/comment/delete/<int:id>/',views.board_comment_delete,name='board_comment_new'),

    #work board
    path('board_work/',views.board_work_list,name='board_work_list'),
    path('board_work/<int:id>',views.board_work_list,name='board_work_list'),
    path('board_work/new/',views.board_work_create_edit,name='board_work_create_edit'),
    path('board_work/edit/<int:id>/',views.board_work_create_edit,name='board_work_create_edit'),

    path('board_work/comment/add',views.board_work_comment_add,name='board_comment_new'),




    #SMS 
    path('sms/send_sms/',views.sms_send_sms), #내용 전달
    path('sms/recv_result/',views.sms_recv_result), # 응답
     
    #SMS History
    path('sms/history/',views.sms_history_index,name='sms_history_index'), 
    path('sms/history/search/',views.sms_history_search), 
    path('sms/history/get/',views.sms_history_get), 
    

    #통계
    ##검사
    path('statistics/test/',views.statistics_test,name='statistics_test'),
    path('statistics/procedure/',views.statistics_procedure,name='statistics_procedure'), 
    path('statistics/medicine/',views.statistics_medicine,name='statistics_medicine'), 
    path('statistics/search/',views.statistics_search),

   
    path('statistics/depart/',views.statistics_depart,name='statistics_depart'), 

    path('statistics/customer_info/',views.statistics_customer_info,name='statistics_customer_info'), 
    path('statistics/search_customer_info/',views.search_customer_info),

    path('statistics/ymw/',views.statistics_ymw,name='statistics_ymw'),  #ymw > year Month Week
    path('statistics/search_ymw/',views.search_ymw),

    path('statistics/daily/',views.statistics_daily,name="statistics_daily"),
    path('statistics/search_daily/',views.search_daily),



    #코드관리
    path('code_setting/',views.code_setting,name="code_setting"),
    path('code_search/',views.code_search),

    path('code_save/',views.code_save),
    path('code_get/',views.code_get),
    path('code_delete/',views.code_delete),

    #path('test/',views.test), 
    #path('test/get_res_table/',views.get_res_table),

]
