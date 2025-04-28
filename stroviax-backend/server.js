import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { XummSdk } from 'xumm-sdk';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Xumm SDK
const xumm = new XummSdk(
  process.env.VITE_XUMM_API_KEY,
  process.env.VITE_XUMM_API_SECRET
);

// Health check route
app.get('/', (req, res) => {
  res.send('StroviaX Backend Server Running ✅');
});

// Tip payload creation route (send XRP tips)
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

// ✅ OAuth2 login start route (corrected with response_type=code)
app.get('/auth', (req, res) => {
  try {
    const clientId = process.env.VITE_XUMM_API_KEY;
    const redirectUri = encodeURIComponent('http://localhost:5173/');
    const scope = 'Identity';
    const responseType = 'code'; // Important for proper OAuth2 login

    const authUrl = `https://oauth2.xumm.app/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Auth route error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// OAuth2 callback route (user returns here after Xumm login)
app.get('/callback', async (req, res) => {
  const { state, code } = req.query;

  if (!code) {
    return res.status(400).send('Missing OAuth2 code');
  }

  try {
    const result = await xumm.oauth2Userdata(code);
    console.log('✅ Logged in user:', result);

    // For now, just redirect back to your app
    res.redirect('http://localhost:5173');
  } catch (error) {
    console.error('OAuth2 callback error:', error);
    res.status(500).send('OAuth2 login failed');
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 StroviaX Backend Server running at http://localhost:${PORT}`);
});
