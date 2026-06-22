import { Router } from 'express';
import { db } from '../config/db.js';

// Import services
import { qualifyMortgageLead } from '../services/mortgageService.js';
import { generateInsuranceQuote } from '../services/insuranceService.js';
import { processLegalIntake } from '../services/legalIntakeService.js';
import { generateConstructionBid } from '../services/constructionBidService.js';
import { writeSalesProposal } from '../services/proposalWriterService.js';
import { scanContractText } from '../services/contractReviewService.js';
import { onboardVendor } from '../services/vendorOnboardingService.js';
import { matchInvoiceWithPo } from '../services/procurementService.js';
import { generateComplianceAudit } from '../services/complianceService.js';

const router = Router();

/**
 * Endpoint to simulate any of the 10 core automations.
 * Triggers database logging and increments operational KPIs dynamically.
 */
router.post('/simulate/:serviceName', async (req, res) => {
  const { serviceName } = req.params;
  const payload = req.body || {};

  console.log(`[Simpler Life Server] POST /api/automations/simulate/${serviceName} with payload:`, payload);

  let result: any = null;
  let hoursSavedIncrement = 0.5; // Default time saved per execution

  try {
    switch (serviceName.toLowerCase()) {
      case 'mortgage':
      case 'mortgage-qualification':
        result = qualifyMortgageLead({
          prospectName: payload.prospectName || 'Jane Miller',
          monthlyIncome: payload.monthlyIncome || 8500,
          monthlyDebt: payload.monthlyDebt || 2400,
          downPayment: payload.downPayment || 50000,
          estimatedCreditScore: payload.estimatedCreditScore || 720,
          propertyValue: payload.propertyValue || 450000
        });
        hoursSavedIncrement = 1.5;
        break;

      case 'insurance':
      case 'insurance-quote':
        result = generateInsuranceQuote({
          companyName: payload.companyName || 'BuildCo Contractors',
          industry: payload.industry || 'Construction',
          employeeCount: payload.employeeCount || 24,
          annualRevenue: payload.annualRevenue || 1800000,
          priorClaimsCount: payload.priorClaimsCount || 0
        });
        hoursSavedIncrement = 2.0;
        break;

      case 'legal-intake':
      case 'legalintake':
        result = processLegalIntake({
          clientName: payload.clientName || 'Alice Cooper',
          matterDescription: payload.matterDescription || 'We are experiencing an urgent business contract dispute where a vendor missed a delivery deadline and we are sued by our client.',
          contactEmail: payload.contactEmail || 'alice@coopertech.com',
          contactPhone: payload.contactPhone || '+1555987654'
        });
        hoursSavedIncrement = 1.0;
        break;

      case 'construction-bid':
      case 'constructionbid':
        result = generateConstructionBid({
          projectName: payload.projectName || 'Downtown Office Renovations',
          sqft: payload.sqft || 3500,
          projectType: payload.projectType || 'Residential Renovation'
        });
        hoursSavedIncrement = 3.0;
        break;

      case 'proposal-writer':
      case 'proposalwriter':
        result = writeSalesProposal({
          clientCompany: payload.clientCompany || 'TechVanguard LLC',
          scopeNeeds: payload.scopeNeeds || ['Lead Qualification Funnels', 'Compliance Audit Trails', 'Three-Way Invoice Matching'],
          budget: payload.budget || 5000
        });
        hoursSavedIncrement = 2.5;
        break;

      case 'contract-review':
      case 'contractreview':
        result = scanContractText({
          contractTitle: payload.contractTitle || 'Vendor Service SLA Draft v1',
          contractText: payload.contractText || 'This agreement is governed by the laws of state of Delaware. Either party can terminate for convenience with 90 days written notice. Indemnification is provided reciprocal. Limitation of Liability is missing.'
        });
        hoursSavedIncrement = 1.5;
        break;

      case 'vendor-onboarding':
      case 'vendoronboarding':
        result = onboardVendor({
          vendorName: payload.vendorName || 'Summit Steel Suppliers',
          ein: payload.ein || '12-3456789',
          hasInsuranceCertificate: payload.hasInsuranceCertificate !== undefined ? payload.hasInsuranceCertificate : true,
          registeredState: payload.registeredState || 'TX'
        });
        hoursSavedIncrement = 1.0;
        break;

      case 'procurement':
      case 'invoice-matching':
        result = matchInvoiceWithPo({
          invoiceId: payload.invoiceId || 'INV-90210',
          poId: payload.poId || 'PO-45600',
          invoiceItems: payload.invoiceItems || [
            { sku: 'STEEL-01', description: 'Grade A Structural Steel Beams', quantity: 15, unitPrice: 250 },
            { sku: 'BOLT-05', description: 'Heavy Hex Bolts 5-inch', quantity: 200, unitPrice: 1.50 }
          ],
          poItems: payload.poItems || [
            { sku: 'STEEL-01', description: 'Grade A Structural Steel Beams', quantity: 15, unitPrice: 250 },
            { sku: 'BOLT-05', description: 'Heavy Hex Bolts 5-inch', quantity: 200, unitPrice: 1.50 }
          ]
        });
        hoursSavedIncrement = 1.2;
        break;

      case 'compliance':
      case 'audit-ledger':
        result = generateComplianceAudit({
          actionType: payload.actionType || 'PII Data Encryption Trigger',
          performedBy: payload.performedBy || 'System Integrator Admin',
          details: payload.details || 'User authorized trigger to migrate and securely index PII credentials to on-rest database vaults.',
          framework: payload.framework || 'SOC2'
        });
        hoursSavedIncrement = 0.8;
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid Service Name',
          details: [`Service '${serviceName}' is not recognized. Choose from: mortgage, insurance, legal-intake, construction-bid, proposal-writer, contract-review, vendor-onboarding, procurement, compliance.`]
        });
    }

    // Integrate with operational database metrics
    try {
      // 1. Increment total leads processed
      await db.execute(`
        UPDATE kpi_metrics 
        SET value = value + 1, updated_at = CURRENT_TIMESTAMP 
        WHERE metric_key = 'leads_processed'
      `);
      
      // 2. Increment cumulative admin hours saved
      await db.execute({
        sql: `UPDATE kpi_metrics 
              SET value = value + ?, updated_at = CURRENT_TIMESTAMP 
              WHERE metric_key = 'hours_saved'`,
        args: [hoursSavedIncrement]
      });

      console.log(`[Simpler Life Server] Database KPI counters successfully incremented in SQLite. (+1 processed, +${hoursSavedIncrement} hrs saved)`);
    } catch (dbErr: any) {
      console.error('[Simpler Life Server] Failed to update SQLite KPI metrics:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      service: serviceName,
      hoursSavedCalculated: hoursSavedIncrement,
      result
    });

  } catch (err: any) {
    console.error(`[Simpler Life Server] Simulation error on service '${serviceName}':`, err);
    return res.status(500).json({
      success: false,
      error: 'Simulation Execution Error',
      details: [err.message]
    });
  }
});

export default router;
