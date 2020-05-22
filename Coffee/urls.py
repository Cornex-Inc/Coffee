"""
Definition of urls for Coffee.
"""

from datetime import datetime
from django.urls import path, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LoginView, LogoutView
from app import forms, views
from django.utils import timezone

from Account.forms import UserRegisterForm, UserRuleChoiceForm, DoctorDepartChoiceForm

from django.views.i18n import JavaScriptCatalog
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='index'),
    path('login/', views.login,name='login'),
    path('logout/', views.logout, name='logout'),
    #path('login/', auth_views.auth_login,name='login'),
    #path('login/',
    #     LoginView.as_view
    #     (
    #         template_name='app/login.html',
    #         authentication_form=forms.BootstrapAuthenticationForm,
    #         extra_context=
    #         {
    #             'title': 'Log in',
    #             'year' : datetime.now().year,
    #             'register_user':UserRegisterForm(),
    #             'register_role':UserRuleChoiceForm(),
    #             'register_doctor':DoctorDepartChoiceForm()
    #         }
    #     ),
    #     name='login'),
    #path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('register/', views.register, name='register'),

    path('doctor/',include('Doctor.urls',namespace='Doctor')),
    path('receptionist/',include('Receptionist.urls',namespace='receptionist')),
    path('laboratory/',include('Laboratory.urls',namespace='Laboratory')),
    path('radiation/',include('Radiation.urls',namespace='Radiation')),
    path('pharmacy/',include('Pharmacy.urls',namespace='Pharmacy')),
    path('physical_therapist/',include('physical_therapist.urls',namespace='physical_therapist')),

    path('manage/',include('Manage.urls',namespace='Manage')),


    ##admin 접속
    path('admin/',views.admin,name='admin'),
     
    #KBL ERP
    path('KBL/',include('KBL.urls',namespace='KBL')), 
     
    ##admin 접속
    path('admin/',views.admin,name='admin'),


    #번역
    path('TranslateEN/',views.TranslateEN,name='TranslateEN'),
    path('TranslateVIE/',views.TranslateVIE,name='TranslateVIE'),
    path('TranslateKO/',views.TranslateKO,name='TranslateKO'),
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    

    #Django 관리자
    path('cornex/', admin.site.urls),



    #서머노트 - 게시판
    path('summernote/', include('django_summernote.urls')),


    #테스트
    path('test/',views.test),
    path('test/send/',views.test_send),
    path('test/recv/',views.test_recv),
    path('test/get_res_table/',views.get_res_table),

    path('signpad/',views.signpad,name='signpad'),
    path('search_waiting_sign/',views.search_waiting_sign,),
    path('save_sign/',views.save_sign,),


    ]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)