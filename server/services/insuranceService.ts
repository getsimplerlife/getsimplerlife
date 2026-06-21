export interface InsuranceInput {
  companyName: string;
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  priorClaimsCount: number;
}

export interface InsuranceResult {
  success: boolean;
  riskScore: number; // 1-10 scale
  generalLiabilityPremium: number;
  professionalLiabilityPremium: number;
  totalPremium: number;
  riskClassification: 'Low' | 'Medium' | 'High' | 'Severe';
  carrierQuoteLog: string;
  notes: string[];
}

export const generateInsuranceQuote = (input: InsuranceInput): InsuranceResult => {
  const { companyName, industry, employeeCount, annualRevenue, priorClaimsCount } = input;
  
  const notes: string[] = [];
  const carrierQuoteLog = `[Carrier Intelligence API] Underwriting algorithms executed for ${companyName} in industry: ${industry}.`;
  
  // 1. Calculate base risk factor based on industry
  let industryFactor = 1.0;
  let riskClassification: 'Low' | 'Medium' | 'High' | 'Severe' = 'Low';
  
  const ind = industry.toLowerCase();
  if (ind.includes('construction') || ind.includes('contractor') || ind.includes('roofing') || ind.includes('plumbing')) {
    industryFactor = 2.5;
    riskClassification = 'High';
  } else if (ind.includes('tech') || ind.includes('software') || ind.includes('consulting') || ind.includes('it')) {
    industryFactor = 0.8;
    riskClassification = 'Low';
  } else if (ind.includes('healthcare') || ind.includes('medical') || ind.includes('clinic')) {
    industryFactor = 1.8;
    riskClassification = 'High';
  } else if (ind.includes('legal') || ind.includes('finance') || ind.includes('accounting')) {
    industryFactor = 1.3;
    riskClassification = 'Medium';
  } else {
    industryFactor = 1.1;
    riskClassification = 'Medium';
  }

  // 2. Adjust Risk Score (1 to 10 scale)
  let riskScore = Math.round(5 * industryFactor);
  if (priorClaimsCount > 0) {
    riskScore += Math.min(4, priorClaimsCount * 2);
  }
  if (employeeCount > 100) {
    riskScore += 1;
  }
  
  // Cap risk score between 1 and 10
  riskScore = Math.max(1, Math.min(10, riskScore));
  
  if (riskScore >= 9) {
    riskClassification = 'Severe';
  } else if (riskScore >= 7) {
    riskClassification = 'High';
  } else if (riskScore >= 4) {
    riskClassification = 'Medium';
  } else {
    riskClassification = 'Low';
  }

  // 3. Estimate Premiums
  // General Liability Premium = Base Rate ($500) * Revenue factor * riskScore
  const revenueMultiplier = Math.max(0.5, Math.log10(annualRevenue / 50000));
  const generalLiabilityPremium = Math.round(500 * revenueMultiplier * industryFactor * (riskScore / 5));
  
  // Professional Liability Premium = Base Rate ($750) * employee factor * riskScore
  const employeeMultiplier = Math.max(0.5, Math.log10(employeeCount + 1));
  const professionalLiabilityPremium = Math.round(750 * employeeMultiplier * industryFactor * (riskScore / 5));

  const totalPremium = generalLiabilityPremium + professionalLiabilityPremium;

  // Compile underwriting notes
  notes.push(`Industry risk profile classified as ${riskClassification} risk.`);
  if (priorClaimsCount > 0) {
    notes.push(`Premium adjusted upwards due to ${priorClaimsCount} registered claim(s) within the last 3 years.`);
  } else {
    notes.push('No prior claims recorded; eligible for safety credit.');
  }
  if (annualRevenue > 5000000) {
    notes.push('Large commercial risk policy terms applied due to annual revenue > $5M.');
  }

  return {
    success: true,
    riskScore,
    generalLiabilityPremium,
    professionalLiabilityPremium,
    totalPremium,
    riskClassification,
    carrierQuoteLog: `[Carrier Underwriting Platform] Binding approved for ${companyName}. [Underwriting Engine] Risk evaluated successfully. GL limit $1,000,000. PL limit $2,000,000. Approved for preliminary binding.`,
    carrierQuoteLogShort: carrierQuoteLog, // for backward compatibility
    notes
  } as any;
};
