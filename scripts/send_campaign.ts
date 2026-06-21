import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error("❌ Error: RESEND_API_KEY is not defined in .env or environment.");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// Default sender (Single Sender Verification must be set up in Resend Console)
// Otherwise, Resend will reject with a 403 unless sending to the owner's email from onboarding@resend.dev
const SENDER_EMAIL = 'onboarding@resend.dev'; 
const TEST_RECIPIENT = 'electric.vortexz@gmail.com';

const campaignLeads = [
  {
    name: 'John Service',
    email: 'john@servicecompany.com',
    company: 'Apex HVAC Services',
    subject: 'Apex HVAC — Recover 15+ hours/week with Asynchronous Automation',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #333;">
        <p>Hi John,</p>
        <p>I hope your week at Apex HVAC Services is going well.</p>
        <p>I noticed you were interested in <strong>Lead Routing</strong> and <strong>CRM Database Sync</strong> automation. These are the two most critical workflows for HVAC companies to eliminate manual dispatch entry and ensure no lead is ever missed.</p>
        <p><strong>The Simpler Life Solution:</strong><br/>
        We build custom, real-time syncs that connect your web leads directly to your CRM (ServiceM8, Jobber, etc.) with instant SMS auto-responses.</p>
        <p><strong>Grand Launch Special:</strong> To celebrate our launch, we are offering <strong>20% off</strong> all setup fees this week.</p>
        <p><strong>Growth Package:</strong> $2,400 setup (Regularly $3,000) / $300/mo.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li><strong>Book your Asynchronous Strategy Audit:</strong> Pick a slot on our delivery queue calendar, and we'll deliver a custom Automation Roadmap & ROI Analysis directly to your inbox: <a href="https://simplerlife.io/book">simplerlife.io/book</a></li>
          <li><strong>Secure your 20% Discount (Growth Package):</strong> <a href="https://buy.stripe.com/aFacN5cMM3uz5xQfJq08g04">Claim Launch Offer</a></li>
        </ol>
        <p>Best,<br/>Carol<br/><strong>Simpler Life</strong></p>
      </div>
    `
  },
  {
    name: 'Mary Realtor',
    email: 'mary@homesell.net',
    company: 'Apex Real Estate',
    subject: 'Apex Real Estate — Automated Showings & Lead Capture',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #333;">
        <p>Hi Mary,</p>
        <p>Thanks for reaching out! I noticed you're looking to automate <strong>Calendar Scheduling</strong> at Apex Real Estate.</p>
        <p>Most agents spend hours on back-and-forth coordination. We automate the entire flow: Buyers book directly from your site, receive instant SMS confirmations, and get reminders at 48h/24h/2h before the showing.</p>
        <p><strong>Grand Launch Special:</strong> Save <strong>20%</strong> on our Growth Package today.</p>
        <p><strong>Growth Package:</strong> $2,400 setup (Regularly $3,000) / $300/mo.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li><strong>Get your Asynchronous Automation Roadmap:</strong> Reserve a delivery slot on our calendar, and we'll send you a full diagnostic report: <a href="https://simplerlife.io/book">simplerlife.io/book</a></li>
          <li><strong>Claim your discount:</strong> <a href="https://buy.stripe.com/aFacN5cMM3uz5xQfJq08g04">Claim Launch Offer</a></li>
        </ol>
        <p>Best,<br/>Carol<br/><strong>Simpler Life</strong></p>
      </div>
    `
  },
  {
    name: 'Clinic Ingestion',
    email: 'billing@dentrix.org',
    company: 'Bright Smiles Practice',
    subject: 'Bright Smiles — AI-Powered Patient Intake & No-Show Reduction',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #333;">
        <p>Hi Team,</p>
        <p>I noticed Bright Smiles Practice is interested in automating patient communications. As a practice using Dentrix, you can save dozens of hours by automating intake and recalls.</p>
        <p><strong>The Simpler Life Solution:</strong><br/>
        • Online booking (syncs with Dentrix)<br/>
        • 3-step SMS reminder sequence (cuts no-shows by 60%)<br/>
        • AI-driven email responses for common patient inquiries.</p>
        <p><strong>Grand Launch Special:</strong> <strong>20% off</strong> our Growth Package.</p>
        <p><strong>Growth Package:</strong> $2,400 setup (Regularly $3,000) / $300/mo.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li><strong>Request an Asynchronous Dental Operations Audit:</strong> <a href="https://simplerlife.io/book">simplerlife.io/book</a></li>
          <li><strong>Secure your setup:</strong> <a href="https://buy.stripe.com/aFacN5cMM3uz5xQfJq08g04">Claim Launch Offer</a></li>
        </ol>
        <p>Best,<br/>Carol<br/><strong>Simpler Life</strong></p>
      </div>
    `
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    company: 'Doe Industries',
    subject: 'Doe Industries — Automate your CRM Sync (20% Launch Discount)',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #333;">
        <p>Hi Jane,</p>
        <p>I see you're looking for <strong>CRM Database Sync</strong> automation at Doe Industries.</p>
        <p>We specialize in connecting your fragmented tools so data flows automatically—eliminating double-entry and human error.</p>
        <p><strong>Grand Launch Special:</strong> Save <strong>20%</strong> on our Starter or Growth packages this week.</p>
        <p><strong>Starter Package:</strong> $1,200 setup (Regularly $1,500) / $150/mo.<br/>
        <strong>Growth Package:</strong> $2,400 setup (Regularly $3,000) / $300/mo.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li><strong>Get an Asynchronous Strategy Audit:</strong> <a href="https://simplerlife.io/book">simplerlife.io/book</a></li>
          <li><strong>Claim Discount (Starter):</strong> <a href="https://buy.stripe.com/dRm3cveUU0in8K21SA08g03">Claim Starter Package</a></li>
          <li><strong>Claim Discount (Growth):</strong> <a href="https://buy.stripe.com/aFacN5cMM3uz5xQfJq08g04">Claim Growth Package</a></li>
        </ol>
        <p>Best,<br/>Carol<br/><strong>Simpler Life</strong></p>
      </div>
    `
  }
];

