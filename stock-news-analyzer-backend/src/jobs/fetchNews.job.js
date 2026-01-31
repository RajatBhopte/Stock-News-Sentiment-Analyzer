import Stock from "../models/Stock.model.js";
import  fetchStockNews  from "../services/newsFetcher.service.js";

const runNewsFetchJob = async () => {
  console.log("--- Starting Global News Fetch Job ---");
  try {
    const stocks = await Stock.find({ isActive: true });

    // This log is the most important one for debugging!
    console.log(`[Job] Found ${stocks.length} active stocks in DB.`);

    for (const stock of stocks) {
      await fetchStockNews(stock);
    }
  } catch (error) {
    console.error("[Job Error]:", error);
  }
  console.log("--- News Fetch Job Completed ---");
};

export default runNewsFetchJob;
