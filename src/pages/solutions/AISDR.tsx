import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, Target, Mail, Phone, Calendar, TrendingUp, Users, 
  Bot, ArrowLeft, CheckCircle2, Clock, Zap, MessageSquare, 
  Loader2, Plus, Play, Pause, ArrowUpRight 
} from 'lucide-react'

type SequenceStep = { day: number; channel: string; action: string; enabled: boolean }
type Campaign = { id: string; name: string; prospects: number; sent: number; replies: number; meetings: number; status: 'active' | 'paused' | 'draft' }

export default function AISDR() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'sequences'>('overview')
  const [sequence, setSequence] = useState<SequenceStep[]>([
    { day: 1, channel: 'LinkedIn', action: 'Connection request with personalized note', enabled: true },
    { day: 2, channel: 'Email', action: 'Intro email referencing LinkedIn or direct intro', enabled: true },
    { day: 4, channel: 'Email', action: 'Value-add content / different angle', enabled: true },
    { day: 7, channel: 'LinkedIn', action: 'Follow-up message (if connected)', enabled: true },
    { day: 14, channel: 'Email', action: 'Breakup / last attempt email', enabled: true },
  ])
  const [campaigns] = useState<Campaign[]>([
    { id: 'c1', name: 'Q3 SaaS Outreach', prospects: 250, sent: 187, replies: 42, meetings: 11, status: 'active' },
    { id: 'c2', name: 'Agency Partners', prospects: 120, sent: 98, replies: 31, meetings: 8, status: 'active' },
    { id: 'c3', name: 'Enterprise Leads', prospects: 75, sent: 75, replies: 12, meetings: 3, status: 'paused' },
  ])

  const toggleStep = (index: number) => {
    setSequence(prev => prev.map((s, i) => i === index ? { ...s, enabled: !s.enabled } : s))
  }

  const totalProspects = campaigns.reduce((a, c) => a + c.prospects, 0)
  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0)
  const totalReplies = campaigns.reduce((a, c) => a + c.replies, 0)
  const totalMeetings = campaigns.reduce((a, c) => a + c.meetings, 0)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark">AI SDR Dashboard</h1>
            <p className="text-gray-500 mt-1">Automated sales development — campaign performance at a glance</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              <Bot className="h-4 w-4" /> AI Active
            </span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Prospects', value: totalProspects.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Emails Sent', value: totalSent.toLocaleString(), icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Replies', value: totalReplies.toString(), icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${Math.round(totalReplies/totalSent*100)}% reply rate` },
            { label: 'Meetings Booked', value: totalMeetings.toString(), icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50', sub: `${Math.round(totalMeetings/totalReplies*100)}% conversion` },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-5 border border-gray-100`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <TrendingUp className={`h-4 w-4 ${stat.color} opacity-50`} />
              </div>
              <p className="text-2xl font-bold text-dark">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              {stat.sub && <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.sub}</p>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          {(['overview', 'campaigns', 'sequences'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition border-b-2 ${
                activeTab === tab ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >{tab}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-dark mb-4">Channel Performance</h3>
              <div className="space-y-4">
                {[
                  { channel: 'Email', sent: totalSent, replies: Math.round(totalReplies * 0.6), meetings: Math.round(totalMeetings * 0.5), color: 'bg-indigo-500' },
                  { channel: 'LinkedIn', sent: Math.round(totalSent * 0.4), replies: Math.round(totalReplies * 0.4), meetings: Math.round(totalMeetings * 0.5), color: 'bg-blue-500' },
                ].map((ch) => (
                  <div key={ch.channel}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-dark">{ch.channel}</span>
                      <span className="text-gray-400">{ch.replies} replies / {ch.meetings} meetings</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${(ch.sent / totalSent) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-dark mb-4">Campaign Status</h3>
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-dark text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.sent}/{c.prospects} sent · {c.replies} replies</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {c.status === 'active' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {c.status}
                      </span>
                      <span className="text-sm font-bold text-primary">{c.meetings} meetings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-dark">All Campaigns</h3>
              <button className="inline-flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition">
                <Plus className="h-4 w-4" /> New Campaign
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Campaign</th>
                    <th className="text-left px-4 py-3 font-medium">Prospects</th>
                    <th className="text-left px-4 py-3 font-medium">Sent</th>
                    <th className="text-left px-4 py-3 font-medium">Replies</th>
                    <th className="text-left px-4 py-3 font-medium">Meetings</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-dark">{c.name}</td>
                      <td className="px-4 py-3">{c.prospects}</td>
                      <td className="px-4 py-3">{c.sent}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium">{c.replies}</td>
                      <td className="px-4 py-3 text-primary font-bold">{c.meetings}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sequences Tab */}
        {activeTab === 'sequences' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-dark">Multi-Channel Sequence Builder</h3>
              <button className="inline-flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition">
                <Plus className="h-4 w-4" /> Add Step
              </button>
            </div>
            <div className="space-y-3">
              {sequence.map((step, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                  step.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'
                }`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {step.day}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        step.channel === 'Email' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                      }`}>{step.channel}</span>
                      <span className="text-xs text-gray-400">Day {step.day}</span>
                    </div>
                    <p className="text-sm text-dark font-medium">{step.action}</p>
                  </div>
                  <button onClick={() => toggleStep(i)} className={`p-2 rounded-lg transition ${
                    step.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.enabled ? <CheckCircle2 className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Action CTA */}
        <div className="mt-8 bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Launch a New Campaign</h3>
          <p className="text-indigo-200 text-sm mb-4">Import prospects, set your sequence, and let AI handle the outreach.</p>
          <Link to="/book" className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition text-sm">
            Get Started <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}