# PF Sathi 🤝

**Your AI-powered PF Claims Assistant** — Helping Indian workers understand, fix, and resubmit rejected EPFO Provident Fund claims.

## 🎯 Problem

Millions of PF withdrawal/transfer claims get rejected every year due to KYC mismatches, incorrect form details, or employer attestation failures. Workers — often daily wage earners — struggle to understand cryptic rejection codes and don't know how to fix their claims.

## 💡 Solution

PF Sathi is an AI-powered assistant that:
- **Explains** rejection codes in plain language (Hindi & English)
- **Guides** users step-by-step to fix their claims
- **Tracks** claim status with visual timelines
- **Supports** voice input for accessibility
- **Enables** in-app resubmission

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Express.js |
| Styling | Vanilla CSS (Glassmorphism + Dark theme) |
| Voice | Web Speech API |
| AI | Rule-based explainer (extensible to Gemini API) |

## 🚀 Quick Start (Single Unified Server)

### Prerequisites
- Node.js 18+
- npm 9+

### Setup & Run in 1 Command

```bash
# Clone
git clone https://github.com/maittrish/BWMI.git
cd BWMI

# Build frontend and start unified server
npm run build
npm start
```

Open **http://localhost:3001** in your browser. Both the frontend UI and backend API run together on port `3001`.

### Development Mode (Optional)

If you wish to run them separately with hot-reloading:
```bash
# Backend (Port 3001)
npm --prefix backend run dev

# Frontend (Port 5173 with auto-proxy to 3001)
npm --prefix frontend run dev
```

## 📱 Features

- **UAN Lookup** — Enter your UAN to see all claims
- **Claim Dashboard** — Visual overview with status badges
- **AI Chat** — Ask about rejection codes, get plain-language answers
- **Voice Input** — Speak your questions (Web Speech API)
- **Step Guide** — Interactive fix walkthrough
- **Resubmission** — Guided form correction flow

## 👥 Team BWMI

Built for hackathon by Team BWMI.

## 📄 License

MIT
