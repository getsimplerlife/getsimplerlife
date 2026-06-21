import { Link } from 'react-router-dom'
import { Calendar, ArrowLeft } from 'lucide-react'

export default function Book() {
  const calLink = "https://cal.com/simpler-life/strategy-session"
  const themeParams = "theme=light&primaryColor=%234f46e5"

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="inline-flex p-3 bg-indigo-50 text-primary rounded-full mb-4">
            <Calendar className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-2">
            Schedule Your Free 15-Min Strategy Call
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Book a slot directly in our team calendar. No pitch. Just a screen-share walkthrough showing you exactly what repetitive tasks we can automate for you.
          </p>
        </div>

        {/* Embedded Iframe */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden" style={{ height: "650px" }}>
          <iframe
            src={`${calLink}?${themeParams}`}
            title="Schedule a strategy session with Simpler Life"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
