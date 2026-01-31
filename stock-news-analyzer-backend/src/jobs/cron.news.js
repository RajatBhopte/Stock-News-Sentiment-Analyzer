import cron from "node-cron";
import runNewsFetchJob from "./fetchNews.job.js";

const initializeScheduler = () => {
  // Schedule news fetch every 30 minutes
  const newsScheduler = cron.schedule(
    "*/30 * * * *",
    async () => {
      console.log(
        `🔄 [Cron] Scheduled news fetch at ${new Date().toISOString()}`,
      );
      try {
        await runNewsFetchJob();
      } catch (error) {
        console.error("❌ [Cron] News fetch failed:", error);
        // Don't crash the server, just log and continue
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    },
  );

  console.log("⏰ News fetcher cron job initialized - runs every 30 minutes");

  return newsScheduler;
};
export default initializeScheduler;


