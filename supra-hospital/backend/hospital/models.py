from django.db import models
from django.core.validators import RegexValidator

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=40, default="＋")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class Doctor(models.Model):
    name = models.CharField(max_length=120)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="doctors")
    qualification = models.CharField(max_length=160, blank=True)
    experience_years = models.PositiveSmallIntegerField(default=0)
    availability = models.CharField(max_length=160, blank=True)
    bio = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class Appointment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"), ("confirmed", "Confirmed"),
        ("completed", "Completed"), ("cancelled", "Cancelled"),
    ]
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20, validators=[RegexValidator(r"^[0-9+() -]{7,20}$", "Enter a valid phone number.")])
    email = models.EmailField()
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name="appointments")
    preferred_date = models.DateField()
    preferred_time = models.CharField(max_length=30)
    message = models.CharField(max_length=500, blank=True, help_text="Do not include diagnoses or sensitive medical details.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.preferred_date} ({self.status})"

class Enquiry(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=160)
    message = models.TextField(max_length=1500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.subject} — {self.name}"
