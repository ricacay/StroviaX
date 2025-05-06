# Getting Started

This guide walks through getting StroviaX running locally.

## 1. Clone the Repo
```bash
git clone https://github.com/<your-username>/stroviax.git
cd stroviax
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Set Up Environment Variables
Create a `.env` file and add your Xaman API keys and MongoDB URI.

```bash
VITE_XUMM_API_KEY=your-public-api-key
XUMM_API_SECRET=your-secret
MONGO_URI=mongodb+srv://...
```

## 4. Start the App
```bash
npm run dev
```

Make sure your backend is also running (e.g., `node server.js` from `/stroviax-backend`).

