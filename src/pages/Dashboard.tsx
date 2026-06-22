import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, Bot, Zap, ArrowUpRight, ArrowLeft, ShieldAlert, LogOut, 
  Loader2, Sparkles, Database, Activity, FileText, CheckCircle2, 
  AlertCircle, Send, HardHat, Layers, Users, Settings, ArrowRight,
  BadgeCheck, Check, Smartphone, Phone
} from 'lucide-react'
import apiService, { MetricsResponse } from '../services/api'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('simpler_life_client_token'))
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState<string>('')
  const [passwordInput, setPasswordInput] = useState<string>('')
  
  // Custom states for upgraded features
  const [selectedVertical, setSelectedVertical] = useState<string>('general')
  const [activeTab, setActiveTab] = useState<'telemetry' | 'roadmap'>('telemetry')
  const [smsNumber, setSmsNumber] = useState<string>('')
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [smsLogs, setSmsLogs] = useState<string[]>([])
  const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false)
  const [selectedRetainer, setSelectedRetainer] = useState<string>('150')
  const [activeRetainerTier, setActiveRetainerTier] = useState<string>('Growth Retainer ($150/mo)')

  // Admin states
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [leads, setLeads] = useState<any[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState<string | null>(null)
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null)
  const [selectedAuditHtml, setSelectedAuditHtml] = useState<string | null>(null)

  // Interactive states
  const [sowApproved, setSowApproved] = useState<boolean>(false)
  const [signature, setSignature] = useState<string>('')
  const [newRequest, setNewRequest] = useState<string>('')
  const [requestSent, setRequestSent] = useState<boolean>(false)
  const [heartbeatColor, setHeartbeatColor] = useState<string>('text-emerald-500')

  // Dictionary of mock verticalized metrics for the Smart Demo mode
  const verticalMetrics: Record<string, any> = {
    general: {
      client: 'Doe Logistics & Transportation',
      hoursSaved: '42.5',
      leads: '312',
      reduction: '92.5%',
      workflows: [
        { name: 'Web Contact Form → CRM Sync', description: 'Triggers immediately upon user form submission', status: 'Active' },
        { name: 'Urgent Dispatch Emergency SMS Router', description: 'Pings dispatcher mobile numbers immediately for hot inquiries', status: 'Active' },
        { name: 'Stripe Checkout → Ledger Sync', description: 'Automates bookkeeping by syncing online card payments', status: 'Active' }
      ],
      logs: [
        '[14:32:01] SUCCESS Inbound Webhook Received: /api/leads/capture',
        '[14:32:02] INFO Deduplication Check Passed: No existing record found',
        '[14:32:05] SUCCESS Lead Hydrated: Simpler Life Expert Engine',
        '[14:32:08] ACTION Pushing to CRM: HubSpot Pipeline',
        '[14:35:12] WAIT Awaiting next trigger...'
      ]
    },
    hvac: {
      client: 'Applewood HVAC & Plumbing',
      hoursSaved: '58.5',
      leads: '412',
      reduction: '94.2%',
      workflows: [
        { name: 'ServiceTitan → HubSpot CRM Sync', description: 'Triggers on job completion to sync invoices and customer logs', status: 'Active' },
        { name: 'Emergency Dispatch SMS Router', description: 'Routes high-priority incoming tickets to on-duty techs instantly', status: 'Active' },
        { name: 'Stripe Checkout → Quickbooks Ledger', description: 'Synchronizes card payments to financial books asynchronously', status: 'Active' }
      ],
      logs: [
        '[14:41:09] SUCCESS Inbound ServiceTitan Job Webhook Received',
        '[14:41:12] INFO Hydrated tech dispatcher alert SMS for Applewood',
        '[14:41:15] SUCCESS Stripe Payment matched with Quickbooks ledger',
        '[14:45:00] WAIT Awaiting next ServiceTitan dispatch sync...'
      ]
    },
    dental: {
      client: 'Apex Dental Care Group',
      hoursSaved: '38.0',
      leads: '285',
      reduction: '91.8%',
      workflows: [
        { name: 'Emergency SLA Schedule Handler', description: 'Detects dentist calendar conflicts and overrides urgent toothache bookings', status: 'Active' },
        { name: 'Open Dental CRM → Automated Survey Dispatch', description: 'Pings patients automated satisfaction surveys 2 hours post-visit', status: 'Active' },
        { name: 'Shadow HR & Seat Purge Model', description: 'Audits open seats monthly and deletes inactive user licenses', status: 'Active' }
      ],
      logs: [
        '[14:50:21] SUCCESS Emergency Dental Appointment booked via Intake Queue',
        '[14:50:24] INFO Dispatched SMS Survey to patient Apex Dental',
        '[14:50:28] SUCCESS Audited SaaS user accounts for unused Open Dental seats',
        '[14:55:00] WAIT Awaiting patient survey replies...'
      ]
    },
    agency: {
      client: 'Velocity Agency Group',
      hoursSaved: '64.0',
      leads: '540',
      reduction: '95.6%',
      workflows: [
        { name: 'White-Label Partnership Referral Tracker', description: 'Automatically maps incoming agency referrals with active tracking links', status: 'Active' },
        { name: 'Project-Cost Scope Creep Telemetry', description: 'Monitors Jira/Github milestones to alert managers of budget burn-rates', status: 'Active' },
        { name: 'Shadow IT SaaS Auto-Deprovisioning', description: 'Deprovision access on offboarding via unified auth triggers', status: 'Active' }
      ],
      logs: [
        '[14:55:12] SUCCESS Referred Client Intake received from affiliate partner',
        '[14:55:15] INFO Calculated project gross margin telemetry',
        '[14:55:19] SUCCESS Audited and deprovisioned shadow IT Notion account',
        '[14:58:30] WAIT Listening for Slack referral webhook...'
      ]
    },
    realestate: {
      client: 'Premier Realty Charlotte',
      hoursSaved: '48.0',
      leads: '320',
      reduction: '89.4%',
      workflows: [
        { name: 'Zillow/Redfin Lead Ingestion → CRM Sync', description: 'Ingests new home inquiry leads into HubSpot pipeline instantly', status: 'Active' },
        { name: 'Daylight Savings Time Offset Scheduler', description: 'Corrects client showing appointments based on local GMT zone shifts', status: 'Active' },
        { name: 'Expiring API Credential Warning Alert', description: 'Automates key rotations for MLS servers to avoid MLS listing downtime', status: 'Active' }
      ],
      logs: [
        '[15:01:05] SUCCESS New buyer lead captured from Zillow API',
        '[15:01:09] INFO Calculated correct DST offset for showings booking calendar',
        '[15:01:12] SUCCESS Rotated expiring MLS API integration key',
        '[15:05:00] WAIT Monitoring MLS active listener...'
      ]
    }
  }

  const loadMetrics = async (authToken: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.fetchMetrics(authToken)
      setMetrics(data)
    } catch (err: any) {
      console.error(err)
      setError('Failed to retrieve live KPIs from the SQLite operational database. Please re-authenticate.')
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async (authToken: string) => {
    try {
      const data = await apiService.fetchAdminLeads(authToken)
      setLeads(data.leads)
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    }
  }

  const handleGenerateAudit = async (leadId: string) => {
    if (!token) return
    setIsGeneratingReport(leadId)
    setGenerationSuccess(null)
    try {
      const response = await apiService.generateReport(leadId, token)
      setGenerationSuccess(leadId)
      if (response.htmlReport) {
        setSelectedAuditHtml(response.htmlReport)
      }
    } catch (err) {
      console.error('Failed to generate audit:', err)
    } finally {
      setIsGeneratingReport(null)
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('simpler_life_client_email') || ''
    if (token) {
      if (token === 'demo-active') {
        // Active demo state
        return
      }
      loadMetrics(token)
      if (savedEmail.toLowerCase() === 'admin@simplerlife.io') {
        setIsAdmin(true)
        fetchLeads(token)
      }
    }
  }, [token])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!emailInput.trim()) {
        // Empty or guest login triggers our highly customized Demo Mode
        localStorage.setItem('simpler_life_client_token', 'demo-active')
        localStorage.setItem('simpler_life_client_email', 'guest@simplerlife.io')
        setToken('demo-active')
        setLoading(false)
        return
      }

      const fetchedToken = await apiService.fetchToken(emailInput, passwordInput)
      localStorage.setItem('simpler_life_client_token', fetchedToken)
      localStorage.setItem('simpler_life_client_email', emailInput)
      setToken(fetchedToken)
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 401) {
        setError('Invalid admin credentials. Please verify your password.')
      } else {
        setError('Authentication failed. Please ensure the backend is running.')
      }
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
    setPasswordInput('')
  }

  // Live SMS Simulation trigger
  const handleTestSms = () => {
    if (!signature) {
      alert('Please type your name in the E-Signature box first to join our testing sandbox!')
      return
    }
    if (!smsNumber.trim()) {
      alert('Please enter a valid phone number!')
      return
    }
    
    setSmsStatus('sending')
    setSmsLogs([])
    
    const logs = [
      `[Gateway] Initializing secure Twilio connection on thread: SL-${Math.floor(Math.random() * 90000 + 10000)}...`,
      `[Gateway] Signing dispatch routing packet with X-Simpler-Life signature...`,
      `[Gateway] Routing sealed webhook trigger to Twilio SMS Node...`,
      `🎉 SUCCESS! Mock SMS message successfully dispatched to ${smsNumber}! Check your terminal below.`
    ]

    logs.forEach((log, index) => {
      setTimeout(() => {
        setSmsLogs(prev => [...prev, log])
        if (index === logs.length - 1) {
          setSmsStatus('sent')
        }
      }, (index + 1) * 800)
    })
  }

  // Handle SLA Retainer Upgrade Mock Action
  const handleUpgradeRetainer = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setUpgradeSuccess(true)
      if (selectedRetainer === '150') {
        setActiveRetainerTier('Growth Retainer ($150/mo)')
      } else if (selectedRetainer === '300') {
        setActiveRetainerTier('Premium SLA Retainer ($300/mo)')
      } else {
        setActiveRetainerTier('Enterprise Scale Retainer ($500/mo)')
      }
    }, 1200)
  }

  // Resolve active data profile (from real metrics or simulated vertical switcher)
  const isDemo = token === 'demo-active'
  const activeProfile = isDemo ? verticalMetrics[selectedVertical] : {
    client: metrics?.client || 'Doe Logistics',
    hoursSaved: metrics?.kpis.hoursSavedThisMonth || 42.5,
    leads: metrics?.kpis.leadsProcessed || 312,
    reduction: '92.5%',
    workflows: [
      { name: 'Web Contact Form → CRM Sync', description: 'Triggers immediately upon user form submission', status: 'Active' },
      { name: 'Urgent Dispatch Emergency SMS Router', description: 'Pings dispatcher mobile numbers immediately for hot inquiries', status: 'Active' },
      { name: 'Stripe Checkout → Ledger Sync', description: 'Automates bookkeeping by syncing online card payments', status: 'Active' }
    ],
    logs: [
      '[14:32:01] SUCCESS Inbound Webhook Received: /api/leads/capture',
      '[14:32:02] INFO Deduplication Check Passed: No existing record found',
      '[14:32:05] SUCCESS Lead Hydrated: Simpler Life Expert Engine',
      '[14:32:08] ACTION Pushing to CRM: HubSpot Pipeline',
      '[14:35:12] WAIT Awaiting next trigger...'
    ]
  }

  // Render Login state
  if (!token) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Bot className="h-10 w-10 animate-pulse text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-dark tracking-tight">
              Client Portal
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Access your real-time performance indicators, active workflows, and custom roadmaps.
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
              {emailInput.trim().toLowerCase() === 'admin@simplerlife.io' && (
                <div className="mt-4 animate-in fade-in duration-300">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter secure admin password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                  />
                </div>
              )}
            </div>

            {/* UPGRADE 1: Industry selector for interactive demo mode */}
            {!emailInput.trim().toLowerCase().includes('admin') && (
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  Select Industry Vertical (Demo Mode)
                </label>
                <select
                  value={selectedVertical}
                  onChange={(e) => setSelectedVertical(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold text-gray-700 transition"
                >
                  <option value="general">General Logistics &amp; Transport</option>
                  <option value="hvac">HVAC &amp; Plumbing Trade</option>
                  <option value="dental">Dental &amp; Healthcare Clinics</option>
                  <option value="agency">Web Agency Affiliate Partner</option>
                  <option value="realestate">Real Estate &amp; Brokerage</option>
                </select>
                <p className="text-[10px] text-indigo-500 mt-1.5 leading-relaxed font-medium">
                  Select an industry to experience custom metrics, workflows, and automated terminal logs tailored specifically to that market!
                </p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition disabled:bg-indigo-300 disabled:cursor-not-allowed uppercase tracking-wider"
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

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Client Retainer Portal</span>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Database className="h-3 w-3 mr-0.5" />
                <span>JWT Secure Logged In</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight mt-1">
              Active Performance: {activeProfile.client}
            </h1>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* UPGRADE 1 Toggle inside Dashboard */}
            {isDemo && (
              <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Industry:</span>
                <select
                  value={selectedVertical}
                  onChange={(e) => setSelectedVertical(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-bold text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="general">Logistics</option>
                  <option value="hvac">HVAC/Trade</option>
                  <option value="dental">Dental</option>
                  <option value="agency">Web Agency</option>
                  <option value="realestate">Real Estate</option>
                </select>
              </div>
            )}
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
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Admin Hours Saved</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">{activeProfile.hoursSaved} hrs</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% MoM</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Saved this month via automatic data entries.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Leads Processed</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">{activeProfile.leads} leads</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% Success</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ingested from website & routed to CRM.</p>
            </div>
          </div>

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

        {/* Tab Switcher - UPGRADE 2 */}
        <div className="flex border-b border-gray-200 mb-8 space-x-6">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-4 text-sm font-bold tracking-tight transition ${
              activeTab === 'telemetry' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Telemetry Logs &amp; Connections 🤖
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-4 text-sm font-bold tracking-tight transition ${
              activeTab === 'roadmap' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            18-Vertical Strategic Audit Vault 📋
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: TELEMETRY & WORKFLOWS */}
          <div className="lg:col-span-2 space-y-8">
            
            {activeTab === 'telemetry' ? (
              <>
                {/* Live Telemetry Log Console (Interactive UPGRADE 1) */}
                <div className="bg-dark rounded-2xl shadow-xl overflow-hidden border border-gray-800">
                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity size={16} className="text-primary" /> Live Workflow Heartbeat
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500">POLLING SQLITE_DB: ACTIVE</span>
                  </div>
                  <div className="p-6 font-mono text-[11px] space-y-2 max-h-[220px] overflow-y-auto bg-black/40">
                    {activeProfile.logs.map((log: string, idx: number) => {
                      let colorClass = 'text-gray-500'
                      if (log.includes('SUCCESS')) colorClass = 'text-emerald-500'
                      if (log.includes('INFO')) colorClass = 'text-blue-500'
                      if (log.includes('ACTION')) colorClass = 'text-indigo-400'
                      if (log.includes('WAIT')) colorClass = 'text-yellow-500 animate-pulse'
                      return (
                        <p key={idx} className={colorClass}>{log}</p>
                      )
                    })}
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

                {/* Active API Connectivity Grid */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-dark text-sm mb-6 flex items-center gap-2">
                    <Layers size={16} className="text-primary" /> Active API Connections
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: 'Stripe', status: 'Healthy', icon: '💳' },
                      { name: 'HubSpot', status: 'Healthy', icon: '🧡' },
                      { name: 'Slack', status: 'Healthy', icon: '💬' },
                      { name: selectedVertical === 'hvac' ? 'ServiceTitan' : 'Salesforce', status: selectedVertical === 'hvac' ? 'Degraded' : 'Healthy', icon: '🛠️' },
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

                {/* Configured Workflows (Interactive UPGRADE 1) */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-dark text-lg mb-6">Configured Workflows</h3>
                  <div className="space-y-4">
                    {activeProfile.workflows.map((workflow: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 transition">
                        <div className="flex items-center space-x-3">
                          {idx % 2 === 0 ? <Bot className="h-5 w-5 text-primary animate-pulse" /> : <Clock className="h-5 w-5 text-primary" />}
                          <div>
                            <p className="text-sm font-bold text-dark">{workflow.name}</p>
                            <p className="text-xs text-gray-500">{workflow.description}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{workflow.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Analytics Breakdown */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">Hours Saved Breakdown (Weekly)</h3>
                  <p className="text-xs text-gray-500 mb-6">Real-time allocation calculated from workflow execution logs.</p>
                  <div className="space-y-4">
                    {[
                      { week: 'Wk 1', hoursSaved: parseFloat(activeProfile.hoursSaved) * 0.25 },
                      { week: 'Wk 2', hoursSaved: parseFloat(activeProfile.hoursSaved) * 0.35 },
                      { week: 'Wk 3', hoursSaved: parseFloat(activeProfile.hoursSaved) * 0.20 },
                      { week: 'Wk 4', hoursSaved: parseFloat(activeProfile.hoursSaved) * 0.20 }
                    ].map((h) => {
                      const maxHours = 25;
                      return (
                        <div key={h.week} className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 w-8">{h.week}</span>
                          <div className="flex-1 mx-4 bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-500" 
                              style={{ width: `${(h.hoursSaved / maxHours) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-dark w-16 text-right">{h.hoursSaved.toFixed(1)} hrs</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* UPGRADE 2: Interactive 18-Vertical Roadmap Vault View */
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-dark text-xl tracking-tight">Diagnostic Roadmap Vault</h3>
                      <p className="text-xs text-gray-500 mt-1">18-Vertical Master Operational &amp; Security Evaluation results.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-600 block">16 / 18</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pillars Verified</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-4 flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <BadgeCheck className="text-emerald-500 h-8 w-8 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-extrabold text-indigo-900 uppercase tracking-wide">Strategic Verification Approved</p>
                        <p className="text-[11px] text-indigo-700 mt-0.5">Your roadmap is fully verified by our AI Expert System and signed by Alice L.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-xl">96.4% Compliance Score</span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { nr: 1, name: "Human Resources (HR)", spec: "Automated onboarding pipeline & shade IT tracking", score: "95%", desc: "Automate user setup across all company SaaS applications, immediately revoke access logs on user offboarding to detect shadow IT." },
                    { nr: 2, name: "Technical Support Dispatch", spec: "Urgent dispatch SLA alerts & API secret rotation", score: "92%", desc: "Ditch manual text dispatching. Ingest tickets from ServiceTitan and ping tech mobile phones with route files on a 4-hour SLA alert." },
                    { nr: 3, name: "Customer Service Hub", spec: "PII scrubbing, automated follow-ups & AI guardrails", score: "94%", desc: "Scrub patient/client PII securely, auto-dispatch customer feedback dispatches via Stripe, and run AI guardrails on outgoing texts." },
                    { nr: 6, name: "Administrative Assistance", spec: "Calendar overlapping block & OCR invoice parsing", score: "90%", desc: "Synchronize multiple booking calendars, inject custom buffer periods, and use AI OCR to parse business receipts instantly." },
                    { nr: 13, name: "Invoice Ledger Integration", spec: "Three-way ledger matching & fraud detection", score: "98%", desc: "Perform instant matches between POs, physical receipts, and banking ledgers, and secure logs with custom cryptographic signatures." },
                    { nr: 18, name: "AI Infrastructure & Auditing", spec: "HMAC cryptographically sealed logs", score: "99%", desc: "Log every single webhook and database trigger securely, and protect all communication lines with HMAC-sealed cryptographic audit ledgers." }
                  ].map((vert) => (
                    <div key={vert.nr} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/10 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2.5">
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold h-5 w-5 rounded-full inline-flex items-center justify-center">
                            {vert.nr}
                          </span>
                          <span className="font-extrabold text-sm text-dark">{vert.name}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">{vert.score} Audit Match</span>
                      </div>
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1.5">{vert.spec}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{vert.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SOW, SMS SANDBOX & UPGRADES */}
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

            {/* UPGRADE 4: Live Twilio SMS Sandbox testing module */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Smartphone className="text-primary h-6 w-6" />
                <h3 className="font-bold text-dark text-lg leading-tight">Live SMS Router Sandbox</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Test our automated SMS routing system! Enter your mobile number below, and trigger a secure webhook dispatch simulation.
              </p>

              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={smsNumber}
                  onChange={(e) => setSmsNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />

                <button
                  type="button"
                  disabled={smsStatus === 'sending' || !signature}
                  onClick={handleTestSms}
                  className="w-full py-3 bg-dark text-white font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  {smsStatus === 'sending' ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Routing SMS Node...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Test Sandbox Ping
                    </>
                  )}
                </button>

                {!signature && (
                  <p className="text-[9px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 font-semibold leading-relaxed">
                    ⚠️ Note: You must type your name in the SOW E-Signature box above first to verify your developer token sandbox!
                  </p>
                )}

                {smsLogs.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-900 rounded-2xl font-mono text-[9px] text-gray-300 space-y-1.5 leading-relaxed max-h-36 overflow-y-auto border border-gray-800 animate-in fade-in">
                    {smsLogs.map((log, idx) => (
                      <p key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : ''}>
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* UPGRADE 3: Active support retainer & direct billing upgrade */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldAlert size={80} />
              </div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Layers className="text-primary h-5 w-5" /> Active Support SLA Retainer
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">Current Support Status</span>
                  <span className="font-bold text-primary">{activeRetainerTier}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">Assigned Expert Integrator</span>
                  <span className="font-bold text-white">Alice L. (Senior Architect)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Response Speed Guarantee</span>
                  <span className="font-bold text-emerald-400">4-Hour Slack SLA Active</span>
                </div>
              </div>

              {upgradeSuccess ? (
                <div className="bg-emerald-600 p-4 rounded-xl text-center border border-emerald-500 animate-in zoom-in-95">
                  <CheckCircle2 size={24} className="text-white mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Retainer Tier Updated!</p>
                  <p className="text-[10px] text-emerald-100 mt-1 leading-relaxed">
                    Stripe Secure Auto-Pay has been upgraded successfully. Your new SLA response is active immediately.
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Upgrade Support SLA Retainer</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRetainer('300')}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold text-center transition ${
                        selectedRetainer === '300'
                          ? 'border-primary bg-indigo-900/50 text-white ring-1 ring-primary'
                          : 'border-gray-800 text-gray-400 bg-transparent hover:border-gray-700'
                      }`}
                    >
                      Premium ($300/mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRetainer('500')}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold text-center transition ${
                        selectedRetainer === '500'
                          ? 'border-primary bg-indigo-900/50 text-white ring-1 ring-primary'
                          : 'border-gray-800 text-gray-400 bg-transparent hover:border-gray-700'
                      }`}
                    >
                      Enterprise ($500/mo)
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    disabled={selectedRetainer === '150' || loading}
                    onClick={handleUpgradeRetainer}
                    className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                        Upgrading Stripe Billing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Confirm Billing Upgrade
                      </>
                    )}
                  </button>
                </div>
              )}
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
                  <p className="text-xs text-gray-500 font-medium">Master Lead Ingestion &amp; Fulfillment Engine</p>
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
                              className="bg-primary h-full" 
                              style={{ width: `${lead.score || 70}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-dark">{lead.score || 70}% Match</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          lead.status === 'dispatched' || lead.status === 'synced'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-gray-600 bg-gray-100'
                        }`}>
                          {lead.status || 'captured'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          disabled={isGeneratingReport === lead.id}
                          onClick={() => handleGenerateAudit(lead.id)}
                          className="inline-flex items-center px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm"
                        >
                          {isGeneratingReport === lead.id ? (
                            <>
                              <Loader2 className="animate-spin h-3.5 w-3.5 mr-1.5" />
                              Compiling...
                            </>
                          ) : generationSuccess === lead.id ? (
                            <>
                              <CheckCircle2 size={14} className="text-emerald-500 mr-1.5" />
                              Blueprint Ready
                            </>
                          ) : (
                            <>
                              <Zap size={14} className="text-indigo-500 mr-1.5" />
                              Generate Blueprint
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
                onClick={() => token && fetchLeads(token)}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Refresh Lead List
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Report Modal */}
      {selectedAuditHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />
                <h3 className="font-bold text-dark text-sm tracking-tight uppercase">Generated Diagnostic Roadmap</h3>
              </div>
              <button 
                onClick={() => setSelectedAuditHtml(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition text-gray-400 hover:text-dark"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-0 bg-gray-100">
              <iframe 
                srcDoc={selectedAuditHtml} 
                className="w-full h-full border-none"
                title="Diagnostic Report"
              />
            </div>
            <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-end bg-gray-50/80 gap-4">
              <button 
                onClick={() => {
                  const blob = new Blob([selectedAuditHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `diagnostic_report_${new Date().getTime()}.html`;
                  a.click();
                }}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-2"
              >
                <ArrowRight size={14} className="rotate-90" /> Download HTML
              </button>
              <button 
                onClick={() => setSelectedAuditHtml(null)}
                className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition shadow-lg"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
