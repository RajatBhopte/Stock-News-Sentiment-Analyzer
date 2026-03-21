# 📈 Stock News Sentiment Analyzer — BullBear

A full-stack web application that fetches real-time stock news, analyzes sentiment using AI/NLP, and visualizes trends on an interactive dashboard — helping users understand market mood before making investment decisions.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Auto News Fetching** | Pulls stock-related headlines from Google News RSS every 30 min via cron jobs |
| **AI Sentiment Analysis** | Classifies each headline as *Positive / Negative / Neutral* using the **FinBERT** NLP model (HuggingFace) |
| **AI-Powered Summary** | Generates a concise 3-bullet "BullBear" summary for every stock using **Google Gemini AI** |
| **Price Prediction** | Predicts 24–48 hr stock price direction & range with an AI confidence score |
| **Price vs Sentiment Chart** | Overlays real stock price data (Yahoo Finance) with daily aggregated sentiment scores |
| **Sector Heatmap** | Visual sector-wise market overview with color-coded performance tiles |
| **Live Market Indices** | Scrolling ticker of real-time NIFTY 50, SENSEX, and other Indian index data |
| **Search & Explore** | Search any listed Indian stock and instantly view its dashboard |
| **Dark / Light Mode** | Toggle between dark and light themes |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v5
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI / NLP:** Google Gemini API (`@google/generative-ai`), HuggingFace Inference API (FinBERT)
- **Stock Data:** Yahoo Finance (via `yahoo-finance2`)
- **News Source:** Google News RSS (via `rss-parser`)
- **Scheduling:** `node-cron` (automated data pipeline)
- **Caching:** `node-cache`

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Charts:** Chart.js, Recharts, Lightweight Charts
- **Animations:** Framer Motion
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Icons:** Lucide React, Heroicons

---

## 📋 Prerequisites

Make sure the following are installed on your machine:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | Comes with Node.js | — |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

You will also need accounts (free tier works) on:

