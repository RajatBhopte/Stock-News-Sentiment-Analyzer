import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../models/Stock.model.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const updateSectors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const sectorMapping = {
      "TCS": "IT Services",
      "INFY": "IT Services",
      "WIPRO": "IT Services",
      "HCLTECH": "IT Services",
      "TECHM": "IT Services",
      "RELIANCE": "Energy",
      "HDFCBANK": "Banking",
      "ICICIBANK": "Banking"
    };

    for (const [symbol, sector] of Object.entries(sectorMapping)) {
      const resp = await Stock.updateOne({ symbol }, { $set: { sector } });
      console.log(`Updated ${symbol} with sector ${sector}:`, resp.modifiedCount > 0 ? "Success" : "No change/Not found");
    }

    console.log("Sector update complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

updateSectors();
