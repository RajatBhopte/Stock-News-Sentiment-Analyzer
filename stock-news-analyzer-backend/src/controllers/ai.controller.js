import News from "../models/news.model.js";
import Stock from "../models/Stock.model.js";
import Sentiment from "../models/sentiment.model.js";
import { generateStockSummary, generatePricePrediction } from "../services/ai.service.js";
import NodeCache from "node-cache";
import axios from "axios";

// Cache AI summaries for 15 minutes (900 seconds)
const summaryCache = new NodeCache({ stdTTL: 900 });

export const getStockAISummary = async (req, res) => {
  try {
    const { stockId } = req.params;

    // Check cache first
    const cachedData = summaryCache.get(stockId);
    if (cachedData) {
      return res.status(200).json({ ...cachedData, cached: true });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const latestNews = await News.find({
      stock: stockId,
    })
      .sort({ publishedAt: -1 })
      .limit(10);

    if (!latestNews || latestNews.length === 0) {
      return res.status(200).json({ 
        summary: "No recent news available to analyze for this stock." 
      });
    }

    const summary = await generateStockSummary(stock.name, latestNews);
    
    const responseData = { 
      summary, 
      stockName: stock.name, 
      symbol: stock.symbol 
    };

    // Store in cache
    summaryCache.set(stockId, responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("AI Controller Error:", error);
    
    // Check if it's a rate limit error from Gemini
    if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
      return res.status(429).json({ 
        message: "AI service is currently busy. Please try again in a few minutes.",
        error: "Rate limit exceeded"
      });
    }

    res.status(500).json({ message: "Error generating AI summary", error: error.message });
  }
};

// Cache predictions for 30 minutes
const predictionCache = new NodeCache({ stdTTL: 1800 });

export const getStockPricePrediction = async (req, res) => {
  try {
    const { stockId } = req.params;

    // Check cache
    const cached = predictionCache.get(stockId);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    // Fetch last 30 days of data for prediction
    const days = 30;
    const startDateString = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
    const sentimentData = await Sentiment.find({
      stock: stockId,
      date: { $gte: startDateString },
    }).sort({ date: 1 }).lean();

    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - days * 24 * 60 * 60;

    const priceResponse = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}.NS`,
      { params: { period1: startDate, period2: endDate, interval: "1d" } }
    );

    const result = priceResponse.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    // Merge data for AI
    const historicalData = timestamps.map((ts, i) => {
      const date = new Date(ts * 1000).toISOString().split("T")[0];
      const sentiment = sentimentData.find(s => s.date === date);
      return {
        date,
        close: quotes.close[i],
        sentiment: sentiment?.averageScore || null
      };
    }).filter(d => d.close != null);

    const prediction = await generatePricePrediction(stock.name, historicalData);
    
    // Store in cache
    predictionCache.set(stockId, prediction);

    res.status(200).json(prediction);
  } catch (error) {
    console.error("Prediction Controller Error:", error);
    res.status(500).json({ message: "Error generating prediction", error: error.message });
  }
};
