import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  Building2,
  Send,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface ProposalResult {
  clientName: string;
  industry: string;
  scopeItems: string[];
  totalAmount: number;
  executiveSummary: string;
  proposalId: string;
}

const scopeOptions = [
  'Digital Marketing Strategy',
  'Brand Identity & Design',
  'Web Development',
  'Content Marketing',
  'SEO Optimization',
  'Social Media Management',
  'Email Automation Campaigns',
  'CRM Integration & Setup',
  'Data Analytics Dashboard',
  'Customer Success Onboarding'
];

export default function ProposalWriting() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    industry: 'technology',
    projectSize: 25000,
    selectedScopes: [] as string[],
    timeline: 'monthly',
    urgency: 'standard'
  });

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      selectedScopes: prev.selectedScopes.includes(scope)
        ? prev.selectedScopes.filter(s => s !== scope)
        : [...prev.selectedScopes, scope]
    }));
  };

  const generateProposal = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    const industries: Record<string, string> = {
      technology: 'fast-growing tech scale-up',
      healthcare: 'healthcare innovation leader',
      finance: 'financial services firm',
      realestate: 'real estate investment group',
      education: 'education technology provider',
      other: 'industry-leading organization'
    };

    const summaries = [
      `${formData.clientName} at ${formData.company} is a ${industries[formData.industry] || 'leading organization'} seeking to accelerate growth through strategic digital transformation. Our proposed engagement will deliver measurable ROI across ${formData.selectedScopes.length} core workstreams.`,
      `Having analyzed ${formData.company}'s current market position and growth objectives, we've identified significant opportunities to streamline operations and capture market share. This proposal outlines a comprehensive partnership designed to deliver immediate impact.`
    ];

    setResult({
      clientName: formData.clientName,
      industry: industries[formData.industry] || 'industry-leading organization',
      scopeItems: formData.selectedScopes,
      totalAmount: formData.projectSize,
      executiveSummary: summaries[Math.floor(Math.random() * summaries.length)],
      proposalId: `PROP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    });
    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setFormData({
      clientName: '',
      company: '',
      industry: 'technology',
      projectSize: 25000,
      selectedScopes: [],
      timeline: 'monthly',
      urgency: 'standard'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="inline-flex p-3 bg-violet-50 text-violet-600 rounded-full mb-4">
            <FileText className="h-7 w-7" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-3">
            B2B Proposal Writing Automation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Never copy-paste a proposal again. Auto-generate beautiful, CRM-hydrated proposals complete
            with custom scopes, pricing tables, and case studies in 30 seconds.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          {['Client Info', 'Scope & Budget', 'Generate', 'Your Proposal'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition ${
                step > i + 1 ? 'bg-secondary text-white' :
                step === i + 1 ? 'bg-violet-600 text-white ring-4 ring-violet-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-violet-600' : 'text-gray-400'}`}>{label}</span>
              {i < 3 && <div className="w-12 sm:w-20 h-0.5 mx-2 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Client Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Client Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Mitchell"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., Mitchell & Co."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'technology', label: '💻 Technology' },
                    { value: 'healthcare', label: '🏥 Healthcare' },
                    { value: 'finance', label: '💰 Finance' },
                    { value: 'realestate', label: '🏠 Real Estate' },
                    { value: 'education', label: '📚 Education' },
                    { value: 'other', label: '📋 Other' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, industry: opt.value })}
                      className={`p-3 border rounded-lg text-sm font-medium transition ${
                        formData.industry === opt.value
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition shadow-md">
                Define Scope & Budget →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Scope & Budget */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Scope of Work & Budget</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Lines (choose all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {scopeOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleScope(s)}
                      className={`p-2.5 border rounded-lg text-sm text-center transition ${
                        formData.selectedScopes.includes(s)
                          ? 'bg-violet-600 text-white border-violet-600 font-medium'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">{formData.selectedScopes.length} selected</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Budget Range: <span className="font-bold text-violet-600">${formData.projectSize.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="250000"
                  step="5000"
                  value={formData.projectSize}
                  onChange={e => setFormData({ ...formData, projectSize: Number(e.target.value) })}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$5K</span><span>$250K</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={formData.selectedScopes.length === 0}
                  className="flex-1 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition shadow-md disabled:bg-violet-300"
                >
                  Generate Proposal →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-dark mb-6">Ready to Generate</h2>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-6 text-left">
              <p className="text-sm text-violet-700"><strong>Client:</strong> {formData.clientName} @ {formData.company}</p>
              <p className="text-sm text-violet-700"><strong>Scopes:</strong> {formData.selectedScopes.join(', ')}</p>
              <p className="text-sm text-violet-700"><strong>Budget:</strong> ${formData.projectSize.toLocaleString()}</p>
            </div>
            <button
              onClick={generateProposal}
              disabled={loading}
              className="w-full inline-flex items-center justify-center py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition shadow-md disabled:bg-violet-300"
            >
              {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> AI Generating Proposal...</> : <><Sparkles className="mr-2 h-5 w-5" /> Generate with AI</>}
            </button>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && result && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8" />
                  <span className="text-xs text-violet-200 font-mono">{result.proposalId}</span>
                </div>
                <h2 className="text-2xl font-bold">Proposal for {result.clientName}</h2>
                <p className="text-violet-100">{formData.company}</p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Executive Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{result.executiveSummary}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Proposed Scope of Work</h3>
                  <div className="grid gap-2">
                    {result.scopeItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Investment Summary</h3>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-400">Total Estimated Investment</p>
                    <p className="text-3xl font-bold text-dark">${result.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Billed {formData.timeline}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">
                    New Proposal
                  </button>
                  <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition shadow-md">
                    <Calendar className="mr-2 h-4 w-4" />
                    Get Your 24-Hour Audit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {[
            { icon: Sparkles, label: 'AI-Powered', desc: 'Executive summary generation' },
            { icon: Building2, label: 'CRM-Hydrated', desc: 'HubSpot/Salesforce connected' },
            { icon: Send, label: 'Auto-Delivery', desc: 'PandaDoc integration' },
            { icon: TrendingUp, label: 'Analytics Tracked', desc: 'Real-time open rates' }
          ].map(f => (
            <div key={f.label} className="text-center p-3">
              <f.icon className="h-5 w-5 text-violet-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-dark">{f.label}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}