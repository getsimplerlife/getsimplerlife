import React from 'react';
import IndustryLanding from '../../components/IndustryLanding';
import type { IndustryConfig } from '../../components/IndustryLanding';

const config: IndustryConfig = {
  id: 'real-estate',
  name: 'Real Estate',
  icon: '🏠',
  color: 'blue-600',
  bgLight: 'bg-blue-50',
  tagline: 'Capture leads faster, close deals sooner',
  hook: 'Speed-to-lead is everything in real estate. Automate lead response, showing coordination, and contract workflows — and never lose a buyer to a faster agent again.',
  painPoints: [
    'Leads go cold within 5 minutes when no automated response exists',
    'Showing coordination requires 6+ back-and-forth messages per appointment',
    'Contract workflows are manual, error-prone, and delay closing',
    'Lead nurturing stops after the first week — no systematic follow-up',
    'Listing data entry into MLS and CRM is duplicated across systems',
    'Commission tracking and disbursement is a spreadsheet nightmare'
  ],
  quickScanFeatures: [
    'Lead response time & conversion audit',
    'Showing coordination workflow analysis',
    'Contract process efficiency assessment',
    '24-hour executive summary with risk score'
  ],
  deepAuditFeatures: [
    'Full sales pipeline & conversion audit',
    'Lead response automation opportunity map',
    'Showing coordination bottleneck analysis',
    'Contract workflow optimization plan',
    'Custom automation roadmap with ROI projections'
  ],
  kpiOne: { value: '45 sec', label: 'Lead response time achieved' },
  kpiTwo: { value: '3.4x', label: 'More leads converted' },
  kpiThree: { value: '22 hrs', label: 'Saved per agent weekly' },
};

export default function RealEstate() {
  return <IndustryLanding config={config} />;
}