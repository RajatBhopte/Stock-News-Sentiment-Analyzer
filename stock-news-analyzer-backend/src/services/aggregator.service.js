import News from "../models/news.model.js";
import Sentiment from "../models/sentiment.model.js";

// Configurable thresholds
const BULLISH_THRESHOLD = 0.15;
const BEARISH_THRESHOLD = -0.15;

const aggregateDailySentiment = async (stockId, dateString) => {
  // Validate inputs
  if (!stockId || !dateString) {
    throw new Error("stockId and dateString are required");
  }

  // Validate date format (basic check)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error("dateString must be in YYYY-MM-DD format");
  }

  try {
    // Calculate date range properly
    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Use aggregation pipeline for better performance
    const results = await News.aggregate([
      {
        $match: {
          stock: stockId,
          processed: true,
          publishedAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$sentimentScore" },
          articleCount: { $sum: 1 },
          positive: {
            $sum: { $cond: [{ $eq: ["$sentimentLabel", "positive"] }, 1, 0] },
          },
          negative: {
            $sum: { $cond: [{ $eq: ["$sentimentLabel", "negative"] }, 1, 0] },
          },
          neutral: {
            $sum: { $cond: [{ $eq: ["$sentimentLabel", "neutral"] }, 1, 0] },
          },
        },
      },
    ]);

    if (!results.length || results[0].articleCount === 0) {
      console.log(`📊 No articles found for ${stockId} on ${dateString}`);
      return null;
    }

    const { averageScore, articleCount, positive, negative, neutral } =
      results[0];

    // Determine overall label
    let dailyLabel = "neutral";
    if (averageScore > BULLISH_THRESHOLD) dailyLabel = "bullish";
    else if (averageScore < BEARISH_THRESHOLD) dailyLabel = "bearish";

    // Upsert into Sentiment collection
    const dailyData = await Sentiment.findOneAndUpdate(
      { stock: stockId, date: dateString },
      {
        $set: {
          averageScore: parseFloat(averageScore.toFixed(4)),
          articleCount,
          label: dailyLabel,
          distribution: { positive, negative, neutral },
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    console.log(
      `📊 Aggregated ${stockId} on ${dateString}: ${dailyLabel} (${articleCount} articles, avg: ${averageScore.toFixed(4)})`,
    );

    return dailyData;
  } catch (error) {
    console.error(
      `❌ Aggregation Error for ${stockId} on ${dateString}:`,
      error.message,
    );
    throw error; // Re-throw so caller knows something failed
  }
};

export default aggregateDailySentiment;
