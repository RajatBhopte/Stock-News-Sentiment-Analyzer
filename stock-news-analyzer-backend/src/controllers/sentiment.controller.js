import Sentiment from "../models/sentiment.model.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";

const trendCache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

export const getStockSentimentTrend = async (req, res) => {
  try {
    const { stockId } = req.params;
    let { days = 7 } = req.query;

    // Validate stockId
    if (!mongoose.Types.ObjectId.isValid(stockId)) {
      return res.status(400).json({
        error: "Invalid stock ID format",
      });
    }

    // Validate days parameter
    days = parseInt(days, 10);
    if (isNaN(days) || days < 1 || days > 90) {
      return res.status(400).json({
        error: "Days parameter must be between 1 and 90",
        provided: req.query.days,
      });
    }

    // Check cache
    const cacheKey = `sentiment:trend:${stockId}:${days}`;
    const cached = trendCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        ...cached,
        cached: true,
      });
    }

    // Use aggregation for efficient query
    const trendData = await Sentiment.aggregate([
      {
        $match: {
          stock: new mongoose.Types.ObjectId(stockId),
        },
      },
      { $sort: { date: -1 } }, // Newest first
      { $limit: days },
      { $sort: { date: 1 } }, // Re-sort oldest to newest for chart
      {
        $project: {
          _id: 1,
          date: 1,
          averageScore: 1,
          label: 1,
          articleCount: 1,
          distribution: 1,
        },
      },
    ]);

    if (!trendData || trendData.length === 0) {
      return res.status(404).json({
        error: "No sentiment data found for this stock",
        stockId,
      });
    }

    const response = {
      stockId,
      days,
      count: trendData.length,
      data: trendData,
    };

    // Cache the result
    trendCache.set(cacheKey, response);

    res.status(200).json(response);
  } catch (error) {
    console.error(
      `❌ Error fetching sentiment trend for ${req.params.stockId}:`,
      error,
    );

    // Handle specific error types
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid stock ID" });
    }

    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoServerError"
    ) {
      return res
        .status(503)
        .json({ error: "Database temporarily unavailable" });
    }

    // Generic server error
    res.status(500).json({
      error: "Failed to fetch sentiment trend data",
    });
  }
};
