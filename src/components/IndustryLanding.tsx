import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, TrendingUp, Shield, Calendar } from 'lucide-react';

export interface IndustryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  hook: string;
  painPoints: string[];
  quickScanFeatures: string[];
  deepAuditFeatures: string[];
  kpiOne: { value: string; label: string };
  kpiTwo: { value: string; label: string };
  kpiThree: { value: string; label: string };
}

interface IndustryLandingProps {
  config: IndustryConfig;
}

// Static color mapping for Tailwind JIT
const colorMap: Record<string, {
  header: string; headerBorder: string; badge: string; badgeText: string;
  accent: string; accentBg: string; accentBorder: string; accentText: string;
  btn: string; btnHover: string; btnOutline: string; btnOutlineBorder: string;
  gradient: string; kpiIcon: string;
}> = {
  emerald: {
    header: 'bg-emerald-50', headerBorder: 'border-emerald-200', badge: 'bg-emerald-100', badgeText: 'text-emerald-700',
    accent: 'bg-emerald-600', accentBg: 'bg-emerald-50', accentBorder: 'border-emerald-200', accentText: 'text-emerald-600',
    btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700', btnOutline: 'border-emerald-600 text-emerald-600', btnOutlineBorder: 'hover:bg-emerald-600 hover:text-white',
    gradient: 'from-emerald-50 to-emerald-100', kpiIcon: 'text-emerald-600',
  },
  violet: {
    header: 'bg-violet-50', headerBorder: 'border-violet-200', badge: 'bg-violet-100', badgeText: 'text-violet-700',
    accent: 'bg-violet-600', accentBg: 'bg-violet-50', accentBorder: 'border-violet-200', accentText: 'text-violet-600',
    btn: 'bg-violet-600', btnHover: 'hover:bg-violet-700', btnOutline: 'border-violet-600 text-violet-600', btnOutlineBorder: 'hover:bg-violet-600 hover:text-white',
    gradient: 'from-violet-50 to-violet-100', kpiIcon: 'text-violet-600',
  },
  blue: {
    header: 'bg-blue-50', headerBorder: 'border-blue-200', badge: 'bg-blue-100', badgeText: 'text-blue-700',
    accent: 'bg-blue-600', accentBg: 'bg-blue-50', accentBorder: 'border-blue-200', accentText: 'text-blue-600',
    btn: 'bg-blue-600', btnHover: 'hover:bg-blue-700', btnOutline: 'border-blue-600 text-blue-600', btnOutlineBorder: 'hover:bg-blue-600 hover:text-white',
    gradient: 'from-blue-50 to-blue-100', kpiIcon: 'text-blue-600',
  },
  orange: {
    header: 'bg-orange-50', headerBorder: 'border-orange-200', badge: 'bg-orange-100', badgeText: 'text-orange-700',
    accent: 'bg-orange-600', accentBg: 'bg-orange-50', accentBorder: 'border-orange-200', accentText: 'text-orange-600',
    btn: 'bg-orange-600', btnHover: 'hover:bg-orange-700', btnOutline: 'border-orange-600 text-orange-600', btnOutlineBorder: 'hover:bg-orange-600 hover:text-white',
    gradient: 'from-orange-50 to-orange-100', kpiIcon: 'text-orange-600',
  },
  indigo: {
    header: 'bg-indigo-50', headerBorder: 'border-indigo-200', badge: 'bg-indigo-100', badgeText: 'text-indigo-700',
    accent: 'bg-indigo-600', accentBg: 'bg-indigo-50', accentBorder: 'border-indigo-200', accentText: 'text-indigo-600',
    btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700', btnOutline: 'border-indigo-600 text-indigo-600', btnOutlineBorder: 'hover:bg-indigo-600 hover:text-white',
    gradient: 'from-indigo-50 to-indigo-100', kpiIcon: 'text-indigo-600',
  },
  amber: {
    header: 'bg-amber-50', headerBorder: 'border-amber-200', badge: 'bg-amber-100', badgeText: 'text-amber-700',
    accent: 'bg-amber-600', accentBg: 'bg-amber-50', accentBorder: 'border-amber-200', accentText: 'text-amber-600',
    btn: 'bg-amber-600', btnHover: 'hover:bg-amber-700', btnOutline: 'border-amber-600 text-amber-600', btnOutlineBorder: 'hover:bg-amber-600 hover:text-white',
    gradient: 'from-amber-50 to-amber-100', kpiIcon: 'text-amber-600',
  },
  green: {
    header: 'bg-green-50', headerBorder: 'border-green-200', badge: 'bg-green-100', badgeText: 'text-green-700',
    accent: 'bg-green-600', accentBg: 'bg-green-50', accentBorder: 'border-green-200', accentText: 'text-green-600',
    btn: 'bg-green-600', btnHover: 'hover:bg-green-700', btnOutline: 'border-green-600 text-green-600', btnOutlineBorder: 'hover:bg-green-600 hover:text-white',
    gradient: 'from-green-50 to-green-100', kpiIcon: 'text-green-600',
  },
  pink: {
    header: 'bg-pink-50', headerBorder: 'border-pink-200', badge: 'bg-pink-100', badgeText: 'text-pink-700',
    accent: 'bg-pink-600', accentBg: 'bg-pink-50', accentBorder: 'border-pink-200', accentText: 'text-pink-600',
    btn: 'bg-pink-600', btnHover: 'hover:bg-pink-700', btnOutline: 'border-pink-600 text-pink-600', btnOutlineBorder: 'hover:bg-pink-600 hover:text-white',
    gradient: 'from-pink-50 to-pink-100', kpiIcon: 'text-pink-600',
  },
};

