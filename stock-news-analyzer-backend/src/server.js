import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Corrected: default import
import initializeScheduler from "./jobs/cron.news.js";
import runNewsFetchJob from "./jobs/fetchNews.job.js";
import runSentimentJob from "./jobs/sentiment.job.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    // 1. Start the Express Server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port http://localhost:${PORT}`);
    });

    // 2. Optional: Run an initial fetch immediately on startup
    console.log("🚀 Triggering initial news fetch...");
    await runNewsFetchJob();

    await runSentimentJob();

    initializeScheduler();

  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
  });
