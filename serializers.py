from rest_framework import serializers
from .models import Doctor, User, Appointments

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ['id', 'name', 'email', 'contactno']
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)  

    class Meta:
        model = Appointments
        fields = ['id', 'doctor', 'date', 'time']