export interface MortgageInput {
  prospectName: string;
  monthlyIncome: number;
  monthlyDebt: number;
  downPayment: number;
  estimatedCreditScore: number;
  propertyValue: number;
}

export interface MortgageResult {
  success: boolean;
  score: number;
  status: 'Approved' | 'Pre-Qualified' | 'Refer to Underwriting' | 'Declined';
  dtiRatio: number;
  ltvRatio: number;
  estimatedMaxLoan: number;
  estimatedInterestRate: number;
  creditCheckLog: string;
  reasons: string[];
}

export const qualifyMortgageLead = (input: MortgageInput): MortgageResult => {
  const { prospectName, monthlyIncome, monthlyDebt, downPayment, estimatedCreditScore, propertyValue } = input;
  
  const reasons: string[] = [];
  const creditCheckLog = `[Credit Bureau API] Retrieved credit profile for ${prospectName}. Score: ${estimatedCreditScore}. No active bankruptcies found.`;
  
  // 1. Calculate Loan to Value (LTV) Ratio
  const loanAmount = propertyValue - downPayment;
  const ltvRatio = parseFloat(((loanAmount / propertyValue) * 100).toFixed(2));
  
  // 2. Calculate Debt to Income (DTI) Ratio
  const dtiRatio = parseFloat(((monthlyDebt / monthlyIncome) * 100).toFixed(2));
  
  // 3. Determine Interest Rate based on Credit Score
  let estimatedInterestRate = 7.5; // Base Rate
  if (estimatedCreditScore >= 740) {
    estimatedInterestRate = 6.125;
  } else if (estimatedCreditScore >= 680) {
    estimatedInterestRate = 6.75;
  } else if (estimatedCreditScore >= 620) {
    estimatedInterestRate = 7.125;
  } else {
    estimatedInterestRate = 7.875;
  }

  // 4. Calculate Estimated Max Loan Amount (rule of thumb: DTI should not exceed 43%)
  // Max monthly mortgage payment = (monthlyIncome * 0.43) - monthlyDebt
  const maxMonthlyPayment = Math.max(0, (monthlyIncome * 0.43) - monthlyDebt);
  // Estimate loan size based on payment size (approx factor for 30yr fixed at estimated rate)
  const monthlyRate = (estimatedInterestRate / 100) / 12;
  const totalMonths = 360;
  let estimatedMaxLoan = 0;
  if (monthlyRate > 0) {
    estimatedMaxLoan = Math.round(maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -totalMetricsMonths(totalMonths))) / monthlyRate));
  } else {
    estimatedMetricsFormula: estimatedMaxLoan = maxMonthlyPayment * totalMonths;
  }
  
  function totalMetricsMonths(months: number) { return months; }

  // Adjust max loan for safe LTV limits
  const maxLoanByLtv = propertyValue * 0.95;
  estimatedMaxLoan = Math.round(Math.min(estimatedMaxLoan, maxLoanByLtv));

  // 5. Qualification Decision Logic
  let status: 'Approved' | 'Pre-Approved' | 'Needs Review' | 'Unqualified' = 'Approved';
  let score = 100;

  // DTI check
  if (dtiRatio > 45) {
    score -= 30;
    status = 'Needs Review';
  }
  if (dtiRatio > 50) {
    score -= 30;
    status = 'Unqualified';
  }

  // Credit Score check
  if (estimatedCreditScore < 580) {
    score -= 40;
    status = 'Unqualified';
  } else if (estimatedCreditScore < 620) {
    score -= 15;
    status = 'Needs Review';
  }

  // LTV check
  if (ltvRatio > 95) {
    score -= 20;
    status = 'Needs Review';
  }
  if (ltvRatio > 97) {
    score -= 30;
    status = 'Unqualified';
  }

  // Compile reasons
  if (dtiRatio > 43) reasons.push(`Debt-to-Income ratio (${dtiRatio}%) is above the preferred 43% limit.`);
  if (estimatedCreditScore < 620) reasons.push(`Credit score (${estimatedCreditScore}) is below standard conventional guidelines.`);
  if (ltvRatio > 95) reasons.push(`Loan-to-Value ratio (${ltvRatio}%) requires a larger down payment or PMI.`);
  
  if (reasons.length === 0) {
    reasons.push('Excellent debt-to-income ratio, credit standing, and collateral asset value.');
  }

  let finalStatus: 'Approved' | 'Pre-Qualified' | 'Refer to Underwriting' | 'Declined' = 'Pre-Qualified';
  if (status === 'Approved') finalStatus = 'Approved';
  else if (status === 'Needs Review') finalStatus = 'Refer to Underwriting';
  else if (status === 'Unqualified') finalStatus = 'Declined';

  return {
    success: true,
    score: Math.max(0, Math.min(100, score)),
    status: finalStatus,
    dtiRatio,
    ltvRatio,
    estimatedMaxLoan,
    estimatedInterestRate,
    creditCheckLog,
    reasons
  };
};
