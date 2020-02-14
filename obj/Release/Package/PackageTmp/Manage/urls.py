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
]
