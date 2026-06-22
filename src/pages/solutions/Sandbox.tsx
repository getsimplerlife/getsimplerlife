import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Terminal, ArrowLeft, Play, Shield, Zap, Sparkles, Database,
  Server, Cpu, CheckCircle2, RefreshCw, Code, FileText, Lock,
  MessageSquare, DollarSign, Wrench, CreditCard, ArrowRight, 
  Globe, Clock, Activity, BookOpen, BarChart3, Bell
} from 'lucide-react'

interface LogStep { time: string; type: 'info' | 'success' | 'warning' | 'security' | 'database'; message: string }
interface PipelineStep { id: string; label: string; icon: any; status: 'pending' | 'active' | 'done' | 'error'; detail: string }

type SimType = 'servicetitan' | 'stripe' | 'quickbooks' | 'calcom'

interface SimConfig {
  label: string
  icon: any
  desc: string
  gradient: string
  hoverBorder: string
  iconBg: string
  iconColor: string
  color: string
  steps: PipelineStep[]
  logs: { msg: string; type: LogStep['type']; delay: number }[]
  response: Record<string, any>
}

const simConfigs: Record<SimType, SimConfig> = {
  servicetitan: {
    label: 'ServiceTitan Job Update', icon: Wrench, desc: 'Job completed → auto-dispatch next appointment', gradient: 'from-blue-900/40 to-blue-800/20', hoverBorder: 'border-blue-500/60', iconBg: 'bg-blue-600/20', iconColor: 'text-blue-400', color: 'blue',
    steps: [
      { id: 'ingest', label: 'Ingestion', icon: Globe, status: 'pending', detail: 'Receiving webhook...' },
      { id: 'pii', label: 'PII Scrubbing', icon: Shield, status: 'pending', detail: 'Redacting sensitive data...' },
      { id: 'transform', label: 'Data Transform', icon: Code, status: 'pending', detail: 'Mapping fields...' },
      { id: 'enrich', label: 'Enrichment', icon: Database, status: 'pending', detail: 'Looking up customer...' },
      { id: 'crm', label: 'CRM Sync', icon: BarChart3, status: 'pending', detail: 'Updating HubSpot...' },
      { id: 'alert', label: 'Slack Alert', icon: Bell, status: 'pending', detail: 'Notifying team...' },
      { id: 'complete', label: 'Complete', icon: CheckCircle2, status: 'pending', detail: 'Done' },
    ],
    logs: [
      { msg: '⏳ Incoming webhook from ServiceTitan...', type: 'info', delay: 200 },
      { msg: '📡 Endpoint: POST /api/webhooks/servicetitan', type: 'info', delay: 300 },
      { msg: '🔐 Event: job.status.updated — Job #ST-48291', type: 'info', delay: 500 },
      { msg: '🔑 Verifying HMAC-SHA256 signature...', type: 'security', delay: 400 },
      { msg: '✅ Signature valid (X-ServiceTitan-Signature match)', type: 'success', delay: 500 },
      { msg: '🛡️ PII detected: phone (***-***-4821), email (j***@apex.com) — redacted', type: 'security', delay: 600 },
      { msg: '🔄 Transforming: service_titan.job → internal schema', type: 'info', delay: 400 },
      { msg: '📋 Customer: Apex Plumbing — 1234 Main St, Charlotte NC', type: 'info', delay: 500 },
      { msg: '🔍 CRM lookup: existing customer (3 prev jobs, $8.2K LTV)', type: 'database', delay: 500 },
      { msg: '📊 HubSpot deal updated — Stage: Service Scheduled', type: 'success', delay: 400 },
      { msg: '📢 Slack #dispatch: "Mike Rodriguez assigned (4.9★, 2mi)"', type: 'success', delay: 600 },
      { msg: '⏱ Total: 4.2s', type: 'info', delay: 200 },
    ],
    response: { success: true, leadId: `ld_${Math.random().toString(36).slice(2, 8)}`, technician: 'Mike Rodriguez', eta: '45 min', slackChannel: '#dispatch' }
  },
  stripe: {
    label: 'Stripe Invoice Paid', icon: CreditCard, desc: 'invoice.payment_succeeded → CRM + Slack', gradient: 'from-purple-900/40 to-purple-800/20', hoverBorder: 'border-purple-500/60', iconBg: 'bg-purple-600/20', iconColor: 'text-purple-400', color: 'purple',
    steps: [
      { id: 'ingest', label: 'Ingestion', icon: Globe, status: 'pending', detail: 'Receiving webhook...' },
      { id: 'pii', label: 'PII Scrubbing', icon: Shield, status: 'pending', detail: 'Redacting card data...' },
      { id: 'validate', label: 'Validation', icon: FileText, status: 'pending', detail: 'Checking invoice...' },
      { id: 'process', label: 'Payment', icon: CreditCard, status: 'pending', detail: 'Processing...' },
      { id: 'crm', label: 'CRM Sync', icon: BarChart3, status: 'pending', detail: 'Closing deal...' },
      { id: 'alert', label: 'Slack Alert', icon: Bell, status: 'pending', detail: 'Notifying team...' },
      { id: 'complete', label: 'Complete', icon: CheckCircle2, status: 'pending', detail: 'Done' },
    ],
    logs: [
      { msg: '⏳ Incoming webhook from Stripe...', type: 'info', delay: 200 },
      { msg: '📡 Endpoint: POST /api/webhooks/stripe', type: 'info', delay: 300 },
      { msg: '💳 Event: invoice.payment_succeeded — inv_9kF2nQ3rX', type: 'info', delay: 500 },
      { msg: '🔑 Verifying Stripe webhook signature...', type: 'security', delay: 400 },
      { msg: '✅ Signature valid (whsec_... match)', type: 'success', delay: 500 },
      { msg: '🛡️ Card data redacted: ****-****-****-4242', type: 'security', delay: 400 },
      { msg: '📋 Invoice #INV-2026-04821 — $3,250.00', type: 'info', delay: 400 },
      { msg: '🏢 Customer: Charlotte Mechanical Services', type: 'info', delay: 400 },
      { msg: '💰 Charging $3,250.00 — payment succeeded', type: 'success', delay: 600 },
      { msg: '📊 HubSpot deal moved to Closed Won', type: 'database', delay: 500 },
      { msg: '📢 Slack #finance: "Payment received — $3,250.00"', type: 'success', delay: 500 },
      { msg: '⏱ Total: 3.8s', type: 'info', delay: 200 },
    ],
    response: { success: true, invoiceId: 'inv_9kF2nQ3rX', amount: '$3,250.00', customer: 'Charlotte Mechanical Services', slackChannel: '#finance' }
  },
  quickbooks: {
    label: 'QuickBooks Invoice', icon: BookOpen, desc: 'Invoice created → sync to CRM + alert', gradient: 'from-emerald-900/40 to-emerald-800/20', hoverBorder: 'border-emerald-500/60', iconBg: 'bg-emerald-600/20', iconColor: 'text-emerald-400', color: 'emerald',
    steps: [
      { id: 'ingest', label: 'Ingestion', icon: Globe, status: 'pending', detail: 'Receiving webhook...' },
      { id: 'pii', label: 'PII Scrubbing', icon: Shield, status: 'pending', detail: 'Redacting financial data...' },
      { id: 'validate', label: 'Validation', icon: FileText, status: 'pending', detail: 'Validating invoice...' },
      { id: 'crm', label: 'CRM Sync', icon: BarChart3, status: 'pending', detail: 'Syncing to HubSpot...' },
      { id: 'alert', label: 'Slack Alert', icon: Bell, status: 'pending', detail: 'Notifying team...' },
      { id: 'complete', label: 'Complete', icon: CheckCircle2, status: 'pending', detail: 'Done' },
    ],
    logs: [
      { msg: '⏳ Incoming webhook from QuickBooks...', type: 'info', delay: 200 },
      { msg: '📡 Endpoint: POST /api/webhooks/quickbooks', type: 'info', delay: 300 },
      { msg: '📄 Event: Invoice.Create — QB-Inv-8821', type: 'info', delay: 500 },
      { msg: '🔑 Verifying OAuth 2.0 token...', type: 'security', delay: 400 },
      { msg: '✅ Token valid (Intuit API)', type: 'success', delay: 400 },
      { msg: '🛡️ Bank acct data redacted: ****-8812', type: 'security', delay: 400 },
      { msg: '📋 Invoice: $4,750 — Net 30 — Apex HVAC Supplies', type: 'info', delay: 500 },
      { msg: '📊 HubSpot deal created — Stage: Invoice Sent', type: 'database', delay: 500 },
      { msg: '📢 Slack #accounting: "New invoice — $4,750 from QB"', type: 'success', delay: 500 },
      { msg: '⏱ Total: 3.2s', type: 'info', delay: 200 },
    ],
    response: { success: true, invoiceId: 'QB-Inv-8821', amount: '$4,750.00', customer: 'Apex HVAC Supplies', action: 'crm_deal_created', slackChannel: '#accounting' }
  },
  calcom: {
    label: 'Cal.com Booking', icon: Clock, desc: 'Appointment booked → sync + confirmation', gradient: 'from-rose-900/40 to-rose-800/20', hoverBorder: 'border-rose-500/60', iconBg: 'bg-rose-600/20', iconColor: 'text-rose-400', color: 'rose',
    steps: [
      { id: 'ingest', label: 'Ingestion', icon: Globe, status: 'pending', detail: 'Receiving webhook...' },
      { id: 'pii', label: 'PII Scrubbing', icon: Shield, status: 'pending', detail: 'Redacting personal info...' },
      { id: 'validate', label: 'Validation', icon: FileText, status: 'pending', detail: 'Checking availability...' },
      { id: 'crm', label: 'CRM Sync', icon: BarChart3, status: 'pending', detail: 'Updating CRM...' },
      { id: 'alert', label: 'Slack Alert', icon: Bell, status: 'pending', detail: 'Notifying team...' },
      { id: 'complete', label: 'Complete', icon: CheckCircle2, status: 'pending', detail: 'Done' },
    ],
    logs: [
      { msg: '⏳ Incoming webhook from Cal.com...', type: 'info', delay: 200 },
      { msg: '📡 Endpoint: POST /api/webhooks/calcom', type: 'info', delay: 300 },
      { msg: '📅 Event: BOOKING_CREATED — bk_7MxKpL2q', type: 'info', delay: 500 },
      { msg: '🔑 Verifying Cal.com webhook secret...', type: 'security', delay: 400 },
      { msg: '✅ Signature verified', type: 'success', delay: 400 },
      { msg: '🛡️ Attendee email redacted: s***@gmail.com', type: 'security', delay: 400 },
      { msg: '📅 Booking: Discovery Call — Tomorrow 2:00 PM EST', type: 'info', delay: 500 },
      { msg: '📊 HubSpot contact created + meeting linked', type: 'database', delay: 500 },
      { msg: '📢 Slack #sales: "New booking — Discovery Call with Sarah"', type: 'success', delay: 500 },
      { msg: '⏱ Total: 2.8s', type: 'info', delay: 200 },
    ],
    response: { success: true, bookingId: 'bk_7MxKpL2q', event: 'Discovery Call', time: 'Tomorrow 2:00 PM EST', attendee: 'Sarah (s***@gmail.com)', slackChannel: '#sales' }
  }
}

