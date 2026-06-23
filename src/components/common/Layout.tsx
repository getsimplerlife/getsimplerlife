import { Outlet, Link } from 'react-router-dom'
import { Activity, ChevronDown, Shield, HardHat, FileText, UserPlus, Package, ClipboardCheck, Bot, Home as HomeIcon, Scale, FileSearch, Sparkles, Zap, Globe, Server, ArrowRight } from 'lucide-react'
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
                  className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="px-5 py-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center justify-between">
                    <span>24/7 Asynchronous Suite</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  
                  <div className="px-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sales &amp; Marketing</div>
                    <Link to="/solutions/insurance-quotes" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-50 transition">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-primary">Insurance Quote Engine</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">LIVE</span>
                    </Link>
                    
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">Financial</div>
                    <Link to="/solutions/mortgage-leads" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 transition">
                      <div className="flex items-center gap-3">
                        <HomeIcon className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-emerald-700">Mortgage Qualification</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">24/7</span>
                    </Link>
                    <Link to="/solutions/construction-bids" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-amber-50 transition">
                      <div className="flex items-center gap-3">
                        <HardHat className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-amber-700">Construction Bids</span>
                      </div>
                    </Link>
                    
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">Legal</div>
                    <Link to="/solutions/legal-intake" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-violet-50 transition">
                      <div className="flex items-center gap-3">
                        <Scale className="h-4 w-4 text-violet-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-violet-700">Legal Intake</span>
                      </div>
                    </Link>
                    <Link to="/solutions/contract-review" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-amber-50 transition">
                      <div className="flex items-center gap-3">
                        <FileSearch className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-amber-700">Contract Review</span>
                      </div>
                    </Link>
                    
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">Operations</div>
                    <Link to="/solutions/proposal-writing" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-violet-50 transition">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-violet-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-violet-700">Proposal Writing</span>
                      </div>
                    </Link>
                    <Link to="/solutions/vendor-onboarding" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-cyan-50 transition">
                      <div className="flex items-center gap-3">
                        <UserPlus className="h-4 w-4 text-cyan-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-cyan-700">Vendor Onboarding</span>
                      </div>
                    </Link>
                    <Link to="/solutions/procurement-automation" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-orange-50 transition">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-orange-700">Procurement</span>
                      </div>
                    </Link>
                    <Link to="/solutions/compliance-dashboard" className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 transition">
                      <div className="flex items-center gap-3">
                        <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-emerald-700">Compliance Dashboard</span>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-3 mx-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <Link to="/checklist" className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        <span className="text-xs font-black text-indigo-900 group-hover:text-primary transition uppercase tracking-tight">22-Vertical Audit</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-indigo-400 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
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
