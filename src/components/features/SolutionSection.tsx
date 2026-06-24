import { Search, PenTool, Rocket, Activity } from 'lucide-react'

const steps = [
  { icon: Search, title: '1. Diagnose', desc: 'We scan your operations across 23 verticals using our asynchronous diagnostic engine — identifying every risk, waste leak, and automation opportunity.' },
  { icon: PenTool, title: '2. Roadmap', desc: 'You receive a complete Automation Roadmap & ROI Analysis Report within 24 hours, prioritized by impact.' },
  { icon: Rocket, title: '3. Deploy', desc: 'Approved automations go live within days. We handle all setup, testing, and integration for you.' },
  { icon: Activity, title: '4. Monitor', desc: 'We maintain, optimize, and scale everything — with real-time dashboards showing hours saved and risk eliminated.' },
]

export default function SolutionSection() {
  return (
    <section className="py-20 bg-gray-50" id="solutions">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Find Risk &amp; Waste Across{' '}
            <span className="text-primary">All 23 Operational Verticals</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From HR onboarding gaps to AI governance blind spots — our 23-vertical diagnostic scans every 
            corner of your operations and delivers a prioritized roadmap within 24 hours.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center">
                <step.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}