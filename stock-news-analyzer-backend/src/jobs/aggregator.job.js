import Stock from "../models/Stock.model.js";
import  aggregateDailySentiment  from "../services/aggregator.service.js";

const runAggregatorJob = async () => {
  console.log("--- Starting Daily Aggregation Job ---");

  const today = new Date().toISOString().split("T")[0]; // "2026-01-31"
  const stocks = await Stock.find({ isActive: true });

  for (const stock of stocks) {
    try{
        await aggregateDailySentiment(stock._id, today);
    }catch(err){
        console.error(`❌ Aggregation failed for stock ${stock.symbol}:`, err.message);
    }

  }


  console.log("--- Aggregation Job Completed ---");
};

export default runAggregatorJob;
