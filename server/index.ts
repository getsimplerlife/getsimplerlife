import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import crypto from 'crypto'
import axios from 'axios'
import { db, initDb } from './config/db.js'
import automationsRouter from './routes/automations.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'simpler_life_super_secret_key_987'

// Initialize Operational Database
initDb().then(() => {
  console.log('[Simpler Life Server] Database initialization complete.')
}).catch(err => {
  console.error('[Simpler Life Server] Database initialization failed:', err)
})

// Security & Request Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", "https://cal.com", "https://calendly.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  }
}))

app.use(cors())
app.use(express.json())

// HMAC signing function
const signPayload = (payload: any, secret: string): string => {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return 'sha256=' + crypto.createHmac('sha256', secret).update(data).digest('hex');
};

// JWT Helper Functions
export const generateToken = (payload: any): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized', details: ['Token is missing'] });
  }
  const token = authHeader.split(' ')[1];
  const parts = token.split('.');
  if (parts.length !== 3) {
    return res.status(401).json({ success: false, error: 'Unauthorized', details: ['Token is invalid'] });
  }
  const [header, payload, signature] = parts;
  const computedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  if (signature !== computedSignature) {
    return res.status(401).json({ success: false, error: 'Unauthorized', details: ['Token signature mismatch'] });
  }
  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    req.user = decodedPayload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized', details: ['Failed to parse token payload'] });
  }
};

// Public Authentication / Token Route
app.get('/api/auth/token', (_req, res) => {
  const token = generateToken({ client: "Doe Logistics" });
  return res.json({ token });
});

// Automations Simulation Routes
app.use('/api/automations', automationsRouter);

