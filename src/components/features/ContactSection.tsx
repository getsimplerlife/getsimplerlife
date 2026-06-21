import React, { useState } from 'react'
import { Send, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import apiService from '../../services/api'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', needs: [] as string[], message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required'
    return errs
  }

  const toggleNeed = (need: string) => {
    setForm(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('loading')
    try {
      await apiService.submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        needs: form.needs,
        message: form.message,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-indigo-50" id="contact">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle2 size={64} className="text-secondary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Thanks, {form.name}!</h2>
          <p className="text-gray-600 mb-6">
            We will begin compiling your custom automation audit right away and deliver it within <strong>24 hours</strong>.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Clock size={16} />
            <span>Average response time: 2 hours</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-indigo-50" id="contact">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Ready to <span className="text-primary">Take Back Your Time</span>?
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Tell us a bit about your business, and we&apos;ll show you exactly what you can automate.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-white text-sm font-semibold">
            <Clock size={16} />
            Asynchronous audit. Delivered in 24 hours.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-accent-warm">*</span></label>
                <input id="contact-name" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm outline-none transition bg-gray-50 focus:border-primary ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-accent-warm">*</span></label>
                <input id="contact-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@company.com"
                  className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm outline-none transition bg-gray-50 focus:border-primary ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input id="contact-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none transition bg-gray-50 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input id="contact-company" type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Business name"
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none transition bg-gray-50 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to automate?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Lead Routing', 'Calendar Scheduling', 'CRM Database Sync', 'AI Email Responses'].map(need => (
                  <button key={need} type="button" onClick={() => toggleNeed(need)}
                    className={`p-2.5 border rounded-lg text-sm text-center transition ${
                      form.needs.includes(need) ? 'bg-primary text-white border-primary shadow-sm font-medium' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >{need}</button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Your biggest time-waster</label>
              <textarea id="contact-message" rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="E.g., copying leads into our CRM daily, booking client calls manually..."
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none transition bg-gray-50 focus:border-primary resize-none"
              />
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-indigo-300 shadow-md"
            >
              {status === 'loading' ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <><Send size={16} /> Submit Automation Request <ArrowRight size={16} /></>
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-500 text-sm text-center">Submission error. Please try again or contact support.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}