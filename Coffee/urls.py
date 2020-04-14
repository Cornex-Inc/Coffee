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
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('register/', views.register, name='register'),

    #notice
    path('notice/', views.notice, name = 'notice'),
    path('notice/edit/', views.notice_edit, name = 'notice_edit'),
    
    path('doctor/',include('Doctor.urls',namespace='Doctor')),
    path('receptionist/',include('Receptionist.urls',namespace='receptionist')),
    path('laboratory/',include('Laboratory.urls',namespace='Laboratory')),
    path('radiation/',include('Radiation.urls',namespace='Radiation')),
    path('pharmacy/',include('Pharmacy.urls',namespace='Pharmacy')),
    path('physical_therapist/',include('physical_therapist.urls',namespace='physical_therapist')),

    path('manage/',include('Manage.urls',namespace='Manage')),

    path('TranslateEN/',views.TranslateEN,name='TranslateEN'),
    path('TranslateVIE/',views.TranslateVIE,name='TranslateVIE'),
    path('TranslateKO/',views.TranslateKO,name='TranslateKO'),

    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),

    path('admin/', admin.site.urls),

    path('summernote/', include('django_summernote.urls')),

    path('test/',views.test),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)