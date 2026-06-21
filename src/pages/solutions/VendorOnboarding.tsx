import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Shield,
  Upload,
  Building2,
  FileText,
  DollarSign,
  Clock,
  Search,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface OnboardingStatus {
  vendorName: string;
  taxVerified: boolean;
  coiVerified: boolean;
  bankVerified: boolean;
  msaSigned: boolean;
  erpCreated: boolean;
  completionPercent: number;
}

export default function VendorOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [formData, setFormData] = useState({
    vendorName: '',
    contactEmail: '',
    taxId: '',
    hasLicense: false,
    hasW9: false,
    hasCOI: false,
    bankRouting: '',
    bankAccount: ''
  });

  const runOnboarding = async () => {
    setLoading(true);
    // Simulate async checks
    await new Promise(r => setTimeout(r, 1500));

    // Simulate verification statuses
    setStatus({
      vendorName: formData.vendorName,
      taxVerified: true,
      coiVerified: formData.hasCOI,
      bankVerified: formData.bankRouting.length > 4,
      msaSigned: true,
      erpCreated: true,
      completionPercent: 100
    });
    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setStatus(null);
    setFormData({
      vendorName: '',
      contactEmail: '',
      taxId: '',
      hasLicense: false,
      hasW9: false,
      hasCOI: false,
      bankRouting: '',
      bankAccount: ''
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
          <span className="inline-flex p-3 bg-cyan-50 text-cyan-600 rounded-full mb-4">
            <UserPlus className="h-7 w-7" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-3">
            Vendor & Supplier Onboarding Portal
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stop chasing certificates, W-9s, and bank details. Auto-verify, e-sign, and provision new vendors
            in 5 minutes — 100% compliance, zero chasing.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          {['Vendor Details', 'Documents', 'Bank & Verify', 'Onboarded!'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition ${
                step > i + 1 ? 'bg-secondary text-white' :
                step === i + 1 ? 'bg-cyan-600 text-white ring-4 ring-cyan-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-cyan-600' : 'text-gray-400'}`}>{label}</span>
              {i < 3 && <div className="w-12 sm:w-20 h-0.5 mx-2 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Vendor Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Enter Vendor Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., Ace Supply Co."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  value={formData.vendorName}
                  onChange={e => setFormData({ ...formData, vendorName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  placeholder="accounts@acesupply.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID (EIN)</label>
                <input
                  type="text"
                  placeholder="XX-XXXXXXX"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark font-mono focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  value={formData.taxId}
                  onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.vendorName || !formData.contactEmail}
                className="w-full py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow-md disabled:bg-cyan-300"
              >
                Upload Documents →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Compliance Document Checklist</h2>
            <div className="space-y-4">
              {[
                { key: 'hasLicense', label: 'Business License / Registration', icon: FileText },
                { key: 'hasW9', label: 'W-9 Tax Form', icon: DollarSign },
                { key: 'hasCOI', label: 'Certificate of Insurance (COI)', icon: Shield },
              ].map(doc => (
                <div
                  key={doc.key}
                  onClick={() => setFormData({ ...formData, [doc.key]: !(formData as any)[doc.key] })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition flex items-center gap-4 ${
                    (formData as any)[doc.key]
                      ? 'border-cyan-400 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-cyan-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    (formData as any)[doc.key] ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {(formData as any)[doc.key] ? <CheckCircle2 className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark text-sm">{doc.label}</p>
                    <p className="text-xs text-gray-400">{(formData as any)[doc.key] ? '✓ Document received' : 'Click to mark as uploaded'}</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    (formData as any)[doc.key] ? 'bg-cyan-600 border-cyan-600' : 'border-gray-300'
                  }`}>
                    {(formData as any)[doc.key] && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                </div>
              ))}

              <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-cyan-800">
                  <AlertCircle className="h-4 w-4" />
                  <span>Documents are encrypted and stored securely. COI expiration dates will be auto-extracted via OCR.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow-md">Bank Verification →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Bank & Verify */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Bank Account & Final Verification</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Routing Number</label>
                <input
                  type="text"
                  placeholder="9-digit routing number"
                  maxLength={9}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark font-mono focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  value={formData.bankRouting}
                  onChange={e => setFormData({ ...formData, bankRouting: e.target.value.replace(/\D/g, '') })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  placeholder="Account number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark font-mono focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                  value={formData.bankAccount}
                  onChange={e => setFormData({ ...formData, bankAccount: e.target.value.replace(/\D/g, '') })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                {[
                  { icon: Search, label: 'TIN Verification', desc: 'IRS Tax ID match' },
                  { icon: Shield, label: 'COI OCR Scan', desc: 'Expiry auto-detected' },
                  { icon: DollarSign, label: 'Plaid ACH Verify', desc: 'Bank validated' }
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <item.icon className="h-5 w-5 text-cyan-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-dark">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
                <button
                  onClick={runOnboarding}
                  disabled={loading || formData.bankRouting.length < 9}
                  className="flex-1 inline-flex items-center justify-center py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow-md disabled:bg-cyan-300"
                >
                  {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Running Verifications...</> : <><Sparkles className="mr-2 h-5 w-5" /> Complete Onboarding</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Onboarded */}
        {step === 4 && status && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-emerald-50 text-secondary rounded-full mb-4">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-dark">Vendor Onboarded Successfully</h2>
                <p className="text-gray-500">{status.vendorName} is now active in your vendor network.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { label: 'IRS TIN Verification', passed: status.taxVerified },
                  { label: 'COI Document Scan', passed: status.coiVerified },
                  { label: 'Bank Account Validation', passed: status.bankVerified },
                  { label: 'MSA / NDA E-Signed', passed: status.msaSigned },
                  { label: 'NetSuite / ERP Record Created', passed: status.erpCreated },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    {item.passed
                      ? <span className="flex items-center gap-1 text-xs font-semibold text-secondary"><CheckCircle2 className="h-4 w-4" /> Verified</span>
                      : <span className="flex items-center gap-1 text-xs font-semibold text-amber-600"><AlertCircle className="h-4 w-4" /> Pending</span>
                    }
                  </div>
                ))}
              </div>

              <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-cyan-800">
                  <strong>Next step:</strong> A Slack notification has been sent to #finance-approvals. Your new vendor is ready for PO issuance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">
                  Onboard Another Vendor
                </button>
                <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow-md">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule ERP Integration Demo
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {[
            { icon: Search, label: 'IRS TIN Match', desc: 'Real-time verification' },
            { icon: Shield, label: 'COI Auto-Scan', desc: 'OCR expiry detection' },
            { icon: DollarSign, label: 'Plaid Banking', desc: 'ACH validation' },
            { icon: Building2, label: 'ERP Provisioning', desc: 'NetSuite/QuickBooks' }
          ].map(f => (
            <div key={f.label} className="text-center p-3">
              <f.icon className="h-5 w-5 text-cyan-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-dark">{f.label}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}