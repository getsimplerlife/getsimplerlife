import { Outlet, Link } from 'react-router-dom'
import { Activity, ChevronDown, Shield, HardHat, FileText, UserPlus, Package, ClipboardCheck, Bot, Home as HomeIcon, Scale, FileSearch, Sparkles, Zap, Globe, Server } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import PromoBanner from './PromoBanner'

export default function Layout() {
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-dark">
      {/* Grand Launch Promo Banner */}
      <PromoBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
            <Activity className="h-6 w-6 text-primary" />
            <span>Simpler Life</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition font-medium">Home</Link>
            {/* Solutions Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition font-medium focus:outline-none"
              >
                <span>Solutions</span>
                <ChevronDown className={`h-4 w-4 transition ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {solutionsOpen && (
                <div 
                  onClick={() => setSolutionsOpen(false)}
                  className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50"
                >
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sales &amp; Marketing</div>
                  <Link to="/solutions/insurance-quotes" className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-primary transition text-sm">
                    <Shield className="h-4 w-4 text-primary" /> Insurance Quote Engine
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Financial</div>
                  <Link to="/solutions/mortgage-leads" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition text-sm">
                    <HomeIcon className="h-4 w-4 text-emerald-600" /> Mortgage Lead Qualification
                  </Link>
                  <Link to="/solutions/construction-bids" className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition text-sm">
                    <HardHat className="h-4 w-4 text-amber-600" /> Construction Bids
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Legal</div>
                  <Link to="/solutions/legal-intake" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition text-sm">
                    <Scale className="h-4 w-4 text-violet-600" /> Legal Intake Automation
                  </Link>
                  <Link to="/solutions/contract-review" className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition text-sm">
                    <FileSearch className="h-4 w-4 text-amber-600" /> Contract Review Workflows
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Operations</div>
                  <Link to="/solutions/proposal-writing" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition text-sm">
                    <FileText className="h-4 w-4 text-violet-600" /> Proposal Writing
                  </Link>
                  <Link to="/solutions/vendor-onboarding" className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 transition text-sm">
                    <UserPlus className="h-4 w-4 text-cyan-600" /> Vendor Onboarding
                  </Link>
                  <Link to="/solutions/procurement-automation" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-gray-700 hover:text-orange-700 transition text-sm">
                    <Package className="h-4 w-4 text-orange-600" /> Procurement Automation
                  </Link>
                  <Link to="/solutions/compliance-dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition text-sm">
                    <ClipboardCheck className="h-4 w-4 text-emerald-600" /> Compliance Dashboard
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Diagnostics</div>
                  <Link to="/solutions/configurator" className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-primary transition text-sm">
                    <Zap className="h-4 w-4 text-primary" /> Workflow Configurator
                  </Link>
                  <Link to="/checklist" className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-primary transition text-sm font-semibold bg-indigo-50/20">
                    <Sparkles className="h-4 w-4 text-indigo-600" /> 18-Vertical Master Audit
                  </Link>
                  <Link to="/scanner" className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-primary transition text-sm">
                    <Globe className="h-4 w-4 text-sky-600" /> Website Automation Scanner
                  </Link>
                  <Link to="/sandbox" className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-primary transition text-sm">
                    <Server className="h-4 w-4 text-purple-600" /> Webhook Playground
                  </Link>
                </div>
              )}
            </div>
            <Link to="/checklist" className="text-gray-600 hover:text-primary transition font-medium">Checklist</Link>
            <Link to="/roi" className="text-gray-600 hover:text-primary transition font-medium">ROI Calc</Link>
            <Link to="/book" className="text-gray-600 hover:text-primary transition font-medium">Book Audit</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition font-medium">Contact</Link>
            <Link to="/sandbox" className="text-indigo-600 hover:text-indigo-800 transition font-semibold flex items-center gap-1.5 bg-indigo-50/50 px-3 py-1 rounded-lg border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              API Sandbox
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition font-medium">Client Portal</Link>
          </nav>
          {/* Mobile nav - simplified */}
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/checklist" className="text-sm text-gray-600 hover:text-primary transition font-medium">Checklist</Link>
            <Link to="/sandbox" className="text-sm text-indigo-600 hover:text-indigo-800 transition font-bold">Sandbox</Link>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary transition font-medium">Portal</Link>
            <Link to="/book" className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-primary-dark transition">Book</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-white font-bold text-lg mb-4 sm:mb-0">
            <Activity className="h-5 w-5 text-secondary" />
            <span>Simpler Life</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Simpler Life. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
