import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, DollarSign, CreditCard, Building, User, ArrowLeft, CheckCircle2, Loader2, Zap, TrendingUp, Clock } from 'lucide-react'

type CreditScore = '' | 'excellent' | 'good' | 'fair' | 'poor'
type Employment = '' | 'w2' | 'self-employed' | 'retired' | 'other'
type PropertyType = '' | 'primary' | 'investment' | 'refinance'

interface LeadScore {
  total: number
  tier: 'Hot' | 'Warm' | 'Qualifying' | 'Nurture'
  color: string
  breakdown: { factor: string; points: number; max: number }[]
}

export default function MortgageLeads() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    creditScore: '' as CreditScore,
    propertyZip: '', propertyType: '' as PropertyType,
    loanAmount: '', downPayment: '',
    employment: '' as Employment,
  })
  const [score, setScore] = useState<LeadScore | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const calcScore = (): LeadScore => {
    const breakdown: { factor: string; points: number; max: number }[] = []
    let total = 0
    // Credit score
    const creditPoints = { excellent: 35, good: 25, fair: 15, poor: 5 }
    const cp = form.creditScore ? creditPoints[form.creditScore] : 0
    breakdown.push({ factor: 'Credit Score', points: cp, max: 35 })
    total += cp
    // Employment
    const empPoints = { w2: 25, 'self-employed': 15, retired: 10, other: 5 }
    const ep = form.employment ? empPoints[form.employment] : 0
    breakdown.push({ factor: 'Employment Type', points: ep, max: 25 })
    total += ep
    // Down payment
    const dp = parseInt(form.downPayment) || 0
    const dpPoints = dp >= 20 ? 20 : dp >= 10 ? 12 : dp >= 5 ? 6 : 0
    breakdown.push({ factor: `Down Payment (${dp}%)`, points: dpPoints, max: 20 })
    total += dpPoints
    // Property type
    const ptPoints = form.propertyType === 'primary' ? 20 : form.propertyType === 'refinance' ? 12 : 8
    breakdown.push({ factor: 'Property Type', points: ptPoints, max: 20 })
    total += ptPoints
    // Tier
    const tier = total >= 80 ? 'Hot' : total >= 60 ? 'Warm' : total >= 40 ? 'Qualifying' : 'Nurture'
    const color = tier === 'Hot' ? 'text-emerald-600' : tier === 'Warm' ? 'text-blue-600' : tier === 'Qualifying' ? 'text-amber-600' : 'text-gray-500'
    return { total, tier, color, breakdown }
  }

  const handleQualify = () => {
    setScore(calcScore())
    setStep(5)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Lead Submitted!</h2>
          <p className="text-gray-500 mb-2">Your pre-qualified lead has been routed to the appropriate loan officer.</p>
          <p className="text-sm text-emerald-600 font-semibold mb-6">Response time: under 2 seconds</p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">Mortgage Lead Qualification</h1>
          <p className="text-gray-500 mt-1">Pre-qualify borrowers in under 2 minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {['Contact', 'Credit', 'Property', 'Employment', 'Results'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                step > i + 1 ? 'bg-secondary text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}>{step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}</div>
              <span className={`ml-2 text-xs font-medium hidden sm:inline ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
              {i < 4 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > i + 1 ? 'bg-secondary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8">
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Borrower Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="John Doe" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => setStep(2)} disabled={!form.name || !form.email}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 text-sm">
                  Continue <Zap className="inline h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Credit & Property */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Credit & Property Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Credit Score</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['excellent', 'good', 'fair', 'poor'] as const).map((cs) => (
                      <button key={cs} onClick={() => update('creditScore', cs)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium text-center transition ${
                          form.creditScore === cs ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="block font-bold text-base">{cs === 'excellent' ? '740+' : cs === 'good' ? '680-739' : cs === 'fair' ? '620-679' : 'Under 620'}</span>
                        {cs.charAt(0).toUpperCase() + cs.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property ZIP Code</label>
                  <input type="text" value={form.propertyZip} onChange={e => update('propertyZip', e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="80202" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([['primary', 'Primary Residence'], ['investment', 'Investment'], ['refinance', 'Refinance']] as const).map(([val, label]) => (
                      <button key={val} onClick={() => update('propertyType', val)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium text-center transition ${
                          form.propertyType === val ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-primary transition">← Back</button>
                <button onClick={() => setStep(3)} disabled={!form.creditScore || !form.propertyType || !form.propertyZip}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 text-sm">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Loan & Down Payment */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Loan & Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Loan Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="number" value={form.loanAmount} onChange={e => update('loanAmount', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 pl-8 pr-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="350000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment Percentage</label>
                  <div className="flex gap-2 mb-2">
                    {[5, 10, 15, 20, 25].map(pct => (
                      <button key={pct} onClick={() => update('downPayment', pct.toString())}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          form.downPayment === pct.toString() ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>{pct}%</button>
                    ))}
                  </div>
                  <input type="range" min={0} max={50} value={form.downPayment || 0} onChange={e => update('downPayment', e.target.value)}
                    className="w-full accent-primary" />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-primary transition">← Back</button>
                <button onClick={() => setStep(4)} disabled={!form.loanAmount || !form.downPayment}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 text-sm">Continue</button>
              </div>
            </div>
          )}

          {/* Step 4: Employment */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-6">Employment & Income</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([['w2', 'W-2 Employee'], ['self-employed', 'Self-Employed'], ['retired', 'Retired'], ['other', 'Other']] as const).map(([val, label]) => (
                      <button key={val} onClick={() => update('employment', val)}
                        className={`p-4 rounded-xl border-2 text-sm font-medium text-center transition ${
                          form.employment === val ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-primary transition">← Back</button>
                <button onClick={handleQualify} disabled={!form.employment}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 text-sm">
                  Calculate Score <Zap className="inline h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && score && (
            <div>
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${score.color} bg-gray-50 mb-3`}>
                  <Zap className="h-4 w-4" /> {score.tier} Lead
                </div>
                <p className="text-4xl font-bold text-dark">{score.total}<span className="text-lg text-gray-400">/100</span></p>
                <p className="text-sm text-gray-500 mt-1">Lead Qualification Score</p>
              </div>

              <div className="space-y-3 mb-8">
                {score.breakdown.map((b) => (
                  <div key={b.factor}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{b.factor}</span>
                      <span className="font-medium text-dark">{b.points}/{b.max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${score.tier === 'Hot' ? 'bg-emerald-500' : score.tier === 'Warm' ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${(b.points / b.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-dark text-sm mb-2">Routing Decision</h4>
                <div className="flex items-center gap-2 text-sm">
                  {score.tier === 'Hot' && <><CheckCircle2 className="h-5 w-5 text-emerald-600" /><span className="text-emerald-700 font-medium">Instant notification to Senior Loan Officer — book VIP call</span></>}
                  {score.tier === 'Warm' && <><Clock className="h-5 w-5 text-blue-600" /><span className="text-blue-700 font-medium">Route to available LO within 5 minutes</span></>}
                  {score.tier === 'Qualifying' && <><Loader2 className="h-5 w-5 text-amber-600" /><span className="text-amber-700 font-medium">Send to junior LO / processing team for follow-up</span></>}
                  {score.tier === 'Nurture' && <><TrendingUp className="h-5 w-5 text-gray-500" /><span className="text-gray-600 font-medium">Enter automated 30-day nurture drip</span></>}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 text-sm">
                  {submitting ? 'Submitting...' : 'Submit to CRM'}
                </button>
                <button onClick={() => setStep(1)} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm">
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}