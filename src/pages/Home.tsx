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