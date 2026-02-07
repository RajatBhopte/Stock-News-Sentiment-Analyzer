// controllers/indicesController.js
import yahooFinance from "yahoo-finance2";
import { INDICES_SYMBOLS } from "../config/indices.config.js";

// Get all indices data
const getIndices = async (req, res) => {
  try {
    const symbols = Object.values(INDICES_SYMBOLS);
    const quotes = await yahooFinance.quote(symbols);

    // Handle both array and single object response
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    const data = Object.entries(INDICES_SYMBOLS).map(([name, symbol]) => {
      const quote = quotesArray.find((q) => q.symbol === symbol);

      if (!quote) {
        throw new Error(`No data found for ${symbol}`);
      }

      return {
        name,
        symbol,
        value: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        previousClose: quote.regularMarketPreviousClose || 0,
        lastUpdated: new Date().toISOString(),
      };
    });

    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching indices:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch market data",
      message: error.message,
    });
  }
};

// Get single index data
const getSingleIndex = async (req, res) => {
  try {
    const { name } = req.params;
    const symbol = INDICES_SYMBOLS[name.toUpperCase()];

    if (!symbol) {
      return res.status(404).json({
        success: false,
        error: "Index not found",
        availableIndices: Object.keys(INDICES_SYMBOLS),
      });
    }

    const quote = await yahooFinance.quote(symbol);

    const data = {
      name: name.toUpperCase(),
      symbol,
      value: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      lastUpdated: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching index:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch index data",
      message: error.message,
    });
  }
};


export { getIndices, getSingleIndex };