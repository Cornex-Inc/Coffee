from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import UserChangeForm, UserCreationForm
from .models import User
from django.utils.translation import gettext as _

class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = (_('user_id'), _('depart'))
    #list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ( _('user_id'), _('password'),_('depart'))}),
        ( _('Permissions'), {'fields': ('is_superuser',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            _('fields'): (_('user_id'), _('password1'), _('password2'),_('depart'))}
         ),
    )

    search_fields = (_('user_id'),)
    ordering = (_('user_id'),)
    filter_horizontal = ()



admin.site.register(User, UserAdmin)
admin.site.unregister(Group)