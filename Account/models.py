from django.db import models

from django.contrib.auth.models import BaseUserManager, AbstractBaseUser,PermissionsMixin

from django.utils.translation import gettext as _
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self,user_id,password=None,):
        if not user_id:
            raise ValueError(_('User must have an eamil address'))

        user = self.model(
            user_id = self.normalize_user_id(user_id),

            )

        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self,user_id,password,):
        user = self.create_user(
            user_id,
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


    user_id = models.CharField(
        verbose_name = _('User ID'),
        max_length = 64,
        unique = True,
        null=False,
        )

    is_active = models.BooleanField(
        default = True,
        verbose_name=_('is active'),
        )

    is_superuser = models.BooleanField(
        default=False,
        verbose_name=_('is superuser'),
        )

    #구분 유형
    division_type = models.CharField(
        max_length = 16,
        null= True,
        )

    #부서
    
    depart = models.CharField( 
        max_length = 16,
        null= True,
        )
    #의사 과
    depart_doctor = models.CharField(
        max_length = 16,
        null= True,
        )

    #직급
    rank = models.CharField(
        max_length = 16,
        null= True,
        )

    #한글 이름
    name_ko = models.CharField(
        max_length = 64,
        null = True,
        )

    #영문 이름
    name_en = models.CharField(
        max_length = 64,
        null = True,
        )

    #베트남 이름
    name_vi= models.CharField(
        max_length = 64,
        null = True,
        )

    #성별
    gender = models.CharField(
        max_length = 6,
        null = True,
        )

    #생년월일
    date_of_birth = models.DateField(
        null = True,
        )

    #연락 번호 1
    phone_number1= models.CharField(
        max_length = 16,
        null = True,
        )

    #연락 번호 2
    phone_number2 = models.CharField(
        max_length = 16,
        null = True,
        )

    #이메일
    email= models.CharField(
        max_length = 64,
        null = True,
        )

    #주소
    address= models.CharField(
        max_length = 128,
        null = True,
        )
    
    #입사 일
    date_of_employment= models.DateField(
        max_length = 8,
        null = True,
        )

    #퇴사 일
    date_of_resignation= models.DateField(
        max_length = 8,
        null = True,
        )

    #퇴사 이유
    resignation_memo = models.CharField(
        max_length = 256,
        null = True,
        )
    
    #사원 메모
    memo= models.CharField(
        max_length = 256,
        null = True,
        )



    #등록 일
    date_of_registered = models.DateTimeField(
            auto_now_add=True,
            blank=True,
            null = True,
        )

    #마지막 수정 일
    lastest_modified_date = models.DateTimeField(
            auto_now_add=True,
            blank=True,
            null = True,
        )

    #재직 상태
    status = models.CharField(
        max_length = 8,
        null = True,
        )




    is_staff = models.BooleanField(default=False)
    objects = UserManager()

    USERNAME_FIELD = _('user_id')
    
    def __str__(self):
        return self.user_id

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


    def is_doctor(self):
        return str(self.depart) == 'DOCTOR'    
    def is_nurse(self):
        return str(self.depart) == 'NURSE'
    def is_receptionist(self):
        return str(self.depart) == 'RECEPTIONIST'
    def is_pharmacy(self):
        return str(self.depart) == 'PHARMACY'
    def is_laboratory(self):
        return str(self.depart) == 'LABORATORY'
    def is_radiation(self):
        return str(self.depart) == 'RADIATION'
    def is_physical_therapist(self):
        return str(self.depart) == 'PT'
    
    @property
    def is_admin(self):
        return self.is_superuser
