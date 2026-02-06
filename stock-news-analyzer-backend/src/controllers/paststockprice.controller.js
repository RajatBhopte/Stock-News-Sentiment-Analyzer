import axios from "axios";
import Sentiment from "../models/sentiment.model.js";
import Stock from "../models/Stock.model.js";   
const getPriceSentimentData = async (req, res) => {
  try {
    const { stockId } = req.params;
    const days = parseInt(req.query.days) || 30;

    // Remove these require lines:
    // const DailySentiment = require("../models/DailySentiment");
    // const Stock = require("../models/Stock");

    // Calculate date as string
    const startDateString = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Use Sentiment (which you already imported)
    const sentimentData = await Sentiment.find({
      stock: stockId,
      date: { $gte: startDateString },
    })
      .sort({ date: 1 })
      .lean();

    // Use Stock (which you already imported)
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - days * 24 * 60 * 60;

    const priceResponse = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}.NS`,
      { params: { period1: startDate, period2: endDate, interval: "1d" } },
    );

    const result = priceResponse.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    const priceMap = {};
    timestamps.forEach((timestamp, i) => {
      const date = new Date(timestamp * 1000).toISOString().split("T")[0];
      priceMap[date] = {
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i],
      };
    });

    const sentimentMap = {};
    sentimentData.forEach((s) => {
      sentimentMap[s.date] = {
        sentiment: s.averageScore,
        label: s.label,
        articleCount: s.articleCount,
      };
    });

    const allDates = [
      ...new Set([...Object.keys(priceMap), ...Object.keys(sentimentMap)]),
    ].sort();

    const mergedData = allDates
      .filter((date) => priceMap[date])
      .map((date) => ({
        date,
        ...priceMap[date],
        sentiment: sentimentMap[date]?.sentiment || null,
        label: sentimentMap[date]?.label || null,
        articleCount: sentimentMap[date]?.articleCount || 0,
      }));

    res.json(mergedData);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch data", details: error.message });
  }
};

export default getPriceSentimentData;
