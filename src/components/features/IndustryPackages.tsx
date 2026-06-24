import { Link } from 'react-router-dom'
import { ArrowRight, Stethoscope, Scale, Building2, ShoppingCart, Cloud, HardHat, Landmark, Megaphone } from 'lucide-react'

const industries = [
  {
    name: 'Healthcare',
    icon: Stethoscope,
    price: '$3,500 – $10,000',
    findings: ['HIPAA/PHI compliance audits', 'Patient intake & scheduling automation', 'Claims processing optimization', 'Telehealth workflow integration'],
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    hover: 'hover:border-rose-400',
    iconBg: 'bg-rose-100',
  },
  {
    name: 'Legal',
    icon: Scale,
    price: '$5,000 – $15,000',
    findings: ['Matter management workflows', 'Document automation & assembly', 'Billable hour tracking & recovery', 'Conflict check automation'],
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    hover: 'hover:border-violet-400',
    iconBg: 'bg-violet-100',
  },
  {
    name: 'Real Estate',
    icon: Building2,
    price: '$2,500 – $7,500',
    findings: ['Lead response time optimization', 'Showing coordination automation', 'Contract-to-close workflows', 'Property listing syndication'],
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    hover: 'hover:border-cyan-400',
    iconBg: 'bg-cyan-100',
  },
  {
    name: 'E-Commerce',
    icon: ShoppingCart,
    price: '$3,000 – $10,000',
    findings: ['Revenue leakage detection', 'Checkout flow optimization', 'Attribution & analytics audits', 'Returns & refund automation'],
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    hover: 'hover:border-orange-400',
    iconBg: 'bg-orange-100',
  },
  {
    name: 'SaaS',
    icon: Cloud,
    price: '$5,000 – $20,000',
    findings: ['Trial-to-paid conversion funnels', 'User onboarding automation', 'Churn reduction analysis', 'AI governance & risk assessment'],
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    hover: 'hover:border-sky-400',
    iconBg: 'bg-sky-100',
  },
  {
    name: 'Construction',
    icon: HardHat,
    price: '$5,000 – $15,000',
    findings: ['Field reporting automation', 'Change order workflows', 'Budget vs. actual tracking', 'Subcontractor compliance checks'],
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hover: 'hover:border-amber-400',
    iconBg: 'bg-amber-100',
  },
  {
    name: 'Financial Services',
    icon: Landmark,
    price: '$7,500 – $25,000',
    findings: ['Regulatory control audits', 'Audit trail automation', 'Security posture assessments', 'KYC/AML compliance workflows'],
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    hover: 'hover:border-emerald-400',
    iconBg: 'bg-emerald-100',
  },
  {
    name: 'Agency',
    icon: Megaphone,
    price: '$2,500 – $8,000',
    findings: ['Client delivery workflow audits', 'Utilization & margin analysis', 'Resource allocation optimization', 'Revenue leakage from scope creep'],
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    hover: 'hover:border-pink-400',
    iconBg: 'bg-pink-100',
  },
]

export default function IndustryPackages() {
  return (
    <section className="py-20 bg-gray-50" id="industry-packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Industry-Specific{' '}
            <span className="text-primary">Diagnostic Packages</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Each package applies our 23-vertical diagnostic engine with sector-specific findings, 
            compliance checks, and automation opportunities. Available via QuickScan™ or Deep Audit™.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className={`rounded-xl border-2 ${ind.border} ${ind.hover} transition bg-white p-5 shadow-sm`}
            >
              <div className={`w-10 h-10 rounded-lg ${ind.iconBg} flex items-center justify-center mb-4`}>
                <ind.icon size={20} className={ind.color} />
              </div>
              
              <h3 className="font-bold text-dark text-base mb-1">{ind.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{ind.price}</p>
              
              <ul className="space-y-2 mb-4">
                {ind.findings.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-emerald-500 text-sm flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-xs text-gray-600 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              
              <Link to={`/book?vertical=${ind.name}`} className={`text-xs font-semibold ${ind.color} hover:underline inline-flex items-center gap-1`}>
                Get Your {ind.name} Audit <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
