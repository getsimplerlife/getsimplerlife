import { Outlet, Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import PromoBanner from './PromoBanner'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-dark">
      {/* Grand Launch Promo Banner */}
      <PromoBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
            <Activity className="h-6 w-6 text-primary" />
            <span>Simpler Life</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition font-medium">Home</Link>
            <Link to="/book" className="text-gray-600 hover:text-primary transition font-medium">Book Audit</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition font-medium">Contact</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition font-medium">Client Portal</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-white font-bold text-lg mb-4 sm:mb-0">
            <Activity className="h-5 w-5 text-secondary" />
            <span>Simpler Life</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Simpler Life. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
