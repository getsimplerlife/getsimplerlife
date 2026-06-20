import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Bot, Zap, ArrowUpRight, ArrowLeft, ShieldAlert, LogOut, Loader2, Sparkles, Database } from 'lucide-react'
import apiService, { MetricsResponse } from '../services/api'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('autoflow_client_token'))
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    // Only load if a valid JWT token exists (not the placeholder 'demo' from local bypass)
    if (token && token !== 'demo') {
      loadMetrics(token)
    }
  }, [token])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedToken = await apiService.fetchToken()
      localStorage.setItem('autoflow_client_token', fetchedToken)
      setToken(fetchedToken)
    } catch (err: any) {
      console.error(err)
      setError('Authentication failed. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('autoflow_client_token')
    setToken(null)
    setMetrics(null)
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
                  Authenticate as Doe Logistics
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
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Avg Lead Response</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">
                  {metrics ? Math.round(metrics.kpis.avgResponseTimeMinutes * 60) : 108} sec
                </span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {metrics?.kpis.targetResponseReductionPercent || 92.5}% Speedup
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Immediate auto-replies dispatched via SMS.</p>
            </div>
          </div>
        </div>

        {/* Grid Bottom */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Automations */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-dark text-lg mb-6">Active Workflows</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-dark">Web Contact Form → FollowUpBoss CRM</p>
                      <p className="text-xs text-gray-500">Triggers immediately upon user form submission</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-dark">Cal.com Event → Google Docs Agenda Creator</p>
                      <p className="text-xs text-gray-500">Generates custom briefings and pre-meeting notes</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>

            {/* Weekly Analytics Breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-dark text-lg mb-4">Hours Saved Breakdown (Weekly)</h3>
              <p className="text-xs text-gray-500 mb-6">Weekly allocation of custom automations in the SQLite database.</p>
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

          {/* Quick Actions / Log */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-fit">
            <h3 className="font-bold text-dark text-lg mb-6">Support & Retainer Info</h3>
            <div className="space-y-4 text-sm">
              <div className="pb-4 border-b border-gray-100">
                <p className="font-semibold text-dark">Retainer Status</p>
                <p className="text-xs text-gray-500 mt-0.5">Growth Retainer ($300/mo) | Up to 8 workflows</p>
              </div>
              <div className="pb-4 border-b border-gray-100">
                <p className="font-semibold text-dark">Assigned Integrator</p>
                <p className="text-xs text-gray-500 mt-0.5">Alice - Lead Automation Expert</p>
              </div>
              <div>
                <Link to="/contact" className="w-full inline-flex items-center justify-center py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition shadow-sm">
                  Request New Automation
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