export default function IndustryLanding({ config }: IndustryLandingProps) {
  const c = colorMap[config.color] || colorMap.emerald;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className={`${c.header} ${c.headerBorder} border-b`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{config.icon}</span>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${c.badge} ${c.badgeText} mb-2`}>
                Industry Package
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-dark">{config.name} Automation</h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">{config.hook}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pain Points */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-dark mb-2">The Pain Points We Eliminate</h2>
          <p className="text-gray-500 mb-8 max-w-2xl">Manual, repetitive bottlenecks draining your team's productivity every single week.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <span className="text-xl mt-0.5">⚠️</span>
                <p className="text-sm text-gray-700 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KPI Strip */}
        <section className="mb-20">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Clock, value: config.kpiOne.value, label: config.kpiOne.label },
              { icon: TrendingUp, value: config.kpiTwo.value, label: config.kpiTwo.label },
              { icon: Shield, value: config.kpiThree.value, label: config.kpiThree.label },
            ].map((k, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <k.icon className={`h-8 w-8 mx-auto mb-3 ${c.kpiIcon}`} />
                <p className="text-3xl font-bold text-dark mb-1">{k.value}</p>
                <p className="text-sm text-gray-500">{k.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Tier Product Ladder */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-dark mb-2 text-center">Our {config.name} Product Suite</h2>
          <p className="text-gray-500 mb-10 text-center max-w-xl mx-auto">From a rapid diagnostic to full managed automation — pick the tier that fits your stage.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tier 1: QuickScan */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <span className={`inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.badge} ${c.badgeText} mb-3`}>Diagnostic</span>
              <h3 className="text-lg font-bold text-dark">QuickScan™</h3>
              <p className="text-3xl font-bold text-dark mt-1 mb-4">$997</p>
              <p className="text-xs text-gray-400 mb-4">One-time. 24-hour turnaround.</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {config.quickScanFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className={`h-4 w-4 ${c.accentText} mt-0.5 flex-shrink-0`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/book" className={`w-full text-center py-2.5 rounded-lg border ${c.btnOutline} font-semibold ${c.btnOutlineBorder} transition`}>
                Start QuickScan
              </Link>
            </div>

            {/* Tier 2: Deep Audit */}
            <div className={`bg-white rounded-2xl border-2 ${c.accentBorder} shadow-lg p-6 flex flex-col relative`}>
              <span className={`absolute -top-3 right-4 px-3 py-0.5 rounded-full text-xs font-semibold ${c.accent} text-white`}>Popular</span>
              <span className={`inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.badge} ${c.badgeText} mb-3`}>Full Assessment</span>
              <h3 className="text-lg font-bold text-dark">Deep Audit™</h3>
              <p className="text-3xl font-bold text-dark mt-1 mb-4">$4,997</p>
              <p className="text-xs text-gray-400 mb-4">One-time. Detailed roadmap included.</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {config.deepAuditFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className={`h-4 w-4 ${c.accentText} mt-0.5 flex-shrink-0`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/book" className={`w-full text-center py-2.5 rounded-lg ${c.accent} text-white font-semibold hover:opacity-90 transition shadow-sm`}>
                Book Deep Audit
              </Link>
            </div>

            {/* Tier 3: Implementation Sprint */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <span className="inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 mb-3">Custom Build</span>
              <h3 className="text-lg font-bold text-dark">Implementation Sprint™</h3>
              <p className="text-3xl font-bold text-dark mt-1 mb-4">$5K–$50K+</p>
              <p className="text-xs text-gray-400 mb-4">One-time. Full build-out & deployment.</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> Complete workflow build-out</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> System integrations & API setup</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> Real-time monitoring dashboards</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> Staff training & documentation</li>
              </ul>
              <Link to="/book" className="w-full text-center py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition">
                Request Proposal
              </Link>
            </div>

            {/* Tier 4: Managed Automation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <span className="inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">Ongoing</span>
              <h3 className="text-lg font-bold text-dark">Managed Automation™</h3>
              <p className="text-3xl font-bold text-dark mt-1 mb-4">$997–$4,997/mo</p>
              <p className="text-xs text-gray-400 mb-4">Monthly. Continuous optimization.</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> 24/7 monitoring & maintenance</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> Monthly performance reporting</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> AI model governance & tuning</li>
                <li className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" /> Priority support (4hr response)</li>
              </ul>
              <Link to="/book" className="w-full text-center py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className={`bg-gradient-to-r ${c.gradient} rounded-3xl p-12 border ${c.accentBorder}`}>
            <h2 className="text-3xl font-bold text-dark mb-4">Ready to Transform Your {config.name} Operations?</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">Start with a QuickScan™ — we'll identify every automation opportunity in your workflow within 24 hours.</p>
            <Link to="/book" className={`inline-flex items-center gap-2 px-8 py-3.5 ${c.accent} text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md text-lg`}>
              <Calendar className="h-5 w-5" /> Schedule Your QuickScan™
            </Link>
            <p className="text-xs text-gray-400 mt-3">No commitment. Results in 24 hours.</p>
          </div>
        </section>
      </div>
    </div>
  );
}