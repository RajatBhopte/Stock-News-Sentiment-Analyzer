const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useState, useEffect } from "react";

const DateNewsView = ({ stockId, selectedDate, onClose }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedDate || !stockId) return;

      try {
        setLoading(true);
        setError(null);

        let formattedDate = selectedDate;
        if (selectedDate.includes("T")) {
          formattedDate = selectedDate.split("T")[0];
        }

        const url = `${BASE_URL}/api/news/date/${stockId}/${formattedDate}`;
        console.log("Fetching from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Received news:", data.length, "articles");

        // Validate data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError(error.message);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedDate, stockId]);

  if (!selectedDate) return null;

  return (
    <div
      className="bg-white rounded-2xl border-2 border-blue-400 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        touchAction: "auto",
        userSelect: "text",
        pointerEvents: "auto",
      }}
    >
      {/* Header - Fixed */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between flex-shrink-0">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📰</span>
          News from{" "}
          {new Date(selectedDate).toLocaleDateString("en-IN", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-white transition-colors flex-shrink-0"
        >
          ✕ Close
        </button>
      </div>

      {/* Content - Scrollable */}
      <div
        className="p-6 bg-gray-50 overflow-y-auto flex-1"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          maxHeight: "calc(90vh - 80px)",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading news articles...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl font-bold text-red-700 mb-2">
              Error loading news
            </p>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload page
            </button>
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium mb-4 sticky top-0 bg-gray-50 py-2 z-10">
              Found {news.length} article{news.length !== 1 ? "s" : ""} from
              this day
            </p>

            {/* NEWS CARDS */}
            {news.map((article, index) => {
              // Validate article has required fields
              if (!article || !article._id || !article.url || !article.title) {
                console.warn("Invalid article at index", index, article);
                return null;
              }

              return (
                <div
                  key={article._id}
                  className="border-2 border-gray-300 rounded-xl p-5 bg-white hover:shadow-lg hover:border-blue-400 transition-all"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    touchAction: "auto",
                    userSelect: "text",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-gray-900 hover:text-blue-600 hover:underline block mb-2 break-words"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Opening:", article.url);
                        }}
                      >
                        {article.title}
                      </a>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium flex-wrap">
                        <span className="font-semibold">
                          {article.source || "Unknown"}
                        </span>
                        <span>•</span>
                        <span>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "N/A"}
                        </span>
                        <span>•</span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read article →
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                          article.sentimentLabel === "positive"
                            ? "bg-green-100 text-green-800"
                            : article.sentimentLabel === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {article.sentimentLabel || "unknown"}
                      </span>
                      <span
                        className={`text-lg font-mono font-bold ${
                          (article.sentimentScore || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {article.sentimentScore
                          ? `${article.sentimentScore > 0 ? "+" : ""}${article.sentimentScore.toFixed(2)}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl font-bold text-gray-700 mb-2">
              No news articles found
            </p>
            <p className="text-gray-500">
              The market might have been closed or no relevant news was
              published on this date
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateNewsView;
