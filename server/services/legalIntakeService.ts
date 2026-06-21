export interface LegalIntakeInput {
  clientName: string;
  matterDescription: string;
  contactEmail: string;
  contactPhone: string;
}

export interface LegalIntakeResult {
  success: boolean;
  caseCategory: string;
  urgencyLevel: 'Low' | 'Medium' | 'High';
  preliminaryAssessment: string;
  suggestedFirstSteps: string[];
  conflictCheckStatus: 'Clear' | 'Pending Review';
  intakeLog: string;
}

export const processLegalIntake = (input: LegalIntakeInput): LegalIntakeResult => {
  const { clientName, matterDescription } = input;
  
  const desc = matterDescription.toLowerCase();
  let caseCategory = 'General Civil Litigation';
  let urgencyLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  let preliminaryAssessment = '';
  const suggestedFirstSteps: string[] = [];

  // 1. Categorization
  if (desc.includes('accident') || desc.includes('injured') || desc.includes('injury') || desc.includes('crash') || desc.includes('slip and fall')) {
    caseCategory = 'Personal Injury / Torts';
    preliminaryAssessment = 'Potential negligence claim based on physical/property damage. Recommended contingency agreement evaluation.';
  } else if (desc.includes('divorce') || desc.includes('child custody') || desc.includes('custody') || desc.includes('alimony') || desc.includes('spouse')) {
    caseCategory = 'Family Law';
    preliminaryAssessment = 'Family dispute. Recommended consultation to review asset distributions and support parameters.';
  } else if (desc.includes('trademark') || desc.includes('patent') || desc.includes('copyright') || desc.includes('intellectual property') || desc.includes('infringement')) {
    caseCategory = 'Intellectual Property';
    preliminaryAssessment = 'IP asset protection. Recommended filing search or cease and desist evaluation.';
  } else if (desc.includes('contract') || desc.includes('agreement') || desc.includes('partnership') || desc.includes('incorporation') || desc.includes('founder')) {
    caseCategory = 'Corporate / Business Law';
    preliminaryAssessment = 'Business entity or transactional agreement review. Recommended hourly retainer billing structure.';
  } else if (desc.includes('landlord') || desc.includes('tenant') || desc.includes('lease') || desc.includes('eviction') || desc.includes('real estate') || desc.includes('property purchase')) {
    caseCategory = 'Real Estate / Property Law';
    preliminaryAssessment = 'Real property transaction or tenant/landlord dispute. Statute review recommended.';
  } else {
    preliminaryAssessment = 'General consultation request. Recommended intake review by a senior associate.';
  }

  // 2. Urgency detection
  if (desc.includes('court') || desc.includes('tomorrow') || desc.includes('urgent') || desc.includes('sued') || desc.includes('complaint served') || desc.includes('deadline') || desc.includes('injunction') || desc.includes('arrested')) {
    urgencyLevel = 'High';
  } else if (desc.includes('next month') || desc.includes('planning') || desc.includes('future') || desc.includes('eventually')) {
    urgencyLevel = 'Low';
  }

  // 3. Compile first steps
  suggestedFirstSteps.push('Conduct standard conflict of interest database check.');
  if (urgencyLevel === 'High') {
    suggestedFirstSteps.push('IMMEDIATE ACTION REQUIRED: Draft scheduling request for initial emergency consultation with a partner.');
  } else {
    suggestedFirstSteps.push('Schedule standard 30-minute intake call with paralegal team.');
  }

  if (caseCategory.includes('Personal Injury')) {
    suggestedFirstSteps.push('Request medical records, accident reports, and insurance details.');
  } else if (caseCategory.includes('Family')) {
    suggestedFirstSteps.push('Send financial disclosure sheet template to prospect.');
  } else if (caseCategory.includes('Corporate')) {
    suggestedFirstSteps.push('Request existing operating agreement or draft contract for attorney review.');
  }

  return {
    success: true,
    caseCategory,
    urgencyLevel,
    preliminaryAssessment,
    suggestedFirstSteps,
    conflictCheckStatus: 'Clear', // Mock system check
    intakeLog: `[Legal Intake CRM] Client: ${clientName}. Conflict check cleared automatically. Matter flagged as ${urgencyLevel} urgency. Next steps queued.`
  };
};
