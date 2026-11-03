# Supra Hospital — Public Website

A responsive public-facing hospital website with an online appointment request form.

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Python Django + Django REST Framework
- Database: MySQL (Docker Compose) or SQLite for a quick local start
- Admin: Django Admin

## Features
- Responsive home page with hospital introduction and service highlights
- Departments and doctor directory (API-driven)
- Appointment request form with server-side validation
- Contact/enquiry form
- Django admin for managing doctors, departments, appointments and enquiries
- Health-information privacy-conscious form: do not enter diagnoses, medical records, or other sensitive clinical details

> This starter project is not a clinical system and does not provide emergency care. For emergencies, call your local emergency number or visit the nearest emergency department. The website must not be used to request emergency assistance.

## 1. Prerequisites
- Python 3.11+
- Node.js 20+
- npm
- Docker Desktop (recommended for MySQL), or use SQLite for local testing

## 2. Backend setup

Open a terminal in `backend/`:

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

For the easiest first run, leave `USE_SQLITE=True` in `.env`.

```bash
python manage.py migrate
python manage.py seed_demo
python manage.py createsuperuser
python manage.py runserver
```

Backend API: http://127.0.0.1:8000/api/
Admin: http://127.0.0.1:8000/admin/

## 3. Frontend setup

Open a second terminal in `frontend/`:

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## 4. Use MySQL with Docker

From the project root:

```bash
docker compose up -d db
```

In `backend/.env`, set:

```env
USE_SQLITE=False
DB_NAME=supra_hospital
DB_USER=supra_user
DB_PASSWORD=change-this-password
DB_HOST=127.0.0.1
DB_PORT=3307
```

Then run:

```bash
cd backend
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

The Compose file maps MySQL to host port `3307` to avoid colliding with a local MySQL installation.

## 5. Configure the real hospital details

The hospital name and sample content are prefilled from the supplied slide. Before publishing, verify and replace:
- Official address, phone number, email and opening hours
- Doctor names, qualifications, schedules and availability
- Actual department/service availability
- Appointment workflow and staff responsibilities
- Privacy notice, consent wording and applicable legal requirements

The slide indicates 24/7 casualty, dialysis/specialities, pharmacy/lab and psychology services. These are shown as presentation-derived service categories, not independently verified claims. Confirm all details with hospital management.

## 6. API endpoints

- `GET /api/health/`
- `GET /api/departments/`
- `GET /api/doctors/`
- `POST /api/appointments/`
- `POST /api/enquiries/`

Appointment status and all submitted records can be managed in Django Admin.

## 7. Production checklist

Do not deploy with development settings. Set a strong `DJANGO_SECRET_KEY`, `DEBUG=False`, exact `ALLOWED_HOSTS`, secure HTTPS, production database credentials, backups, rate limiting, email delivery, monitoring and a reviewed privacy policy. Restrict admin access and use least-privilege database credentials. Have the hospital approve all content and obtain appropriate consent before collecting personal information.

This project stores appointment contact details. Treat the database as confidential, limit staff access, define retention/deletion rules and do not store clinical records in this starter application.
