import { Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
        <AlertCircle className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-dark tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another workflow. Let's get you back on track.
        </p>
        <Link to="/" className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Safety
        </Link>
      </div>
    </div>
  )
}
