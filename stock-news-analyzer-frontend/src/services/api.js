const BASE_URL = import.meta.env.VITE_API_URL 

export const stockAPI = {
  getLatestNews: async (stockId) => {
    const response = await fetch(`${BASE_URL}/api/news/latest/${stockId}`);
    if (!response.ok) throw new Error("Failed to fetch news");
    return response.json();
  },

  getSentimentTrend: async (stockId, days = 7) => {
    const response = await fetch(
      `${BASE_URL}/api/sentiment/trend/${stockId}?days=${days}`,
    );
    if (!response.ok) throw new Error("Failed to fetch sentiment trend");
    return response.json();
  },

  // Add other endpoints as needed
  searchStocks: async (query) => {
    const response = await fetch(`${BASE_URL}/api/stocks/search?q=${query}`);
    if (!response.ok) throw new Error("Failed to search stocks");
    return response.json();
  },
};
