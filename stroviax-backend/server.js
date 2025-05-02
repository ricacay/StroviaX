import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { XummSdk } from 'xumm-sdk';
import Tip from './models/tipModel.js'; // import the Tip model

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Xumm SDK
const xumm = new XummSdk(
  process.env.VITE_XUMM_API_KEY,
  process.env.VITE_XUMM_API_SECRET
);

// Health check
app.get('/', (req, res) => {
  res.send('✅ StroviaX Backend Server is running');
});

// Create XRP tip payload (via Xumm)
app.post('/create-tip-payload', async (req, res) => {
  try {
    const { destination, amount, memo } = req.body;

    if (!destination || !amount) {
      return res.status(400).json({ error: 'Missing destination or amount' });
    }

    const payload = {
      TransactionType: 'Payment',
      Destination: destination,
      Amount: amount,
      Memos: memo
        ? [
            {
              Memo: {
                MemoData: Buffer.from(memo, 'utf8').toString('hex').toUpperCase(),
              },
            },
          ]
        : undefined,
    };

    const createdPayload = await xumm.payload.create(payload);

    res.json({
      uuid: createdPayload.uuid,
      next: createdPayload.next.always,
    });
  } catch (error) {
    console.error('Error creating payload:', error);
    res.status(500).json({ error: 'Failed to create payload' });
  }
});

// Xumm OAuth2 login
app.get('/auth', (req, res) => {
  try {
    const clientId = process.env.VITE_XUMM_API_KEY;
    const redirectUri = encodeURIComponent('http://localhost:5173/');
    const scope = 'Identity';
    const responseType = 'code';

    const authUrl = `https://oauth2.xumm.app/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    res.json({ authUrl });
  } catch (error) {
    console.error('Auth route error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// OAuth2 callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).send('Missing OAuth2 code');

  try {
    const result = await xumm.oauth2Userdata(code);
    console.log('✅ Logged in user:', result);
    res.redirect('http://localhost:5173');
  } catch (error) {
    console.error('OAuth2 callback error:', error);
    res.status(500).send('OAuth2 login failed');
  }
});

// ✅ Save tip to MongoDB
app.post('/api/tip', async (req, res) => {
  const { sender, recipient, amount, memo, timestamp } = req.body;

  if (!sender || !recipient || !amount || !timestamp) {
    return res.status(400).json({ error: 'Missing required tip fields' });
  }

  try {
    const newTip = new Tip({ sender, recipient, amount, memo, timestamp });
    await newTip.save();
    console.log('💾 Tip saved to MongoDB:', newTip);
    res.status(200).json({ message: 'Tip logged successfully' });
  } catch (err) {
    console.error('❌ Error saving tip:', err);
    res.status(500).json({ error: 'Failed to save tip' });
  }
});

// Optional: Get all tips
app.get('/api/tips', async (req, res) => {
  try {
    const tips = await Tip.find().sort({ timestamp: -1 }).limit(50);
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 StroviaX Backend Server running at http://localhost:${PORT}`);
});
