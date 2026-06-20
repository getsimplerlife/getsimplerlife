import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

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

// API Routes
app.post('/api/leads', (req, res) => {
  const { name, email, phone, company, needs, message } = req.body
  console.log(`[AutoFlow Backend] Received New Lead Submission:`, { name, email, phone, company, needs, message })

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: ['name is required', 'email is required']
    })
  }

  // Generate a mock unique lead ID
  const leadId = `ld_${Math.random().toString(36).substring(2, 11)}`

  return res.status(201).json({
    success: true,
    message: 'Lead ingested successfully. Mock pipeline triggered.',
    leadId
  })
})

app.get('/api/metrics', (req, res) => {
  console.log(`[AutoFlow Backend] Fetching Performance Metrics...`)
  return res.status(200).json({
    client: "Doe Logistics",
    activeWorkflows: 2,
    kpis: {
      hoursSavedThisMonth: 42.5,
      leadsProcessed: 312,
      avgResponseTimeMinutes: 1.8,
      targetResponseReductionPercent: 92.5
    },
    history: [
      { week: "W1", hoursSaved: 9.5 },
      { week: "W2", hoursSaved: 11.2 },
      { week: "W3", hoursSaved: 10.8 },
      { week: "W4", hoursSaved: 11.0 }
    ]
  })
})

// Static Asset Delivery (React compiled files)
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))

// Fallback all other GET requests to React client SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// Bind to 0.0.0.0 on port 3000
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[AutoFlow Express Server] Live on port ${PORT} (explicitly bound to 0.0.0.0)`)
})
