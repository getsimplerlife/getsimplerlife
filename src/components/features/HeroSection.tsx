import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Shield, Zap, Search } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-gray-50 border-b border-gray-100">
      {/* 24-Hour Rescue Hero Badge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            {/* 24-Hour Rescue Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-5">
              <Clock className="h-3.5 w-3.5" />
              24-Hour Operational Rescue
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-dark mb-6 leading-tight">
              Find Every Risk, Leak, and{' '}
              <span className="text-primary">Automation Opportunity</span>{' '}
              in Your Business —{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Within 24 Hours</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We scan your operations across all 23 verticals — finance, sales, legal, marketing, HR, compliance, 
              cybersecurity, and AI governance — and deliver a complete diagnostic roadmap in under a day. 
              Stop leaking revenue to manual processes, compliance gaps, and automation blind spots.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
              <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md text-base">
                Start Your 24-Hour Rescue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/checklist" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition bg-white text-base">
                View the 23-Vertical Checklist
              </Link>
            </div>
            
            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> Results in 24 hours</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> No commitment required</span>
              <span className="flex items-center gap-1.5"><Search className="h-3.5 w-3.5 text-primary" /> 23-vertical diagnostic</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Full ROI roadmap included</span>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">The 24-Hour Rescue Process</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <Search className="h-5 w-5 text-amber-600" />
                  <div><p className="text-sm font-semibold text-dark">1. We Scan</p><p className="text-xs text-gray-500">23 verticals across your entire operation</p></div>
                </div>
                <div className="h-6 w-0.5 bg-amber-200 mx-auto ml-5" />
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <Zap className="h-5 w-5 text-secondary" />
                  <div><p className="text-sm font-semibold text-dark">2. We Diagnose</p><p className="text-xs text-gray-500">Risk scores, waste analysis, automation opportunities</p></div>
                </div>
                <div className="h-6 w-0.5 bg-amber-200 mx-auto ml-5" />
                <div className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  <div><p className="text-sm font-semibold text-dark">3. You Act</p><p className="text-xs text-gray-500">Full roadmap delivered within 24 hours</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}