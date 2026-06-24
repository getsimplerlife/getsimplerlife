import { X, Gift } from 'lucide-react'
import { useState } from 'react'

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 relative overflow-hidden shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center space-x-3">
          <span className="hidden md:inline-flex p-1 bg-white/20 rounded-full">
            <Gift className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold tracking-wide flex items-center gap-2">
            <span className="bg-white text-primary px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter">Grand Launch</span>
            <span>🚀 THE 24-HOUR RESCUE: Find operational risk & waste with our $997 QuickScan™. 100% credited back!</span>
          </p>
          <a 
            href="/book" 
            className="ml-4 px-3 py-1 bg-white text-primary rounded-full text-xs font-black uppercase hover:bg-opacity-90 transition shadow-sm whitespace-nowrap"
          >
            Claim Discount
          </a>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition ml-2"
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
