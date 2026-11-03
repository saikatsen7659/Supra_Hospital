
import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, ArrowUpRight, Award, CalendarDays,
  CheckCircle2, ChevronDown, Clock3, FlaskConical, HeartPulse,
  Menu, Phone, ShieldCheck, Stethoscope, Users, X, MapPin,
  Mail, Brain, Pill, Ambulance
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api'

const fallbackDepartments = [
  {
    id: 1,
    name: 'Emergency & Casualty',
    description: 'Emergency and casualty service information. Contact the hospital directly for urgent assistance.',
    icon: '✚'
  },
  {
    id: 2,
    name: 'Dialysis & Specialities',
    description: 'Specialist care and dialysis service information.',
    icon: '＋'
  },
  {
    id: 3,
    name: 'Pharmacy & Laboratory',
    description: 'Pharmacy and diagnostic laboratory service information.',
    icon: '⚕'
  },
  {
    id: 4,
    name: 'Psychology & Mental Wellness',
    description: 'Psychology and mental wellness service information.',
    icon: '♡'
  },
]

const serviceIcons = [Ambulance, Activity, FlaskConical, Brain]

function Header() {
  const [open, setOpen] = useState(false)

  const links = [
    ['Services', '#services'],
    ['Our approach', '#about'],
    ['Doctors', '#doctors'],
    ['Contact', '#contact']
  ]

  return (
    <header className="header">
      <div className="container nav">
        <a className="brand" href="#">
          <span className="brand-mark">S+</span>
          <span>SUPRA <small>HOSPITAL</small></span>
        </a>

        <nav className={open ? 'nav-links show' : 'nav-links'}>
          {links.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#appointment">
          Book an appointment <ArrowUpRight size={16}/>
        </a>

        <button
          className="menu-btn"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X/> : <Menu/>}
        </button>
      </div>
    </header>
  )
}

