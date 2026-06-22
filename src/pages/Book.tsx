import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Calendar, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Check, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  User, 
  Mail, 
  Building, 
  Phone as PhoneIcon, 
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import apiService from '../services/api'

export default function Book() {
  const [searchParams] = useSearchParams()
  const verticalParam = searchParams.get('vertical')

  const [selectedOption, setSelectedOption] = useState('strategy')
  const [selectedDate, setSelectedDate] = useState('Instant 24/7 Delivery Queue')
  const [selectedTime, setSelectedTime] = useState('Immediate')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([])

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: verticalParam ? `I would like to book an Asynchronous Audit specifically for: ${verticalParam}.` : ''
  })

  React.useEffect(() => {
    if (verticalParam) {
      setForm(prev => ({
        ...prev,
        message: prev.message || `I would like to book an Asynchronous Audit specifically for: ${verticalParam}.`
      }))
    }
  }, [verticalParam])

  // Fetch already booked slots from backend
  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.fetchBookings()
        if (res && res.success) {
          setBookedSlots(res.bookings)
        }
      } catch (err) {
        console.error('[Book] Failed to fetch booked slots:', err)
      }
    }
    fetchBookings()
  }, [])

  const bookingOptions = [
    {
      id: 'strategy',
      title: 'Asynchronous Strategy Audit',
      duration: 'Delivered in 24 Hours',
      description: 'A custom strategy audit mapping out your manual workflows to identify your biggest automation wins, compiled asynchronously.',
      needs: ['Lead Routing'],
      icon: <Clock className="h-5 w-5 text-indigo-600" />
    },
    {
      id: 'integration',
      title: 'Asynchronous Integration Audit',
      duration: 'Delivered in 24 Hours',
      description: 'A technical blueprint scoping out your databases, CRM integrations, and webhook requirements, compiled and delivered to your inbox.',
      needs: ['CRM Database Sync'],
      icon: <Cpu className="h-5 w-5 text-emerald-600" />
    },
    {
      id: 'operations',
      title: 'Asynchronous Operations Assessment',
      duration: 'Delivered in 24 Hours',
      description: 'An exhaustive operations review culminating in a custom implementation roadmap and ROI analysis report delivered directly to your inbox.',
      needs: ['Lead Routing', 'CRM Database Sync'],
      icon: <ShieldCheck className="h-5 w-5 text-violet-600" />
    }
  ]

  const activeOption = bookingOptions.find(opt => opt.id === selectedOption) || bookingOptions[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate) {
      setErrorMsg('Please select a date for your session.')
      return
    }
    if (!selectedTime) {
      setErrorMsg('Please select an available time slot.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      needs: activeOption.needs,
      message: `[MOCK CALENDAR BOOKING]
Session Type: ${activeOption.title}
Scheduled Date: ${selectedDate}
Scheduled Time: ${selectedTime}
User Notes: ${form.message || 'No additional notes.'}`
    }

    try {
      // First, log the lead in SQLite operational database (capture lead state)
      await apiService.submitLead(payload)
      
      // Redirect to Stripe Secure Checkout ($99.00 Audit Blueprint)
      window.location.href = "https://buy.stripe.com/dRm7sL4gg4yDgcu7cU08g07"
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.response?.data?.error || 'An error occurred while scheduling your booking.')
      setStatus('error')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-6">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold text-dark mb-3">Booking Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your asynchronous automation audit is confirmed! Our engineering system has queued your diagnostic report, and your tailored playbook will be delivered on your scheduled date.
            </p>

            {/* Meeting Summary Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Sparkles className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">Session Type</span>
                  <span className="text-gray-900 font-bold">{activeOption.title}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">Date &amp; Time</span>
                  <span className="text-gray-900 font-bold">{selectedDate} @ {selectedTime}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <User className="h-5 w-5 text-violet-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider">Assigned Auditor</span>
                  <span className="text-gray-900 font-bold">Simpler Life — AI Expert System</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark shadow-md transition"
              >
                Back to Homepage
              </Link>
              <br />
              <button
                onClick={() => {
                  setStatus('idle')
                  setSelectedDate('')
                  setSelectedTime('')
                  setForm({ name: '', email: '', company: '', phone: '', message: '' })
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline mt-2"
              >
                Book Another Delivery Slot
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-10">
              <span className="inline-flex p-3 bg-indigo-50 text-primary rounded-full mb-4">
                <Calendar className="h-6 w-6" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-2">
                Instant 24/7 Automation Diagnostic Blueprint
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a custom diagnostic session below, fill out your details, and our AI Expert System will build and deliver a comprehensive automation roadmap for your business asynchronously in under 24 hours. No call required, active 24/7.
              </p>
            </div>

            {/* Step 1: Select Session Cards */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-primary text-white h-6 w-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
                Select Session Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bookingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedOption(opt.id)
                      setErrorMsg('')
                    }}
                    className={`text-left p-5 rounded-2xl border transition relative flex flex-col justify-between h-full bg-white shadow-sm hover:shadow-md ${
                      selectedOption === opt.id
                        ? 'border-primary ring-2 ring-indigo-100 bg-indigo-50/10'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl ${
                          selectedOption === opt.id ? 'bg-indigo-50' : 'bg-gray-50'
                        }`}>
                          {opt.icon}
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          {opt.duration}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base mb-1.5">{opt.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{opt.description}</p>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-indigo-600 mt-2">
                      {selectedOption === opt.id ? (
                        <span className="flex items-center text-primary">
                          <Check className="h-4 w-4 mr-1 text-primary animate-pulse" /> Active Selected
                        </span>
                      ) : (
                        <span>Choose This Session</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main scheduler frictionless section */}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              {/* Step 2: Attendee Details Form */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md space-y-6">
                <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center">
                  <span className="bg-primary text-white h-5 w-5 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
                  Your Details
                </h2>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start space-x-3 text-red-800 text-xs font-semibold">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <User className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <Building className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe Industries"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <PhoneIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    What manual task or bottleneck should we solve?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g., manually logging HVAC dispatch tickets to Notion, copying leads to our CRM daily..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-xl transition disabled:bg-indigo-300 disabled:cursor-not-allowed uppercase tracking-wider"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Generating Secure Checkout...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                        Proceed to Secure Payment — $99.00
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed max-w-md mx-auto">
                    🔒 <strong>Secure Payment Powered by Stripe</strong>. Credit card &amp; Apple Pay accepted. The $99 diagnostic fee is <strong>100% credited back</strong> toward any implementation package if you choose to build your custom roadmap with us.
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
