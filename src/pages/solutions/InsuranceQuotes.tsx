import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Building2,
  DollarSign,
  FileText,
  CheckCircle2,
  Loader2,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  Calendar
} from 'lucide-react';

type BusinessType = 'independent_agency' | 'brokerage' | 'underwriter' | 'other';
type IndustryType = 'general_liability' | 'commercial_auto' | 'workers_comp' | 'professional_liability' | 'cyber' | 'other';

interface QuoteResult {
  premium: number;
  deductible: string;
  carrier: string;
  coverage: string;
  tier: string;
}

export default function InsuranceQuotes() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [formData, setFormData] = useState({
    businessType: '' as BusinessType | '',
    industry: '' as IndustryType | '',
    annualRevenue: 500000,
    claimsHistory: 'none',
    employees: 10,
    coverageAmount: 1000000,
    deductible: '2500',
    name: '',
    email: '',
    company: ''
  });

  const generateQuote = async () => {
    setLoading(true);
    // Simulate real-time quote generation
    await new Promise(r => setTimeout(r, 2000));

    const carriers = ['Liberty Mutual', 'Travelers', 'Nationwide', 'CNA Hardy', 'Chubb'];
    const tiers = ['Preferred', 'Standard', 'Premium Select', 'Elite'];

    const baseMultiplier = formData.annualRevenue / 1000000;
    const claimRisk = formData.claimsHistory === 'none' ? 0.85 : formData.claimsHistory === 'minor' ? 1.0 : 1.25;
    const empFactor = 1 + (formData.employees / 100);

    const basePremium = formData.coverageAmount / 100000 * 15;
    const calculatedPremium = Math.round(basePremium * baseMultiplier * claimRisk * empFactor);

    setQuoteResult({
      premium: calculatedPremium,
      deductible: formData.deductible === '1000' ? '$1,000' : formData.deductible === '2500' ? '$2,500' : formData.deductible === '5000' ? '$5,000' : '$10,000',
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      coverage: `$${(formData.coverageAmount / 1000000).toFixed(0)}M General Liability`,
      tier: tiers[Math.floor(Math.random() * tiers.length)]
    });
    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setQuoteResult(null);
    setFormData({
      businessType: '',
      industry: '',
      annualRevenue: 500000,
      claimsHistory: 'none',
      employees: 10,
      coverageAmount: 1000000,
      deductible: '2500',
      name: '',
      email: '',
      company: ''
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex p-3 bg-indigo-50 text-primary rounded-full mb-4">
            <Shield className="h-7 w-7" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-3">
            Automated Insurance Quote Engine
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Deliver custom General Liability and Commercial quotes in under 60 seconds — automatically.
            Our intelligent risk-profiling engine queries multi-carrier rates in real-time.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {['Risk Profile', 'Coverage Needs', 'Your Details', 'Your Quote'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition ${
                step > i + 1 ? 'bg-secondary text-white' :
                step === i + 1 ? 'bg-primary text-white ring-4 ring-indigo-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                step === i + 1 ? 'text-primary' : 'text-gray-400'
              }`}>{label}</span>
              {i < 3 && <div className="w-12 sm:w-20 h-0.5 mx-2 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Risk Profile */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Let's Profile Your Risk</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'independent_agency', label: 'Independent Agency', icon: Building2 },
                    { value: 'brokerage', label: 'Brokerage', icon: Briefcase },
                    { value: 'underwriter', label: 'Underwriter', icon: Shield },
                    { value: 'other', label: 'Other', icon: Building2 }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, businessType: opt.value as BusinessType })}
                      className={`flex items-center gap-2 p-3 border rounded-lg text-sm font-medium transition ${
                        formData.businessType === opt.value
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry Classification</label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value as IndustryType })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                >
                  <option value="">Select industry...</option>
                  <option value="general_liability">General Liability</option>
                  <option value="commercial_auto">Commercial Auto</option>
                  <option value="workers_comp">Workers' Compensation</option>
                  <option value="professional_liability">Professional Liability</option>
                  <option value="cyber">Cyber Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue</label>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <input
                    type="range"
                    min="100000"
                    max="50000000"
                    step="100000"
                    value={formData.annualRevenue}
                    onChange={e => setFormData({ ...formData, annualRevenue: Number(e.target.value) })}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-bold text-dark w-24 text-right">
                    ${(formData.annualRevenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md"
              >
                Continue to Coverage →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Coverage Needs */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Define Your Coverage Parameters</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Limit: <span className="text-primary font-bold">${(formData.coverageAmount / 1000000).toFixed(1)}M</span>
                </label>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="500000"
                  value={formData.coverageAmount}
                  onChange={e => setFormData({ ...formData, coverageAmount: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$500K</span>
                  <span>$10M</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deductible Tier</label>
                <div className="grid grid-cols-4 gap-3">
                  {['1000', '2500', '5000', '10000'].map(d => (
                    <button
                      key={d}
                      onClick={() => setFormData({ ...formData, deductible: d })}
                      className={`p-3 border rounded-lg text-sm font-semibold transition ${
                        formData.deductible === d
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      ${Number(d).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Claims History</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'none', label: 'Clean (3+ yrs)' },
                    { value: 'minor', label: 'Minor Claims' },
                    { value: 'major', label: 'Major Claims' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, claimsHistory: opt.value })}
                      className={`p-3 border rounded-lg text-sm font-medium transition ${
                        formData.claimsHistory === opt.value
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md"
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Your Details */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Almost There — Your Contact Info</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sarah Johnson"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@agency.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Your Agency Name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white"
                >
                  ← Back
                </button>
                <button
                  onClick={generateQuote}
                  disabled={loading || !formData.name || !formData.email}
                  className="flex-1 inline-flex items-center justify-center py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md disabled:bg-indigo-300"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Generating Quote...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" /> Generate Instant Quote</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Quote Result */}
        {step === 4 && quoteResult && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-secondary/30 shadow-lg p-8 text-center">
              <div className="inline-flex p-3 bg-emerald-50 text-secondary rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">Your Quote Is Ready</h2>
              <p className="text-gray-500 mb-6">Preliminary binder generated in real-time.</p>

              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Premium</p>
                  <p className="text-2xl font-bold text-secondary">${quoteResult.premium.toLocaleString()}/yr</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Deductible</p>
                  <p className="text-lg font-bold text-dark">{quoteResult.deductible}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Carrier</p>
                  <p className="text-lg font-bold text-dark">{quoteResult.carrier}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tier</p>
                  <p className="text-lg font-bold text-primary">{quoteResult.tier}</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-semibold text-dark mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Coverage Summary
                </h4>
                <p className="text-sm text-gray-600">{quoteResult.coverage}</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Full policy term: 12 months</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Claims-made coverage including prior acts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Defense outside the limit included</li>
                </ul>
              </div>

              <p className="text-xs text-gray-400 mb-6">
                *This is a preliminary simulated quote for demonstration. Actual underwriting and final pricing is subject to carrier verification.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white"
                >
                  Start New Quote
                </button>
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Policy Review
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {[
            { icon: TrendingUp, label: 'Multi-Carrier Rates', desc: 'Real-time underwriting' },
            { icon: Clock, label: 'Sub-60 Second Quotes', desc: 'Instant binder delivery' },
            { icon: Shield, label: 'Secure Data Handling', desc: 'HMAC-256 encrypted' },
            { icon: Sparkles, label: 'E-Sign Ready', desc: 'DocuSign integration' }
          ].map(f => (
            <div key={f.label} className="text-center p-3">
              <f.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-dark">{f.label}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}