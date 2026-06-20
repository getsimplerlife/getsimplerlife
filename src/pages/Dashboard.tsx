import { Link } from 'react-router-dom'
import { Clock, Bot, Zap, ArrowUpRight, ArrowLeft } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Client Retainer Portal</span>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight mt-1">
              Active Automation Performance
            </h1>
          </div>
          <Link to="/" className="mt-4 sm:mt-0 inline-flex items-center text-sm text-gray-500 hover:text-primary transition font-medium">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Exit Portal
          </Link>
        </div>

        {/* Highlight Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Admin Hours Saved</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">42.5 hrs</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% MoM</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Saved this month via automatic data entries.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Leads Processed</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">312 leads</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% Success</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ingested from website & routed to CRM.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-primary rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Avg Lead Response</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-dark">28 sec</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">92.5% Speedup</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Immediate auto-replies dispatched via SMS.</p>
            </div>
          </div>
        </div>

        {/* Grid Bottom */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Automations */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
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

          {/* Quick Actions / Log */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
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
