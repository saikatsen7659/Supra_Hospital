from django.urls import path
from .views import health, DepartmentList, DoctorList, AppointmentCreate, EnquiryCreate

urlpatterns = [
    path("health/", health),
    path("departments/", DepartmentList.as_view()),
    path("doctors/", DoctorList.as_view()),
    path("appointments/", AppointmentCreate.as_view()),
    path("enquiries/", EnquiryCreate.as_view()),
]
