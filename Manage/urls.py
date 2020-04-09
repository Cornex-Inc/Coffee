from django.urls import path
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
    
]
