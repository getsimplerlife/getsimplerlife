import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function runTest() {
  console.log("=== STARTING BACKEND REST API TEST ===");

  // 1. Submit a series of mock leads to /api/leads
  const mockLeads = [
    {
      name: "John Service",
      email: "john@servicecompany.com",
      phone: "+15552345678",
      company: "Apex HVAC Services",
      needs: ["Lead Routing", "CRM Database Sync"],
      message: "We need our dispatch requests logged instantly to Notion."
    },
    {
      name: "Mary Realtor",
      email: "mary@homesell.net",
      phone: "+15558765432",
      company: "Apex Real Estate",
      needs: ["Calendar Scheduling"],
      message: "Please integrate our Cal.com calendar with client reminders."
    },
    {
      name: "Clinic Ingestion",
      email: "billing@dentrix.org",
      phone: "+15559876543",
      company: "Bright Smiles Practice",
      needs: ["AI Email Responses"],
      message: "Can you automate our post-visit review collection?"
    }
  ];

  console.log("\n--- Submitting Mock Leads ---");
  for (const lead of mockLeads) {
    try {
      console.log(`Submitting lead for: ${lead.name} (${lead.email})...`);
      const res = await axios.post(`${BASE_URL}/api/leads`, lead);
      console.log(`Success! Status: ${res.status}. LeadId: ${res.data.leadId}`);
    } catch (err: any) {
      console.error(`Failed to submit lead for ${lead.name}:`, err.response?.data || err.message);
    }
  }

  // 2. Try fetching metrics without a JWT token (should fail)
  console.log("\n--- Fetching KPI Metrics WITHOUT JWT ---");
  try {
    const res = await axios.get(`${BASE_URL}/api/metrics`);
    console.log("Error: Expected 401 Unauthorized, but got:", res.data);
  } catch (err: any) {
    console.log(`Expected failure received: Status ${err.response?.status} (${err.response?.data?.error || err.message})`);
  }

  // 3. Fetch a JWT Token from /api/auth/token
  console.log("\n--- Requesting JWT Auth Token ---");
  let token = "";
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/token`);
    token = res.data.token;
    console.log(`Successfully generated token: ${token.substring(0, 30)}...`);
  } catch (err: any) {
    console.error("Failed to generate JWT token:", err.message);
    return;
  }

  // 4. Fetch KPI metrics WITH JWT token (should succeed and reflect database aggregates)
  console.log("\n--- Fetching KPI Metrics WITH JWT ---");
  try {
    const res = await axios.get(`${BASE_URL}/api/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Successfully retrieved KPI Metrics:", JSON.stringify(res.data, null, 2));
  } catch (err: any) {
    console.error("Failed to fetch KPI Metrics:", err.response?.data || err.message);
  }

  console.log("\n=== BACKEND REST API TEST COMPLETE ===");
}

runTest().catch(err => {
  console.error("Test execution failed:", err);
});
