# StroviaX

StroviaX is a micro-transaction tipping platform built on the XRP Ledger, enabling audiences to support content creators directly and securely with XRP.

---

## 🌟 Features
- 🔐 Xaman (Xumm) Wallet Connect (OAuth2)
- 💸 Send XRP tips directly to creators
- 👤 Dynamic Creator Profiles
- 🌙 Dark Mode Toggle
- ⚙️ Zustand-powered global state
- 🖼️ Clean, modern UI with Tailwind CSS

---

## 📁 Project Structure

```
stroviax/
├── stroviax-frontend/   # React + Vite frontend
└── stroviax-backend/    # Express + Mongoose backend
```

---

## 🚀 Quick Start (Development)

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/stroviax.git
cd stroviax
```

---

### 2. Backend Setup
```bash
cd stroviax-backend
cp .env.example .env
npm install
npm run dev
```

✅ Make sure to update `.env` with your own:
- `MONGO_URI`
- `VITE_XUMM_API_KEY`
- `VITE_XUMM_API_SECRET`

---

### 3. Frontend Setup
```bash
cd stroviax-frontend
npm install
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173)  
The backend will run on [http://localhost:4000](http://localhost:4000)

---

## 🛡️ Environment Variables

Create a `.env` file in each directory (`stroviax-backend` and `stroviax-frontend`) using `.env.example` as your guide.

---

## 📦 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Zustand
- **Backend**: Express.js, Mongoose, Xumm SDK
- **Auth**: Xaman OAuth2
- **Database**: MongoDB Atlas
- **Blockchain**: XRP Ledger

---

## 📝 License

ISC © OmniSphere Solutions LLC
