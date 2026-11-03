from django.contrib import admin
from .models import Department, Doctor, Appointment, Enquiry

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    search_fields = ("name",)

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "department", "experience_years", "is_active")
    list_filter = ("department", "is_active")
    search_fields = ("name", "qualification")

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("name", "department", "preferred_date", "preferred_time", "status", "created_at")
    list_filter = ("status", "department", "preferred_date")
    search_fields = ("name", "phone", "email")
    readonly_fields = ("created_at",)

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "subject", "email", "created_at")
    search_fields = ("name", "email", "subject")
    readonly_fields = ("created_at",)
