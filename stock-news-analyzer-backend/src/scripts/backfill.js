import Stock from "../models/Stock.model.js";
import aggregateDailySentiment from "../services/aggregator.service.js";

export const backfillSevenDays = async (stockId) => {
  console.log(`🚀 Starting 7-day backfill for Stock: ${stockId}`);

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

    try {
      await aggregateDailySentiment(stockId, dateString);
    } catch (err) {
      console.error(`❌ Failed backfill for ${dateString}:`, err.message);
    }
  }
  console.log("✅ Backfill complete.");
};