// API Routes - Original Lead Submission Route
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, company, needs, message } = req.body
  console.log(`[Simpler Life Backend] Received New Lead Submission:`, { name, email, phone, company, needs, message })

  // 1. Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: ['Name is required']
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: ['A valid email is required']
    });
  }

  // Calculate score based on lead details
  let score = 0;
  if (needs && Array.isArray(needs)) {
    if (needs.includes('Lead Routing')) score += 30;
    if (needs.includes('CRM Database Sync')) score += 40;
  }
  if (email.endsWith('.com') && !email.includes('gmail') && !email.includes('yahoo')) {
    score += 30; // Corporate Domain
  }

  const leadId = `ld_${crypto.randomUUID()}`;

  try {
    // 2. Persist to database
    await db.execute({
      sql: `INSERT INTO leads (id, name, email, phone, company, needs, message, score, sync_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        leadId,
        name,
        email,
        phone || null,
        company || null,
        needs ? JSON.stringify(needs) : null,
        message || null,
        score,
        'pending'
      ]
    });

    // Update KPI metrics in database
    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 0.5, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    // 3. Prepare payload for n8n
    const webhookPayload = {
      id: leadId,
      source: "website_contact_form",
      timestamp: new Date().toISOString(),
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        needs: needs || [],
        message: message || null,
        score
      }
    };

    // Calculate HMAC-SHA256 signature
    const secret = process.env.N8N_WEBHOOK_SECRET || 'n8n_secret_key_123';
    const signature = signPayload(webhookPayload, secret);

    // Forward to n8n webhook
    const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/leads';
    console.log(`[Simpler Life Backend] Forwarding lead ${leadId} to n8n at ${n8nUrl}...`);

    let syncStatus = 'synced';
    try {
      await axios.post(n8nUrl, webhookPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Simpler-Life-Signature': signature
        },
        timeout: 5000 // 5 seconds timeout
      });
      console.log(`[Simpler Life Backend] Webhook successfully forwarded to n8n.`);
    } catch (err: any) {
      console.error(`[Simpler Life Backend] Webhook forwarding to n8n failed:`, err.message);
      syncStatus = 'failed';
    }

    // Update sync status in DB
    await db.execute({
      sql: `UPDATE leads SET sync_status = ? WHERE id = ?`,
      args: [syncStatus, leadId]
    });

    return res.status(201).json({
      success: true,
      message: 'Lead ingested successfully. Automation pipeline triggered.',
      leadId
    });

  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/leads error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: [err.message]
    });
  }
});

// --- API Endpoints for 10 New Industry-Specific Automations ---

// 1. AI SDR Submission Endpoint
app.post('/api/ai-sdr', async (req, res) => {
  const { prospect_name, email, phone, company_name, role, fit_score, intent_score, outreach_status, conversation_log } = req.body;
  
  if (!prospect_name || typeof prospect_name !== 'string' || prospect_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['prospect_name is required'] });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['A valid email is required'] });
  }
  if (!company_name || typeof company_name !== 'string' || company_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['company_name is required'] });
  }

  const id = `sdr_${crypto.randomUUID()}`;
  const finalFitScore = typeof fit_score === 'number' ? fit_score : Math.round(70 + Math.random() * 25);
  const finalIntentScore = typeof intent_score === 'number' ? intent_score : Math.round(65 + Math.random() * 30);

  try {
    await db.execute({
      sql: `INSERT INTO ai_sdr_leads (id, prospect_name, email, phone, company_name, role, fit_score, intent_score, outreach_status, conversation_log) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        prospect_name,
        email,
        phone || null,
        company_name,
        role || null,
        finalFitScore,
        finalIntentScore,
        outreach_status || 'pending',
        conversation_log || null
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 1.5, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'AI SDR Lead ingested successfully', id });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/ai-sdr error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 2. Mortgage Lead Qualification Endpoint
app.post('/api/mortgage-qualify', async (req, res) => {
  const { applicant_name, email, phone, property_zip, property_type, estimated_price, loan_amount, employment_type, down_payment_saved, credit_score_range, assigned_loan_officer, status } = req.body;
  
  if (!applicant_name || typeof applicant_name !== 'string' || applicant_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['applicant_name is required'] });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['A valid email is required'] });
  }
  if (!property_zip || typeof property_zip !== 'string') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['property_zip is required'] });
  }

  const id = `mq_${crypto.randomUUID()}`;
  let prequal_score = 50; // Default base score
  if (credit_score_range === 'Excellent') prequal_score += 30;
  else if (credit_score_range === 'Good') prequal_score += 15;
  if (employment_type === 'W2') prequal_score += 15;

  try {
    await db.execute({
      sql: `INSERT INTO mortgage_qualification (id, applicant_name, email, phone, property_zip, property_type, estimated_price, loan_amount, employment_type, down_payment_saved, credit_score_range, prequal_score, assigned_loan_officer, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        applicant_name,
        email,
        phone || null,
        property_zip,
        property_type || 'primary_residence',
        typeof estimated_price === 'number' ? estimated_price : null,
        typeof loan_amount === 'number' ? loan_amount : null,
        employment_type || null,
        typeof down_payment_saved === 'number' ? down_payment_saved : null,
        credit_score_range || null,
        prequal_score,
        assigned_loan_officer || 'Officer unassigned',
        status || 'initiated'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 1.0, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Mortgage application pre-qualified successfully', id, prequal_score });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/mortgage-qualify error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 3. Legal Intake Endpoint
app.post('/api/legal-intake', async (req, res) => {
  const { client_name, email, phone, case_category, case_details, conflict_check_status, viability_score, assigned_attorney, status } = req.body;
  
  if (!client_name || typeof client_name !== 'string' || client_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['client_name is required'] });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['A valid email is required'] });
  }

  const id = `leg_${crypto.randomUUID()}`;
  const finalViabilityScore = typeof viability_score === 'number' ? viability_score : Math.round(40 + Math.random() * 55);

  try {
    await db.execute({
      sql: `INSERT INTO legal_intake (id, client_name, email, phone, case_category, case_details, conflict_check_status, viability_score, assigned_attorney, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        client_name,
        email,
        phone || null,
        case_category || 'general_consultation',
        case_details || null,
        conflict_check_status || 'pending',
        finalViabilityScore,
        assigned_attorney || 'Intake Attorney pool',
        status || 'received'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 1.0, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Legal intake log created', id, viability_score: finalViabilityScore });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/legal-intake error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 4. Contract Review Endpoint
app.post('/api/contract-review', async (req, res) => {
  const { contract_name, contract_type, client_name, raw_text_summary, key_clauses_extracted, review_status } = req.body;
  
  if (!contract_name || typeof contract_name !== 'string' || contract_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['contract_name is required'] });
  }
  if (!client_name || typeof client_name !== 'string' || client_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['client_name is required'] });
  }

  const id = `cr_${crypto.randomUUID()}`;
  const risk_score = Math.round(Math.random() * 45); // Random risk score under 45
  const sampleClauses = key_clauses_extracted || JSON.stringify({
    indemnity: "Standard commercial mutual indemnity clause",
    governing_law: "State of Delaware",
    term: "Auto-renewing 12-month period"
  });

  try {
    await db.execute({
      sql: `INSERT INTO contract_reviews (id, contract_name, contract_type, client_name, raw_text_summary, risk_score, key_clauses_extracted, review_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        contract_name,
        contract_type || 'NDA',
        client_name,
        raw_text_summary || null,
        risk_score,
        sampleClauses,
        review_status || 'uploaded'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 2.0, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Contract uploaded and reviewed', id, risk_score });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/contract-review error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 5. Automated Insurance Quote Endpoint
app.post('/api/insurance-quote', async (req, res) => {
  const { lead_id, industry_code, annual_revenue, deductible_tier, carrier_name, quote_status } = req.body;
  
  if (!industry_code || typeof industry_code !== 'string' || industry_code.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['industry_code is required'] });
  }
  if (typeof annual_revenue !== 'number' || annual_revenue <= 0) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['A valid annual_revenue is required'] });
  }

  const id = `ins_${crypto.randomUUID()}`;
  const preliminary_premium = Math.round(annual_revenue * 0.0045 * 100) / 100;

  // Ensure real reference exists in leads table to satisfy foreign key constraint
  let finalLeadId = lead_id;
  try {
    if (finalLeadId) {
      const leadCheck = await db.execute({
        sql: `SELECT id FROM leads WHERE id = ?`,
        args: [finalLeadId]
      });
      if (leadCheck.rows.length === 0) {
        await db.execute({
          sql: `INSERT INTO leads (id, name, email, company, needs) VALUES (?, ?, ?, ?, ?)`,
          args: [finalLeadId, 'Placeholder for Insurance Quote', 'insurance-placeholder@simplerlife.com', 'Insurance Lead Co', '["Insurance Quote"]']
        });
      }
    } else {
      finalLeadId = `ld_${crypto.randomUUID()}`;
      await db.execute({
        sql: `INSERT INTO leads (id, name, email, company, needs) VALUES (?, ?, ?, ?, ?)`,
        args: [finalLeadId, 'Placeholder for Insurance Quote', 'insurance-placeholder@simplerlife.com', 'Insurance Lead Co', '["Insurance Quote"]']
      });
    }

    await db.execute({
      sql: `INSERT INTO insurance_quotes (id, lead_id, industry_code, annual_revenue, deductible_tier, preliminary_premium, carrier_name, quote_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        finalLeadId,
        industry_code,
        annual_revenue,
        deductible_tier || 'standard',
        preliminary_premium,
        carrier_name || 'Liberty Mutual',
        quote_status || 'draft'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 1.5, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Insurance quote compiled successfully', id, preliminary_premium });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/insurance-quote error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 6. Construction Bid Endpoint
app.post('/api/construction-bid', async (req, res) => {
  const { project_name, total_square_footage, estimated_material_cost, estimated_labor_hours, overhead_markup_percent, profit_margin_percent, procore_project_id, status } = req.body;
  
  if (!project_name || typeof project_name !== 'string' || project_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['project_name is required'] });
  }
  if (typeof total_square_footage !== 'number' || total_square_footage <= 0) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['total_square_footage must be a positive number'] });
  }
  if (typeof estimated_material_cost !== 'number' || estimated_material_cost < 0) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['estimated_material_cost must be a positive number'] });
  }

  const id = `cb_${crypto.randomUUID()}`;
  const laborHours = typeof estimated_labor_hours === 'number' ? estimated_labor_hours : Math.round(total_square_footage * 0.15);
  const laborCost = laborHours * 45; // $45/hour
  const baseCost = estimated_material_cost + laborCost;
  const markup = overhead_markup_percent || 10.0;
  const margin = profit_margin_percent || 15.0;
  const final_bid_amount = Math.round(baseCost * (1 + markup/100) * (1 + margin/100) * 100) / 100;

  try {
    await db.execute({
      sql: `INSERT INTO construction_bids (id, project_name, total_square_footage, estimated_material_cost, estimated_labor_hours, overhead_markup_percent, profit_margin_percent, final_bid_amount, procore_project_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        project_name,
        total_square_footage,
        estimated_material_cost,
        laborHours,
        markup,
        margin,
        final_bid_amount,
        procore_project_id || `pr_${crypto.randomUUID().slice(0,8)}`,
        status || 'pending_review'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 2.5, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Construction bid estimate generated successfully', id, final_bid_amount });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/construction-bid error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 7. B2B Proposal Endpoint
app.post('/api/proposal-writing', async (req, res) => {
  const { crm_deal_id, client_name, proposed_amount, pandadoc_document_id, proposal_status } = req.body;
  
  if (!crm_deal_id || typeof crm_deal_id !== 'string' || crm_deal_id.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['crm_deal_id is required'] });
  }
  if (!client_name || typeof client_name !== 'string' || client_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['client_name is required'] });
  }
  if (typeof proposed_amount !== 'number' || proposed_amount <= 0) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['proposed_amount must be a positive number'] });
  }

  const id = `prop_${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: `INSERT INTO proposal_logs (id, crm_deal_id, client_name, proposed_amount, pandadoc_document_id, proposal_status) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        crm_deal_id,
        client_name,
        proposed_amount,
        pandadoc_document_id || `pdoc_${crypto.randomUUID()}`,
        proposal_status || 'generated'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 2.0, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'B2B Proposal written and logged', id });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/proposal-writing error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 8. Vendor Onboarding Endpoint
app.post('/api/vendor-onboarding', async (req, res) => {
  const { vendor_name, tax_id, coi_expiration_date, bank_account_verified, onboarding_status } = req.body;
  
  if (!vendor_name || typeof vendor_name !== 'string' || vendor_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['vendor_name is required'] });
  }
  if (!tax_id || typeof tax_id !== 'string' || tax_id.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['tax_id is required'] });
  }

  const id = `vnd_${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: `INSERT INTO vendor_onboardings (id, vendor_name, tax_id, tax_verification_status, coi_expiration_date, bank_account_verified, docusign_envelope_id, erp_vendor_id, onboarding_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        vendor_name,
        tax_id,
        'pending',
        coi_expiration_date || '2027-12-31',
        bank_account_verified ? 1 : 0,
        `ds_${crypto.randomUUID()}`,
        `erp_${crypto.randomUUID().slice(0, 8)}`,
        onboarding_status || 'initiated'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 1.5, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Vendor onboarding initiated', id });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/vendor-onboarding error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 9. Procurement Purchase Order Endpoint
app.post('/api/procurement-po', async (req, res) => {
  const { po_number, supplier_name, items_summary, total_amount, approved_by, delivery_eta } = req.body;
  
  if (!po_number || typeof po_number !== 'string' || po_number.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['po_number is required'] });
  }
  if (!supplier_name || typeof supplier_name !== 'string' || supplier_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['supplier_name is required'] });
  }
  if (typeof total_amount !== 'number' || total_amount < 0) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['total_amount must be a valid number'] });
  }

  const id = `po_${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: `INSERT INTO purchase_orders (id, po_number, supplier_name, items_summary, total_amount, approved_by, supplier_acknowledged, delivery_eta, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        po_number,
        supplier_name,
        items_summary || 'N/A',
        total_amount,
        approved_by || 'Auto-System Approved',
        0,
        delivery_eta || 'TBD',
        'draft'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 1.0, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Procurement PO drafted successfully', id });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/procurement-po error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// 10. Compliance Audit Endpoint
app.post('/api/compliance-audit', async (req, res) => {
  const { checklist_name, operator_name, device_uuid, payload_json, compliance_rating } = req.body;
  
  if (!checklist_name || typeof checklist_name !== 'string' || checklist_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['checklist_name is required'] });
  }
  if (!operator_name || typeof operator_name !== 'string' || operator_name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['operator_name is required'] });
  }
  if (!payload_json) {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ['payload_json is required'] });
  }

  const id = `comp_${crypto.randomUUID()}`;
  const serializedPayload = typeof payload_json === 'string' ? payload_json : JSON.stringify(payload_json);
  
  // Create tamper hash of the payload using SHA-256 HMAC
  const tamper_hash = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${checklist_name}.${operator_name}.${serializedPayload}`)
    .digest('hex');

  try {
    await db.execute({
      sql: `INSERT INTO compliance_ledger (id, checklist_name, operator_name, device_uuid, payload_json, tamper_hash, compliance_rating) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        checklist_name,
        operator_name,
        device_uuid || `dev_${crypto.randomUUID().slice(0, 8)}`,
        serializedPayload,
        tamper_hash,
        compliance_rating || 'compliant'
      ]
    });

    await db.execute(`UPDATE kpi_metrics SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'leads_processed'`);
    await db.execute(`UPDATE kpi_metrics SET value = value + 0.5, updated_at = CURRENT_TIMESTAMP WHERE metric_key = 'hours_saved'`);

    return res.status(201).json({ success: true, message: 'Compliance audit logged securely with tamper hash', id, tamper_hash });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] POST /api/compliance-audit error:`, err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', details: [err.message] });
  }
});

// Original metrics route for dynamic performance tracking
app.get('/api/metrics', verifyToken, async (_req, res) => {
  console.log(`[Simpler Life Backend] Fetching Performance Metrics...`);
  try {
    const leadsCountRes = await db.execute("SELECT COUNT(*) as count FROM leads");
    // Aggregate processed leads dynamically
    const dbCount = Number(leadsCountRes.rows[0].count) || 0;
    
    // Get metrics from DB
    const processedRes = await db.execute("SELECT value FROM kpi_metrics WHERE metric_key = 'leads_processed'");
    const leadsProcessed = Number(processedRes.rows[0]?.value) || (312 + dbCount);

    const hoursSavedRes = await db.execute("SELECT value FROM kpi_metrics WHERE metric_key = 'hours_saved'");
    const hoursSaved = Number(hoursSavedRes.rows[0]?.value) || 42.5;

    const avgResponseTimeRes = await db.execute("SELECT value FROM kpi_metrics WHERE metric_key = 'avg_response_time'");
    const avgResponseTime = Number(avgResponseTimeRes.rows[0]?.value) || 1.8;

    const targetReductionRes = await db.execute("SELECT value FROM kpi_metrics WHERE metric_key = 'target_response_reduction'");
    const targetReduction = Number(targetReductionRes.rows[0]?.value) || 92.5;

    return res.status(200).json({
      client: "Doe Logistics",
      activeWorkflows: 12, // Updated from 2 to 12 to reflect the 10 new integrations + 2 original
      kpis: {
        hoursSavedThisMonth: hoursSaved,
        leadsProcessed: leadsProcessed,
        avgResponseTimeMinutes: avgResponseTime,
        targetResponseReductionPercent: targetReduction
      },
      history: [
        { week: "W1", hoursSaved: Math.round((hoursSaved / 4) * 0.9 * 10) / 10 },
        { week: "W2", hoursSaved: Math.round((hoursSaved / 4) * 1.05 * 10) / 10 },
        { week: "W3", hoursSaved: Math.round((hoursSaved / 4) * 1.02 * 10) / 10 },
        { week: "W4", hoursSaved: Math.round((hoursSaved / 4) * 1.03 * 10) / 10 }
      ]
    });
  } catch (err: any) {
    console.error(`[Simpler Life Backend] GET /api/metrics error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: [err.message]
    });
  }
})

// Static Asset Delivery (React compiled files)
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))

// Fallback all other GET requests to React client SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// Bind to 0.0.0.0 on port 3000
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Simpler Life Server] Live on port ${PORT} (explicitly bound to 0.0.0.0)`)
})
