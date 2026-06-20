import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path in the project root
const dbPath = path.resolve(__dirname, "../../operational.db");

export const db = createClient({
  url: `file:${dbPath}`
});

export const initDb = async () => {
  console.log(`[Database] Initializing operational database at file:${dbPath}...`);
  try {
    // Table for logging and tracking leads
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

    // Table for storing operational KPI metrics
    await db.execute(`
      CREATE TABLE IF NOT EXISTS kpi_metrics (
        metric_key TEXT PRIMARY KEY,
        value REAL NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
