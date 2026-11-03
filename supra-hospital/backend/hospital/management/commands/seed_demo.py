from django.core.management.base import BaseCommand
from hospital.models import Department

class Command(BaseCommand):
    help = "Create starter departments for the public website."

    def handle(self, *args, **options):
        departments = [
            ("Emergency & Casualty", "Emergency and casualty service information. The hospital indicates 24/7 casualty availability; verify current operations directly.", "✚"),
            ("Dialysis & Specialities", "Specialist care and dialysis service information.", "＋"),
            ("Pharmacy & Laboratory", "Pharmacy and diagnostic laboratory service information.", "⚕"),
            ("Psychology & Mental Wellness", "Psychology and mental wellness service information.", "♡"),
        ]
        for name, description, icon in departments:
            Department.objects.get_or_create(name=name, defaults={"description": description, "icon": icon})
        self.stdout.write(self.style.SUCCESS("Starter departments are ready. Add verified doctors in Django Admin."))
