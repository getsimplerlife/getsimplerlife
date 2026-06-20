import { MessageCircle, Calendar, ClipboardCopy, Users } from 'lucide-react'

const pains = [
  { icon: MessageCircle, title: 'Leads go cold because nobody followed up within 5 minutes', color: 'text-red-500', bg: 'bg-red-50', border: 'border-l-red-500' },
  { icon: ClipboardCopy, title: "You're still copying and pasting between 5+ apps daily", color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-l-orange-500' },
  { icon: Calendar, title: 'Client onboarding takes 3+ hours of back-and-forth', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-l-rose-500' },
  { icon: Users, title: 'You have no idea how many leads you have actually lost', color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-600' },
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-white" id="problem">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            You Started a Business to Build Something —{' '}
            <span className="text-primary">Not to Do Data Entry</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Every hour you spend manually responding to inquiries, updating your calendar, or copying
            data between apps is an hour stolen from your clients, your family, and your growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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
      </div>
    </section>
  )
}