1. **MongoDB Atlas** — for the cloud database → [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Google AI Studio** — for the Gemini API key → [aistudio.google.com](https://aistudio.google.com/)
3. **HuggingFace** — for the FinBERT inference API token → [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

## 🔑 API Keys Required

This project uses **3 environment variables** in the backend and **1** in the frontend:

### Backend (`stock-news-analyzer-backend/.env`)

| Variable | What It Is | Where to Get It |
|---|---|---|
| `MONGODB_URL` | MongoDB Atlas connection string | MongoDB Atlas → *Database* → *Connect* → *Drivers* → copy the `mongodb+srv://...` URI |
| `Gemini_API` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/) → *Get API Key* → *Create API key* |
| `HF_TOKEN` | HuggingFace access token | [HuggingFace Tokens](https://huggingface.co/settings/tokens) → *New token* → select **Read** scope |
| `PORT` | Server port (optional, defaults to `5000`) | — |

### Frontend (`stock-news-analyzer-frontend/.env`)

| Variable | What It Is | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RajatBhopte/Stock-News-Sentiment-Analyzer.git
cd Stock-News-Sentiment-Analyzer
```

### 2. Setup the Backend

```bash
# Navigate to backend folder
cd stock-news-analyzer-backend

# Install dependencies
npm install
```

Create a `.env` file in `stock-news-analyzer-backend/` with your own keys:

```env
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/stock-news-analyzer
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Gemini_API=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **⚠️ Important:** Replace the placeholder values above with your actual credentials. Never commit your `.env` file to Git.

### 3. Setup the Frontend

```bash
# Navigate to frontend folder (from project root)
cd stock-news-analyzer-frontend

# Install dependencies
npm install
```

Create a `.env` file in `stock-news-analyzer-frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

---

## ▶️ Running the Project Locally

You need **two terminal windows** — one for the backend and one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd stock-news-analyzer-backend
npm run dev
```

The backend server will start at `http://localhost:5000`. On first startup, it will automatically:
1. Connect to MongoDB Atlas
2. Fetch latest stock news from Google News RSS
3. Run sentiment analysis on new articles using FinBERT
4. Aggregate sentiment scores per stock per day

### Terminal 2 — Start the Frontend

```bash
cd stock-news-analyzer-frontend
npm run dev
```

The frontend will start at `http://localhost:5173` (default Vite port).

### 4. Open in Browser

Navigate to **http://localhost:5173** to see the landing page. Click **"Go to Dashboard"** to explore stock sentiment data.

---

## 📁 Project Structure

```
Stock-News-Sentiment-Analyzer/
├── stock-news-analyzer-backend/
│   ├── src/
│   │   ├── config/          # Database connection config
│   │   ├── controllers/     # Route controllers
│   │   ├── jobs/            # Cron jobs (fetch, sentiment, aggregator)
│   │   ├── models/          # Mongoose schemas (Stock, News, Sentiment)
│   │   ├── routes/          # Express API routes
│   │   ├── scripts/         # Backfill & utility scripts
│   │   ├── services/        # Core business logic (AI, news, sentiment)
│   │   ├── utils/           # Helper utilities
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
├── stock-news-analyzer-frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   │   ├── AIPrediction.jsx
│   │   │   ├── AISummary.jsx
│   │   │   ├── PriceSentimentChart.jsx
│   │   │   ├── SentimentTrendChart.jsx
│   │   │   ├── StockSearch.jsx
│   │   │   ├── StockPriceWidget.jsx
│   │   │   ├── LiveIndicesTicker.jsx
│   │   │   └── ...more
│   │   ├── pages/           # Page-level components
│   │   │   ├── LandingPage.jsx
│   │   │   └── SectorHeatmap.jsx
│   │   ├── services/        # API service layer
│   │   └── App.jsx          # Root component & routing
│   ├── .env                 # Frontend env variables
│   └── package.json
│
└── README.md
```

---

## 🔄 How the Data Pipeline Works

```
Google News RSS  ──►  Fetch & Clean Headlines  ──►  FinBERT Sentiment Analysis
                                                            │
                                                            ▼
  Dashboard  ◄──  Aggregate Per Stock/Day  ◄──  Store in MongoDB
      │
      ├── Sentiment Trend Charts
      ├── Price vs Sentiment Overlay
      ├── AI Summary (Gemini)
      └── AI Price Prediction (Gemini)
```

1. **Cron Job** runs every 30 minutes fetching latest news from Google News RSS
2. **FinBERT** (via HuggingFace API) scores each headline as positive / negative / neutral
3. **Aggregator** computes daily average sentiment per stock
4. **Gemini AI** generates human-readable summaries and price predictions on demand
5. **Frontend** visualizes everything with interactive, animated charts

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/news/:stockId` | Fetch news articles for a stock |
| `GET` | `/api/sentiment/:stockId` | Get aggregated sentiment data |
| `GET` | `/api/stock/price/:symbol` | Live stock price from Yahoo Finance |
| `GET` | `/api/ai/summary/:stockId` | AI-generated news summary (Gemini) |
| `GET` | `/api/ai/prediction/:stockId` | AI price prediction (Gemini) |
| `GET` | `/api/stocks/search?q=` | Search stocks by name or symbol |
| `GET` | `/api/sector/heatmap` | Sector-wise market heatmap data |
| `GET` | `/api/indices` | Live market indices data |
| `GET` | `/health` | Health check |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🔮 Future Scope

- **ML Price Prediction** — Integrate a machine learning model trained on historical price + sentiment data to predict future stock prices
- **Portfolio Tracker** — Add a personalized watchlist and portfolio tracking system
- **Alerts & Notifications** — Push notifications when sentiment shifts dramatically for watched stocks

---

## 👨‍💻 Author

**Rajat Bhopte**
- GitHub: [@RajatBhopte](https://github.com/RajatBhopte)

---

## 📄 License

This project is licensed under the ISC License.
