from django.urls import path
from . import views

app_name = 'physical_therapist'

urlpatterns = [
    path('',views.index,name='index'),
]
