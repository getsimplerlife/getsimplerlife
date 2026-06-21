export interface BidInput {
  projectName: string;
  sqft: number;
  projectType: 'Residential Renovation' | 'Commercial Build' | 'HVAC System Install' | 'Custom Carpentry';
}

export interface BidItem {
  item: string;
  category: 'Material' | 'Labor' | 'Permit/Admin';
  cost: number;
}

export interface BidResult {
  success: boolean;
  materialCost: number;
  laborCost: number;
  contingencyFee: number;
  totalBidAmount: number;
  estimatedDurationDays: number;
  itemizedBreakdown: BidItem[];
  pricingEngineLog: string;
}

export const generateConstructionBid = (input: BidInput): BidResult => {
  const { projectName, sqft, projectType } = input;
  
  let materialRate = 35; // default per sqft
  let laborRate = 45; // default per sqft
  let durationMultiplier = 1.0;

  if (projectType === 'Commercial Build') {
    materialRate = 75;
    laborRate = 85;
    durationMultiplier = 1.8;
  } else if (projectType === 'Residential Renovation') {
    materialRate = 45;
    laborRate = 55;
    durationMultiplier = 1.2;
  } else if (projectType === 'HVAC System Install') {
    materialRate = 90;
    laborRate = 40;
    durationMultiplier = 0.5;
  } else if (projectType === 'Custom Carpentry') {
    materialRate = 60;
    laborRate = 70;
    durationMultiplier = 0.8;
  }

  const materialCost = sqft * materialRate;
  const laborCost = sqft * laborRate;
  const rawSubtotal = materialCost + laborCost;
  const contingencyFee = Math.round(rawSubtotal * 0.15); // 15% standard contingency
  const totalBidAmount = rawSubtotal + contingencyFee;

  const estimatedDurationDays = Math.max(1, Math.round((sqft / 50) * durationMultiplier));

  // Build the itemized breakdown
  const itemizedBreakdown: BidItem[] = [
    {
      item: `${projectType} Materials (Base rate: $${materialRate}/sqft)`,
      category: 'Material',
      cost: materialCost
    },
    {
      item: `${projectType} Skilled Labor (Base rate: $${laborRate}/sqft)`,
      category: 'Labor',
      cost: laborCost
    },
    {
      item: 'Standard Safety & Contingency Buffer (15%)',
      category: 'Permit/Admin',
      cost: contingencyFee
    },
    {
      item: 'Municipal Work Permits & Regulatory Filing',
      category: 'Permit/Admin',
      cost: Math.round(500 * durationMultiplier)
    }
  ];

  const finalTotal = totalBidAmount + Math.round(500 * durationMultiplier);

  return {
    success: true,
    materialCost,
    laborCost,
    contingencyFee,
    totalBidAmount: finalTotal,
    estimatedDurationDays,
    itemizedBreakdown,
    pricingEngineLog: `[Pricing Engine] Successfully generated itemized bid for: ${projectName}. Total: $${finalTotal.toLocaleString()}. Est. duration: ${estimatedDurationDays} business days.`
  };
};
