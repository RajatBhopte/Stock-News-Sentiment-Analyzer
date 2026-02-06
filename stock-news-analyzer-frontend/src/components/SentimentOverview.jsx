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

  const getLabelColor = () => {
    if (label === "bullish")
      return "text-green-600 bg-green-50 border-green-200";
    if (label === "bearish") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className={`border-2 rounded-lg p-4 ${getLabelColor()}`}>
        <p className="text-sm font-medium uppercase">Market Mood</p>
        <p className="text-3xl font-bold mt-2">{label}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-sm text-gray-600">Avg Sentiment Score</p>
        <p
          className={`text-3xl font-bold mt-2 ${averageScore >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {averageScore.toFixed(2)}
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-sm text-gray-600">Articles Analyzed</p>
        <p className="text-3xl font-bold mt-2">{articleCount}</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">Distribution</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Positive</span>
            <span className="font-semibold text-green-600">
              {((distribution.positive / total) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Negative</span>
            <span className="font-semibold text-red-600">
              {((distribution.negative / total) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Neutral</span>
            <span className="font-semibold text-gray-600">
              {((distribution.neutral / total) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentOverview;
