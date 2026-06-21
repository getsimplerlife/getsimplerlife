import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook/leads', (req, res) => {
  console.log('[Mock Webhook Server] Received lead sync payload:', req.body);
  res.status(200).json({ success: true, message: 'Lead synced successfully to automation workflow' });
});

const PORT = 5678;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Mock Webhook Server] Running on port ${PORT} - Listening for lead webhooks...`);
});
