import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Corrected: default import
import initializeScheduler from "./jobs/schedular.js";
import runNewsFetchJob from "./jobs/fetchNews.job.js";
import runSentimentJob from "./jobs/sentiment.job.js";
import runAggregatorJob from "./jobs/aggregator.job.js";
import { backfillSevenDays } from "./scripts/backfill.js";
import axios from "axios";
dotenv.config();

const PORT = process.env.PORT || 5000;


app.get('/api/stock/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Using Yahoo Finance API (no key needed)
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`,
      {
        params: {
          interval: '1d',
          range: '1d'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    const result = response.data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];

    const stockData = {
      symbol: symbol,
      companyName: meta.longName || `${symbol} Stock`,
      lastPrice: meta.regularMarketPrice || meta.previousClose,
      previousClose: meta.previousClose || meta.chartPreviousClose,
      change: (meta.regularMarketPrice || meta.previousClose) - (meta.previousClose || meta.chartPreviousClose),
      pChange: (((meta.regularMarketPrice || meta.previousClose) - (meta.previousClose || meta.chartPreviousClose)) / (meta.previousClose || meta.chartPreviousClose)) * 100,
      open: quote.open?.[0] || meta.previousClose,
      dayHigh: meta.regularMarketDayHigh || meta.previousClose,
      dayLow: meta.regularMarketDayLow || meta.previousClose,
      volume: meta.regularMarketVolume || 0
    };

    res.json(stockData);
  } catch (error) {
    console.error('Stock price error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch stock price',
      message: error.message 
    });
  }
});


connectDB().then(async () => {
  // Start Express
  app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));

  // Start Cron Jobs
  initializeScheduler();

  // PRO TIP: Run an initial fetch immediately once so you don't wait 30 mins
  console.log("🚀 Running initial startup fetch...");
  await runNewsFetchJob();
  await runSentimentJob();
  await runAggregatorJob();

//  await backfillSevenDays("697dc2fc0224a18255c77baf"); // Example Stock ID TCS
//  await backfillSevenDays("6985df0475e96d05f9d825de"); // Example Stock ID INFY
//  await backfillSevenDays("6985df4375e96d05f9d825e5"); // Example Stock ID TECH Mahindra
//  await backfillSevenDays("6985df2875e96d05f9d825e1"); // Example Stock ID Wipro
//  await backfillSevenDays("6985df3775e96d05f9d825e3"); // Example Stock ID  HCL

}).catch((err) => {
  console.error("Failed to start server:", err);
});
