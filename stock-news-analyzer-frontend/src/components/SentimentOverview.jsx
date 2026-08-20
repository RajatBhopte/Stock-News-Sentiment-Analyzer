import { useEffect, useState } from "react";
import { stockAPI } from "../services/api";

const SentimentOverview = ({ stockId }) => {
  const [latestSentiment, setLatestSentiment] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      const data = await stockAPI.getSentimentTrend(stockId, 1);
      if (data.data.length > 0) {
        setLatestSentiment(data.data[0]);
      }
    };
    if (stockId) fetchLatest();
  }, [stockId]);

  if (!latestSentiment) return null;

  const { averageScore, distribution, label, articleCount } = latestSentiment;
  const total =
    distribution.positive + distribution.negative + distribution.neutral;
  const pct = (value) => (total > 0 ? ((value / total) * 100).toFixed(0) : 0);

  const getLabelColor = () => {
    if (label === "bullish")
      return "text-green-600 bg-green-50 border-green-200";
    if (label === "bearish") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div className={`border-2 rounded-lg p-3 sm:p-4 ${getLabelColor()}`}>
        <p className="text-[10px] sm:text-sm font-medium uppercase leading-tight">
          Today Market Mood
        </p>
        <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 capitalize break-words">
          {label}
        </p>
      </div>

      <div className="border rounded-lg p-3 sm:p-4 bg-white border-gray-200">
        <p className="text-[10px] sm:text-sm text-gray-600 leading-tight">
          Today Sentiment Score
        </p>
        <p
          className={`text-xl sm:text-3xl font-bold mt-1 sm:mt-2 ${averageScore >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {averageScore.toFixed(2)}
        </p>
      </div>

      <div className="border rounded-lg p-3 sm:p-4 bg-white border-gray-200">
        <p className="text-[10px] sm:text-sm text-gray-600 leading-tight">
          Today Articles Analyzed
        </p>
        <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-900">
          {articleCount}
        </p>
      </div>

      <div className="col-span-2 md:col-span-1 border rounded-lg p-3 sm:p-4 bg-white border-gray-200">
        <p className="text-[10px] sm:text-sm text-gray-600 mb-1.5 sm:mb-2 leading-tight">
          Today Distribution
        </p>
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-gray-700">Positive</span>
            <span className="font-semibold text-green-600">
              {pct(distribution.positive)}%
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-700">Negative</span>
            <span className="font-semibold text-red-600">
              {pct(distribution.negative)}%
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-700">Neutral</span>
            <span className="font-semibold text-gray-600">
              {pct(distribution.neutral)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;
