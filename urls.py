from django.urls import path
from adminapp import views


urlpatterns = [
    #user
    
    path('signup/', views.Signup, name='signup'),
    path('adminlogin/', views.userlogin, name='adminlogin'),
    path('management/', views.management, name='management'),
    path('appointments/', views.appointments, name='appointments'),  
    path('appointments/<int:user_id>/', views.appointments, name='appointments_by_id'),  # Optional
    path('my_appointments/', views.my_appointments, name='my_appointments'),
    path("cancel/<int:appointment_id>/", views.cancel, name="cancel"),
    path('reset_password/', views.reset_password, name='reset_password'),
    
    
    #admin
    
    path('api/admin_login/', views.admin_login, name='admin_login'),
    path('home/', views.home, name='home'),
    path('todaylist/', views.todaylist, name='todaylist'),
    
    #doctor list
    path('doctor/', views.doctor, name='doctor'),  # <== Add this line!
    
    #add doctor
    path('doctor/add/', views.add, name='add'),
    
    #view doctor
    path('view_doctor/<int:doctor_id>/', views.view_doctor, name='view'),
    
    #edit doctor
    path('doctor/edit/<int:doctor_id>/', views.edit, name='edit_doctor'),
    
    #delete doctor
    path('doctor/delete/<int:doctor_id>/', views.delete_doctor, name='delete_doctor'),
    
    #most viewed
    path('reports/', views.reports, name='reports'),
    
    #user
    path('users/', views.user_list, name='user_list'),
    path('users/<int:user_id>/view/', views.user_view, name='user_view'),
    path('users/<int:user_id>/history/', views.user_history, name='user_history'),
    
    path('logout/', views.admin_logout, name='logout'),
]
