import RSSParser from "rss-parser";
import News from "../models/news.model.js";
import  generateHash  from "../utils/hash.js";
import { cleanHeadline } from "./parser.services.js";

const parser = new RSSParser();
const fetchStockNews = async (stock) => {
  try {
    // Example: Google News RSS for the stock keyword
    // Add '+when:7d' inside the query itself for fetching news 7 days old
    const FEED_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(stock.keywords[0] + " when:7d")}&hl=en-IN&gl=IN&ceid=IN:en`;

    const feed = await parser.parseURL(FEED_URL);
    console.log(
      `[Fetcher] ${stock.symbol}: Found ${feed.items.length} items in RSS`,
    ); // <-- CHECK THIS
    const newArticles = [];

    for (const item of feed.items) {
      // Create a unique hash to prevent duplicates
      const contentHash = generateHash(item.title + item.link);

      // Check if this article already exists in DB
      const exists = await News.exists({ contentHash });
      const rawTitle = item.title;
      const cleanTitle = cleanHeadline(rawTitle);

      if (!exists) {
        newArticles.push({
          stock: stock._id,
          title: cleanTitle,
          url: item.link,
          source: item.source || "Google News",
          publishedAt: new Date(item.pubDate),
          contentHash: contentHash,
          // We leave sentiment fields empty for the AI Job to pick up later
        });
      }
    }

    if (newArticles.length > 0) {
      await News.insertMany(newArticles, { ordered: false });
      console.log(
        `[Fetcher] Saved ${newArticles.length} new articles for ${stock.symbol}`,
      );
    } else {
      console.log(`[Fetcher] No new news for ${stock.symbol}`);
    }
  } catch (error) {
    console.error(`[Fetcher Error] Failed for ${stock.symbol}:`, error.message);
  }
};

export default fetchStockNews;
