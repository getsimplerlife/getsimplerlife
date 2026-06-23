import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HardHat,
  ArrowLeft,
  Ruler,
  DollarSign,
  FileText,
  CheckCircle2,
  Loader2,
  Hammer,
  TrendingUp,
  Clock,
  Users,
  Calculator,
  Calendar,
  Shield
} from 'lucide-react';

interface BidBreakdown {
  materials: number;
  labor: number;
  overhead: number;
  profit: number;
  contingency: number;
  total: number;
  hours: number;
}

export default function ConstructionBids() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bidResult, setBidResult] = useState<BidBreakdown | null>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    squareFootage: 2500,
    materialType: 'standard',
    laborRate: 65,
    estimatedDays: 30,
    workers: 4,
    overheadPercent: 10,
    profitPercent: 15,
    location: 'urban'
  });

  const generateBid = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    const sqft = formData.squareFootage;
    const materialRates: Record<string, { perSqft: number }> = {
      standard: { perSqft: 85 },
      premium: { perSqft: 145 },
      commercial: { perSqft: 210 },
      luxury: { perSqft: 310 }
    };

    const materialRate = materialRates[formData.materialType]?.perSqft || 85;
    const locationMultiplier = formData.location === 'urban' ? 1.15 : formData.location === 'suburban' ? 1.0 : 0.9;

    const materialCost = sqft * materialRate * locationMultiplier;
    const laborHours = sqft * 0.065 + formData.estimatedDays * 2;
    const laborCost = laborHours * formData.laborRate * locationMultiplier;
    const overhead = (materialCost + laborCost) * (formData.overheadPercent / 100);
    const subtotal = materialCost + laborCost + overhead;
    const profit = subtotal * (formData.profitPercent / 100);
    const contingency = subtotal * 0.05;

    setBidResult({
      materials: Math.round(materialCost),
      labor: Math.round(laborCost),
      overhead: Math.round(overhead),
      profit: Math.round(profit),
      contingency: Math.round(contingency),
      total: Math.round(subtotal + profit + contingency),
      hours: Math.round(laborHours)
    });
    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setBidResult(null);
    setFormData({
      projectName: '',
      squareFootage: 2500,
      materialType: 'standard',
      laborRate: 65,
      estimatedDays: 30,
      workers: 4,
      overheadPercent: 10,
      profitPercent: 15,
      location: 'urban'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-full mb-4">
            <HardHat className="h-7 w-7" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-3">
            Construction Bid & Estimate Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Generate flawless, line-item construction estimates connected directly to Procore — in seconds, not days.
            Eliminate spreadsheet errors and win more bids.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          {['Project Specs', 'Materials & Labor', 'Markup & Review', 'Your Bid'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition ${
                step > i + 1 ? 'bg-secondary text-white' :
                step === i + 1 ? 'bg-amber-600 text-white ring-4 ring-amber-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                step === i + 1 ? 'text-amber-600' : 'text-gray-400'
              }`}>{label}</span>
              {i < 3 && <div className="w-12 sm:w-20 h-0.5 mx-2 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Project Specs */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Enter Project Specifications</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g., Downtown Office Renovation"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  value={formData.projectName}
                  onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Square Footage: <span className="font-bold text-amber-600">{formData.squareFootage.toLocaleString()} sq ft</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="100"
                  value={formData.squareFootage}
                  onChange={e => setFormData({ ...formData, squareFootage: Number(e.target.value) })}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>500</span><span>50,000</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Location</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'urban', label: 'Urban' },
                    { value: 'suburban', label: 'Suburban' },
                    { value: 'rural', label: 'Rural' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, location: opt.value })}
                      className={`p-3 border rounded-lg text-sm font-medium transition ${
                        formData.location === opt.value
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition shadow-md"
              >
                Continue to Materials →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Materials & Labor */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Materials & Labor Parameters</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Specification Tier</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'standard', label: '🏢 Standard Build' },
                    { value: 'premium', label: '✨ Premium Finish' },
                    { value: 'commercial', label: '🏗️ Commercial Grade' },
                    { value: 'luxury', label: '👑 Luxury/Signature' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, materialType: opt.value })}
                      className={`p-3 border rounded-lg text-sm font-medium transition ${
                        formData.materialType === opt.value
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Labor Rate</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="25"
                      max="250"
                      value={formData.laborRate}
                      onChange={e => setFormData({ ...formData, laborRate: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                    />
                    <span className="text-sm text-gray-400">/hr</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Days</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.estimatedDays}
                    onChange={e => setFormData({ ...formData, estimatedDays: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
                <div className="grid grid-cols-4 gap-3">
                  {[2, 4, 6, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setFormData({ ...formData, workers: n })}
                      className={`p-3 border rounded-lg text-sm font-semibold transition ${
                        formData.workers === n
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="h-4 w-4 mx-auto mb-1" />
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition shadow-md">Continue to Markup →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Markup & Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Margin Settings & Review</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  G&A Overhead: <span className="font-bold text-amber-600">{formData.overheadPercent}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={formData.overheadPercent}
                  onChange={e => setFormData({ ...formData, overheadPercent: Number(e.target.value) })}
                  className="w-full accent-amber-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin: <span className="font-bold text-amber-600">{formData.profitPercent}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={formData.profitPercent}
                  onChange={e => setFormData({ ...formData, profitPercent: Number(e.target.value) })}
                  className="w-full accent-amber-600"
                />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Pro tip:</strong> Industry standard for GCs is 10-15% overhead and 15-20% profit margin.
                  Adjust based on project complexity and competition.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
                <button
                  onClick={generateBid}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition shadow-md disabled:bg-amber-300"
                >
                  {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Calculating...</> : <><Calculator className="mr-2 h-5 w-5" /> Generate Bid Proposal</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Bid Result */}
        {step === 4 && bidResult && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg overflow-hidden">
              <div className="bg-amber-600 text-white p-6 text-center">
                <HardHat className="h-10 w-10 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">{formData.projectName || 'Construction Bid'}</h2>
                <p className="text-amber-100 text-sm">Bid Proposal — Generated in Real-Time</p>
              </div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Total Bid Amount</p>
                  <p className="text-4xl font-bold text-dark">${bidResult.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{bidResult.hours.toLocaleString()} estimated labor hours</p>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    { label: 'Materials', value: bidResult.materials, icon: Hammer, color: 'text-blue-600' },
                    { label: 'Labor', value: bidResult.labor, icon: Users, color: 'text-emerald-600' },
                    { label: 'G&A Overhead', value: bidResult.overhead, icon: TrendingUp, color: 'text-purple-600' },
                    { label: 'Contingency (5%)', value: bidResult.contingency, icon: Shield, color: 'text-orange-600' },
                    { label: 'Profit Margin', value: bidResult.profit, icon: DollarSign, color: 'text-secondary' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-dark">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="font-bold text-dark">Total Bid</span>
                    <span className="font-bold text-lg text-amber-700">${bidResult.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">
                    Start New Estimate
                  </button>
                  <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition shadow-md">
                    <Calendar className="mr-2 h-4 w-4" />
                    Get Your 24-Hour Audit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
          {[
            { icon: Ruler, label: 'Accurate Measurements', desc: 'Auto-calculated sq ft' },
            { icon: TrendingUp, label: 'Margin Safe', desc: 'Built-in overhead & profit' },
            { icon: FileText, label: 'Procore Ready', desc: 'Direct API integration' },
            { icon: Clock, label: 'Sub-2 Minute Bids', desc: 'Instant generation' }
          ].map(f => (
            <div key={f.label} className="text-center p-3">
              <f.icon className="h-5 w-5 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-dark">{f.label}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}