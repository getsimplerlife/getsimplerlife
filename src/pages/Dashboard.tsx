import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Bot, Zap, ArrowUpRight, ArrowLeft, ShieldAlert, LogOut, Loader2, Sparkles, Database, Activity, FileText, CheckCircle2, AlertCircle, Send, HardHat, Layers, Users, Settings, ArrowRight } from 'lucide-react'
import apiService, { MetricsResponse } from '../services/api'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('simpler_life_client_token'))
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState<string>('')
  
  // Admin states
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [leads, setLeads] = useState<any[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState<string | null>(null)
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null)

  // Interactive states
  const [sowApproved, setSowApproved] = useState<boolean>(false)
  const [signature, setSignature] = useState<string>('')
  const [newRequest, setNewRequest] = useState<string>('')
  const [requestSent, setRequestSent] = useState<boolean>(false)
  const [heartbeatColor, setHeartbeatColor] = useState<string>('text-emerald-500')

  const loadMetrics = async (authToken: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.fetchMetrics(authToken)
      setMetrics(data)
    } catch (err: any) {
      console.error(err)
      setError('Failed to retrieve live KPIs from the SQLite operational database. Please re-authenticate.')
      // If unauthorized, clear token and reset
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const data = await apiService.fetchAdminLeads()
      setLeads(data.leads)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    }
  }

  const handleGenerateAudit = async (leadId: string) => {
    setIsGeneratingReport(leadId)
    setGenerationSuccess(null)
    try {
      await apiService.generateReport(leadId)
      setGenerationSuccess(leadId)
    } catch (err) {
      console.error('Failed to generate audit:', err)
    } finally {
      setIsGeneratingReport(null)
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('simpler_life_client_email') || ''
    // Only load if a valid JWT token exists (not the placeholder 'demo' from local bypass)
    if (token && token !== 'demo') {
      loadMetrics(token)
      if (savedEmail.toLowerCase() === 'admin@simplerlife.io') {
        setIsAdmin(true)
        fetchLeads()
      }
    }
  }, [token])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedToken = await apiService.fetchToken(emailInput)
      localStorage.setItem('simpler_life_client_token', fetchedToken)
      localStorage.setItem('simpler_life_client_email', emailInput)
      setToken(fetchedToken)
    } catch (err: any) {
      console.error(err)
      setError('Authentication failed. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('simpler_life_client_token')
    localStorage.removeItem('simpler_life_client_email')
    setToken(null)
    setMetrics(null)
    setIsAdmin(false)
    setEmailInput('')
  }

  // If not authenticated, prompt to log in and generate a JWT token
  if (!token || token === 'demo') {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Bot className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-dark tracking-tight">
              Client Portal
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Access your real-time performance indicators and active automation workflows.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Company Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="e.g., client@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
              />
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                Note: Entering a registered booking/purchase email will load your custom workflows and active performance stats. Leaving it blank or entering a guest email will load a live interactive demo.
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Generating Secure JWT...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {emailInput.trim() ? 'Access Personal Portal' : 'Access Interactive Demo'}
                </>
              )}
            </button>
            <Link
              to="/"
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 text-sm font-semibold rounded-xl text-gray-600 bg-white hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading indicator for authenticated users waiting on SQLite fetch
  if (loading && !metrics) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Fetching live operational database metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Client Retainer Portal</span>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Database className="h-3 w-3 mr-0.5" />
                <span>JWT Secure Logged In</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight mt-1">
              Active Performance: {metrics?.client || 'Doe Logistics'}
            </h1>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button
              onClick={handleLogout}
              className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 transition font-medium"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Disconnect
            </button>
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition font-medium">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Exit Portal
            </Link>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Admin Hours Saved</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">{metrics?.kpis.hoursSavedThisMonth || 42.5} hrs</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% MoM</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Saved this month via automatic data entries.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Leads Processed</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">{metrics?.kpis.leadsProcessed || 312} leads</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% Success</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ingested from website & routed to CRM.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Activity className={`h-6 w-6 ${heartbeatColor} transition-colors duration-500`} />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">System Heartbeat</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">Healthy</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">All API connections operational.</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: TELEMETRY & WORKFLOWS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Live Telemetry Log */}
            <div className="bg-dark rounded-2xl shadow-xl overflow-hidden border border-gray-800">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity size={16} className="text-primary" /> Live Workflow Heartbeat
                </h3>
                <span className="text-[10px] font-mono text-gray-500">POLLING SQLITE_DB: ACTIVE</span>
              </div>
              <div className="p-6 font-mono text-[11px] space-y-2 max-h-[200px] overflow-y-auto bg-black/40">
                <p className="text-gray-500">[14:32:01] <span className="text-emerald-500">SUCCESS</span> Inbound Webhook Received: /api/leads/capture</p>
                <p className="text-gray-500">[14:32:02] <span className="text-blue-500">INFO</span> Deduplication Check Passed: No existing record found</p>
                <p className="text-gray-500">[14:32:05] <span className="text-emerald-500">SUCCESS</span> Lead Hydrated: Simpler Life Expert Engine</p>
                <p className="text-gray-500">[14:32:08] <span className="text-primary">ACTION</span> Pushing to CRM: {metrics?.client || 'Doe Logistics'} Pipeline</p>
                <p className="text-gray-400 animate-pulse">[14:35:12] <span className="text-yellow-500">WAIT</span> Awaiting next trigger...</p>
              </div>
              <div className="px-6 py-3 bg-gray-900/80 grid grid-cols-3 gap-2 border-t border-gray-800">
                <div className="text-center border-r border-gray-800">
                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Uptime</p>
                  <p className="text-xs text-white font-bold tracking-widest">99.98%</p>
                </div>
                <div className="text-center border-r border-gray-800">
                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter">API Status</p>
                  <p className="text-xs text-emerald-400 font-bold tracking-widest">STABLE</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Daily Runs</p>
                  <p className="text-xs text-white font-bold tracking-widest">1,248</p>
                </div>
              </div>
            </div>

            {/* Active API Connectivity Grid - New High Fidelity Section */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-dark text-sm mb-6 flex items-center gap-2">
                <Layers size={16} className="text-primary" /> Active API Connections
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Stripe', status: 'Healthy', icon: '💳' },
                  { name: 'HubSpot', status: 'Healthy', icon: '🧡' },
                  { name: 'Slack', status: 'Healthy', icon: '💬' },
                  { name: 'ServiceTitan', status: 'Degraded', icon: '🛠️' },
                ].map((api) => (
                  <div key={api.name} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xl mb-1">{api.icon}</span>
                    <span className="text-[10px] font-bold text-dark block">{api.name}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`h-1.5 w-1.5 rounded-full ${api.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span className="text-[9px] text-gray-400 uppercase font-medium">{api.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Automations */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-dark text-lg mb-6">Configured Workflows</h3>
              <div className="space-y-4">
                {metrics && (metrics as any).customWorkflows ? (
                  (metrics as any).customWorkflows.map((workflow: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 transition">
                      <div className="flex items-center space-x-3">
                        {idx % 2 === 0 ? <Bot className="h-5 w-5 text-primary" /> : <Clock className="h-5 w-5 text-primary" />}
                        <div>
                          <p className="text-sm font-semibold text-dark">{workflow.name}</p>
                          <p className="text-xs text-gray-500">{workflow.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{workflow.status}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Bot className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-dark">Web Contact Form → CRM Sync</p>
                          <p className="text-xs text-gray-500">Triggers immediately upon user form submission</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Weekly Analytics Breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-dark text-lg mb-4">Hours Saved Breakdown (Weekly)</h3>
              <p className="text-xs text-gray-500 mb-6">Real-time allocation calculated from workflow execution logs.</p>
              <div className="space-y-4">
                {metrics?.history && metrics.history.map((h) => {
                  const maxHours = Math.max(...metrics.history.map(x => x.hoursSaved)) || 1;
                  return (
                    <div key={h.week} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 w-8">{h.week}</span>
                      <div className="flex-1 mx-4 bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${(h.hoursSaved / maxHours) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-dark w-16 text-right">{h.hoursSaved} hrs</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SOW & REQUESTS */}
          <div className="space-y-8 h-fit">
            
            {/* SOW Intake & Approval */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-primary h-6 w-6" />
                <h3 className="font-extrabold text-dark text-lg italic">Pending SOW</h3>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 mb-6 shadow-sm">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-3 tracking-tighter">PROJECT SPECS: PHASE 2 EXPANSION</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 font-medium">Automated Invoice OCR Matching</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 font-medium">Multi-Directional Inventory Sync</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 font-medium">Slack Approval Notification Hub</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-dark">One-Time Fee:</span>
                  <span className="text-lg font-black text-primary">$1,500</span>
                </div>
              </div>

              {!sowApproved ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">E-Signature</label>
                    <input 
                      type="text"
                      placeholder="Type full name to sign"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-indigo-100 bg-white text-sm focus:ring-2 focus:ring-primary outline-none transition font-serif italic"
                    />
                  </div>
                  <button 
                    disabled={!signature.trim()}
                    onClick={() => setSowApproved(true)}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    Approve & Sign SOW
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-inner animate-in zoom-in-95">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">SOW Approved</span>
                  </div>
                  <p className="text-[10px] opacity-90 border-t border-white/20 pt-2 mt-2 font-serif italic">
                    Signed by {signature} on {new Date().toLocaleDateString()}
                  </p>
                </div>
              )}
              <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                By signing, you authorize Simpler Life to begin the implementation phase defined in the specifications above.
              </p>
            </div>

            {/* Request New Automation Intake Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <HardHat className="text-primary h-6 w-6" />
                <h3 className="font-bold text-dark text-lg leading-tight">Request New Automation</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Found a new manual bottleneck? Describe the repetitive task below and our experts will draft an implementation spec.
              </p>
              
              {!requestSent ? (
                <div className="space-y-4">
                  <textarea 
                    value={newRequest}
                    onChange={(e) => setNewRequest(e.target.value)}
                    placeholder="e.g. I want to automate our weekly PDF reporting to Slack..."
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px] transition"
                  />
                  <button 
                    disabled={!newRequest.trim()}
                    onClick={() => { setRequestSent(true); setNewRequest(''); }}
                    className="w-full py-3 bg-dark text-white font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    Submit to Integrator <Send size={14} />
                  </button>
                </div>
              ) : (
                <div className="bg-indigo-50 p-6 rounded-2xl text-center border border-indigo-100 animate-in fade-in">
                  <Sparkles size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-primary">Request Queued!</p>
                  <p className="text-[10px] text-indigo-400 mt-1">Alice will review this and update your SOW specs shortly.</p>
                  <button 
                    onClick={() => setRequestSent(false)}
                    className="text-[10px] text-primary font-bold underline mt-4"
                  >
                    Submit another request
                  </button>
                </div>
              )}
            </div>

            {/* Support & Retainer Info */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={80} />
              </div>
              <h3 className="font-bold text-white text-lg mb-6">Integrator Support</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold text-emerald-400">Growth Retainer</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">Assigned Integrator</span>
                  <span className="font-bold">Alice L.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Review</span>
                  <span className="font-bold">2 days ago</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-3 text-indigo-400">
                  <AlertCircle size={16} />
                  <span className="font-bold tracking-tight">Need Urgent Help?</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  Retainer clients get priority 4-hour SLA via Slack Connect.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ADMIN CONTROL PANEL - High Fidelity Lead Management */}
        {isAdmin && (
          <div className="mt-12 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-dark tracking-tight">Admin Control Panel</h2>
                  <p className="text-xs text-gray-500 font-medium">Master Lead Ingestion & Fulfillment Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {leads.length} TOTAL LEADS
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-4">Prospect</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/30 transition group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-primary font-bold text-xs">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-dark">{lead.name}</p>
                            <p className="text-[11px] text-gray-500">{lead.company || 'Private Individual'} • {lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full" 
                              style={{ width: `${Math.min(lead.score, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          lead.sync_status === 'synced' 
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                            : 'text-amber-600 bg-amber-50 border-amber-100'
                        }`}>
                          {lead.sync_status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleGenerateAudit(lead.id)}
                          disabled={isGeneratingReport === lead.id}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            generationSuccess === lead.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                          } disabled:opacity-50 shadow-sm`}
                        >
                          {isGeneratingReport === lead.id ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Generating...
                            </>
                          ) : generationSuccess === lead.id ? (
                            <>
                              <CheckCircle2 size={14} />
                              Audit Sent
                            </>
                          ) : (
                            <>
                              <Zap size={14} />
                              Generate Audit
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Users size={32} strokeWidth={1.5} />
                          <p className="text-sm font-medium">No leads found in the database.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                <ShieldAlert size={12} />
                AUTHORIZED ADMIN SESSION ONLY • HMAC SECURED WEBHOOKS
              </p>
              <button 
                onClick={fetchLeads}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Refresh Lead List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

