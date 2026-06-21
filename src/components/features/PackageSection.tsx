import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Starter', setup: '$1,500', monthly: '$150', popular: false,
    features: ['Up to 3 workflow automations', 'Lead capture + response automation', 'Calendar sync', 'Email support (48h response)'],
    paymentLink: 'https://buy.stripe.com/dRm3cveUU0in8K21SA08g03',
    discounted: '$1,200'
  },
  {
    name: 'Growth', setup: '$3,000', monthly: '$300', popular: true,
    features: ['Up to 8 workflow automations', 'Everything in Starter', 'CRM integration & data sync', 'Client onboarding automation', 'Priority support (12h response)', 'Monthly optimization review'],
    paymentLink: 'https://buy.stripe.com/aFacN5cMM3uz5xQfJq08g04',
    discounted: '$2,400'
  },
  {
    name: 'Scale', setup: '$5,000', monthly: '$500', popular: false,
    features: ['Unlimited workflows', 'Everything in Growth', 'Multi-app integration (Slack, HubSpot, QuickBooks)', 'Custom AI agent training', 'Dedicated support (4h response)', 'Weekly performance reports'],
    paymentLink: 'https://buy.stripe.com/28E14neUUaX17FYcxe08g05',
    discounted: '$4,000'
  },
]

export default function PackageSection() {
  return (
    <section className="py-20 bg-white" id="packages">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Pick the Plan That <span className="text-primary">Fits Your Business</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">One-time setup + monthly support. No hidden fees. No long-term contracts.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all hover:-translate-y-1 hover:shadow-lg ${
                plan.popular ? 'border-primary bg-gradient-to-br from-indigo-50 to-white shadow-lg' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={14} /> Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-dark mb-2">{plan.name}</h3>
              <div className="mb-3">
                <span className="text-sm text-gray-400">Setup </span>
                <span className="text-2xl font-bold text-dark line-through opacity-40">{plan.setup}</span>
                <span className="text-2xl font-bold text-secondary ml-2">{plan.discounted}</span>
                <span className="ml-2 bg-secondary/10 text-secondary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Launch 20% Off</span>
              </div>
              <div className="mb-6"><span className="text-sm text-gray-400">then </span><span className="text-lg font-semibold text-primary">{plan.monthly}</span><span className="text-sm text-gray-400">/mo</span></div>
              <div className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <div key={f} className="flex gap-2.5 items-start">
                    <Check size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
              <a href={plan.paymentLink} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition">
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}