import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Settings, 
  Database, 
  Zap, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Activity,
  ArrowUpRight,
  Calculator,
  Layout,
  Cpu,
  Users
} from 'lucide-react'

// Define Types
type Industry = 'Healthcare' | 'Legal' | 'Real Estate' | 'E-Commerce' | 'SaaS' | 'Construction' | 'Financial' | 'Agency'

interface TechApp {
  id: string
  name: string
  icon: string
  category: 'CRM' | 'Communication' | 'Operations' | 'Finance'
}

const APPS: TechApp[] = [
  { id: 'servicetitan', name: 'ServiceTitan', icon: '🛠️', category: 'Operations' },
  { id: 'hubspot', name: 'HubSpot', icon: '🧡', category: 'CRM' },
  { id: 'salesforce', name: 'Salesforce', icon: '☁️', category: 'CRM' },
  { id: 'slack', name: 'Slack', icon: '💬', category: 'Communication' },
  { id: 'zapier', name: 'Zapier', icon: '⚡', category: 'Operations' },
  { id: 'make', name: 'Make.com', icon: '🟣', category: 'Operations' },
  { id: 'quickbooks', name: 'QuickBooks', icon: '💸', category: 'Finance' },
  { id: 'calendly', name: 'Calendly', icon: '📅', category: 'Operations' },
  { id: 'clio', name: 'Clio', icon: '⚖️', category: 'Operations' },
  { id: 'shopify', name: 'Shopify', icon: '🛍️', category: 'Operations' },
]

const BOTTLENECKS = [
  { id: 'manual_entry', label: 'Manual Data Entry', impact: 'High Time Loss' },
  { id: 'missed_leads', label: 'Missed After-Hours Leads', impact: 'Lost Revenue' },
  { id: 'slow_followup', label: 'Slow Lead Response', impact: 'Low Conversion' },
  { id: 'messy_data', label: 'CRM / Database Mismatch', impact: 'Operational Chaos' },
  { id: 'no_reminders', label: 'No Automatic Follow-ups', impact: 'Customer Churn' },
]

