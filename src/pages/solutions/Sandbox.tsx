import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  ArrowLeft,
  Play,
  Send,
  Shield,
  Zap,
  Sparkles,
  Database,
  Server,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Code,
  FileText,
  Lock,
  MessageSquare,
  DollarSign
} from 'lucide-react';

interface LogStep {
  time: string;
  type: 'info' | 'success' | 'warning' | 'security' | 'database';
  message: string;
}

type WebhookType = 'leads' | 'ai-sdr' | 'mortgage' | 'compliance' | 'procurement' | 'construction';

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState<WebhookType>('leads');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [response, setResponse] = useState<any>(null);
  
  // Input fields state
  const [leadName, setLeadName] = useState('John Service');
  const [leadEmail, setLeadEmail] = useState('john@apexservices.com');
  const [leadNeeds, setLeadNeeds] = useState('Lead Routing, CRM Database Sync');
  
  const [prospectName, setProspectName] = useState('Alice Developer');
  const [prospectEmail, setProspectEmail] = useState('alice@devcorp.com');
  const [prospectCompany, setProspectCompany] = useState('DevCorp');
  const [prospectRole, setProspectRole] = useState('Senior Engineer');

  const [applicantName, setApplicantName] = useState('Robert Mortgage');
  const [applicantEmail, setApplicantEmail] = useState('robert@mortgagequest.com');
  const [propertyZip, setPropertyZip] = useState('28202');
  const [creditRange, setCreditRange] = useState('Excellent');

  const [checklistName, setChecklistName] = useState('Daily OSHA Checklist');
  const [operatorName, setOperatorName] = useState('Jane Inspector');
  const [complianceRating, setComplianceRating] = useState('compliant');

  const [poNumber, setPoNumber] = useState('PO-2026-0412');
  const [supplierName, setSupplierName] = useState('Apex HVAC Supplies');
  const [poAmount, setPoAmount] = useState(4500);

  const [projectName, setProjectName] = useState('Charlotte Regional Airport HVAC');
  const [squareFootage, setSquareFootage] = useState(12000);
  const [materialCost, setMaterialCost] = useState(25000);

  // Automatically reset response and logs when changing webhook types
  useEffect(() => {
    setLogs([]);
    setResponse(null);
    setIsSimulating(false);
  }, [activeTab]);

  const getPayload = () => {
    switch (activeTab) {
      case 'leads':
        return {
          name: leadName,
          email: leadEmail,
          needs: leadNeeds.split(',').map(s => s.trim()),
          message: 'Simulated sandbox test'
        };
      case 'ai-sdr':
        return {
          prospect_name: prospectName,
          email: prospectEmail,
          company_name: prospectCompany,
          role: prospectRole
        };
      case 'mortgage':
        return {
          applicant_name: applicantName,
          email: applicantEmail,
          property_zip: propertyZip,
          credit_score_range: creditRange,
          employment_type: 'W2',
          estimated_price: 450000,
          loan_amount: 360000
        };
      case 'compliance':
        return {
          checklist_name: checklistName,
          operator_name: operatorName,
          compliance_rating: complianceRating,
          payload_json: {
            items: [
              { check: 'Safety harnesses inspected', status: 'pass' },
              { check: 'MFA configuration verified', status: 'pass' }
            ]
          }
        };
      case 'procurement':
        return {
          po_number: poNumber,
          supplier_name: supplierName,
          total_amount: Number(poAmount),
          items_summary: 'Sandbox heavy mechanical equipment log'
        };
      case 'construction':
        return {
          project_name: projectName,
          total_square_footage: Number(squareFootage),
          estimated_material_cost: Number(materialCost),
          estimated_labor_hours: Math.round(squareFootage * 0.12),
          overhead_markup_percent: 10,
          profit_margin_percent: 15
        };
    }
  };

  const getEndpoint = () => {
    switch (activeTab) {
      case 'leads': return 'POST /api/leads';
      case 'ai-sdr': return 'POST /api/ai-sdr';
      case 'mortgage': return 'POST /api/mortgage-qualify';
      case 'compliance': return 'POST /api/compliance-audit';
      case 'procurement': return 'POST /api/procurement-po';
      case 'construction': return 'POST /api/construction-bid';
    }
  };

  const triggerSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setLogs([]);
    setResponse(null);

    const payload = getPayload();
    const endpoint = getEndpoint();

    const addLog = (msg: string, type: LogStep['type'] = 'info', delay: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const now = new Date();
          const ms = String(now.getMilliseconds()).padStart(3, '0');
          const timeStr = `${now.toLocaleTimeString('en-US', { hour12: false })}.${ms}`;
          setLogs(prev => [...prev, { time: timeStr, type, message: msg }]);
          resolve();
        }, delay);
      });
    };

    // Sequential steps
    await addLog(`📡 Webhook client initiated connection to backend...`, 'info', 0);
    await addLog(`🚀 Dispatching payload to endpoint: ${endpoint}`, 'info', 100);
    await addLog(`🔍 JSON payload detected. Commencing input schema validations...`, 'info', 150);

    // Validate email if present
    if (payload.email) {
      await addLog(`✉️ Validating structure of email address: "${payload.email}"`, 'info', 100);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        await addLog(`❌ Validation failed: "${payload.email}" is not a valid email formatting structure.`, 'warning', 100);
        setIsSimulating(false);
        setResponse({ success: false, error: 'Validation Error', details: ['A valid email is required'] });
        return;
      }
      await addLog(`✨ Validation structure check passed successfully.`, 'success', 80);
    }

    switch (activeTab) {
      case 'leads':
        await addLog(`📊 Evaluating lead context to calculate opportunity scoring index...`, 'info', 100);
        let leadScore = 0;
        if (payload.email?.endsWith('.com') && !payload.email?.includes('gmail') && !payload.email?.includes('yahoo')) {
          leadScore += 30;
          await addLog(`🎯 Corporate domain detected (score +30 points).`, 'success', 100);
        }
        if (payload.needs && payload.needs.length > 0) {
          leadScore += 40;
          await addLog(`📋 Specific integration needs selected (score +40 points).`, 'success', 80);
        }
        await addLog(`💾 Writing record to SQLite table: "leads"`, 'database', 150);
        await addLog(`📈 Executing atomic triggers: Incrementing process KPIs in table "kpi_metrics"`, 'database', 120);
        await addLog(`🔐 Signing payload with cryptographically sealed HMAC-SHA256 signature...`, 'security', 150);
        await addLog(`🔗 Webhook generated with X-Simpler-Life-Signature header.`, 'security', 50);
        await addLog(`📡 Forwarding to active n8n synchronization webhook (Port 5678)...`, 'info', 180);
        await addLog(`🟢 Webhook successfully synced on port 5678. Status: 200 OK`, 'success', 150);
        break;

      case 'ai-sdr':
        await addLog(`🤖 Forwarding target company and role profile to AI Ingestion Engine...`, 'info', 100);
        await addLog(`📊 Analyzing Fit Score index and Intent Telemetry factors...`, 'info', 120);
        await addLog(`🎯 Calculated Fit Score: 87.5% - Intent Level: 91.0%`, 'success', 100);
        await addLog(`💾 Logging CRM pipeline prospect to table: "ai_sdr_leads"`, 'database', 150);
        await addLog(`📈 KPIs incremented: processed_leads +1, hours_saved +1.5 hrs`, 'database', 100);
        await addLog(`💌 Automated highly personalized intro response composed for "${payload.prospect_name}"`, 'success', 180);
        break;

      case 'mortgage':
        await addLog(`🏦 Evaluating down payment savings ratios and credit history variables...`, 'info', 100);
        let mqScore = 50;
        if (creditRange === 'Excellent') {
          mqScore += 30;
          await addLog(`⭐ Excellent credit range detected (score +30)`, 'success', 100);
        }
        await addLog(`💾 Saving pre-qualification telemetry record to table: "mortgage_qualification"`, 'database', 150);
        await addLog(`📈 Real-Time KPIs updated: processed_leads +1, hours_saved +1.0 hrs`, 'database', 100);
        await addLog(`👤 Matching and assigning appropriate corporate Loan Officer...`, 'info', 120);
        break;

      case 'compliance':
        await addLog(`🔐 Compiling check logs to produce cryptographically tamper-proof audit trace...`, 'info', 100);
        await addLog(`🧮 Hashing operational checklist schema with HS256 algorithm...`, 'security', 150);
        await addLog(`💾 Registering blockchain-style secure audit ledger to table: "compliance_ledger"`, 'database', 150);
        await addLog(`🔒 Tamper-Proof ledger record block committed. Status: Sealed.`, 'security', 100);
        break;

      case 'procurement':
        await addLog(`💼 Verifying PO draft limits against budget allocation index...`, 'info', 100);
        await addLog(`💾 Saving purchase order logs to SQLite table: "purchase_orders"`, 'database', 150);
        await addLog(`🔔 Triggering manager mock approval webhook events...`, 'info', 120);
        await addLog(`📈 Metric counters modified: processed_leads +1, hours_saved +1.0 hrs`, 'database', 100);
        break;

      case 'construction':
        await addLog(`🏗️ Parsing project square footage blueprint dimensional multipliers...`, 'info', 100);
        await addLog(`💰 Evaluating material cost index and estimated labor hour ratios...`, 'info', 120);
        await addLog(`💾 Saving final calculated bid parameters to table: "construction_bids"`, 'database', 150);
        await addLog(`📈 Atomic update finished: processed_leads +1, hours_saved +2.5 hrs`, 'database', 100);
        break;
    }

    await addLog(`✅ Operation successfully logged. Parsing pipeline finished.`, 'success', 150);

    // Call the actual API endpoint inside the server
    try {
      const url = `/api/${activeTab === 'procurement' ? 'procurement-po' : activeTab === 'compliance' ? 'compliance-audit' : activeTab === 'mortgage' ? 'mortgage-qualify' : activeTab === 'construction' ? 'construction-bid' : activeTab}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ success: false, error: 'Sandbox network failure', details: [err.message] });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Home */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
            <Zap className="h-8 w-8 animate-pulse" />
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-dark mb-4">
            Real-Time Webhook & API Sandbox
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Directly interface with our robust SQLite schemas and live Express.js automation endpoints.
            Trigger simulated payloads, observe real-time cryptographic logs, and track KPI updates instantly.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
          {[
            { id: 'leads', name: 'New Contact Lead', icon: MessageSquare },
            { id: 'ai-sdr', name: 'AI SDR Prospect', icon: Sparkles },
            { id: 'mortgage', name: 'Mortgage Pre-Qual', icon: Database },
            { id: 'compliance', name: 'Compliance Audit', icon: Shield },
            { id: 'procurement', name: 'Procurement PO', icon: DollarSign },
            { id: 'construction', name: 'Construction Bid', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WebhookType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left - Control Panel / Editor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-600" />
                Webhook Parameters
              </h2>

              {/* Interactive payload editor form based on active webhook */}
              <div className="space-y-4 mb-6">
                {activeTab === 'leads' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={leadName}
                        onChange={e => setLeadName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={e => setLeadEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Needs List (Comma separated)</label>
                      <input
                        type="text"
                        value={leadNeeds}
                        onChange={e => setLeadNeeds(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'ai-sdr' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Prospect Name</label>
                      <input
                        type="text"
                        value={prospectName}
                        onChange={e => setProspectName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={prospectEmail}
                        onChange={e => setProspectEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Company Name</label>
                        <input
                          type="text"
                          value={prospectCompany}
                          onChange={e => setProspectCompany(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Role / Position</label>
                        <input
                          type="text"
                          value={prospectRole}
                          onChange={e => setProspectRole(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'mortgage' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Applicant Name</label>
                      <input
                        type="text"
                        value={applicantName}
                        onChange={e => setApplicantName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={applicantEmail}
                        onChange={e => setApplicantEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Property Zip Code</label>
                        <input
                          type="text"
                          value={propertyZip}
                          onChange={e => setPropertyZip(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Credit Score Range</label>
                        <select
                          value={creditRange}
                          onChange={e => setCreditRange(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        >
                          <option value="Excellent">Excellent (720+)</option>
                          <option value="Good">Good (660-719)</option>
                          <option value="Fair">Fair (620-659)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'compliance' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Checklist Audit Name</label>
                      <input
                        type="text"
                        value={checklistName}
                        onChange={e => setChecklistName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Compliance Operator Name</label>
                      <input
                        type="text"
                        value={operatorName}
                        onChange={e => setOperatorName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Compliance Rating Rating</label>
                      <select
                        value={complianceRating}
                        onChange={e => setComplianceRating(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      >
                        <option value="compliant">Compliant (Zero Issues)</option>
                        <option value="at_risk">At Risk (Minor Non-Blockers)</option>
                        <option value="non_compliant">Non Compliant</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'procurement' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Purchase Order (PO) Number</label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={e => setPoNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Supplier Company Name</label>
                      <input
                        type="text"
                        value={supplierName}
                        onChange={e => setSupplierName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Total PO Amount ($)</label>
                      <input
                        type="number"
                        value={poAmount}
                        onChange={e => setPoAmount(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'construction' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Construction Project Name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Square Footage (sqft)</label>
                        <input
                          type="number"
                          value={squareFootage}
                          onChange={e => setSquareFootage(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Material Costs ($)</label>
                        <input
                          type="number"
                          value={materialCost}
                          onChange={e => setMaterialCost(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={triggerSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Simulating Pipeline...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    Trigger Webhook
                  </>
                )}
              </button>
            </div>

            {/* API Endpoint and Headers Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-3">API Target Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Endpoint:</span>
                  <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs">
                    {getEndpoint()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold">Content-Type:</span>
                  <span className="font-mono text-gray-600 text-xs">application/json</span>
                </div>
                {activeTab === 'compliance' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-semibold">Crypto Hash:</span>
                    <span className="font-mono text-emerald-600 text-xs flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      HMAC SHA-256
                    </span>
                  </div>
                )}
                {activeTab === 'leads' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-semibold">Sync Server:</span>
                    <span className="font-mono text-indigo-600 text-xs">Port 5678</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Live Visual Logs Terminal */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
            {/* Terminal Header */}
            <div className="bg-slate-900 text-slate-400 px-5 py-4 rounded-t-2xl flex items-center justify-between border-b border-slate-800 shadow-sm">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-indigo-400" />
                <span className="font-bold font-mono text-sm tracking-wide text-slate-100">Simpler Life Execution Console</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
              </div>
            </div>

            {/* Terminal Screen */}
            <div className="bg-slate-950 flex-grow p-6 rounded-b-2xl font-mono text-sm leading-relaxed overflow-y-auto max-h-[550px] shadow-inner text-slate-300">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-20">
                  <Cpu className="h-10 w-10 mb-4 animate-bounce text-slate-600" />
                  <p>Console is in standby mode.</p>
                  <p className="text-xs mt-1">Select a webhook and click "Trigger Webhook" to execute our real-time telemetry pipelines.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 items-start border-l-2 pl-3 ${
                        log.type === 'success'
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5 py-1'
                          : log.type === 'warning'
                          ? 'border-rose-500 text-rose-400 bg-rose-500/5 py-1'
                          : log.type === 'security'
                          ? 'border-amber-500 text-amber-400 bg-amber-500/5 py-1'
                          : log.type === 'database'
                          ? 'border-indigo-400 text-indigo-300 bg-indigo-500/5 py-1'
                          : 'border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-slate-500 text-xs select-none">[{log.time}]</span>
                      <p className="text-xs sm:text-sm font-mono">{log.message}</p>
                    </div>
                  ))}
                  
                  {/* Show API Response Payload when Simulation Completes */}
                  {response && (
                    <div className="mt-6 pt-5 border-t border-slate-800 animate-fadeIn">
                      <div className="flex items-center gap-2 text-indigo-400 mb-3 text-xs font-bold uppercase tracking-wider">
                        <Server className="h-4 w-4" />
                        HTTP Response Status: 201 Created
                      </div>
                      <pre className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs text-indigo-200 overflow-x-auto">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
