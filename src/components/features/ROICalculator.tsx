import { useState, useEffect, useRef, useCallback } from 'react'
import { Mail, Calendar, Database, Users, Receipt, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
  { key: 'email', label: 'Lead follow-up & email responses', icon: Mail, default: 5 },
  { key: 'scheduling', label: 'Scheduling & calendar management', icon: Calendar, default: 3 },
  { key: 'dataEntry', label: 'Data entry & spreadsheet updates', icon: Database, default: 4 },
  { key: 'onboarding', label: 'Client onboarding & intake', icon: Users, default: 2 },
  { key: 'invoicing', label: 'Invoicing & payment follow-ups', icon: Receipt, default: 2 },
] as const

type CategoryKey = typeof categories[number]['key']

function useCountUp(target: number, duration = 1200) {
  const [display, setDisplay] = useState(0)
  const prevTarget = useRef(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    const start = prevTarget.current
    const diff = target - start
    if (Math.abs(diff) < 0.5) {
      setDisplay(target)
      prevTarget.current = target
      return
    }

    const startTime = performance.now()
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      else { setDisplay(target); prevTarget.current = target }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return display
}

export default function ROICalculator() {
  const [hours, setHours] = useState<Record<CategoryKey, number>>({
    email: 5, scheduling: 3, dataEntry: 4, onboarding: 2, invoicing: 2,
  })

  const total = Object.values(hours).reduce((a, b) => a + b, 0)
  const saved = total * 0.75
  const animSaved = useCountUp(saved)
  const animTotal = useCountUp(total)
  const isHigh = total > 80

  const updateHour = useCallback((key: CategoryKey, val: number) => {
    const n = Math.max(0, Math.min(40, Math.round(val)))
    setHours(prev => ({ ...prev, [key]: n }))
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-emerald-50" id="roi-calculator">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold mb-4">
            <Sparkles size={16} /> Interactive Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            ⚡ See How Many Hours <span className="text-primary">You Could Save</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Move the sliders to match your weekly hours — watch your savings update in real time.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8">
          <p className="font-semibold text-dark mb-6">I spend this many hours per week on:</p>
          <div className="space-y-5">
            {categories.map(cat => (
              <div key={cat.key}>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor={`roi-${cat.key}`} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <cat.icon size={18} className="text-primary" />
                    {cat.label}
                  </label>
                  <span className="font-bold text-primary font-mono text-base min-w-[2rem] text-right">{hours[cat.key]}h</span>
                </div>
                <input
                  id={`roi-${cat.key}`}
                  type="range"
                  min={0} max={40}
                  value={hours[cat.key]}
                  onChange={e => updateHour(cat.key, Number(e.target.value))}
                  aria-label={`${cat.label} hours per week`}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 p-5 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-dark font-mono">
                {Math.round(animTotal)}<span className="text-sm text-gray-400">/week</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">You Could Save</p>
              <p className="text-2xl font-bold text-secondary font-mono">
                ~{Math.round(animSaved)}<span className="text-sm text-gray-400">/week</span>
              </p>
            </div>
          </div>

          <div aria-live="polite" className="mt-4 text-center text-sm text-gray-500">
            {total === 0 ? (
              <span>Enter your hours above to see potential savings.</span>
            ) : isHigh ? (
              <span className="text-accent-warm font-semibold">
                🚨 Whoa — {total}h/week on admin? Let's talk ASAP.{' '}
                <Link to="/book" className="text-primary underline font-semibold">Schedule your audit →</Link>
              </span>
            ) : (
              <span>
                That's like reclaiming <strong className="text-secondary">~{Math.round(saved)} hours</strong> every week.{' '}
                <span className="text-gray-400">Imagine what you'd do with that time.</span>
              </span>
            )}
          </div>

          <div className="text-center mt-6">
            <Link to="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition shadow-md">
              Get My Automation Audit <ArrowRight size={20} />
            </Link>
          </div>

          <p className="mt-3 text-xs text-gray-400 text-center">
            Based on typical automation of ~75% of repetitive tasks. Actual results may vary.
          </p>
        </div>
      </div>
    </section>
  )
}