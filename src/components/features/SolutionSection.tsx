import { Search, PenTool, Rocket, Activity } from 'lucide-react'

const steps = [
  { icon: Search, title: '1. Audit', desc: 'We map your current workflow in a 30-minute discovery call to identify every automation opportunity.' },
  { icon: PenTool, title: '2. Design', desc: 'We build a custom automation flow using AI + no-code tools tailored exactly to your business processes.' },
  { icon: Rocket, title: '3. Deploy', desc: 'Your workflows go live within days, not months. We handle all the setup and testing.' },
  { icon: Activity, title: '4. Monitor', desc: 'We maintain, optimize, and scale everything for you — so you never have to think about it.' },
]

export default function SolutionSection() {
  return (
    <section className="py-20 bg-gray-50" id="solutions">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            We Automate the Work <span className="text-primary">You Shouldn&apos;t Have to Think About</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From first contact to final follow-up — we design, deploy, and maintain custom automation
            workflows that save you dozens of hours every week.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
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