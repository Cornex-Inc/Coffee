from django.db import models

from django.contrib.auth.models import BaseUserManager, AbstractBaseUser,PermissionsMixin

from django.utils.translation import gettext as _
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self,email,password=None,):
        if not email:
            raise ValueError(_('User must have an eamil address'))

        user = self.model(
            email = self.normalize_email(email),

            )

        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self,email,password,):
        user = self.create_user(
            email,
            password = password,
            )

        user.is_superuser = True
        user.is_staff = True
        user.save(using = self._db)
        return user

class User(AbstractBaseUser,PermissionsMixin):
    user_role_choices=(('ADMIN',_('Admin')),
            ('DOCTOR', _('Doctor')),
            ('PT', _('Physical Therapist')),#Physical Therapist
            ('RECEPTIONIST', _('Receptionist')),
            ('DENTREC',_('Receptionist for Dental')),
            ('PHARMACY', _('Pharmacy')),
            ('LABORATORY',_('Laboratory')),
            ('RADIATION', _('Radiation')),)


    email = models.CharField(
        verbose_name = _('email'),
        max_length = 64,
        unique = True,
        )

    is_active = models.BooleanField(
        default = True,
        verbose_name=_('is active'),
        )

    is_superuser = models.BooleanField(
        default=False,
        verbose_name=_('is superuser'),
        )

    is_staff = models.BooleanField(default=False)
    user_role = models.CharField(max_length=30, choices=user_role_choices, default='ADMIN')

    objects = UserManager()

    USERNAME_FIELD = _('email')
    
    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


    def is_doctor(self):
        return str(self.user_role) == 'DOCTOR'
    def is_receptionist(self):
        return str(self.user_role) == 'RECEPTIONIST'
    def is_pharmacy(self):
        return str(self.user_role) == 'PHARMACY'
    def is_laboratory(self):
        return str(self.user_role) == 'LABORATORY'
    def is_radiation(self):
        return str(self.user_role) == 'RADIATION'
    def is_physical_therapist(self):
        return str(self.user_role) == 'PT'
        

    @property
    def is_admin(self):
        return self.is_superuser
