import { useRef } from 'react'
import { ShieldCheck, Clock, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import HeroSection from '../components/features/HeroSection'
import ProblemSection from '../components/features/ProblemSection'
import SolutionSection from '../components/features/SolutionSection'
import ROICalculator from '../components/features/ROICalculator'
import PackageSection from '../components/features/PackageSection'
import TestimonialSection from '../components/features/TestimonialSection'
import ContactSection from '../components/features/ContactSection'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white">
      {/* Hero — Value Prop + CTA */}
      <HeroSection />

      {/* Industry Solutions — Upgraded with Horizontal Scroll Wheel Carousel */}
      <section className="py-20 bg-white" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />

          {/* Section Header with Premium Navigation Arrows */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="text-left">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">24/7 Asynchronous Demonstrations</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">Explore Our Automation Solutions</h2>
              <p className="text-gray-500 max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
                Click any solution to launch a fully simulated interactive workflow. Our engineering system provides 24/7 asynchronous delivery for all audit and implementation roadmaps.
              </p>
            </div>
            
            {/* Smooth Control Buttons */}
            <div className="flex items-center space-x-3 mt-6 md:mt-0">
              <button
                type="button"
                onClick={scrollLeft}
                className="p-3 rounded-full border border-gray-200 hover:border-primary hover:bg-indigo-50 text-gray-500 hover:text-primary transition shadow-sm bg-white"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="p-3 rounded-full border border-gray-200 hover:border-primary hover:bg-indigo-50 text-gray-500 hover:text-primary transition shadow-md bg-white"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Flex Scroll Track */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 pt-2 scroll-smooth hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { title: 'Insurance Quote Engine', desc: 'Multi-carrier quote generation in under 60 seconds with interactive risk profiling.', icon: '🛡️', path: '/solutions/insurance-quotes', color: 'indigo' },
              { title: 'Construction Bid Generator', desc: 'Flawless line-item estimates with material costs, labor breakdowns, and Procore sync.', icon: '🏗️', path: '/solutions/construction-bids', color: 'amber' },
              { title: 'B2B Proposal Writing', desc: 'Auto-generate beautiful, CRM-hydrated proposals with AI-powered executive summaries.', icon: '📄', path: '/solutions/proposal-writing', color: 'violet' },
              { title: 'Vendor Onboarding Portal', desc: 'Auto-verify tax IDs, scan COIs, validate bank accounts, and provision to ERP in 5 minutes.', icon: '🤝', path: '/solutions/vendor-onboarding', color: 'cyan' },
              { title: 'Procurement Automation', desc: 'Auto-generate POs from inventory thresholds, approve via Slack, dispatch to suppliers.', icon: '📦', path: '/solutions/procurement-automation', color: 'orange' },
              { title: 'Compliance Dashboard', desc: 'Tamper-proof audit logs, daily checklists, HMAC-signed evidence, and auto-generated PDF reports.', icon: '✅', path: '/solutions/compliance-dashboard', color: 'emerald' },
              { title: 'Workflow Configurator', desc: 'Design your own custom AI automation pipeline and see instant ROI projections for your specific industry.', icon: '⚡', path: '/solutions/configurator', color: 'primary' },
              { title: 'Website Scanner', desc: 'Enter your URL and get an instant audit score with remediation recommendations — free.', icon: '🔍', path: '/scanner', color: 'sky' },
              { title: 'API Webhook Sandbox', desc: 'Simulate ServiceTitan, Stripe, QuickBooks, and Cal.com events in a live pipeline visualizer.', icon: '⚙️', path: '/sandbox', color: 'purple' },
              { title: 'Leaked Lead ROI Calc', desc: 'See exactly how much revenue you lose from missed leads — interactive calculator with live animations.', icon: '📊', path: '/roi', color: 'red' },
            ].map((sol, i) => {
              const colorMap: Record<string, { bg: string, text: string, hover: string, border: string }> = {
                indigo: { bg: 'bg-indigo-50', text: 'text-primary', hover: 'hover:border-primary', border: 'border-indigo-100' },
                amber: { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'hover:border-amber-400', border: 'border-amber-100' },
                violet: { bg: 'bg-violet-50', text: 'text-violet-600', hover: 'hover:border-violet-400', border: 'border-violet-100' },
                cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'hover:border-cyan-400', border: 'border-cyan-100' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:border-orange-400', border: 'border-orange-100' },
                emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:border-emerald-400', border: 'border-emerald-100' },
                primary: { bg: 'bg-indigo-50', text: 'text-primary', hover: 'hover:border-primary', border: 'border-indigo-100' },
                sky: { bg: 'bg-sky-50', text: 'text-sky-600', hover: 'hover:border-sky-400', border: 'border-sky-100' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:border-purple-400', border: 'border-purple-100' },
                red: { bg: 'bg-red-50', text: 'text-red-600', hover: 'hover:border-red-400', border: 'border-red-100' },
              };
              const c = colorMap[sol.color];
              return (
                <a 
                  key={i} 
                  href={sol.path}
                  className={`p-6 border-2 ${c.border} rounded-2xl shadow-sm ${c.hover} transition text-left bg-white group min-w-[280px] sm:min-w-[340px] flex-shrink-0 snap-start flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-2xl mb-4`}>
                      {sol.icon}
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2 transition group-hover:text-primary">{sol.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{sol.desc}</p>
                  </div>
                  <span className={`text-sm font-semibold ${c.text} inline-flex items-center gap-1 mt-auto`}>
                    Try Demo → <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full animate-pulse">Live</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services / Automation Offerings */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Core Automation Offerings</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            We target the highest-demand, most repetitive bottlenecks to deliver immediate ROI.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Lead Routing Booster', desc: 'Connect your website contact forms directly to your sales workflows. Scores leads, assigns reps instantly, and sends automated SMS replies in under 30 seconds.', features: ['Custom Webhook integration', 'Speed-to-lead under 30 seconds', 'Rep notifications via Slack/Discord'] },
              { title: 'Scheduling Backends', desc: 'Streamline client scheduling with automated calendar booking widgets and reminder triggers. Reclaim hours spent coordinating times and drastically reduce no-shows.', features: ['Cal.com / Calendly embeds', '3-tier SMS/Email reminders', 'Automatic pre-meeting documents'] },
              { title: 'CRM & Database Sync', desc: 'Seamless real-time synchronization between lead capture channels and CRM/Notion databases via n8n or Make. Eliminate double-entry errors for good.', features: ['Multi-directional syncing', 'Custom field matching', 'Operational logging and alerts'] },
            ].map((svc, i) => (
              <div key={i} className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition text-left bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-primary flex items-center justify-center font-bold text-lg mb-6">
                  {['⚡', '📅', '🔄'][i]}
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{svc.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{svc.desc}</p>
                <ul className="text-xs text-gray-500 space-y-2">
                  {svc.features.map(f => <li key={f} className="flex items-center gap-1.5"><span className="text-secondary">✓</span> {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Guarantee */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-indigo-50 text-primary rounded-full mb-4"><ShieldCheck className="h-8 w-8" /></div>
          <h2 className="text-2xl font-bold text-dark mb-4">The Simpler Life Guarantee</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We are dedicated to SMB success. If we don't save you at least 10 hours a week on admin
            within the first 30 days of implementation, we&apos;ll refund your setup fee completely.
            No questions asked.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-1.5"><Clock className="h-4 w-4 text-primary" /><span>99.9% Uptime SLA</span></div>
            <div className="flex items-center justify-center space-x-1.5"><ShieldCheck className="h-4 w-4 text-primary" /><span>Secure Integrations</span></div>
            <div className="col-span-2 md:col-span-1 flex items-center justify-center space-x-1.5"><Zap className="h-4 w-4 text-primary" /><span>Instant Setup Response</span></div>
          </div>
        </div>
      </section>

      {/* Problem — Pain Points */}
      <ProblemSection />

      {/* Solution — How It Works */}
      <SolutionSection />

      {/* ROI Calculator — Interactive Tool */}
      <ROICalculator />

      {/* Packages — Pricing Tiers */}
      <PackageSection />

      {/* Testimonials — Social Proof */}
      <TestimonialSection />

      {/* Contact — Lead Capture Form */}
      <ContactSection />
    </div>
  )
}
