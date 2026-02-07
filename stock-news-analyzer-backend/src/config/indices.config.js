// config/indices.config.js
const INDICES_SYMBOLS = {
  "NIFTY 50": "^NSEI",
  "SENSEX": "^BSESN",
  "NIFTY IT": "^CNXIT",
  "BANK NIFTY": "^NSEBANK",
};

const API_CONFIG = {
  UPDATE_INTERVAL: 10000, // 10 seconds
  PORT: 5000,
};

export { INDICES_SYMBOLS, API_CONFIG };
