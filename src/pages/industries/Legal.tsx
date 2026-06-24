import React from 'react';
import IndustryLanding from '../../components/IndustryLanding';
import type { IndustryConfig } from '../../components/IndustryLanding';

const config: IndustryConfig = {
  id: 'legal',
  name: 'Legal',
  icon: '⚖️',
  color: 'violet-600',
  bgLight: 'bg-violet-50',
  tagline: 'Streamline matter management & maximize billable hours',
  hook: 'Stop losing 15+ billable hours a week to admin. Automate matter management, document workflows, and intake — so your firm works faster and bills more.',
  painPoints: [
    'Attorneys spend 30%+ of their week on non-billable administrative tasks',
    'Client intake is manual, slow, and inconsistent across practice areas',
    'Document version control chaos leads to costly errors and missed deadlines',
    'Conflict of interest checks require manual database cross-referencing',
    'Billing leakage from uncaptured time entries erodes profitability',
    'Compliance with court filing deadlines is tracked on spreadsheets'
  ],
  quickScanFeatures: [
    'Billable hour recovery opportunity analysis',
    'Document workflow bottleneck mapping',
    'Matter management efficiency audit',
    '24-hour executive summary with risk score'
  ],
  deepAuditFeatures: [
    'Full practice management workflow audit',
    'Billable hour leakage quantification',
    'Document automation opportunity assessment',
    'Conflict check & intake process redesign',
    'Custom automation roadmap with ROI projections'
  ],
  kpiOne: { value: '12+ hrs', label: 'Billable hours recovered weekly' },
  kpiTwo: { value: '60%', label: 'Faster document turnaround' },
  kpiThree: { value: '99.9%', label: 'Deadline compliance rate' },
};

export default function Legal() {
  return <IndustryLanding config={config} />;
}