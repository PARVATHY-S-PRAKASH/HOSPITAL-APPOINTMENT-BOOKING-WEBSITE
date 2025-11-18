#admin side

#---------------Admin login---------------------
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.utils.http import url_has_allowed_host_and_scheme
from django.conf import settings
from django.contrib.auth.decorators import login_required
from .models import User

from django.http import HttpResponse

def admin_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        next_url = request.POST.get('next')

        user = authenticate(request, email=email, password=password)
        print("Authenticated user:", user)

        if user is not None and user.is_admin:
            login(request, user)
            if next_url:
                return redirect(next_url)
            return redirect('home')
        else:
            messages.error(request, 'Invalid credentials or not admin.')
            return redirect('admin_login')

    return render(request, 'login.html', {'next': request.GET.get('next', '')})

#----------------------Home page-------------- 

# Home Page View (requires login)
# @login_required(login_url='admin_login')  # Use name, not hardcoded path
def home(request):
    print("User:", request.user)
    print("Is authenticated:", request.user.is_authenticated)
    return render(request, 'home.html')

#------------------Today list----------------------------

from datetime import date, datetime
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Appointments

# @login_required(login_url='login')  # Use 'login' here
def todaylist(request):
    selected_date_str = request.GET.get('date', '')
    try:
        if selected_date_str:
            selected_date = datetime.strptime(selected_date_str, "%Y-%m-%d").date()
        else:
            selected_date = date.today()
    except ValueError:
        selected_date = date.today()

    appointments = Appointments.objects.filter(date=selected_date).select_related('doctor', 'user')

    return render(request, 'todaylist.html', {
        'appointments': appointments,
        'selected_date': selected_date,  # Used to preserve date in input
    })


    
#------------------Doctor-----------------

from .models import Doctor

# @login_required(login_url='admin_login')
# def doctor(request):
#     doctors = Doctor.objects.all()
#     return render(request, 'doctor.html', {'doctors': doctors})


def doctor(request):
    query = request.GET.get('query', '')
    if query:
        doctors = Doctor.objects.filter(Q(name__icontains=query) | Q(department__icontains=query))
    else:
        doctors = Doctor.objects.all()
    
    # Optional: track view if coming via ID
    doctor_id = request.GET.get('view')
    if doctor_id:
        doctor = get_object_or_404(Doctor, id=doctor_id)
        DoctorView.objects.create(doctor=doctor)

    return render(request, 'doctor.html', {'doctors': doctors})



#-----------------------Add-----------------------

from django.shortcuts import render, redirect
from .models import Doctor