async function run() {
  const mode = process.argv[2] || 'test';

  if (mode === 'test') {
    console.log(`🚀 Sending single test email to the owner (${TEST_RECIPIENT}) via Resend...`);
    const lead = campaignLeads[0];
    try {
      const data = await resend.emails.send({
        from: `Simpler Life <onboarding@resend.dev>`, // Default sandbox domain
        to: [TEST_RECIPIENT],
        subject: `[TEST] ${lead.subject}`,
        html: lead.html,
      });
      console.log(`✅ Test email successfully sent! Response ID:`, data.data?.id);
      console.log(`\n👉 Once you complete Single Sender Verification for '${SENDER_EMAIL}' on your Resend Dashboard, you can run the full campaign using:`);
      console.log(`   npx tsx scripts/send_campaign.ts launch`);
    } catch (err) {
      console.error(`❌ Error sending test email:`, err);
    }
  } else if (mode === 'launch') {
    console.log(`🔥 Launching full campaign to ${campaignLeads.length} leads using verified sender ${SENDER_EMAIL}...`);
    for (const lead of campaignLeads) {
      try {
        console.log(`Sending to ${lead.name} (${lead.email})...`);
        const data = await resend.emails.send({
          from: `Carol | Simpler Life <${SENDER_EMAIL}>`,
          to: [lead.email],
          subject: lead.subject,
          html: lead.html,
        });
        console.log(`✅ Sent to ${lead.name}! Response ID:`, data.data?.id);
      } catch (err) {
        console.error(`❌ Failed to send to ${lead.name}:`, err);
      }
    }
    console.log(`\n🎉 Campaign sending complete!`);
  }
}

run();
