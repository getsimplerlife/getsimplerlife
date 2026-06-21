export interface ContractInput {
  contractTitle: string;
  contractText: string;
}

export interface ContractAnomaly {
  clause: string;
  finding: string;
  severity: 'Severe' | 'Moderate' | 'Low';
  recommendation: string;
}

export interface ContractReviewResult {
  success: boolean;
  healthScore: number; // 0-100 scale
  riskLevel: 'Low' | 'Medium' | 'High';
  anomalies: ContractAnomaly[];
  criticalClauses: Record<string, string>;
  scannerLog: string;
}

export const scanContractText = (input: ContractInput): ContractReviewResult => {
  const { contractTitle, contractText } = input;
  
  const text = contractText.toLowerCase();
  const anomalies: ContractAnomaly[] = [];
  const criticalClauses: Record<string, string> = {};
  
  let healthScore = 100;

  // 1. Identify governing law
  if (text.includes('governing law') || text.includes('jurisdiction')) {
    if (text.includes('new york') || text.includes('delaware') || text.includes('california')) {
      criticalClauses['Governing Law'] = 'Standard regulatory state jurisdiction identified.';
    } else {
      criticalClauses['Governing Law'] = 'Non-standard state jurisdiction identified.';
      anomalies.push({
        clause: 'Governing Law / Jurisdiction',
        finding: 'Governing law is set to a non-standard jurisdiction (outside NY/DE/CA).',
        severity: 'Low',
        recommendation: 'Ensure your legal team is comfortable litigating in this jurisdiction if a dispute arises.'
      });
      healthScore -= 5;
    }
  } else {
    criticalClauses['Governing Law'] = 'Missing standard governing law provisions.';
    anomalies.push({
      clause: 'Governing Law',
      finding: 'No governing law or jurisdiction provision found.',
      severity: 'Moderate',
      recommendation: 'Add a standard Governing Law clause (e.g., State of Delaware) to prevent disputes over trial venues.'
    });
    healthScore -= 15;
  }

  // 2. Identify termination clause
  if (text.includes('terminate') || text.includes('termination')) {
    if (text.includes('convenience') && (text.includes('90 days') || text.includes('120 days') || text.includes('90-day'))) {
      anomalies.push({
        clause: 'Termination for Convenience Notice',
        finding: 'Unusually long termination for convenience notice period (>60 days) detected.',
        severity: 'Moderate',
        recommendation: 'Negotiate this down to 30 or 60 days to maintain organizational agility.'
      });
      healthScore -= 10;
    }
    criticalClauses['Termination Provisions'] = 'Termination conditions are explicitly defined.';
  } else {
    criticalClauses['Termination Provisions'] = 'Missing explicit termination conditions.';
    anomalies.push({
      clause: 'Termination',
      finding: 'No explicit termination provisions detected.',
      severity: 'Severe',
      recommendation: 'Add standard termination terms for material breach and convenience with 30 days written notice.'
    });
    healthScore -= 25;
  }

  // 3. Indemnification & Limitation of Liability
  if (text.includes('indemnity') || text.includes('indemnify') || text.includes('indemnification')) {
    criticalClauses['Indemnification'] = 'Indemnification structure is present.';
    if (!text.includes('limitation of liability') && !text.includes('limit of liability')) {
      anomalies.push({
        clause: 'Limitation of Liability',
        finding: 'Indemnification is present but there is no overarching Limitation of Liability cap.',
        severity: 'Severe',
        recommendation: 'Crucial exposure risk. Insert a reciprocal Limitation of Liability clause capping damages to fees paid in the trailing 12 months.'
      });
      healthScore -= 30;
    }
  } else {
    criticalClauses['Indemnification'] = 'No indemnification terms found.';
  }

  if (text.includes('limitation of liability') || text.includes('limit of liability')) {
    criticalClauses['Limitation of Liability'] = 'Limitation of liability is present.';
  }

  // 4. Assign overall Risk Level
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (healthScore < 60) {
    riskLevel = 'High';
  } else if (healthScore < 85) {
    riskLevel = 'Medium';
  }

  return {
    success: true,
    healthScore,
    riskLevel,
    anomalies,
    criticalClauses,
    scannerLog: `[Contract Scanner API] Scanned: ${contractTitle}. Identified ${anomalies.length} potential legal anomalies. Calculated Contract Health Score: ${healthScore}/100 (Risk: ${riskLevel}).`
  };
};