def add(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        department = request.POST.get('department')
        qualification = request.POST.get('qualification')
        experience = request.POST.get('experience')
        img = request.FILES.get('photo')  # This handles uploaded files

        # Save to database
        doctor=Doctor.objects.create(
            name=name,
            department=department,
            qualification=qualification,
            experience=experience,
            img=img
        )

        # return redirect('view_doctor', doctor_id=doctor.id)  # Change to the appropriate redirect (e.g., to doctor list)
        return render(request, 'view.html', {'doctor': doctor})
    
    return render(request, 'add.html')

   
   
   
#---------------View doctor-------------------------

def view_doctor(request, doctor_id):
    doctor = Doctor.objects.get(id=doctor_id)
    return render(request, 'view.html', {'doctor': doctor})
 


#---------------------Edit--------------------------------

from django.shortcuts import render, get_object_or_404, redirect
from .models import Doctor

def edit(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id)

    if request.method == 'POST':
        doctor.name = request.POST['name']
        doctor.department = request.POST['department']
        doctor.qualification = request.POST['qualification']
        doctor.experience = request.POST['experience']

        if 'img' in request.FILES:
            doctor.img = request.FILES['img']

        doctor.save()
        # return redirect('doctor_list')  # Change this to the actual name of your list view route
        return render(request, 'view.html', {'doctor': doctor})
    

    return render(request, 'edit.html', {'doctor': doctor})



#---------------------------Delete-------------------

from django.shortcuts import render, get_object_or_404
from .models import Doctor

def delete_doctor(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id)

    if request.method == 'POST':
        # Check if the user confirmed deletion
        if 'confirm' in request.POST:
            doctor_name = doctor.name
            doctor.delete()
            doctors = Doctor.objects.all()
            return render(request, 'doctor.html', {
                'doctors': doctors,
                'message': f'Deleted Dr. {doctor_name}'
            })
        else:
            # If 'cancel' clicked, go back to doctor list
            return redirect('doctor')

    # For GET request, show confirmation page
    return render(request, 'confirm_delete.html', {'doctor': doctor})


#----------------------User list-----------------------

from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User


def user_view(request, user_id):
    user_view = get_object_or_404(User, id=user_id)
    return render(request, 'userview.html', {'user_view': user_view})

#------------------------User View----------------------

from django.contrib.auth import get_user_model
from django.shortcuts import render

User = get_user_model()

def user_list(request):
    users = User.objects.all()
    return render(request, 'user.html', {'users': users})



#-------------------User history---------------------

from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Appointments

User = get_user_model()

def user_history(request, user_id):
    user = get_object_or_404(User, id=user_id)
    today = timezone.localdate()

    upcoming_appointments = Appointments.objects.filter(user=user, date__gte=today).order_by('date', 'time')
    past_appointments = Appointments.objects.filter(user=user, date__lt=today).order_by('-date', '-time')

    context = {
        'upcoming_appointments': upcoming_appointments,
        'past_appointments': past_appointments,
    }
    return render(request, 'userhistory.html', context)





#------------------Reports----------------------

from django.db.models import Count, Q
from .models import Doctor, DoctorView

def reports(request):
    month = request.GET.get('month', '')
    department = request.GET.get('department', '')
    selected_month = str(month) if month else ''

    

    doctors = Doctor.objects.all()

    if department:
        doctors = doctors.filter(department__iexact=department)

    # if month:
        try:
            month = int(month)
            doctors = doctors.annotate(
                total_views=Count('views', filter=Q(views__date__month=month))
            )
        except (ValueError, TypeError):
            month=None
            doctors = doctors.annotate(total_views=Count('views'))
    # else:
    #     doctors = doctors.annotate(total_views=Count('views'))

    return render(request, 'reports.html', {
        'doctors': doctors,
        'months': range(1, 13),
        'selected_month': selected_month,
        'selected_dept': department,
    })





#------------------------------Logout---------------------------

from django.contrib.auth import logout
from django.shortcuts import redirect

def admin_logout(request):
    logout(request)
    return redirect('admin_login')

#-----------------------------------------------------------------


# user side

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import DoctorSerializer, UserSerializer, AppointmentSerializer
from adminapp.models import User
from adminapp.models import Doctor
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .models import Appointments
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes


@api_view(['POST'])
@permission_classes((AllowAny,))
def Signup(request):
    name  = request.data.get("name")
    email  = request.data.get("email")
    dob  = request.data.get("dob")
    gender  = request.data.get("gender")
    address  = request.data.get("address")
    contactno  = request.data.get("contactno")
    password = request.data.get("password")
    if not name or not email or not password:
        return Response({'message':'All fields are required'})
    if User.objects.filter(email=email).exists():
        return  Response({'message':'Email already exist'}, status=400)
    user = User.objects.create_user(email=email, password=password)
    user.name = name
    user.dob = dob
    user.gender = gender
    user.address = address
    user.contactno = contactno
    user.save()
    return Response({'message':'user created successsfully'} ,status = 200)
    

# -----------------------API LOGIN-----------------------------

@api_view(['POST'])
@permission_classes((AllowAny,))
def userlogin(request):
    email  = request.data.get("email")
    password = request.data.get("password")
    print(email,password)
    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=HTTP_200_OK)
 


# ----------------------Doctor List-------------------------

@api_view(['GET'])  
@permission_classes((AllowAny,))
def management(request):
    doctors = Doctor.objects.all()  
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


# ---------------------Book Appointments-------------------

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def appointments(request):
    user = request.user  # Securely get user from token
    print(user)
    doctor_id = request.data.get('doctor_id')
    date = request.data.get('date')
    time = request.data.get('time')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({'message': 'Doctor not found'}, status=404)

    appointment = Appointments.objects.create(
        user=user,
        doctor=doctor,
        date=date,
        time=time
    )
    return Response({'message': 'Appointment booked successfully'})


# ---------------My Appointments-------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_appointments(request):
    print("Request User:", request.user)
    appointments = Appointments.objects.filter(user=request.user)
    serializer = AppointmentSerializer(appointments, many=True)
    print(serializer.data)
    return Response(serializer.data)

# ----------------Cancel Appointment----------------------

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Appointments

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel(request, appointment_id):
    appointment = get_object_or_404(Appointments, id=appointment_id)
    
    if appointment.user != request.user:
        return Response({'error': 'You do not have permission to cancel this appointment.'},
                        status=status.HTTP_403_FORBIDDEN)
                
    appointment.delete()
    return Response({'message': 'Appointment cancelled successfully'}, status=status.HTTP_200_OK)


# ----------------Reset Password----------------------

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reset_password(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not old_password or not new_password or not confirm_password:
        return Response({"error": "All password fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({"error": "New password and confirm password do not match."}, status=status.HTTP_400_BAD_REQUEST)

    if old_password == new_password:
        return Response({"error": "New password cannot be the same as the old password."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

