import Stock from "../models/Stock.model.js";
import Sentiment from "../models/sentiment.model.js";

export const getSectorHeatmap = async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true });
    
    // Get latest sentiment for each stock
    const results = await Promise.all(stocks.map(async (stock) => {
      const latestSentiment = await Sentiment.findOne({ stock: stock._id })
        .sort({ date: -1 });
      
      return {
        _id: stock._id,
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector || "Others",
        sentiment: latestSentiment ? latestSentiment.averageScore : 0,
        label: latestSentiment ? latestSentiment.label : "neutral"
      };
    }));

    // Grouping by sector
    const sectors = results.reduce((acc, curr) => {
      const sector = curr.sector;
      if (!acc[sector]) {
        acc[sector] = {
          name: sector,
          stocks: [],
          avgSentiment: 0
        };
      }
      acc[sector].stocks.push(curr);
      return acc;
    }, {});

    // Calculate average sentiment per sector
    const sectorArray = Object.values(sectors).map(sector => {
      const totalSentiment = sector.stocks.reduce((sum, s) => sum + s.sentiment, 0);
      sector.avgSentiment = totalSentiment / sector.stocks.length;
      return sector;
    });

    res.status(200).json(sectorArray);
  } catch (error) {
    console.error("Sector Controller Error:", error);
    res.status(500).json({ message: "Error fetching sector data", error: error.message });
  }
};
