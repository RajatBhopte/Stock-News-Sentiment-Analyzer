import cron from "node-cron";
import runNewsFetchJob from "./fetchNews.job.js";
import runSentimentJob from "./sentiment.job.js";
import runAggregatorJob from "./aggregator.job.js";

const initScheduledJobs = () => {
  console.log("⏰ Task Scheduler Initialized...");

  // 1. Fetch News every 30 minutes
  // Format: (minute hour day month day-of-week)
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running Scheduled: News Fetcher");
    await runNewsFetchJob();
  });

  // 2. Run Sentiment Analysis every 10 minutes
  // (We run this more often to clear the queue of articles)
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running Scheduled: Sentiment Analysis");
    await runSentimentJob();
  });

  // 3. Aggregate Daily Sentiment every 5 minutes (for testing)
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running Scheduled: Daily Aggregator");
    await runAggregatorJob();
  });
};;

export default initScheduledJobs;
