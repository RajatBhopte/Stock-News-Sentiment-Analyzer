import Stock from "../models/Stock.model.js";
import News from "../models/news.model.js";
import  aggregateDailySentiment  from "../services/aggregator.service.js";

const runAggregatorJob = async () => {
  console.log("--- Starting Daily Aggregation Job ---");

  const stocks = await Stock.find({ isActive: true });

  for (const stock of stocks) {
    try {
      // Find all distinct dates that have processed articles for this stock
      const distinctDates = await News.aggregate([
        {
          $match: {
            stock: stock._id,
            processed: true,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      for (const { _id: dateString } of distinctDates) {
        await aggregateDailySentiment(stock._id, dateString);
      }
    } catch (err) {
      console.error(`❌ Aggregation failed for stock ${stock.symbol}:`, err.message);
    }
  }


  console.log("--- Aggregation Job Completed ---");
};

export default runAggregatorJob;
