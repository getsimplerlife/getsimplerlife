import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path in the project root
const dbPath = path.resolve(__dirname, "../../operational.db");

export const db = createClient({
  url: process.env.DATABASE_URL || `file:${dbPath}`,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

export const initDb = async () => {
  console.log(`[Database] Initializing operational database at file:${dbPath}...`);
  try {
    // 1. Table for logging and tracking leads
    await db.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        needs TEXT,
        message TEXT,
        sync_status TEXT DEFAULT 'pending',
        score INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Table for storing operational KPI metrics
    await db.execute(`
      CREATE TABLE IF NOT EXISTS kpi_metrics (
        metric_key TEXT PRIMARY KEY,
        value REAL NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Schema Updates for all 10 Industry-Specific Automations ---

    // 4. Mortgage Qualification Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mortgage_qualification (
        id TEXT PRIMARY KEY,
        applicant_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        property_zip TEXT,
        property_type TEXT,
        estimated_price REAL,
        loan_amount REAL,
        employment_type TEXT,
        down_payment_saved REAL,
        credit_score_range TEXT,
        prequal_score INTEGER DEFAULT 0,
        assigned_loan_officer TEXT,
        status TEXT DEFAULT 'initiated',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Legal Intake Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS legal_intake (
        id TEXT PRIMARY KEY,
        client_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        case_category TEXT,
        case_details TEXT,
        conflict_check_status TEXT DEFAULT 'pending',
        viability_score INTEGER DEFAULT 0,
        assigned_attorney TEXT,
        status TEXT DEFAULT 'received',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Contract Reviews Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contract_reviews (
        id TEXT PRIMARY KEY,
        contract_name TEXT NOT NULL,
        contract_type TEXT,
        client_name TEXT NOT NULL,
        raw_text_summary TEXT,
        risk_score INTEGER DEFAULT 0,
        key_clauses_extracted TEXT,
        review_status TEXT DEFAULT 'uploaded',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Insurance Quotes Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS insurance_quotes (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        industry_code TEXT,
        annual_revenue REAL,
        deductible_tier TEXT,
        preliminary_premium REAL,
        carrier_name TEXT,
        quote_status TEXT DEFAULT 'draft',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(lead_id) REFERENCES leads(id)
      )
    `);

    // 8. Construction Bids Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS construction_bids (
        id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        total_square_footage REAL,
        estimated_material_cost REAL,
        estimated_labor_hours REAL,
        overhead_markup_percent REAL DEFAULT 10.0,
        profit_margin_percent REAL DEFAULT 15.0,
        final_bid_amount REAL,
        procore_project_id TEXT,
        status TEXT DEFAULT 'pending_review',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Proposal Logs Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS proposal_logs (
        id TEXT PRIMARY KEY,
        crm_deal_id TEXT UNIQUE NOT NULL,
        client_name TEXT NOT NULL,
        proposed_amount REAL,
        pandadoc_document_id TEXT,
        proposal_status TEXT DEFAULT 'generated',
        sent_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 10. Vendor Onboardings Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS vendor_onboardings (
        id TEXT PRIMARY KEY,
        vendor_name TEXT NOT NULL,
        tax_id TEXT,
        tax_verification_status TEXT DEFAULT 'pending',
        coi_expiration_date TEXT,
        bank_account_verified INTEGER DEFAULT 0,
        docusign_envelope_id TEXT,
        erp_vendor_id TEXT,
        onboarding_status TEXT DEFAULT 'initiated',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 11. Purchase Orders Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id TEXT PRIMARY KEY,
        po_number TEXT UNIQUE NOT NULL,
        supplier_name TEXT NOT NULL,
        items_summary TEXT,
        total_amount REAL,
        approved_by TEXT,
        supplier_acknowledged INTEGER DEFAULT 0,
        delivery_eta TEXT,
        status TEXT DEFAULT 'draft',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 12. Compliance Ledger Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS compliance_ledger (
        id TEXT PRIMARY KEY,
        checklist_name TEXT NOT NULL,
        operator_name TEXT NOT NULL,
        device_uuid TEXT,
        payload_json TEXT NOT NULL,
        tamper_hash TEXT NOT NULL,
        compliance_rating TEXT DEFAULT 'compliant',
        logged_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default values for KPI metrics if they don't exist
    const defaultMetrics = [
      { key: "hours_saved", val: 42.5 },
      { key: "leads_processed", val: 312 },
      { key: "avg_response_time", val: 1.8 },
      { key: "target_response_reduction", val: 92.5 }
    ];

    for (const metric of defaultMetrics) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO kpi_metrics (metric_key, value) VALUES (?, ?)`,
        args: [metric.key, metric.val]
      });
    }

    console.log("[Database] Schema check and default metrics initialization complete.");
  } catch (err) {
    console.error("[Database] Initialization failed:", err);
    throw err;
  }
};
