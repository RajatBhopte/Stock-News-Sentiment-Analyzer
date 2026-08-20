import express from 'express';
import sentimentRoutes from './routes/sentiment.routes.js';
import newsRoutes from './routes/news.routes.js';
import cors from "cors"; // Import CORS middleware
import stockRoutes from "./routes/stockRoutes.js"; // Import stock routes
import pastPriceRoutes from "./routes/pastprice.routes.js"; // Import past price routes
import News from "./models/news.model.js"; // Import News model for news by date route
import mongoose from "mongoose"; // Import mongoose for ObjectId conversion
import axios from 'axios';
import indicesRoutes from "./routes/indicesRoutes.js"; // Import indices routes
import { fetchIndexQuote } from "./services/yahooPrice.service.js";
import aiRoutes from "./routes/ai.routes.js";
import sectorRoutes from "./routes/sector.routes.js";

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies



app.get('/', (req, res) => {
  res.send('BullBear Backend is running');
});

// In your backend routes
// to get news of particular stock on particular date
app.get("/api/news/date/:stockId/:date", async (req, res) => {
  try {
    const { stockId, date } = req.params;

    console.log("Received params:", { stockId, date }); // Debug

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Parse date properly
    const [year, month, day] = date.split("-").map(Number);

    // Create start and end of day in UTC
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    console.log("Date range:", { startOfDay, endOfDay }); // Debug

    // Validate dates
    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
      return res.status(400).json({
        error: "Invalid date values",
      });
    }

    // Convert stockId to ObjectId
    const stockObjectId = new mongoose.Types.ObjectId(stockId);

    const news = await News.find({
      stock: stockObjectId,
      publishedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      processed: true,
    })
      .sort({ publishedAt: -1 })
      .limit(50);

    console.log(`Found ${news.length} articles`); // Debug

    res.json(news);
  } catch (error) {
    console.error("Error fetching news by date:", error);
    res.status(500).json({
      error: "Failed to fetch news",
      message: error.message,
    });
  }
});

// to get real time indices data
// NOTE: this inline route is matched before the `/api/indices` router mount
// below, so it — not indicesController — serves GET /api/indices. The router
// still handles the /api/indices/:name sub-route.
app.get("/api/indices", async (req, res) => {
  const symbols = {
    nifty50: "^NSEI",
    niftyIT: "^CNXIT",
    bankNifty: "^NSEBANK",
    sensex: "^BSESN",
  };

  const results = await Promise.all(
    Object.entries(symbols).map(async ([key, symbol]) => {
      try {
        const quote = await fetchIndexQuote(symbol);
        return { name: key, ...quote };
      } catch (error) {
        console.error(`[Indices] ${key} failed:`, error.message);
        return null;
      }
    }),
  );

  const data = results.filter(Boolean);

  // Returning an empty array with a 200 made a total upstream failure look
  // like "no indices exist", which rendered an empty ticker bar with no clue
  // why. Say so explicitly instead.
  if (data.length === 0) {
    return res.status(503).json({
      error: "Market data provider unavailable",
      details: "No index quotes could be fetched",
    });
  }

  res.json(data);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Server is alive");
});



app.use("/api/indices", indicesRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/stock", pastPriceRoutes); // Add past price route
app.use("/api/ai", aiRoutes);
app.use("/api/sectors", sectorRoutes);


export default app;