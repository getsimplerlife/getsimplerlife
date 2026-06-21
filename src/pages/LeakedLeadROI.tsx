import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, DollarSign, Users, Moon, TrendingDown, AlertTriangle, Sparkles, BarChart3, ArrowUpRight, Calculator } from 'lucide-react'

function useCountUp(target: number, duration = 1000) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)
  const raf = useRef<number>()

  useEffect(() => {
    const start = prev.current
    const diff = target - start
    if (Math.abs(diff) < 0.5) { setDisplay(target); prev.current = target; return }
    const startTime = performance.now()
    function animate(t: number) {
      const p = Math.min((t - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(start + diff * eased)
      if (p < 1) raf.current = requestAnimationFrame(animate)
      else { setDisplay(target); prev.current = target }
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])
  return display
}

export default function LeakedLeadROI() {
  const [ticketSize, setTicketSize] = useState(2500)
  const [monthlyVisitors, setMonthlyVisitors] = useState(5000)
  const [missedRate, setMissedRate] = useState(35)

  const conversionRate = 2.5 // 2.5% average conversion
  const monthlyLeads = Math.round(monthlyVisitors * (conversionRate / 100))
  const missedLeads = Math.round(monthlyLeads * (missedRate / 100))
  const monthlyLostRevenue = Math.round(missedLeads * ticketSize)
  const annualLostRevenue = monthlyLostRevenue * 12

  const animMonthlyLost = useCountUp(monthlyLostRevenue)
  const animAnnualLost = useCountUp(annualLostRevenue)
  const animMissedLeads = useCountUp(missedLeads)

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}K`
    return `$${val.toLocaleString()}`
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4">
            <AlertTriangle size={16} /> Are You Losing Leads Right Now?
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4 leading-tight">
            Calculate Your{' '}
            <span className="text-red-500">Leaked Lead Revenue</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Every unanswered lead, every after-hours inquiry, every slow follow-up is revenue walking out the door. 
            See exactly how much — and how to stop it.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Input Panel - 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-dark">Your Business Metrics</h2>
            </div>

            <div className="space-y-8">
              {/* Average Ticket Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 font-semibold text-dark">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    Average Ticket Size
                  </label>
                  <span className="text-2xl font-bold text-dark font-mono">${ticketSize.toLocaleString()}</span>
                </div>
                <input type="range" min={100} max={50000} step={100} value={ticketSize}
                  onChange={e => setTicketSize(Number(e.target.value))}
                  className="w-full accent-primary" aria-label="Average ticket size" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$100</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Monthly Visitors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 font-semibold text-dark">
                    <Users className="h-5 w-5 text-blue-500" />
                    Monthly Website Visitors
                  </label>
                  <span className="text-2xl font-bold text-dark font-mono">{monthlyVisitors.toLocaleString()}</span>
                </div>
                <input type="range" min={100} max={100000} step={100} value={monthlyVisitors}
                  onChange={e => setMonthlyVisitors(Number(e.target.value))}
                  className="w-full accent-primary" aria-label="Monthly website visitors" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>100</span>
                  <span>100,000</span>
                </div>
              </div>

              {/* Missed Lead Rate */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 font-semibold text-dark">
                    <Moon className="h-5 w-5 text-indigo-500" />
                    Missed After-Hours & Slow-Response Leads
                  </label>
                  <span className="text-2xl font-bold text-dark font-mono">{missedRate}%</span>
                </div>
                <input type="range" min={5} max={80} step={1} value={missedRate}
                  onChange={e => setMissedRate(Number(e.target.value))}
                  className="w-full accent-primary" aria-label="Missed lead rate percentage" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5%</span>
                  <span>80%</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Below Sliders */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Qualified Leads / Month</p>
                <p className="text-2xl font-bold text-indigo-600">{monthlyLeads}</p>
                <p className="text-xs text-gray-400">at {conversionRate}% conversion</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Leaked Leads / Month</p>
                <p className="text-2xl font-bold text-red-500">{Math.round(animMissedLeads)}</p>
                <p className="text-xs text-gray-400">{missedRate}% of qualified leads</p>
              </div>
            </div>
          </div>

          {/* Results Panel - 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <TrendingDown className="h-6 w-6 text-red-200" />
                <h3 className="text-lg font-bold text-white/90">Your Monthly Leak</h3>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-red-200 mb-1">Estimated Monthly Lost Revenue</p>
                <p className="text-5xl sm:text-6xl font-black tracking-tight">
                  {formatCurrency(animMonthlyLost)}
                </p>
                <p className="text-sm text-red-200 mt-2">
                  from {Math.round(animMissedLeads)} leads slipping through the cracks
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-200">Annualized Loss</span>
                  <span className="text-2xl font-bold">{formatCurrency(animAnnualLost)}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(missedRate * 1.25, 100)}%` }} />
                </div>
                <p className="text-xs text-red-200 mt-2">Lead leakage rate: {missedRate}%</p>
              </div>

              <Link to="/book"
                className="block w-full text-center py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition shadow-lg text-lg">
                Stop the Leak — Get Your $99 Audit
                <ArrowUpRight className="inline h-5 w-5 ml-1" />
              </Link>
              <p className="text-xs text-red-200 text-center mt-3">
                100% credited toward any implementation package
              </p>
            </div>

            {/* Context Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-dark mb-1">Industry Benchmark</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    The average SMB loses <strong className="text-red-500">35-50%</strong> of leads due to slow response. 
                    Responding within <strong className="text-primary">5 minutes</strong> increases conversion by{' '}
                    <strong className="text-emerald-600">9x</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - How to fix */}
        <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-4 text-indigo-200" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">How Simpler Life Stops the Leak</h2>
          <p className="text-indigo-200 max-w-xl mx-auto mb-6">
            Our AI automation captures every lead — 24/7, 365 — responds instantly, qualifies, 
            and routes to your team. No lead is ever left unanswered.
          </p>
          <Link to="/book"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-indigo-50 transition shadow-lg">
            Get Your $99 Asynchronous Audit Blueprint <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}