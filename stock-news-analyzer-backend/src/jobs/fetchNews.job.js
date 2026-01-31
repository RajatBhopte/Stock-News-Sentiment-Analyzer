import Stock from "../models/Stock.model.js";
import  fetchStockNews  from "../services/newsFetcher.service.js";

const runNewsFetchJob = async () => {
  console.log("--- Starting Global News Fetch Job ---");
  try {
    const stocks = await Stock.find({ isActive: true });
    console.log(`[Job] Found ${stocks.length} active stocks in DB.`);

    const results = await Promise.allSettled(
      stocks.map(stock => fetchStockNews(stock))
    );

    // Log failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`[Job] Failed for stock ${stocks[index].symbol}:`, result.reason);
      }
    });

  } catch (error) {
    console.error("[Job Error]:", error);
  }
  console.log("--- News Fetch Job Completed ---");
};


export default runNewsFetchJob;