export default function Sandbox() {
  const [simType, setSimType] = useState<SimType | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [logs, setLogs] = useState<LogStep[]>([])
  const [pipeline, setPipeline] = useState<PipelineStep[]>([])
  const [responseData, setResponseData] = useState<Record<string, any> | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight }, [logs])

  const addLog = (msg: string, type: LogStep['type'] = 'info', delay: number): Promise<void> =>
    new Promise(resolve => setTimeout(() => {
      const now = new Date()
      const ms = String(now.getMilliseconds()).padStart(3, '0')
      setLogs(prev => [...prev, { time: `${now.toLocaleTimeString('en-US', { hour12: false })}.${ms}`, type, message: msg }])
      resolve()
    }, delay))

  const updatePipeline = (id: string, status: PipelineStep['status'], detail: string) =>
    setPipeline(prev => prev.map(s => s.id === id ? { ...s, status, detail } : s))

  const simulate = async (type: SimType) => {
    setIsSimulating(true); setLogs([]); setResponseData(null); setSimType(type)
    const config = simConfigs[type]
    setPipeline(config.steps)

    for (const step of config.steps) {
      updatePipeline(step.id, 'active', `Processing ${step.label.toLowerCase()}...`)
      await new Promise(r => setTimeout(r, 300))
    }

    for (const log of config.logs) {
      const stepIdx = Math.min(Math.floor(logs.length / 2), config.steps.length - 1)
      const stepId = config.steps[stepIdx]?.id
      if (stepId) updatePipeline(stepId, 'done', `✓ ${config.steps[stepIdx].label} complete`)
      await addLog(log.msg, log.type, log.delay)
      const nextIdx = Math.min(Math.floor(logs.length / 2), config.steps.length - 1)
      if (nextIdx > stepIdx && config.steps[nextIdx]) {
        updatePipeline(config.steps[nextIdx].id, 'active', `Processing ${config.steps[nextIdx].label.toLowerCase()}...`)
      }
    }

    config.steps.forEach(s => updatePipeline(s.id, 'done', `✓ ${s.label} complete`))
    setResponseData(config.response)
    setIsSimulating(false)
  }

  const reset = () => { setSimType(null); setIsSimulating(false); setLogs([]); setPipeline([]); setResponseData(null) }

  const types: SimType[] = ['servicetitan', 'stripe', 'quickbooks', 'calcom']

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Activity className="h-3 w-3 text-emerald-400" /> Sandbox
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">⚡ Webhook Playground & API Sandbox</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Trigger real-time simulations of ServiceTitan, Stripe, QuickBooks, and Cal.com events — watch them flow through Ingestion → PII Scrubbing → CRM Sync → Slack Alert.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT PANEL */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Simulate an Event</h2>
              <div className="grid grid-cols-2 gap-3">
                {types.map(t => {
                  const c = simConfigs[t]
                  return (
                    <button key={t} onClick={() => simulate(t)} disabled={isSimulating}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${c.gradient} border border-gray-700 hover:${c.hoverBorder} transition disabled:opacity-50 group`}>
                      <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center group-hover:bg-opacity-30 transition`}>
                        <c.icon className={`h-6 w-6 ${c.iconColor}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition">{c.label.split(' ')[0]}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{c.desc.slice(0, 35)}...</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Pipeline</h2>
              {pipeline.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Click a button to start</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {pipeline.map((step, i) => (
                    <div key={step.id} className="flex items-start gap-3 relative pb-5 last:pb-0">
                      {i < pipeline.length - 1 && (
                        <div className={`absolute left-4 top-7 w-0.5 h-5 ${step.status === 'done' ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                      )}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        step.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                        step.status === 'active' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-gray-700 text-gray-500'
                      }`}>
                        {step.status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : step.status === 'active' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <div className="h-2 w-2 rounded-full bg-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className={`text-sm font-medium ${step.status === 'done' ? 'text-emerald-300' : step.status === 'active' ? 'text-blue-300' : 'text-gray-500'}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${step.status === 'done' ? 'text-emerald-500/70' : step.status === 'active' ? 'text-blue-400/70' : 'text-gray-600'}`}>{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {responseData && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Response</h2>
                  <button onClick={reset} className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Reset</button>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 text-xs text-emerald-300 overflow-x-auto font-mono leading-relaxed">{JSON.stringify(responseData, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* RIGHT PANEL — Terminal */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700" style={{ background: '#1a1a2e' }}>
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
              <p className="text-xs text-gray-400 ml-3 font-mono">webhook-simulator — terminal</p>
              {isSimulating && <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400"><RefreshCw className="h-3 w-3 animate-spin" /> Running...</div>}
            </div>
            <div ref={terminalRef} className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto" style={{ minHeight: 400, maxHeight: 600, background: '#0d1117' }}>
              {logs.length === 0 ? (
                <div className="text-center py-16 text-gray-600">
                  <Terminal className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Terminal ready</p>
                  <p className="text-xs mt-1">Trigger a simulation from the left panel</p>
                </div>
              ) : logs.map((log, i) => (
                <div key={i} className="flex gap-3 mb-1.5">
                  <span className="text-gray-600 flex-shrink-0 w-24">{log.time}</span>
                  <span className={`flex-shrink-0 w-16 text-xs ${log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-yellow-400' : log.type === 'security' ? 'text-cyan-400' : log.type === 'database' ? 'text-purple-400' : 'text-gray-300'}`}>[{log.type.toUpperCase()}]</span>
                  <span className="text-gray-200">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}