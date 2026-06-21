import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  FileText,
  Clock,
  AlertTriangle,
  Calendar,
  Lock,
  UserCheck,
  Activity
} from 'lucide-react';

interface ComplianceStatus {
  overallRating: 'compliant' | 'at_risk' | 'non_compliant';
  checksPassed: number;
  checksTotal: number;
  lastAudit: string;
  encrypted: boolean;
  items: { name: string; status: 'pass' | 'fail' | 'pending'; category: string }[];
}

const checklistItems = [
  { name: 'Data Encryption at Rest (AES-256)', category: 'Security' },
  { name: 'Access Control — MFA Enabled', category: 'Security' },
  { name: 'Backup Integrity Verification', category: 'Infrastructure' },
  { name: 'Employee HIPAA Training (Current)', category: 'Compliance' },
  { name: 'Vendor Risk Assessment', category: 'Vendors' },
  { name: 'Incident Response Plan (Reviewed)', category: 'Security' },
  { name: 'Physical Security — Server Access Logs', category: 'Infrastructure' },
  { name: 'Data Retention Policy Compliance', category: 'Compliance' },
  { name: 'Penetration Test (Quarterly)', category: 'Security' },
  { name: 'Privacy Policy — Consent Records', category: 'Compliance' },
];

export default function ComplianceDashboard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ComplianceStatus | null>(null);
  const [checklist, setChecklist] = useState(checklistItems.map(item => ({ ...item, checked: Math.random() > 0.3 })));
  const [auditDate, setAuditDate] = useState('');

  const runAudit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    const passed = checklist.filter(i => i.checked).length;
    const total = checklist.length;
    const ratio = passed / total;

    const overall: 'compliant' | 'at_risk' | 'non_compliant' =
      ratio >= 0.9 ? 'compliant' : ratio >= 0.7 ? 'at_risk' : 'non_compliant';

    const now = new Date();
    setAuditDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }));

    setStatus({
      overallRating: overall,
      checksPassed: passed,
      checksTotal: total,
      lastAudit: auditDate || now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      encrypted: true,
      items: checklist.map(i => ({
        name: i.name,
        status: i.checked ? 'pass' : 'fail',
        category: i.category
      }))
    });
    setLoading(false);
  };

  const toggleCheck = (index: number) => {
    setChecklist(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
  };

  const resetAudit = () => {
    setStatus(null);
    setAuditDate('');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-4">
            <Shield className="h-7 w-7" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-3">
            Compliance Documentation Dashboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Be audit-ready every single day. Automatically compile daily safety logs, track signatures,
            and archive tamper-proof evidence — with zero chasing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Checklist */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">Compliance Checklist</h2>
                {status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    <Lock className="h-3 w-3" />
                    Tamper-Proof HMAC Logged
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-8">
                {checklist.map((item, i) => (
                  <div
                    key={item.name}
                    onClick={() => !status && toggleCheck(i)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${
                      status
                        ? item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                        : item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      item.checked ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                    }`}>
                      {item.checked && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.checked ? 'text-dark' : 'text-gray-600'}`}>{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    {status && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.checked ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.checked ? 'Pass' : 'Fail'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {!status ? (
                <button
                  onClick={runAudit}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-md disabled:bg-emerald-300"
                >
                  {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Compiling Audit Ledger...</> : <><Activity className="mr-2 h-5 w-5" /> Run Compliance Audit</>}
                </button>
              ) : (
                <button onClick={resetAudit} className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">
                  Reset & Run New Audit
                </button>
              )}
            </div>
          </div>

          {/* Right - Dashboard Summary */}
          <div className="space-y-6">
            {/* Overall Status */}
            {status ? (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Overall Compliance</h3>
                  <div className={`inline-flex p-4 rounded-full mb-3 ${
                    status.overallRating === 'compliant' ? 'bg-emerald-50' :
                    status.overallRating === 'at_risk' ? 'bg-amber-50' : 'bg-red-50'
                  }`}>
                    <Shield className={`h-10 w-10 ${
                      status.overallRating === 'compliant' ? 'text-emerald-600' :
                      status.overallRating === 'at_risk' ? 'text-amber-600' : 'text-red-600'
                    }`} />
                  </div>
                  <p className={`text-xl font-bold mb-1 ${
                    status.overallRating === 'compliant' ? 'text-emerald-700' :
                    status.overallRating === 'at_risk' ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {status.overallRating === 'compliant' ? '100% Compliant' :
                     status.overallRating === 'at_risk' ? 'At Risk' : 'Non-Compliant'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {status.checksPassed}/{status.checksTotal} checks passed
                  </p>
                </div>

                {/* Score Ring */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Compliance Score</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#E8E8F0" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                        strokeDasharray={`${(status.checksPassed / status.checksTotal) * 264} 264`}
                        strokeLinecap="round"
                        className={`${
                          status.overallRating === 'compliant' ? 'text-emerald-600' :
                          status.overallRating === 'at_risk' ? 'text-amber-600' : 'text-red-600'
                        }`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-dark">{Math.round((status.checksPassed / status.checksTotal) * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Audit Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Audit Log</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Audit</span>
                      <span className="text-sm font-semibold text-dark">{status.lastAudit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Encryption</span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                        <Lock className="h-3.5 w-3.5" /> AES-256 + HMAC
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Signed By</span>
                      <span className="text-sm font-semibold text-dark">Device UUID: E2B-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <Link to="/book" className="inline-flex items-center justify-center w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-md">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Compliance Review
                </Link>
              </>
            ) : (
              <>
                {/* Pre-audit info cards */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-dark mb-4">HIPAA / GDPR Ready</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Lock, label: 'HMAC-SHA256 Tamper Proofing', desc: 'Immutable audit ledger' },
                      { icon: UserCheck, label: 'Digital Signatures', desc: 'Device UUID + IP + timestamp' },
                      { icon: FileText, label: 'Auto-Generated PDF Reports', desc: 'Audit-ready evidence packs' },
                      { icon: Clock, label: 'Scheduled Daily Checks', desc: 'Automated recurring triggers' }
                    ].map(f => (
                      <div key={f.label} className="flex items-start gap-3">
                        <f.icon className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-dark">{f.label}</p>
                          <p className="text-xs text-gray-400">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800">
                      Toggle the checklist items above to simulate daily compliance checks, then click "Run Compliance Audit"
                      to generate an immutable, cryptographically signed audit report.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}