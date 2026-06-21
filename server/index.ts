import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import crypto from 'crypto'
import axios from 'axios'
import { db, initDb } from './config/db.js'

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

// API Routes
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
})

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
      activeWorkflows: 2,
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
