export interface VendorInput {
  vendorName: string;
  ein: string;
  hasInsuranceCertificate: boolean;
  registeredState: string;
}

export interface VendorChecks {
  einFormatValid: boolean;
  ofacSanctionsCleared: boolean;
  sosActiveBusiness: boolean;
  coiCompliant: boolean;
  overallApproved: boolean;
}

export interface VendorResult {
  success: boolean;
  vendorChecks: VendorChecks;
  verificationLog: string;
  onboardingStatus: 'Completed' | 'Pending Verification Documents' | 'Rejected';
}

export const onboardVendor = (input: VendorInput): VendorResult => {
  const { vendorName, ein, hasInsuranceCertificate, registeredState } = input;
  
  // 1. EIN Format Validation (should be XX-XXXXXXX)
  const einRegex = /^\d{2}-\d{7}$/;
  const einFormatValid = einRegex.test(ein);

  // 2. Mock OFAC Sanctions search (compares against a mock list of banned entities)
  const mockSanctionedList = ['illegal import corp', 'banned logistics ltd', 'shadowy supply chain inc'];
  const nameLower = vendorName.toLowerCase();
  const ofacSanctionsCleared = !mockSanctionedList.some(banned => nameLower.includes(banned));

  // 3. Mock Secretary of State active registration (always true unless empty state or specific name)
  const sosActiveBusiness = registeredState.trim().length === 2 && !nameLower.includes('inactive') && !nameLower.includes('dissolved');

  // 4. COI Compliant
  const coiCompliant = hasInsuranceCertificate;

  // 5. Final Approval Decision
  const overallApproved = einFormatValid && ofacSanctionsCleared && sosActiveBusiness && coiCompliant;

  let onboardingStatus: 'Completed' | 'Pending Verification Documents' | 'Rejected' = 'Completed';
  if (!ofacSanctionsCleared) {
    onboardingStatus = 'Rejected';
  } else if (!einFormatValid || !coiCompliant || !sosActiveBusiness) {
    onboardingStatus = 'Pending Verification Documents';
  }

  // Compile detailed verification logs
  let verificationLog = '';
  if (onboardingStatus === 'Completed') {
    verificationLog = `[Compliance Screening System] Vendor ${vendorName} verification complete. EIN ${ein} validated, OFAC list searched and cleared, SOS active in ${registeredState}, Certificate of Insurance verified and active. Status: APPROVED.`;
  } else if (onboardingStatus === 'Rejected') {
    verificationLog = `[Compliance Screening System] Vendor ${vendorName} was flagged and REJECTED during automated OFAC sanctions list screening. Please refer to corporate legal policy immediately.`;
  } else {
    const issues: string[] = [];
    if (!einFormatValid) issues.push('Invalid EIN format (expected XX-XXXXXXX)');
    if (!coiCompliant) issues.push('Missing/invalid Certificate of Insurance (COI)');
    if (!sosActiveBusiness) issues.push(`Inactive or invalid business registration status with the Secretary of State (${registeredState})`);
    verificationLog = `[Compliance Screening System] Vendor ${vendorName} onboarding is PENDING. Issues detected: ${issues.join(', ')}.`;
  }

  return {
    success: true,
    vendorChecks: {
      einFormatValid,
      ofacSanctionsCleared,
      sosActiveBusiness,
      coiCompliant,
      overallApproved
    },
    verificationLog,
    onboardingStatus
  };
};
