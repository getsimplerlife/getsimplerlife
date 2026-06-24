import { MessageCircle, Calendar, ClipboardCopy, Users, AlertTriangle, Clock, DollarSign, Shield, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const pains = [
  { icon: MessageCircle, title: 'Leads go cold because nobody followed up within 5 minutes — that is lost revenue walking out the door', color: 'text-red-500', bg: 'bg-red-50', border: 'border-l-red-500' },
  { icon: ClipboardCopy, title: "You are still copying and pasting between 5+ apps daily — that is $30K+/year in wasted admin labor", color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-l-orange-500' },
  { icon: Calendar, title: 'Client onboarding takes 3+ hours of back-and-forth — every hour you chase documents is an hour you are not billing', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-l-rose-500' },
  { icon: Users, title: 'You have no idea how many leads, hours, or dollars you have actually lost to manual processes', color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-600' },
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-white" id="problem">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertTriangle className="h-3.5 w-3.5" />
            The Hidden Risks Draining Your Business
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Every Day You Wait, Risk Compounds and{' '}
            <span className="text-red-500">Revenue Leaks</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Operational risk, waste, and automation blind spots are hiding in every corner of your business — 
            from dead leads and manual data entry to compliance gaps and AI governance risks. 
            Most owners never see them. Our 23-vertical diagnostic finds every one — <strong>within 24 hours</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {pains.map((pain, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-5 rounded-xl ${pain.bg} ${pain.border} border-l-4 transition-all hover:translate-x-1 hover:shadow-md`}
            >
              <pain.icon size={22} className={`${pain.color} flex-shrink-0 mt-0.5`} />
              <p className="text-dark font-medium text-sm leading-relaxed">{pain.title}</p>
            </div>
          ))}
        </div>

        {/* Risk Stats Strip */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { icon: DollarSign, value: '$134K', label: 'Avg annual waste found' },
            { icon: Clock, value: '24 hrs', label: 'To complete your rescue' },
            { icon: Shield, value: '100%', label: 'Risk-free diagnostic' },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-dark">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md">
            Start Your Risk-Free Rescue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}