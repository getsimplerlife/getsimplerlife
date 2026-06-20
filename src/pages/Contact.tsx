import React, { useState } from 'react'
import { CheckCircle2, Phone, Mail, Building, Send } from 'lucide-react'
import apiService from '../services/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    needs: [] as string[],
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const toggleNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiService.submitLead(formData)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
            Request Your Free Automation Audit
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell us a bit about your business, and our team will map out exactly what workflows you can automate to save 10–30 hours each week.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Quick Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-dark mb-4 text-lg">Contact Us Directly</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>support@autoflow.ai</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+1 (555) 303-FLOW</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Denver, CO | Remote</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-dark mb-2">Inquiry Received Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  Thanks for reaching out! Our automation assistant and scheduling algorithms have processed your entry. We will be in touch within 24 hours to schedule your audit.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to automate? (Select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Lead Routing', 'Calendar Scheduling', 'CRM Database Sync', 'AI Email Responses'].map(need => (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleNeed(need)}
                        className={`p-2.5 border rounded-lg text-sm text-center transition ${
                          formData.needs.includes(need)
                            ? 'bg-primary text-white border-primary shadow-sm font-medium'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {need}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your biggest administrative time-waster</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="E.g., copying leads into our CRM daily, booking client calls manually..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-indigo-300 shadow-md"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Automation Request
                    </>
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">Submission error. Please try again or contact support.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
