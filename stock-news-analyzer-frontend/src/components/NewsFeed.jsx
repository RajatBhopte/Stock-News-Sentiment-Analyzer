import { useState, useEffect } from "react";
import { stockAPI } from "../services/api";

const getSentimentColor = (label) => {
  switch (label?.toLowerCase()) {
    case "positive":
      return "bg-green-100 text-green-800 border-green-300";
    case "negative":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getSentimentIcon = (label) => {
  switch (label?.toLowerCase()) {
    case "positive":
      return "📈";
    case "negative":
      return "📉";
    default:
      return "➖";
  }
};

const NewsFeed = ({ stockId }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await stockAPI.getLatestNews(stockId);
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (stockId) {
      fetchNews();
      const interval = setInterval(fetchNews, 300000);
      return () => clearInterval(interval);
    }
  }, [stockId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-3 animate-pulse bg-gray-50"
          >
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
        <p className="text-red-800 font-semibold text-sm">
          ⚠️ Failed to load news
        </p>
        <p className="text-red-600 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-base font-medium">No news available</p>
        <p className="text-xs mt-1">Check back later</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {news.map((article) => (
        <div
          key={article._id}
          className="border-2 border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-400 transition-all bg-white group"
        >
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xl flex-shrink-0 mt-0.5">
              {getSentimentIcon(article.sentimentLabel)}
            </span>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-3 leading-tight flex-1"
            >
              {article.title}
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-xs text-gray-600 font-medium truncate">
                {article.source}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getSentimentColor(article.sentimentLabel)}`}
              >
                {article.sentimentLabel?.toUpperCase() || "NEUTRAL"}
              </span>
              <span
                className={`text-xs font-mono font-bold ${article.sentimentScore >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {article.sentimentScore > 0 ? "+" : ""}
                {article.sentimentScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
