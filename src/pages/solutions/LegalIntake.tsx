import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Scale, ArrowLeft, CheckCircle2, AlertCircle, MessageSquare, FileText, User, Shield, Clock, Send, Loader2 } from 'lucide-react'

type CaseType = '' | 'personal_injury' | 'family_law' | 'criminal_defense' | 'immigration' | 'estate_planning' | 'other'
type Urgency = '' | 'emergency' | 'soon' | 'planning'

interface ConflictResult {
  status: 'clear' | 'flag' | 'conflict'
  message: string
}

export default function LegalIntake() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    caseType: '' as CaseType,
    whenHappened: '', whereHappened: '',
    urgency: '' as Urgency,
    description: '',
    opposingParty: '',
  })
  const [conflictResult, setConflictResult] = useState<ConflictResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const caseTypeLabels: Record<string, string> = {
    personal_injury: 'Personal Injury',
    family_law: 'Family Law',
    criminal_defense: 'Criminal Defense',
    immigration: 'Immigration',
    estate_planning: 'Estate Planning',
    other: 'Other',
  }

  const handleConflictCheck = () => {
    // Simulate conflict check
    const hasConflict = form.opposingParty.toLowerCase().includes('acme') || form.name.toLowerCase().includes('existing')
    if (hasConflict) {
      setConflictResult({ status: 'flag', message: 'Potential conflict detected — please review manually.' })
    } else {
      setConflictResult({ status: 'clear', message: 'No conflict found. Proceed with intake.' })
    }
    setStep(4)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-violet-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Case Intake Complete</h2>
          <p className="text-gray-500 mb-4">
            Your case has been scored and routed to the appropriate attorney. You'll receive a call within 1 hour.
          </p>
          <div className="bg-violet-50 rounded-lg p-3 mb-6 text-sm">
            <p className="font-medium text-violet-800">Next Step</p>
            <p className="text-violet-600">An engagement letter will be sent for e-signature shortly.</p>
          </div>
          <Link to="/" className="text-sm text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">Legal Intake Automation</h1>
          <p className="text-gray-500 mt-1">AI-powered intake with instant conflict checking</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8">
          {/* Step 1: Case Type */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Scale className="h-8 w-8 text-violet-600" />
                <h2 className="text-xl font-bold text-dark">What type of case?</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['personal_injury', 'Personal Injury', 'Car accidents, slip & fall, medical malpractice'],
                  ['family_law', 'Family Law', 'Divorce, custody, child support'],
                  ['criminal_defense', 'Criminal Defense', 'DUI, theft, assault charges'],
                  ['immigration', 'Immigration', 'Visas, green cards, citizenship'],
                  ['estate_planning', 'Estate Planning', 'Wills, trusts, probate'],
                  ['other', 'Other', 'Different legal matter'],
                ].map(([val, title, desc]) => (
                  <button key={val} onClick={() => { update('caseType', val); setStep(2) }}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      form.caseType === val ? 'border-violet-600 bg-violet-50' : 'border-gray-200 hover:border-violet-200'
                    }`}>
                    <p className="font-semibold text-dark text-sm">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Case Details</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-600 transition" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-600 transition" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">When did this happen?</label>
                    <input type="text" value={form.whenHappened} onChange={e => update('whenHappened', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-600 transition" placeholder="e.g., Last week, March 2026" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Where did it happen?</label>
                    <input type="text" value={form.whereHappened} onChange={e => update('whereHappened', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-600 transition" placeholder="City, State" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                  <div className="flex gap-2">
                    {[['emergency', '🔴 Emergency'], ['soon', '🟡 Within a Week'], ['planning', '🟢 Just Planning']].map(([val, label]) => (
                      <button key={val} onClick={() => update('urgency', val)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                          form.urgency === val ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brief description</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-600 transition resize-none"
                    placeholder="Describe what happened..." />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-violet-600 transition">← Back</button>
                <button onClick={() => setStep(3)} disabled={!form.name || !form.phone}
                  className="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition disabled:bg-gray-300 text-sm">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Conflict Check */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-violet-600" />
                <h2 className="text-xl font-bold text-dark">Conflict of Interest Check</h2>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm">
                <p className="font-medium text-amber-800">🔍 AI is scanning our client database</p>
                <p className="text-amber-600 mt-1">Checking {form.name} and any opposing parties against existing matters...</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opposing Party Name (if known)</label>
                <input type="text" value={form.opposingParty} onChange={e => update('opposingParty', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-600 transition" placeholder="Name of person or company on the other side" />
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-violet-600 transition">← Back</button>
                <button onClick={handleConflictCheck}
                  className="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition text-sm">
                  Run Conflict Check <Shield className="inline h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Conflict Results */}
          {step === 4 && conflictResult && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Conflict Check Results</h2>
              <div className={`rounded-xl p-5 mb-6 ${conflictResult.status === 'clear' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center gap-3">
                  {conflictResult.status === 'clear' ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                  )}
                  <div>
                    <p className={`font-bold ${conflictResult.status === 'clear' ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {conflictResult.status === 'clear' ? '✅ No Conflict Found' : '⚠️ Potential Conflict'}
                    </p>
                    <p className={`text-sm ${conflictResult.status === 'clear' ? 'text-emerald-600' : 'text-amber-600'}`}>{conflictResult.message}</p>
                  </div>
                </div>
              </div>

              {conflictResult.status === 'clear' && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-dark text-sm mb-3">Case Assessment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Case Type</span><span className="font-medium text-dark">{caseTypeLabels[form.caseType]}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Urgency</span><span className="font-medium text-dark">{form.urgency === 'emergency' ? '🔴 Emergency' : form.urgency === 'soon' ? '🟡 Within a Week' : '🟢 Planning'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Routing</span><span className="font-medium text-violet-600">{caseTypeLabels[form.caseType]} Attorney</span></div>
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition disabled:bg-gray-300">
                    {submitting ? <><Loader2 className="inline h-4 w-4 mr-2 animate-spin" /> Submitting...</> : <><Send className="inline h-4 w-4 mr-2" /> Submit Intake</>}
                  </button>
                </>
              )}

              {conflictResult.status !== 'clear' && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">This intake has been flagged for manual review by a senior attorney.</p>
                  <Link to="/" className="text-sm text-violet-600 hover:underline">← Return to Home</Link>
                </div>
              )}

              <div className="mt-4">
                <button onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-violet-600 transition">← Back to edit</button>
              </div>
            </div>
          )}
        </div>

        {/* Live preview banner */}
        <div className="mt-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">⚡ Auto-Response Active</p>
            <p className="text-violet-200 text-xs">Every lead gets an instant SMS/email reply within 30 seconds</p>
          </div>
          <Clock className="h-8 w-8 text-violet-200" />
        </div>
      </div>
    </div>
  )
}