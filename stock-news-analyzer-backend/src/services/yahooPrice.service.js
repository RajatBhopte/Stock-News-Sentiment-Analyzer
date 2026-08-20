import axios from "axios";

// Yahoo rate-limits (429) any request whose User-Agent looks automated, and
// axios defaults to "axios/<version>". A browser UA is the difference between
// a 429 and a 200 on this endpoint — keep it here so both callers share the fix.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

class PriceProviderError extends Error {
  constructor(message, { status = null, throttled = false } = {}) {
    super(message);
    this.name = "PriceProviderError";
    this.status = status;
    this.throttled = throttled;
  }
}

/**
 * Fetches a daily OHLCV series for an NSE symbol.
 * @param {string} symbol - NSE symbol without the ".NS" suffix (e.g. "TCS")
 * @param {number} days - how many days back to request
 * @returns {Promise<{timestamps:number[], quotes:object}>}
 */
export const fetchDailySeries = async (symbol, days) => {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - days * 24 * 60 * 60;

  let data;
  try {
    ({ data } = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`,
      {
        params: { period1: startDate, period2: endDate, interval: "1d" },
        headers: { "User-Agent": BROWSER_UA, Accept: "application/json" },
        timeout: 20000,
      },
    ));
  } catch (error) {
    const status = error.response?.status ?? null;
    throw new PriceProviderError(
      `Yahoo request failed${status ? ` (${status})` : ""}: ${error.message}`,
      { status, throttled: status === 429 },
    );
  }

  const result = data?.chart?.result?.[0];
  if (!result?.timestamp || !result?.indicators?.quote?.[0]) {
    throw new PriceProviderError(
      data?.chart?.error?.description || "Price provider returned no series",
      { status: 502 },
    );
  }

  return { timestamps: result.timestamp, quotes: result.indicators.quote[0] };
};

export { PriceProviderError };
