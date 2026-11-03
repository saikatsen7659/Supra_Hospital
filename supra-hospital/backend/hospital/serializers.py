from datetime import date
from rest_framework import serializers
from .models import Department, Doctor, Appointment, Enquiry

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "description", "icon"]

class DoctorSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    class Meta:
        model = Doctor
        fields = ["id", "name", "department", "department_name", "qualification", "experience_years", "availability", "bio"]

class AppointmentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    class Meta:
        model = Appointment
        fields = ["id", "name", "phone", "email", "department", "department_name", "doctor", "preferred_date", "preferred_time", "message", "status", "created_at"]
        read_only_fields = ["id", "status", "created_at"]

    def validate_preferred_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Please choose today or a future date.")
        return value

    def validate(self, attrs):
        doctor = attrs.get("doctor")
        department = attrs.get("department")
        if doctor and doctor.department_id != department.id:
            raise serializers.ValidationError({"doctor": "Please choose a doctor from the selected department."})
        if doctor and not doctor.is_active:
            raise serializers.ValidationError({"doctor": "This doctor is not currently accepting requests."})
        return attrs

class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ["id", "name", "email", "phone", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]
