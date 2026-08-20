import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.Gemini_API?.trim());

// Primary and fallback models for resilience
// Free-tier request quotas are per-model, so a spent quota on one still leaves
// the next usable. Ordered strongest-first.
const MODEL_CHAIN = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];

/**
 * Attempts to generate content with the primary model, falls back on 503/overload errors.
 * @param {string} prompt - The prompt to send
 * @returns {Promise<import("@google/generative-ai").GenerateContentResult>}
 */
const generateWithFallback = async (prompt) => {
  let lastError;

  for (const modelName of MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.httpStatusCode;
      const msg = error?.message || "";
      // 429 (quota) and 503 (overloaded) are both worth retrying on the next
      // model in the chain; anything else is a real error, so stop.
      const shouldTryNext =
        status === 429 ||
        status === 503 ||
        /429|503|quota|high demand|overloaded|too many requests/i.test(msg);

      if (shouldTryNext && modelName !== MODEL_CHAIN[MODEL_CHAIN.length - 1]) {
        console.warn(`Model "${modelName}" unavailable (${status ?? "error"}), trying next...`);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

/**
 * Generates a 3-bullet point summary of news articles for a stock
 * @param {string} stockName - Name of the stock
 * @param {Array} newsArticles - List of news articles (title and content/description)
 * @returns {Promise<string>} - The AI summary
 */
export const generateStockSummary = async (stockName, newsArticles) => {
  try {
    const articlesText = newsArticles
      .map((art, index) => `${index + 1}. Title: ${art.title}\nDescription: ${art.description || art.content || ""}`)
      .join("\n\n");

    const prompt = `
      You are a senior financial analyst. Analyze news for ${stockName} and provide a structured "BULLBEAR" summary.
      
      Requirements:
      1. Provide exactly 3 short, impactful bullet points.
      2. Do NOT use emojis.
      3. Do NOT use markdown bold (** characters). Use plain UPPERCASE text for themes.
      4. Include a final "Sentiment Grade" based on the news (e.g., BULLISH, NEUTRAL, CAUTIOUS).
      
      Format (follow this exactly, no emojis, no asterisks):
      - THEME NAME: Description of the point...
      - THEME NAME: Description of the point...
      - THEME NAME: Description of the point...
      
      GRADE: [GRADE NAME]
      
      News Articles:
      ${articlesText}
    `;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw new Error(`Failed to generate AI summary: ${error.message}`);
  }
};

/**
 * Predicts stock price direction based on historical price + sentiment
 * @param {string} stockName 
 * @param {Array} historicalData - Array of {date, close, sentiment}
 * @returns {Promise<Object>} - The AI prediction
 */
export const generatePricePrediction = async (stockName, historicalData) => {
  try {
    const dataText = historicalData
      .map(d => `Date: ${d.date}, Price: ${d.close}, Sentiment: ${d.sentiment || 'N/A'}`)
      .join("\n");

    const prompt = `
      You are a quantitative financial analyst and AI model. Analyze the correlation between historical stock prices and news sentiment for ${stockName}.
      
      Historical Data (Last 30 Days):
      ${dataText}
      
      Task:
      Predict the price movement for the next 24-48 hours.
      
      Requirements:
      1. Determine the expected Direction (Bullish, Bearish, or Neutral).
      2. Provide a Predicted Price Range (Lower and Upper bounds).
      3. Assign a Confidence Level (0-100%).
      4. Give a brief "Reasoning" explaining how news sentiment influenced this prediction.
      
      Return ONLY a JSON object with this exact structure:
      {
        "direction": "Bullish/Bearish/Neutral",
        "predictedRange": { "low": number, "high": number },
        "confidence": number,
        "reasoning": "string"
      }
    `;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating Price Prediction:", error);
    throw new Error(`Failed to predict price: ${error.message}`);
  }
};
