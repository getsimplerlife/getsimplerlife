import { Check, Zap, Search, Rocket, Activity, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'QuickScan™',
    id: 'price_1TlcttD8uiOZ0HlMUoZJD6Jk',
    price: '$997',
    subtitle: 'One-time diagnostic',
    description: 'Rapid 24-hour assessment of your highest-impact automation opportunities.',
    popular: false,
    highlight: '24-Hour Turnaround',
    features: [
      '1 industry package diagnostic',
      '24-hour turnaround from submission',
      'Executive summary with key findings',
      'Risk score & compliance rating',
      'Top 5 automation opportunities identified',
    ],
    cta: 'Start Your QuickScan',
    link: '/book',
  },
  {
    name: 'Deep Audit™',
    id: 'price_1TlcuMD8uiOZ0HlMaNBLZPRY',
    price: '$4,997',
    subtitle: 'Comprehensive analysis',
    description: 'Full-depth diagnostic across your chosen industry vertical with detailed cost savings analysis.',
    popular: true,
    highlight: 'Full Roadmap Included',
    features: [
      'Full industry package diagnostic',
      'Detailed cost savings analysis with ROI projections',
      'Custom Automation Roadmap & Implementation Plan',
      'Comprehensive compliance & risk review',
      '23-vertical cross-reference analysis',
      'Executive presentation with stakeholder summaries',
    ],
    cta: 'Schedule Your Deep Audit',
    link: '/contact',
  },
  {
    name: 'Implementation Sprint™',
    id: 'price_1TlcuMD8uiOZ0HlMuaI0mmRd',
    price: '$5,000 – $50,000+',
    subtitle: 'Build & deploy',
    description: 'Professional build-out of all recommended automations with full system integration.',
    popular: false,
    highlight: 'Custom Scope',
    features: [
      'Full build-out of all recommended automations',
      'Workflow repair and optimization',
      'System integration (CRM, ERP, LOS, etc.)',
      'Deployment of real-time monitoring dashboards',
      'Team training and knowledge transfer',
      '30-day post-deployment support',
    ],
    cta: 'Discuss Your Sprint',
    link: '/contact',
  },
  {
    name: 'Managed Automation™',
    id: 'price_1TlcuMD8uiOZ0HlMInOJpSoo',
    price: '$997 – $4,997/mo',
    subtitle: 'Ongoing partnership',
    description: 'Continuous monitoring, maintenance, and optimization — your automation stack, our expertise.',
    popular: false,
    highlight: 'Ongoing Governance',
    features: [
      'Continuous workflow monitoring & maintenance',
      'Monthly performance reporting with KPIs',
      'Ongoing AI governance & optimization',
      'Priority support with 2-hour response',
      'Quarterly business review & roadmap updates',
      'Dedicated automation success manager',
    ],
    cta: 'Get Managed Today',
    link: '/contact',
  },
]

export default function PackageSection() {
  return (
    <section className="py-20 bg-white" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Clock size={14} /> 24-Hour Rescue Starts Here
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            From Rapid Discovery to{' '}
            <span className="text-primary">Full-Scale Automation</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Start with a <strong>24-hour QuickScan™</strong> — we diagnose every risk, leak, and automation 
            opportunity across your business. Then scale up to enterprise-grade managed automation 
            with our full 4-tier product ladder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col ${
                tier.popular ? 'border-primary bg-gradient-to-br from-indigo-50 to-white shadow-lg ring-2 ring-primary/20' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                  <Star size={12} /> Most Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-dark">{tier.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{tier.subtitle}</p>
              </div>

              <div className="mb-3">
                <span className="text-2xl font-bold text-dark">{tier.price}</span>
              </div>

              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{tier.description}</p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold mb-5 self-start">
                <Zap size={12} /> {tier.highlight}
              </div>

              <div className="space-y-2.5 mb-6 flex-1">
                {tier.features.map(f => (
                  <div key={f} className="flex gap-2 items-start">
                    <Check size={15} className="text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>

              <a href={tier.link}
                className={`block text-center w-full py-2.5 rounded-lg font-semibold transition text-sm ${
                  tier.popular ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'border-2 border-primary text-primary hover:bg-indigo-50'
                }`}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}