const testimonials = [
  { quote: 'Simpler Life saved us 20+ hours a week on lead follow-up. Our response time went from 4 hours to 30 seconds. Game changer.', name: 'Sarah M.', role: 'Real Estate Agent, Denver' },
  { quote: 'I was skeptical, but the audit showed me exactly what I was losing. We signed up on the spot and haven\'t looked back.', name: 'James K.', role: 'HVAC Business Owner, Austin' },
  { quote: 'Setup took 3 days. I\'ve already reclaimed my weekends. Worth every penny.', name: 'Priya R.', role: 'Marketing Agency Owner, NYC' },
]

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-gray-50" id="testimonials">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="text-gray-500">Real results from real businesses that reclaimed their time.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative">
              <svg className="absolute top-4 right-5 text-primary opacity-10" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"/>
              </svg>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-dark text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}