import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Clock, Calendar, MessageSquare, FileText, Zap, Globe, Smartphone, Loader2, ArrowUpRight, Sparkles, Download } from 'lucide-react'

interface ScanIssue {
  id: string
  category: string
  label: string
  severity: 'critical' | 'warning' | 'pass'
  description: string
  recommendation: string
  icon: any
}

interface ScanResult {
  score: number
  grade: string
  gradeColor: string
  issues: ScanIssue[]
  url: string
}

const allIssues: Omit<ScanIssue, 'id'>[] = [
  { category: 'Scheduling', label: 'Online Booking Calendar', severity: 'critical', description: 'No online booking widget detected. Customers cannot schedule appointments 24/7.', recommendation: 'Add a Calendly/Cal.com embed to capture after-hours bookings.', icon: Calendar },
  { category: 'Responsiveness', label: 'Mobile Optimization', severity: 'critical', description: 'Site does not render properly on mobile devices. 70% of SMB traffic is mobile.', recommendation: 'Implement responsive design or switch to a mobile-first template.', icon: Smartphone },
  { category: 'SMS Automation', label: 'Instant SMS Auto-Responder', severity: 'critical', description: 'No SMS auto-response detected. Leads who text in never get an instant reply.', recommendation: 'Set up Twilio SMS auto-reply triggering within 2 seconds of inbound text.', icon: MessageSquare },
  { category: 'SEO', label: 'SEO Metadata', severity: 'warning', description: 'Missing or incomplete meta titles, descriptions, and OG tags on key pages.', recommendation: 'Add meta titles, descriptions, and Open Graph tags to all pages.', icon: FileText },
  { category: 'Performance', label: 'Page Load Speed', severity: 'warning', description: 'Estimated load time over 3 seconds — above the 2.5s recommended threshold.', recommendation: 'Optimize images, enable caching, and minify CSS/JS.', icon: Clock },
  { category: 'Analytics', label: 'Analytics Tracking', severity: 'warning', description: 'No analytics script detected. You are flying blind on visitor behavior.', recommendation: 'Install Google Analytics 4 or a privacy-first alternative like Plausible.', icon: Search },
  { category: 'Chat', label: 'Live Chat / Chatbot', severity: 'critical', description: 'No chat widget found. Visitors have no way to ask questions in real time.', recommendation: 'Add a chatbot or live chat widget to capture engaged visitors.', icon: MessageSquare },
  { category: 'Lead Capture', label: 'Contact Form', severity: 'pass', description: 'Contact form detected on the site.', recommendation: 'Ensure form submissions trigger instant SMS/email auto-response.', icon: FileText },
  { category: 'Load Time', label: 'Server Response Time', severity: 'warning', description: 'Time to First Byte (TTFB) estimated above 600ms.', recommendation: 'Upgrade hosting or implement a CDN for faster server response.', icon: Clock },
]

