from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.db import models
from django.utils import timezone
# from django.contrib.auth.models import User
from django.conf import settings
    
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_admin=False, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        user = self.model(email=self.normalize_email(email), is_admin=is_admin, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        return self.create_user(email, password, is_admin=True, **extra_fields)




class User(AbstractBaseUser, PermissionsMixin):  # <- IMPORTANT
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    dob = models.DateField(default=timezone.now)
    gender = models.CharField(max_length=1, choices=[('M','Male'), ('F','Female'), ('O','Other')])
    address = models.TextField()
    contactno = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)  # ADD THIS

    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email

    # @property
    # def is_authenticated(self):
    #     return True
    
    # def is_staff(self):
    #     return self.is_admin
    @property
    def is_staff(self):
        return self.is_admin

    



class Doctor(models.Model):
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    qualification = models.CharField(max_length=100)
    experience = models.PositiveIntegerField()
    img = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self):
        return self.name

   

class DoctorView(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='views')
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.doctor.name} viewed on {self.date}"



class Appointments(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.user.email} with {self.doctor.name} on {self.date} at {self.time}"



