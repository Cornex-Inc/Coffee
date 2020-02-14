from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import UserChangeForm, UserCreationForm
from .models import User
from django.utils.translation import gettext as _

class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = (_('email'), _('user_role'))
    #list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ( _('email'), _('password'),_('user_role'))}),
        ( _('Permissions'), {'fields': ('is_superuser',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            _('fields'): (_('email'), _('password1'), _('password2'),_('user_role'))}
         ),
    )

    search_fields = (_('email'),)
    ordering = (_('email'),)
    filter_horizontal = ()



admin.site.register(User, UserAdmin)
admin.site.unregister(Group)