import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileSearch, ArrowLeft, Upload, Shield, AlertTriangle, CheckCircle2, FileText, Download, Loader2, ArrowUpRight } from 'lucide-react'

type RiskLevel = 'low' | 'medium' | 'high'
type ContractType = '' | 'nda' | 'msa' | 'sow' | 'employment' | 'vendor' | 'lease'

interface FlaggedClause {
  id: string; type: 'high_risk' | 'acceptable' | 'info'
  clause: string; issue: string; recommendation: string
}

interface ReviewResult {
  contractType: string; parties: string; effectiveDate: string; value: string
  riskScore: number; riskLevel: RiskLevel; flags: FlaggedClause[]
}

export default function ContractReview() {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [contractType, setContractType] = useState<ContractType>('')

  const handleUpload = () => {
    if (!contractType) return
    setUploading(true)
    setTimeout(() => {
      setUploading(false); setUploaded(true); setReviewing(true)
      setTimeout(() => {
        setReviewing(false)
        setResult({
          contractType: contractType.toUpperCase(),
          parties: 'Acme Corp. (Provider) × ClientCo Inc. (Recipient)',
          effectiveDate: 'July 1, 2026',
          value: contractType === 'nda' ? 'N/A' : '$150,000',
          riskScore: 28,
          riskLevel: 'medium',
          flags: [
            { id: 'f1', type: 'high_risk', clause: 'Indemnification (Section 8.2)', issue: 'Indemnification cap is $50K — below your standard of $250K', recommendation: 'Negotiate cap up to $250K to match company standard' },
            { id: 'f2', type: 'high_risk', clause: 'Limitation of Liability (Section 9.1)', issue: 'UNCAPPED liability for IP infringement — no limitation of liability applies', recommendation: 'Cap liability at 1x-3x contract value, exclude IP from cap' },
            { id: 'f3', type: 'acceptable', clause: 'Confidentiality (Section 5)', issue: 'Standard mutual confidentiality terms — within thresholds', recommendation: 'Auto-approve' },
            { id: 'f4', type: 'acceptable', clause: 'Payment Terms (Section 3)', issue: 'Net 45 — within acceptable range (Net 30-60)', recommendation: 'Auto-approve' },
            { id: 'f5', type: 'info', clause: 'Auto-Renewal (Section 11.1)', issue: '90-day notice period required for non-renewal', recommendation: 'Set calendar reminder 100 days before renewal date' },
            { id: 'f6', type: 'info', clause: 'Governing Law (Section 12.3)', issue: 'Delaware law — standard, no action needed', recommendation: 'Informational only' },
          ],
        })
      }, 2000)
    }, 1500)
  }

  const riskColors = { low: 'text-emerald-600', medium: 'text-amber-600', high: 'text-red-600' }
  const riskBgs = { low: 'bg-emerald-50', medium: 'bg-amber-50', high: 'bg-red-50' }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">Contract Review Workflow</h1>
          <p className="text-gray-500 mt-1">AI-powered clause analysis, risk flagging, and executive summaries</p>
        </div>

        {!uploaded && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-dark mb-6">Upload Contract for Review</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['nda', 'NDA'], ['msa', 'MSA'], ['sow', 'SOW'], ['employment', 'Employment'], ['vendor', 'Vendor'], ['lease', 'Lease']].map(([val, label]) => (
                    <button key={val} onClick={() => setContractType(val as ContractType)}
                      className={`p-2.5 rounded-lg border-2 text-sm font-medium text-center transition ${contractType === val ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-amber-500 transition cursor-pointer">
                <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="font-semibold text-dark mb-1">Drop your contract here</p>
                <p className="text-sm text-gray-400 mb-4">PDF, DOCX, or Google Doc — up to 50MB</p>
                <button onClick={handleUpload} disabled={!contractType || uploading}
                  className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition disabled:bg-gray-300 text-sm">
                  {uploading ? <><Loader2 className="inline h-4 w-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="inline h-4 w-4 mr-2" /> Select & Upload</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {uploaded && reviewing && (
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10">
              <FileSearch className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-dark mb-2">AI is Reviewing Your Contract</h3>
              <p className="text-gray-500 mb-6">Analyzing clauses, comparing against playbook standards...</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p>✓ Document ingested and classified</p>
                <p>✓ Metadata extracted</p>
                <p className="text-amber-600 font-medium">⟳ Analyzing clauses against playbook...</p>
              </div>
            </div>
          </div>
        )}

        {result && !reviewing && (
          <div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-dark">Executive Summary</h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${riskColors[result.riskLevel]} ${riskBgs[result.riskLevel]}`}>
                  <Shield className="h-4 w-4" /> {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)} Risk
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Contract Type', value: result.contractType },
                  { label: 'Parties', value: result.parties },
                  { label: 'Effective Date', value: result.effectiveDate },
                  { label: 'Contract Value', value: result.value },
                  { label: 'Risk Score', value: `${result.riskScore}/100` },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-dark truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-dark">Clause Analysis</h3>
                <span className="text-xs text-gray-400">{result.flags.filter(f => f.type === 'high_risk').length} high-risk · {result.flags.filter(f => f.type === 'acceptable').length} auto-approved · {result.flags.filter(f => f.type === 'info').length} informational</span>
              </div>
              <div className="divide-y divide-gray-100">
                {result.flags.map((flag) => (
                  <div key={flag.id} className={`p-4 ${flag.type === 'high_risk' ? 'bg-red-50/50' : flag.type === 'acceptable' ? 'bg-emerald-50/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      {flag.type === 'high_risk' && <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />}
                      {flag.type === 'acceptable' && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      {flag.type === 'info' && <FileText className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${flag.type === 'high_risk' ? 'bg-red-100 text-red-700' : flag.type === 'acceptable' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {flag.type === 'high_risk' ? 'High Risk' : flag.type === 'acceptable' ? 'Auto-Approved' : 'Info'}
                          </span>
                          <span className="text-sm font-semibold text-dark">{flag.clause}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{flag.issue}</p>
                        <p className="text-xs text-gray-400">{flag.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition">
                <Download className="h-4 w-4" /> Download Redlined Version
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">
                <ArrowUpRight className="h-4 w-4" /> Send to DocuSign
              </button>
            </div>

            <div className="mt-4 text-center">
              <button onClick={() => { setUploaded(false); setResult(null); setContractType('') }}
                className="text-sm text-gray-500 hover:text-amber-600 transition">← Review another contract</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}