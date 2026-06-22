import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Database, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-primary mb-6">
              ⚡ 50+ Registered Clients | Cumulative 57.0 hrs/wk saved | 92.5% Response Speedup
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-dark mb-6 leading-tight">
              Tired of Wasting Hours on Tasks AI Could Do in Seconds?
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Stop manually entering data, following up on leads, and juggling spreadsheets. Simpler Life builds custom automation workflows so your small business runs itself — while you focus on growth.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md">
                Get Your Automation Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/solutions/configurator" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition bg-white">
                Build Your Workflow
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">No commitment. Asynchronous delivery. See exactly what you can automate.</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <Link to="/scanner" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition font-medium">🔍 Scanner</Link>
              <Link to="/sandbox" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition font-medium">⚡ API Sandbox</Link>
              <Link to="/roi" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition font-medium">📊 ROI Calc</Link>
              <Link to="/checklist" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition font-medium">📋 Audit Checklist</Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Example Automation Stream</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  <div><p className="text-sm font-semibold text-dark">Lead Comes In</p><p className="text-xs text-gray-500">Form submitted or call received</p></div>
                </div>
                <div className="h-6 w-0.5 bg-indigo-200 mx-auto ml-5" />
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <Bot className="h-5 w-5 text-secondary" />
                  <div><p className="text-sm font-semibold text-dark">Simpler Life Processes</p><p className="text-xs text-gray-500">Score lead, auto-assign, draft reply</p></div>
                </div>
                <div className="h-6 w-0.5 bg-indigo-200 mx-auto ml-5" />
                <div className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <Database className="h-5 w-5 text-primary" />
                  <div><p className="text-sm font-semibold text-dark">CRM & Dispatch Updated</p><p className="text-xs text-gray-500">Notion updated + SMS dispatch triggered</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}