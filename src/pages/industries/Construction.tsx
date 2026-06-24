import React from 'react';
import IndustryLanding from '../../components/IndustryLanding';
import type { IndustryConfig } from '../../components/IndustryLanding';

const config: IndustryConfig = {
  id: 'construction',
  name: 'Construction',
  icon: '🏗️',
  color: 'amber-600',
  bgLight: 'bg-amber-50',
  tagline: 'Protect margins. Win bids. Deliver on time.',
  hook: 'Construction margins live or die on accurate estimates and field reporting. Automate your bid generation, change order tracking, and budget monitoring — and build more profitably.',
  painPoints: [
    'Estimators spend 15-30 hours per week on manual spreadsheet bids',
    'Change orders get lost in email threads, causing scope and budget creep',
    'Field reports are handwritten and entered into systems days late',
    'Material price fluctuations aren\'t tracked against active project budgets',
    'Subcontractor compliance documentation is spread across filing cabinets',
    'Progress billing requires manual data aggregation across job sites'
  ],
  quickScanFeatures: [
    'Field reporting workflow audit',
    'Change order process efficiency analysis',
    'Budget tracking gap assessment',
    '24-hour executive summary with risk score'
  ],
  deepAuditFeatures: [
    'Full project operations audit',
    'Estimation accuracy & bid win-rate analysis',
    'Change order lifecycle assessment',
    'Field-to-office data flow audit',
    'Custom automation roadmap with ROI projections'
  ],
  kpiOne: { value: '20+ hrs', label: 'Saved per estimator weekly' },
  kpiTwo: { value: '35%', label: 'Faster project closeouts' },
  kpiThree: { value: '2.5x', label: 'Bid submission speed increase' },
};

export default function Construction() {
  return <IndustryLanding config={config} />;
}