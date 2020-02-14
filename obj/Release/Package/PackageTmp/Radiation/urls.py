from django.urls import path

from Radiation import views


app_name = 'Radiation'

urlpatterns = [
    path('',views.index,name='radiation_index'),
    path('waiting_list/',views.waiting_list,name='waiting_list'),
    path('waiting_selected/',views.waiting_selected,name='waiting_selected'),
    


    path('get_image/',views.get_image,name='get_image'),

    path('zoom_in/<int:img_id>',views.zoom_in,name='zoom_in'),
]
