import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Corrected: default import
import initializeScheduler from "./jobs/schedular.js";
import runNewsFetchJob from "./jobs/fetchNews.job.js";
import runSentimentJob from "./jobs/sentiment.job.js";
import runAggregatorJob from "./jobs/aggregator.job.js";
import { backfillSevenDays } from "./scripts/backfill.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

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

 await backfillSevenDays("697dc2fc0224a18255c77baf"); // Example Stock ID
}).catch((err) => {
  console.error("Failed to start server:", err);
});