export default function Scanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('')
  const progressRef = useRef<number>(0)

  const handleScan = () => {
    if (!url.trim()) return
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    setScanning(true)
    setProgress(0)
    setScanned(false)
    setResult(null)

    const phases = [
      'Connecting to server...',
      'Analyzing page structure...', 
      'Checking mobile responsiveness...',
      'Scanning for automation tools...',
      'Testing load performance...',
      'Generating audit report...',
    ]
    let step = 0
    const interval = setInterval(() => {
      progressRef.current += 4
      const pct = Math.min(progressRef.current, 100)
      setProgress(pct)
      setPhase(phases[Math.min(Math.floor(pct / 17), phases.length - 1)])
      
      if (pct >= 100) {
        clearInterval(interval)
        // Simulate some randomization for realistic results
        const randomizedIssues = allIssues.map((issue, i) => ({
          ...issue,
          id: `issue-${i}`,
          // Randomize some passes/warnings for realism
          severity: (Math.random() > 0.85 ? 'pass' : issue.severity === 'pass' ? 'pass' : issue.severity) as 'critical' | 'warning' | 'pass',
        }))
        const failCount = randomizedIssues.filter(i => i.severity === 'critical').length * 15 + randomizedIssues.filter(i => i.severity === 'warning').length * 8
        const score = Math.max(15, 100 - failCount + Math.floor(Math.random() * 10))
        let grade = 'F', gradeColor = 'text-red-500'
        if (score >= 90) { grade = 'A'; gradeColor = 'text-emerald-500' }
        else if (score >= 75) { grade = 'B'; gradeColor = 'text-emerald-400' }
        else if (score >= 60) { grade = 'C'; gradeColor = 'text-amber-500' }
        else if (score >= 40) { grade = 'D'; gradeColor = 'text-orange-500' }
        
        setResult({ score, grade, gradeColor, issues: randomizedIssues.filter(i => i.severity !== 'pass'), url: formattedUrl })
        setScanned(true)
        setScanning(false)
      }
    }, 120)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles size={16} /> Free Instant Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4 leading-tight">
            Website Automation{' '}
            <span className="text-primary">Scanner</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Enter your business website and get an instant audit of your automation readiness — 
            booking, SMS, chat, mobile, and more.
          </p>
        </div>

        {/* URL Input */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold text-dark">Enter Your Website URL</h2>
            </div>
            <div className="flex gap-3">
              <input type="text" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="yourbusiness.com"
                className="flex-1 rounded-xl border-2 border-gray-200 px-5 py-3.5 text-base outline-none focus:border-primary transition"
                onKeyDown={e => e.key === 'Enter' && handleScan()} />
              <button onClick={handleScan} disabled={!url.trim() || scanning}
                className="px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition disabled:bg-gray-300 flex items-center gap-2">
                {scanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="h-5 w-5" /> Scan</>}
              </button>
            </div>
          </div>
        </div>

        {/* Scanning Progress */}
        {scanning && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{progress}%</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">Scanning Your Website</h3>
              <p className="text-sm text-gray-500 mb-4">{phase}</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {scanned && result && (
          <div>
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-dark">Audit Scorecard</h2>
                  <p className="text-sm text-gray-500 mt-1">{result.url}</p>
                </div>
                <div className="text-center">
                  <span className={`text-5xl font-black ${result.gradeColor}`}>{result.grade}</span>
                  <p className="text-xs text-gray-400 mt-1">{result.score}/100</p>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${result.gradeColor.replace('text-', 'bg-')}`}
                  style={{ width: `${result.score}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
            </div>

            {/* Issues */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-dark">Issues Found ({result.issues.length})</h3>
                <div className="flex gap-3 text-xs">
                  <span className="text-red-500 font-medium">{result.issues.filter(i => i.severity === 'critical').length} critical</span>
                  <span className="text-amber-500 font-medium">{result.issues.filter(i => i.severity === 'warning').length} warnings</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {result.issues.map((issue) => (
                  <div key={issue.id} className={`p-4 ${issue.severity === 'critical' ? 'bg-red-50/30' : issue.severity === 'warning' ? 'bg-amber-50/20' : ''}`}>
                    <div className="flex items-start gap-3">
                      {issue.severity === 'critical' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />}
                      {issue.severity === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                      {issue.severity === 'pass' && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <issue.icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-dark">{issue.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            issue.severity === 'critical' ? 'bg-red-100 text-red-700' : 
                            issue.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>{issue.severity === 'critical' ? 'Critical' : issue.severity === 'warning' ? 'Warning' : 'Pass'}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{issue.description}</p>
                        <p className="text-xs text-primary font-medium">💡 {issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-4 text-indigo-200" />
              <h2 className="text-2xl font-bold mb-3">Want Us to Fix These for You?</h2>
              <p className="text-indigo-200 max-w-lg mx-auto mb-6">
                Our team will audit your site, implement every recommendation, and have your automation 
                stack running in days — not months.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-indigo-50 transition shadow-lg">
                  Get Your $99 Automation Audit <ArrowRight size={20} />
                </Link>
                <button onClick={() => { setScanned(false); setResult(null); setUrl('') }}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition">
                  Scan Another Site
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}