export default function Configurator() {
  const [step, setStep] = useState(1)
  const [industry, setIndustry] = useState<Industry | ''>('')
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([])

  const progress = (step / 4) * 100

  const toggleApp = (id: string) => {
    setSelectedApps(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const toggleBottleneck = (id: string) => {
    setSelectedBottlenecks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
  }

  // Calculate ROI Metrics
  const metrics = useMemo(() => {
    const baseHoursSaved = selectedBottlenecks.length * 5 // 5 hours per bottleneck
    const baseRevenueBoost = selectedBottlenecks.includes('missed_leads') ? 15 : 5
    return {
      hoursSaved: baseHoursSaved + (selectedApps.length * 2),
      revenueBoost: baseRevenueBoost + (selectedBottlenecks.length * 2),
      efficiency: 45 + (selectedApps.length * 5) + (selectedBottlenecks.length * 5)
    }
  }, [selectedApps, selectedBottlenecks])

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-dark mb-4">
            Custom <span className="text-primary">Automation Configurator</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Design your ideal automated workflow in 60 seconds. 
            Tell us your stack, we'll show you the future.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="h-2 bg-gray-200 rounded-full w-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className={step >= 1 ? 'text-primary' : ''}>Industry</span>
            <span className={step >= 2 ? 'text-primary' : ''}>Tech Stack</span>
            <span className={step >= 3 ? 'text-primary' : ''}>Bottlenecks</span>
            <span className={step >= 4 ? 'text-primary' : ''}>ROI Roadmap</span>
          </div>
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
          
          <div className="flex-grow p-8 sm:p-12">
            
            {/* Step 1: Industry */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-dark mb-8 flex items-center gap-3">
                  <Layout className="text-primary" /> What's your primary industry?
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(['Healthcare', 'Legal', 'Real Estate', 'E-Commerce', 'SaaS', 'Construction', 'Financial', 'Agency'] as Industry[]).map((ind) => (
                    <button
                      key={ind}
                      onClick={() => { setIndustry(ind); setStep(2); }}
                      className={`p-6 text-left rounded-2xl border-2 transition-all ${
                        industry === ind ? 'border-primary bg-indigo-50 shadow-md' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="block text-lg font-bold text-dark">{ind}</span>
                      <span className="text-sm text-gray-500">Tailored automation blueprints for {ind.toLowerCase()} businesses.</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Tech Stack */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-dark mb-2 flex items-center gap-3">
                  <Layers className="text-primary" /> Select your current software stack
                </h2>
                <p className="text-gray-500 mb-8">Which apps are you using to run your business today?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => toggleApp(app.id)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                        selectedApps.includes(app.id) ? 'border-primary bg-indigo-50 ring-2 ring-primary/10' : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-3xl mb-2">{app.icon}</span>
                      <span className="text-sm font-bold text-dark">{app.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-1">{app.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Bottlenecks */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-dark mb-2 flex items-center gap-3">
                  <Activity className="text-primary" /> Where are the manual friction points?
                </h2>
                <p className="text-gray-500 mb-8">Select the tasks that consume too much of your team's time.</p>
                <div className="space-y-4">
                  {BOTTLENECKS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => toggleBottleneck(b.id)}
                      className={`w-full p-5 text-left rounded-xl border-2 flex items-center justify-between transition-all ${
                        selectedBottlenecks.includes(b.id) ? 'border-primary bg-indigo-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <span className="block font-bold text-dark">{b.label}</span>
                        <span className="text-xs text-gray-400 italic">Impact: {b.impact}</span>
                      </div>
                      {selectedBottlenecks.includes(b.id) && <CheckCircle2 className="text-primary h-6 w-6" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: ROI Roadmap */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Left: Diagram */}
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                      <Zap className="text-yellow-500" /> Your Dynamic Workflow
                    </h3>
                    
                    <div className="relative bg-gray-900 rounded-2xl p-6 min-h-[350px] flex flex-col justify-between border-4 border-gray-800 shadow-2xl">
                      {/* Source */}
                      <div className="flex justify-center mb-8">
                        <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center w-32 relative">
                          <Users className="text-blue-400 mx-auto mb-1" />
                          <span className="text-[10px] text-white/70 uppercase">Inbound Lead</span>
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gradient-to-b from-blue-400 to-transparent" />
                        </div>
                      </div>

                      {/* AI Agent Engine */}
                      <div className="flex justify-center my-4">
                        <div className="bg-primary/20 p-6 rounded-2xl border-2 border-primary/40 text-center w-48 relative shadow-[0_0_30px_rgba(79,70,229,0.3)] animate-pulse">
                          <Cpu className="text-primary mx-auto mb-2" />
                          <span className="block text-xs font-bold text-white uppercase tracking-widest">AI Expert Engine</span>
                          <span className="text-[10px] text-primary/80">Processing {industry} Workflow</span>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gradient-to-t from-primary to-transparent" />
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gradient-to-b from-primary to-transparent" />
                        </div>
                      </div>

                      {/* Destination Integrations */}
                      <div className="flex justify-around mt-8">
                        {selectedApps.slice(0, 3).map(appId => {
                          const app = APPS.find(a => a.id === appId)
                          return (
                            <div key={appId} className="bg-white/10 p-3 rounded-lg border border-white/20 text-center w-24">
                              <span className="text-xl">{app?.icon}</span>
                              <span className="block text-[10px] text-white mt-1">{app?.name}</span>
                            </div>
                          )
                        })}
                        {selectedApps.length === 0 && (
                          <div className="bg-white/10 p-3 rounded-lg border border-white/20 text-center w-24">
                            <Database className="text-white/40 mx-auto" />
                            <span className="block text-[10px] text-white/40 mt-1">CRM Sync</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: ROI Metrics */}
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                      <BarChart3 className="text-emerald-500" /> Projected ROI Metrics
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <p className="text-xs text-indigo-400 uppercase font-bold mb-1">Time Saved</p>
                        <p className="text-3xl font-black text-primary">{metrics.hoursSaved}h<span className="text-sm font-normal">/wk</span></p>
                      </div>
                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-xs text-emerald-400 uppercase font-bold mb-1">Revenue Boost</p>
                        <p className="text-3xl font-black text-emerald-600">+{metrics.revenueBoost}%</p>
                      </div>
                      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 col-span-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-orange-400 uppercase font-bold mb-1">Operational Efficiency</p>
                            <p className="text-3xl font-black text-orange-600">{metrics.efficiency}%</p>
                          </div>
                          <Sparkles className="h-10 w-10 text-orange-300" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-dark p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
                      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calculator size={24} className="text-primary" /> QuickScan™ Diagnostic
                      </h4>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Get our $997 professional diagnostic report. We'll map your entire {industry} operation 
                        and build your exact ROI implementation roadmap.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-white">$997<span className="text-sm font-normal text-gray-500 line-through ml-2">$1,497</span></div>
                        <a 
                          href="https://buy.stripe.com/14A8wP1448OT1hAfJq08g08"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow py-3 bg-primary text-center font-bold rounded-xl hover:bg-primary-dark transition shadow-lg flex items-center justify-center gap-2"
                        >
                          Unlock Audit <ArrowRight size={18} />
                        </a>
                      </div>
                      <p className="text-[10px] text-gray-500 text-center mt-4">
                        100% credited back toward any full-scale automation deployment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Wizard Footer Controls */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
            {step > 1 && step < 4 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-500 font-semibold hover:text-dark transition"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !industry}
                className="px-8 py-3 bg-dark text-white font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-30 flex items-center gap-2"
              >
                Next Step <ArrowRight size={18} />
              </button>
            ) : step === 3 ? (
              <button 
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                Generate My Roadmap <Zap size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-2 text-primary font-bold hover:underline"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Testimonials or Trust Bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale contrast-125">
          <div className="flex items-center gap-2"><Settings size={20} /> <span className="font-bold">SOC2 COMPLIANT</span></div>
          <div className="flex items-center gap-2"><Database size={20} /> <span className="font-bold">HIPAA READY</span></div>
          <div className="flex items-center gap-2"><MessageSquare size={20} /> <span className="font-bold">GDPR ALIGNED</span></div>
          <div className="flex items-center gap-2"><Clock size={20} /> <span className="font-bold">24/7 MONITORING</span></div>
        </div>

      </div>
    </div>
  )
}

function BarChart3({ className, size = 24 }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
    </svg>
  )
}
