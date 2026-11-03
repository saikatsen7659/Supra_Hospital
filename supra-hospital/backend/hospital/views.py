from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Department, Doctor
from .serializers import DepartmentSerializer, DoctorSerializer, AppointmentSerializer, EnquirySerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok", "service": "Supra Hospital API"})

class DepartmentList(generics.ListAPIView):
    serializer_class = DepartmentSerializer
    queryset = Department.objects.filter(is_active=True)

class DoctorList(generics.ListAPIView):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.filter(is_active=True, department__is_active=True).select_related("department")

class AppointmentCreate(generics.CreateAPIView):
    serializer_class = AppointmentSerializer

class EnquiryCreate(generics.CreateAPIView):
    serializer_class = EnquirySerializer
