from django.urls import path,include
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

    


    path('inventory_test/',views.inventory_test,name='inventory_test'),
    path('test_search/',views.test_search,name='test_search'),
    path('test_add_edit_get/',views.test_add_edit_get,name='test_add_edit_get'),
    path('test_add_edit_set/',views.test_add_edit_set,name='test_add_edit_set'),
    path('test_add_edit_delete/',views.test_add_edit_delete,name='test_add_edit_delete'),


    path('inventory_precedure/',views.inventory_precedure,name='inventory_precedure'),
    path('precedure_search/',views.precedure_search,name='precedure_search'),
    path('precedure_add_edit_get/',views.precedure_add_edit_get,name='precedure_add_edit_get'),
    path('precedure_add_edit_set/',views.precedure_add_edit_set,name='precedure_add_edit_set'),
    path('precedure_add_edit_delete/',views.precedure_add_edit_delete,name='precedure_add_edit_delete'),


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


    
    #baord
    #path('summernote/', include('django_summernote.urls')),

    path('board/',views.board_list,name='board_list'),
    path('board/<int:id>',views.board_list,name='board_list'),
    path('board/new/',views.board_create_edit,name='board_create_edit'),
    path('board/edit/<int:id>/',views.board_create_edit,name='board_create_edit'),
    path('board/delete/<int:id>',views.board_delete,name='board_delete'),

    path('board/comment/get',views.board_comment_get,name='board_comment_new'),
    path('board/comment/add',views.board_comment_add,name='board_comment_new'),
    path('board/comment/add/<int:comment_id>',views.board_comment_add,name='board_comment_new'),
    path('board/comment/edit/<int:id>/',views.board_comment_edit,name='board_comment_new'),
    path('board/comment/delete/<int:id>/',views.board_comment_delete,name='board_comment_new'),
]
