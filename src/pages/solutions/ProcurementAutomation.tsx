import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShoppingCart,
  Truck,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Send
} from 'lucide-react';

interface POData {
  poNumber: string;
  supplierName: string;
  items: { name: string; qty: number; unitPrice: number; total: number }[];
  totalAmount: number;
  deliveryETA: string;
  status: string;
}

const sampleItems = [
  { name: 'Steel Rebar Grade 60 (per ton)', price: 850 },
  { name: '3/4" Plywood Sheets (per sheet)', price: 42 },
  { name: 'Type 1 Portland Cement (per bag)', price: 12.50 },
  { name: 'PVC Schedule 40 Pipe 4" (per ft)', price: 3.20 },
  { name: 'Electrical Romex 14/2 (per ft)', price: 0.85 },
  { name: 'Copper Tubing 1/2" (per ft)', price: 2.40 },
  { name: 'Drywall 4x8 Sheets (per sheet)', price: 18.75 },
  { name: 'Insulation R-13 Batt (per roll)', price: 48 }
];

export default function ProcurementAutomation() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [poResult, setPoResult] = useState<POData | null>(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierEmail: '',
    urgency: 'standard',
    items: sampleItems.slice(0, 3).map(item => ({ ...item, qty: 10 })),
    deliveryAddress: ''
  });

  const updateItemQty = (index: number, qty: number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], qty: Math.max(0, qty) };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = (item: typeof sampleItems[0]) => {
    if (!formData.items.find(i => i.name === item.name)) {
      setFormData({ ...formData, items: [...formData.items, { ...item, qty: 5 }] });
    }
  };

  const removeItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const totalPO = formData.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const generatePO = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    const eta = formData.urgency === 'rush' ? '3-5 business days' :
                formData.urgency === 'standard' ? '10-14 business days' :
                '21-30 business days';

    setPoResult({
      poNumber: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      supplierName: formData.supplierName,
      items: formData.items.filter(i => i.qty > 0).map(i => ({
        name: i.name,
        qty: i.qty,
        unitPrice: i.price,
        total: i.qty * i.price
      })),
      totalAmount: totalPO,
      deliveryETA: eta,
      status: 'draft'
    });
    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setStep(1);
    setPoResult(null);
    setFormData({
      supplierName: '',
      supplierEmail: '',
      urgency: 'standard',
      items: sampleItems.slice(0, 3).map(item => ({ ...item, qty: 10 })),
      deliveryAddress: ''
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
          <span className="inline-flex p-3 bg-orange-50 text-orange-600 rounded-full mb-4">
            <Package className="h-7 w-7" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-3">
            Procurement & PO Automation Tracker
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate supply chain holdups. Auto-generate, approve via Slack, and dispatch purchase orders
            the second inventory drops below safety thresholds.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center mb-10">
          {['Supplier', 'Line Items', 'Review & Approve', 'PO Generated'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition ${
                step > i + 1 ? 'bg-secondary text-white' :
                step === i + 1 ? 'bg-orange-600 text-white ring-4 ring-orange-100' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-orange-600' : 'text-gray-400'}`}>{label}</span>
              {i < 3 && <div className="w-12 sm:w-20 h-0.5 mx-2 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Supplier */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Supplier & Delivery Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                <input type="text" placeholder="e.g., Metro Building Supply" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  value={formData.supplierName} onChange={e => setFormData({ ...formData, supplierName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Email (for PO delivery)</label>
                <input type="email" placeholder="orders@metrosupply.com" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  value={formData.supplierEmail} onChange={e => setFormData({ ...formData, supplierEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Site Address</label>
                <input type="text" placeholder="123 Construction Way, Denver, CO" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  value={formData.deliveryAddress} onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Urgency</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'rush', label: '🚨 Rush', desc: '3-5 days' },
                    { value: 'standard', label: '📦 Standard', desc: '10-14 days' },
                    { value: 'economy', label: '🚢 Economy', desc: '21-30 days' }
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => setFormData({ ...formData, urgency: opt.value })}
                      className={`p-3 border rounded-lg text-sm transition ${
                        formData.urgency === opt.value ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}>
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-xs opacity-80">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!formData.supplierName} className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-md disabled:bg-orange-300">
                Add Line Items →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Line Items */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-4">Purchase Order Line Items</h2>
            <p className="text-sm text-gray-500 mb-6">Adjust quantities or add items from the catalog below.</p>

            <div className="space-y-3 mb-6">
              {formData.items.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">${item.price.toFixed(2)}/unit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateItemQty(i, item.qty - 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center font-bold">-</button>
                    <input type="number" min="0" value={item.qty} onChange={e => updateItemQty(i, Number(e.target.value))} className="w-16 text-center rounded-lg border border-gray-300 px-2 py-1 text-sm font-semibold" />
                    <button onClick={() => updateItemQty(i, item.qty + 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center font-bold">+</button>
                  </div>
                  <span className="text-sm font-bold text-dark w-20 text-right">${(item.qty * item.price).toFixed(2)}</span>
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-sm ml-1">✕</button>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Add from catalog:</p>
              <div className="flex flex-wrap gap-2">
                {sampleItems.filter(s => !formData.items.find(i => i.name === s.name)).map(item => (
                  <button key={item.name} onClick={() => addItem(item)}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-full hover:bg-orange-50 hover:border-orange-200 transition text-gray-600">
                    + {item.name.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl mb-4">
              <span className="font-semibold text-dark">PO Subtotal</span>
              <span className="text-xl font-bold text-orange-700">${totalPO.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-md">Review & Submit →</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-dark mb-6">Review Purchase Order</h2>
            <p className="text-sm text-gray-500 mb-4">In production, this PO would be sent to your Slack for interactive approval.</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-dark">Source: Inventory Alert</p>
              <p className="text-xs text-gray-500">Stock levels for selected items dropped below safety threshold</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <Send className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Slack Approval Pending</p>
                <p className="text-xs text-orange-600">[ Approve PO ] [ Modify PO ] [ Reject ]</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">← Back</button>
              <button
                onClick={generatePO}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-md disabled:bg-orange-300"
              >
                {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Dispatching PO...</> : <><ShoppingCart className="mr-2 h-5 w-5" /> Approve & Dispatch PO</>}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && poResult && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg overflow-hidden">
              <div className="bg-orange-600 text-white p-6 text-center">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Purchase Order Generated</h2>
                <p className="text-orange-100 font-mono">{poResult.poNumber}</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400">Supplier</p>
                    <p className="text-sm font-bold text-dark">{poResult.supplierName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-lg font-bold text-dark">${poResult.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400">Delivery ETA</p>
                    <p className="text-sm font-bold text-dark">{poResult.deliveryETA}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {poResult.items.map(item => (
                    <div key={item.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-dark">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.qty} @ ${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-bold">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    PO will be emailed to {formData.supplierEmail} with acknowledgment link
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition bg-white">
                    Create New PO
                  </button>
                  <Link to="/book" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-md">
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
            { icon: Truck, label: 'Supplier Delivery', desc: 'Auto-email with tracking' },
            { icon: TrendingUp, label: 'Stock Threshold', desc: 'Real-time inventory check' },
            { icon: Users, label: 'Slack Approval', desc: 'Interactive PO workflow' },
            { icon: FileText, label: 'NetSuite Sync', desc: 'Automatic ERP creation' }
          ].map(f => (
            <div key={f.label} className="text-center p-3">
              <f.icon className="h-5 w-5 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-dark">{f.label}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}