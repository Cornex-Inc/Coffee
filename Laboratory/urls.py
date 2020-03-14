from django.urls import path
from . import views

app_name = 'Laboratory'

urlpatterns = [
    path('',views.index,name='laboratory_index'),
    path('waiting_list/',views.waiting_list,name='waiting_list'),
    path('waiting_selected/',views.waiting_selected,name='waiting_selected'),
    path('get_test_manage/',views.get_test_manage,name='get_test_manage'),
    
    path('save/',views.save,name='save'),


    path('checklist',views.checklist,name='checklist'),
]
