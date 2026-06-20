import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Calendar, Database, ShieldCheck, Clock, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-primary mb-6">
                ⚡ Serving 50+ SMBs | Avg 22 hrs saved/week
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-dark mb-6 leading-tight">
                Tired of Wasting Hours on Tasks AI Could Do in Seconds?
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop manually entering data, following up on leads, and juggling spreadsheets. AutoFlow AI builds custom automation workflows so your small business runs itself — while you focus on growth.
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md">
                  Get Your Free Automation Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition bg-white">
                  Learn How It Works
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-400">No commitment. 15-minute call. See exactly what you can automate.</p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 flex justify-center">
              {/* Simple Flow Animation Placeholder */}
              <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Example Automation Stream</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-dark">Lead Comes In</p>
                      <p className="text-xs text-gray-500">Form submitted or call received</p>
                    </div>
                  </div>
                  <div className="h-6 w-0.5 bg-indigo-200 mx-auto ml-5"></div>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <Bot className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-semibold text-dark">AutoFlow AI Processes</p>
                      <p className="text-xs text-gray-500">Score lead, auto-assign, draft reply</p>
                    </div>
                  </div>
                  <div className="h-6 w-0.5 bg-indigo-200 mx-auto ml-5"></div>
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-dark">CRM & Dispatch Updated</p>
                      <p className="text-xs text-gray-500">Notion updated + SMS dispatch triggered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Core Automation Offerings</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">
            We target the highest-demand, most repetitive bottlenecks to deliver immediate ROI.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition text-left bg-gray-50">
              <Bot className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-dark mb-3">Lead Routing Booster</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Connect your website contact forms directly to your sales workflows. Scores leads, assigns reps instantly, and sends automated SMS replies in under 30 seconds.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 mb-6">
                <li className="flex items-center">✓ Custom Webhook integration</li>
                <li className="flex items-center">✓ Speed-to-lead under 30 seconds</li>
                <li className="flex items-center">✓ Rep notifications via Slack/Discord</li>
              </ul>
            </div>
            <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition text-left bg-gray-50">
              <Calendar className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-dark mb-3">Calendar Scheduling Back</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Streamline client scheduling with automated calendar booking widgets and reminder triggers. Reclaim hours spent coordinating times and drastically reduce no-shows.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 mb-6">
                <li className="flex items-center">✓ Cal.com / Calendly embeds</li>
                <li className="flex items-center">✓ 3-tier SMS/Email reminders</li>
                <li className="flex items-center">✓ Automatic pre-meeting documents</li>
              </ul>
            </div>
            <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition text-left bg-gray-50">
              <Database className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-dark mb-3">CRM & Database Sync</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Seamless real-time synchronization between lead capture channels and CRM/Notion databases via n8n or Make. Eliminate double-entry errors for good.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 mb-6">
                <li className="flex items-center">✓ Multi-directional syncing</li>
                <li className="flex items-center">✓ Custom field matching</li>
                <li className="flex items-center">✓ Operational logging and alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-indigo-50 text-primary rounded-full mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-4">The AutoFlow Guarantee</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We are dedicated to SMB success. If we don't save you at least 10 hours a week on admin within the first 30 days of implementation, we'll refund your setup fee completely. No questions asked.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Secure Integrations</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center justify-center space-x-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <span>Instant Setup Response</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
