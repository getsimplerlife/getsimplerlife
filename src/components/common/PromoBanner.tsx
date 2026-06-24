import { X, Clock, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-amber-600 via-primary to-secondary text-white px-4 py-2.5 relative overflow-hidden shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center space-x-3">
          <span className="hidden md:inline-flex p-1 bg-white/20 rounded-full animate-pulse">
            <Clock className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold tracking-wide flex items-center gap-2">
            <span className="bg-white text-primary px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter font-black">🔥 24-Hour Rescue</span>
            <span className="hidden sm:inline">Find every risk, leak, and automation blind spot in your business — within 24 hours. <strong>$997 QuickScan™</strong></span>
            <span className="sm:hidden">$997 QuickScan™ — Results in 24hrs</span>
          </p>
          <Link
            to="/book"
            className="ml-4 px-3 py-1 bg-white text-primary rounded-full text-xs font-black uppercase hover:bg-opacity-90 transition shadow-sm whitespace-nowrap"
          >
            Book Now
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition ml-2 flex-shrink-0"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Decorative pulse element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 animate-pulse" />
    </div>
  )
}
