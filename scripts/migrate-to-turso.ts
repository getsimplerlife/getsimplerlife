import { createClient } from "@libsql/client";
import { createClient as createWebClient } from "@libsql/client/web";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../operational.db");

async function migrate() {
  const tursoUrl = process.env.DATABASE_URL;
  const tursoAuthToken = process.env.DATABASE_AUTH_TOKEN;

  if (!tursoUrl || !tursoUrl.startsWith("libsql://")) {
    console.error("Error: DATABASE_URL must be a valid Turso URL (libsql://...)");
    process.exit(1);
  }

  if (!tursoAuthToken) {
    console.error("Error: DATABASE_AUTH_TOKEN is required.");
    process.exit(1);
  }

  console.log(`Connecting to local SQLite: file:${dbPath}`);
  const localClient = createClient({ url: `file:${dbPath}` });

  console.log(`Connecting to remote Turso: ${tursoUrl}`);
  const remoteClient = createWebClient({ url: tursoUrl, authToken: tursoAuthToken });

  const tables = [
    "leads",
    "kpi_metrics",
    "ai_sdr_leads",
    "mortgage_qualification",
    "legal_intake",
    "contract_reviews",
    "insurance_quotes",
    "construction_bids",
    "proposal_logs",
    "vendor_onboardings",
    "purchase_orders",
    "compliance_ledger"
  ];

  for (const table of tables) {
    console.log(`Migrating table: ${table}...`);
    try {
      const result = await localClient.execute(`SELECT * FROM ${table}`);
      console.log(`Found ${result.rows.length} rows in ${table}.`);

      for (const row of result.rows) {
        const columns = Object.keys(row);
        const placeholders = columns.map(() => "?").join(", ");
        const values = columns.map(col => row[columns.indexOf(col)]); // This might need adjustment based on how result.rows is structured

        // Simplified insert - assumes schema is already created by initDb()
        // Or we can use a more robust way to handle dynamic columns
        
        const columnNames = columns.join(", ");
        await remoteClient.execute({
          sql: `INSERT OR REPLACE INTO ${table} (${columnNames}) VALUES (${placeholders})`,
          args: Object.values(row)
        });
      }
      console.log(`Table ${table} migrated successfully.`);
    } catch (err: any) {
      console.warn(`Warning: Could not migrate table ${table}: ${err.message}`);
    }
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
