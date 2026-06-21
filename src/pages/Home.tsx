import { ShieldCheck, Clock, Zap } from 'lucide-react'
import HeroSection from '../components/features/HeroSection'
import ProblemSection from '../components/features/ProblemSection'
import SolutionSection from '../components/features/SolutionSection'
import ROICalculator from '../components/features/ROICalculator'
import PackageSection from '../components/features/PackageSection'
import TestimonialSection from '../components/features/TestimonialSection'
import ContactSection from '../components/features/ContactSection'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero — Value Prop + CTA */}
      <HeroSection />

      {/* Industry Solutions — New feature section */}
      <section className="py-20 bg-white" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Explore Our Automation Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            Interactive demos of our most powerful automation pipelines. Click any solution to try it live.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Insurance Quote Engine', desc: 'Multi-carrier quote generation in under 60 seconds with interactive risk profiling.', icon: '🛡️', path: '/solutions/insurance-quotes', color: 'indigo' },
              { title: 'Construction Bid Generator', desc: 'Flawless line-item estimates with material costs, labor breakdowns, and Procore sync.', icon: '🏗️', path: '/solutions/construction-bids', color: 'amber' },
              { title: 'B2B Proposal Writing', desc: 'Auto-generate beautiful, CRM-hydrated proposals with AI-powered executive summaries.', icon: '📄', path: '/solutions/proposal-writing', color: 'violet' },
              { title: 'Vendor Onboarding Portal', desc: 'Auto-verify tax IDs, scan COIs, validate bank accounts, and provision to ERP in 5 minutes.', icon: '🤝', path: '/solutions/vendor-onboarding', color: 'cyan' },
              { title: 'Procurement Automation', desc: 'Auto-generate POs from inventory thresholds, approve via Slack, dispatch to suppliers.', icon: '📦', path: '/solutions/procurement-automation', color: 'orange' },
              { title: 'Compliance Dashboard', desc: 'Tamper-proof audit logs, daily checklists, HMAC-signed evidence, and auto-generated PDF reports.', icon: '✅', path: '/solutions/compliance-dashboard', color: 'emerald' },
            ].map((sol, i) => {
              const colorMap: Record<string, { bg: string, text: string, hover: string, border: string }> = {
                indigo: { bg: 'bg-indigo-50', text: 'text-primary', hover: 'hover:border-primary', border: 'border-indigo-100' },
                amber: { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'hover:border-amber-400', border: 'border-amber-100' },
                violet: { bg: 'bg-violet-50', text: 'text-violet-600', hover: 'hover:border-violet-400', border: 'border-violet-100' },
                cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'hover:border-cyan-400', border: 'border-cyan-100' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:border-orange-400', border: 'border-orange-100' },
                emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:border-emerald-400', border: 'border-emerald-100' },
              };
              const c = colorMap[sol.color];
              return (
                <a key={i} href={sol.path}
                  className={`p-6 border-2 ${c.border} rounded-2xl shadow-sm ${c.hover} transition text-left bg-white group`}>
                  <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-2xl mb-4`}>
                    {sol.icon}
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2 transition">{sol.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{sol.desc}</p>
                  <span className={`text-sm font-semibold ${c.text} inline-flex items-center gap-1`}>
                    Try Demo → <span className="text-xs">Live</span>
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
              { title: 'Calendar Scheduling Back', desc: 'Streamline client scheduling with automated calendar booking widgets and reminder triggers. Reclaim hours spent coordinating times and drastically reduce no-shows.', features: ['Cal.com / Calendly embeds', '3-tier SMS/Email reminders', 'Automatic pre-meeting documents'] },
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