function App() {
  const [departments, setDepartments] = useState(fallbackDepartments)
  const [doctors, setDoctors] = useState([])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    doctor: '',
    preferred_date: '',
    preferred_time: 'Morning (9 AM – 12 PM)',
    message: ''
  })

  const [enquiry, setEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [bookingState, setBookingState] = useState({
    loading: false,
    message: '',
    error: false
  })

  const [enquiryState, setEnquiryState] = useState({
    loading: false,
    message: '',
    error: false
  })

  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => {
    fetch(`${API}/departments/`)
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(data => {
        setDepartments(data)
        setApiOnline(true)
      })
      .catch(() => setApiOnline(false))

    fetch(`${API}/doctors/`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => setDoctors([]))
  }, [])

  const selectedDoctors = useMemo(
    () => doctors.filter(d => String(d.department) === String(form.department)),
    [doctors, form.department]
  )

  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const updateEnquiry = (e) =>
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value })

  async function submitAppointment(e) {
    e.preventDefault()

    setBookingState({
      loading: true,
      message: '',
      error: false
    })

    try {
      const response = await fetch(`${API}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          department: Number(form.department),
          doctor: form.doctor ? Number(form.doctor) : null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Object.values(data).flat().join(' ') ||
          'Unable to submit request.'
        )
      }

      setBookingState({
        loading: false,
        message: `Thank you, ${form.name}. Your appointment request #${data.id} has been received. The hospital team will contact you to confirm it.`,
        error: false
      })

      setForm({
        name: '',
        phone: '',
        email: '',
        department: '',
        doctor: '',
        preferred_date: '',
        preferred_time: 'Morning (9 AM – 12 PM)',
        message: ''
      })

    } catch (err) {
      setBookingState({
        loading: false,
        message: `${err.message} Please check that the backend is running and try again.`,
        error: true
      })
    }
  }

  async function submitEnquiry(e) {
    e.preventDefault()

    setEnquiryState({
      loading: true,
      message: '',
      error: false
    })

    try {
      const response = await fetch(`${API}/enquiries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enquiry)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Object.values(data).flat().join(' ') ||
          'Unable to send enquiry.'
        )
      }

      setEnquiryState({
        loading: false,
        message: 'Your enquiry has been submitted. Our team will get back to you.',
        error: false
      })

      setEnquiry({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })

    } catch (err) {
      setEnquiryState({
        loading: false,
        message: `${err.message} Please try again later.`,
        error: true
      })
    }
  }

  return (
    <>
      <div className="topline">
        <div className="container top-inner">
          <span>
            <Clock3 size={14}/>
            Emergency information: contact the hospital directly for urgent care
          </span>

          <span className="api-status">
            <i className={apiOnline ? 'dot online' : 'dot'} />
            {apiOnline ? 'Booking system connected' : 'Website preview mode'}
          </span>
        </div>
      </div>

      <Header/>

      <main>
        <section className="hero">
          <div className="hero-bg"></div>

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span></span> CARE THAT MOVES YOU FORWARD
              </div>

              <h1>
                Better care.<br/>
                <em>Brighter</em> tomorrows.
              </h1>

              <p className="hero-lead">
                Thoughtful healthcare, specialist support and a team focused on helping you feel informed, supported and cared for.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#appointment">
                  Request an appointment <ArrowRight size={17}/>
                </a>

                <a className="text-link" href="#services">
                  Explore our services <ArrowUpRight size={16}/>
                </a>
              </div>

              <div className="hero-proof">
                <div className="proof-icon">
                  <ShieldCheck size={20}/>
                </div>
                <div>
                  <b>Your wellbeing comes first</b>
                  <small>Clear information. Considerate care.</small>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=85"
                  onError={e => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=85'
                  }}
                  alt="Modern hospital corridor"
                />

                <div className="image-label">
                  <span className="label-icon">
                    <HeartPulse size={20}/>
                  </span>
                  <span>
                    <b>Care, connected</b>
                    <small>Across every step</small>
                  </span>
                </div>
              </div>

              <div className="floating-note">
                <span className="note-icon">
                  <Stethoscope size={20}/>
                </span>
                <div>
                  <b>Multispeciality support</b>
                  <small>Services in one place</small>
                </div>
              </div>

              <div className="circle-stamp">
                CARE<br/>WITH<br/>PURPOSE
              </div>
            </div>
          </div>

          <div className="hero-bottom container">
            <span>COMPASSION</span>
            <span className="line"></span>
            <span>EXPERTISE</span>
            <span className="line"></span>
            <span>ACCESSIBILITY</span>
          </div>
        </section>

        <section className="intro section" id="about">
          <div className="container intro-grid">
            <div>
              <div className="eyebrow dark">
                <span></span> WELCOME TO SUPRA
              </div>
              <h2>
                Healthcare should feel<br/>
                <em>human, always.</em>
              </h2>
            </div>

            <div className="intro-text">
              <p>
                Supra Hospital is presented as a multispeciality care centre, bringing together emergency support, specialist services, pharmacy, laboratory and psychology-related care.
              </p>
              <p>
                Our goal for this website is to make service information easier to find and appointment requests easier to send. Please contact the hospital to verify current availability, timings and clinical details.
              </p>
              <a href="#contact" className="under-link">
                Talk to our team <ArrowUpRight size={16}/>
              </a>
            </div>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <span></span> WHAT WE OFFER
                </div>
                <h2>
                  Support for your<br/>
                  <em>health journey.</em>
                </h2>
              </div>

              <p>
                Explore the service categories shown in the hospital presentation. Contact the hospital directly to confirm availability and make service-specific arrangements.
              </p>
            </div>

            <div className="service-grid">
              {departments.map((d, i) => {
                const Icon = serviceIcons[i % serviceIcons.length]

                return (
                  <article className="service-card" key={d.id}>
                    <div className="service-top">
                      <span className="service-icon">
                        <Icon size={23}/>
                      </span>
                      <span className="service-number">0{i + 1}</span>
                    </div>

                    <h3>{d.name}</h3>
                    <p>{d.description}</p>

                    <a
                      href="#appointment"
                      aria-label={`Request appointment for ${d.name}`}
                    >
                      Enquire about service <ArrowUpRight size={16}/>
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="care-band">
          <div className="container care-grid">
            <div className="care-symbol">
              <HeartPulse size={44}/>
              <span>SUPRA</span>
            </div>

            <div>
              <div className="eyebrow light">
                <span></span> OUR COMMITMENT
              </div>
              <h2>
                Care is more than<br/>
                a consultation.
              </h2>
            </div>

            <p>
              It is clear communication, thoughtful guidance and making the next step easier. We want every visitor to know where to go and how to get in touch.
            </p>
          </div>
        </section>

        <section className="doctors section" id="doctors">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow dark">
                  <span></span> OUR PEOPLE
                </div>
                <h2>
                  Meet your care<br/>
                  <em>team.</em>
                </h2>
              </div>

              <p>
                Doctor profiles will appear here when the hospital team adds verified information through the admin portal.
              </p>
            </div>

            {doctors.length ? (
              <div className="doctor-grid">
                {doctors.map(d => (
                  <article className="doctor-card" key={d.id}>
                    <div className="doctor-avatar">
                      <Stethoscope size={30}/>
                    </div>

                    <div>
                      <h3>{d.name}</h3>
                      <p>{d.qualification || d.department_name}</p>
                      <small>
                        {d.department_name} · {d.experience_years} years' experience
                      </small>
                      {d.availability && <small>{d.availability}</small>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="doctor-empty">
                <Users size={28}/>
                <div>
                  <b>Doctor directory coming soon</b>
                  <span>
                    Verified doctor details will be published here by the hospital.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="appointment section" id="appointment">
          <div className="container appointment-grid">
            <div className="appointment-copy">
              <div className="eyebrow light">
                <span></span> TAKE THE NEXT STEP
              </div>

              <h2>
                Let's make time<br/>
                for <em>your health.</em>
              </h2>

              <p>
                Send an appointment request and the hospital team can contact you to confirm the details. Your request is not confirmed until the hospital contacts you.
              </p>

              <div className="appointment-points">
                <span><CheckCircle2 size={17}/> Simple request form</span>
                <span><CheckCircle2 size={17}/> Department selection</span>
                <span><CheckCircle2 size={17}/> Follow-up by hospital staff</span>
              </div>

              <div className="emergency-note">
                <Ambulance size={20}/>
                <span>
                  <b>Need urgent medical help?</b>
                  <small>
                    This form is not monitored for emergencies. Call local emergency services or go to the nearest emergency department.
                  </small>
                </span>
              </div>
            </div>

            <form className="booking-form" onSubmit={submitAppointment}>
              <div className="form-heading">
                <span>APPOINTMENT REQUEST</span>
                <h3>Tell us how to reach you.</h3>
                <p>Fields marked * are required.</p>
              </div>

              <div className="form-row">
                <label>
                  Full name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    required
                    maxLength="120"
                    placeholder="Your full name"
                  />
                </label>

                <label>
                  Phone number *
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateForm}
                    required
                    minLength="7"
                    maxLength="20"
                    placeholder="+91 00000 00000"
                  />
                </label>
              </div>

              <label>
                Email address *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateForm}
                  required
                  placeholder="you@example.com"
                />
              </label>

              <div className="form-row">
                <label>
                  Department *
                  <select
                    name="department"
                    value={form.department}
                    onChange={e => setForm({
                      ...form,
                      department: e.target.value,
                      doctor: ''
                    })}
                    required
                  >
                    <option value="">Choose a department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Preferred doctor
                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={updateForm}
                    disabled={!selectedDoctors.length}
                  >
                    <option value="">No preference</option>
                    {selectedDoctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Preferred date *
                  <input
                    type="date"
                    name="preferred_date"
                    value={form.preferred_date}
                    onChange={updateForm}
                    min={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </label>

                <label>
                  Preferred time *
                  <select
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={updateForm}
                    required
                  >
                    <option>Morning (9 AM – 12 PM)</option>
                    <option>Afternoon (12 PM – 4 PM)</option>
                    <option>Evening (4 PM – 7 PM)</option>
                    <option>Any available time</option>
                  </select>
                </label>
              </div>

              <label>
                Message (optional)
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateForm}
                  maxLength="500"
                  placeholder="Share a brief scheduling request only. Please do not include diagnoses or sensitive medical details."
                />
              </label>

              <button
                className="btn btn-primary submit-btn"
                disabled={bookingState.loading}
              >
                {bookingState.loading ? 'Sending request…' : 'Send appointment request'}
                <ArrowRight size={17}/>
              </button>

              {bookingState.message && (
                <div
                  className={bookingState.error ? 'form-alert error' : 'form-alert success'}
                  role="status"
                >
                  {bookingState.message}
                </div>
              )}

              <small className="privacy-note">
                <ShieldCheck size={14}/>
                Your details are used to respond to this request. Please review the hospital's privacy policy before launch.
              </small>
            </form>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="container contact-grid">
            <div>
              <div className="eyebrow dark">
                <span></span> GET IN TOUCH
              </div>

              <h2>
                We're here to<br/>
                <em>help you connect.</em>
              </h2>

              <p>
                For current opening hours, doctor availability, emergency arrangements and directions, please contact Supra Hospital directly.
              </p>

              {/* Updated hospital contact details */}
              <div className="contact-list">
                <div>
                  <Phone/>
                  <span>
                    <b>Phone</b>
                    <a href="tel:+919233792347">+91 9233792347</a>
                  </span>
                </div>

                <div>
                  <Mail/>
                  <span>
                    <b>Email</b>
                    <small>support@suprahospital</small>
                  </span>
                </div>

                <div>
                  <MapPin/>
                  <span>
                    <b>Visit</b>
                    <small>JP Nagar, Bengaluru – 653004</small>
                  </span>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={submitEnquiry}>
              <h3>Send an enquiry</h3>
              <p>We'd be happy to hear from you.</p>

              <label>
                Your name
                <input
                  name="name"
                  value={enquiry.name}
                  onChange={updateEnquiry}
                  required
                  maxLength="120"
                  placeholder="Full name"
                />
              </label>

              <div className="form-row">
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={enquiry.email}
                    onChange={updateEnquiry}
                    required
                    placeholder="Email address"
                  />
                </label>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={enquiry.phone}
                    onChange={updateEnquiry}
                    placeholder="Phone (optional)"
                  />
                </label>
              </div>

              <label>
                Subject
                <input
                  name="subject"
                  value={enquiry.subject}
                  onChange={updateEnquiry}
                  required
                  maxLength="160"
                  placeholder="How can we help?"
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  value={enquiry.message}
                  onChange={updateEnquiry}
                  required
                  maxLength="1500"
                  placeholder="Write your enquiry…"
                />
              </label>

              <button
                className="btn btn-dark"
                disabled={enquiryState.loading}
              >
                {enquiryState.loading ? 'Sending…' : 'Submit enquiry'}
                <ArrowRight size={17}/>
              </button>

              {enquiryState.message && (
                <div
                  className={enquiryState.error ? 'form-alert error' : 'form-alert success'}
                  role="status"
                >
                  {enquiryState.message}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-top">
          <a className="brand brand-footer" href="#">
            <span className="brand-mark">S+</span>
            <span>SUPRA <small>HOSPITAL</small></span>
          </a>

          <p>
            Thoughtful care. Clear information.<br/>
            A more supported health journey.
          </p>

          <a href="#appointment" className="footer-link">
            Request an appointment <ArrowUpRight size={16}/>
          </a>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Supra Hospital. All rights reserved.
          </span>
          <span>
            Website information must be verified by hospital management before publication.
          </span>
        </div>
      </footer>
    </>
  )
}

export default App