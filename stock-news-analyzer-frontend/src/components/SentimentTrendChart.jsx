import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
  ComposedChart,
} from "recharts";
import { stockAPI } from "../services/api";

const SentimentTrendChart = ({ stockId, onDateSelect }) => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);
        const data = await stockAPI.getSentimentTrend(stockId, timeRange);
        setTrendData(data);
      } catch (err) {
        console.error("Failed to fetch trend:", err);
      } finally {
        setLoading(false);
      }
    };

    if (stockId) fetchTrend();
  }, [stockId, timeRange]);

  const handleDotClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] sm:h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-gray-500 animate-pulse font-semibold text-base sm:text-lg">
          Loading sentiment data...
        </div>
      </div>
    );
  }

  if (!trendData || trendData.data.length === 0) {
    return (
      <div className="h-[300px] sm:h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <p className="text-gray-600 text-base sm:text-lg font-semibold">
            No trend data available
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Check back later for sentiment analysis
          </p>
        </div>
      </div>
    );
  }

  const chartData = trendData.data
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      fullDate: d.date,
      score: parseFloat(d.averageScore.toFixed(3)),
      articles: d.articleCount,
      positive: d.distribution.positive,
      negative: d.distribution.negative,
      neutral: d.distribution.neutral,
      label: d.label,
    }))
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.score));
    const dataMin = Math.min(...chartData.map((i) => i.score));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const avgSentiment =
    trendData.data.reduce((sum, d) => sum + d.averageScore, 0) /
    trendData.count;
  const totalArticles = trendData.data.reduce(
    (sum, d) => sum + d.articleCount,
    0,
  );
  const bullishDays = trendData.data.filter(
    (d) => d.label === "bullish",
  ).length;
  const bearishDays = trendData.data.filter(
    (d) => d.label === "bearish",
  ).length;
  const neutralDays = trendData.data.filter(
    (d) => d.label === "neutral",
  ).length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 sm:p-4 border-2 border-gray-300 rounded-lg sm:rounded-xl shadow-2xl max-w-[90vw] sm:max-w-none">
          <p className="font-bold text-gray-900 text-sm sm:text-base mb-2">
            {data.date}
          </p>
          <p
            className={`text-xl sm:text-2xl font-bold mb-2 ${
              data.score >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.score > 0 ? "+" : ""}
            {data.score.toFixed(3)}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 capitalize">
            Market:{" "}
            <span
              className={`${
                data.label === "bullish"
                  ? "text-green-600"
                  : data.label === "bearish"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {data.label}
            </span>
          </p>
          <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2 sm:mb-3">
            Articles: {data.articles}
          </p>
          <div className="text-[10px] sm:text-xs space-y-1 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-semibold">✓ Positive:</span>
              <span className="font-bold text-green-800">{data.positive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-semibold">✗ Negative:</span>
              <span className="font-bold text-red-800">{data.negative}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">— Neutral:</span>
              <span className="font-bold text-gray-800">{data.neutral}</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-blue-600 font-bold mt-2 sm:mt-3 text-center">
            👆 {isMobile ? "Tap" : "Click"} dot to view news
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const color = payload.score >= 0 ? "#16a34a" : "#dc2626";

    // CRITICAL FIX: Larger touch target on mobile (48px = accessible minimum)
    const visualRadius = isMobile ? 4 : 6;
    const touchRadius = isMobile ? 24 : 8; // 48px touch area on mobile

    return (
      <g>
        {/* Invisible larger touch target for mobile */}
        {isMobile && (
          <circle
            cx={cx}
            cy={cy}
            r={touchRadius}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleDotClick(payload.fullDate);
            }}
          />
        )}
        {/* Visible dot */}
        <circle
          cx={cx}
          cy={cy}
          r={visualRadius}
          fill={color}
          stroke="#fff"
          strokeWidth={isMobile ? 1.5 : 2}
          style={{
            cursor: "pointer",
            pointerEvents: isMobile ? "none" : "auto",
          }}
          onClick={
            !isMobile
              ? (e) => {
                  e.stopPropagation();
                  handleDotClick(payload.fullDate);
                }
              : undefined
          }
          onMouseEnter={
            !isMobile
              ? (e) => {
                  e.target.setAttribute("r", 8);
                }
              : undefined
          }
          onMouseLeave={
            !isMobile
              ? (e) => {
                  e.target.setAttribute("r", 6);
                }
              : undefined
          }
        />
      </g>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Sentiment Trend Analysis
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            {trendData.count} days • {totalArticles} articles analyzed
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                timeRange === days
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-3 sm:p-6 shadow-lg">
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
          <ComposedChart
            data={chartData}
            margin={{
              top: 10,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset={off} stopColor="#dc2626" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="splitStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#16a34a" stopOpacity={1} />
                <stop offset={off} stopColor="#dc2626" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
              stroke="#6b7280"
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
              interval={isMobile ? "preserveStartEnd" : 0}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
              stroke="#6b7280"
              tickFormatter={(value) => value.toFixed(1)}
              width={isMobile ? 45 : 60}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={0}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeWidth={isMobile ? 1.5 : 2}
              label={
                !isMobile
                  ? {
                      value: "Neutral",
                      position: "right",
                      fill: "#6b7280",
                      fontSize: 12,
                      fontWeight: "bold",
                    }
                  : undefined
              }
            />
            {!isMobile && (
              <Bar
                dataKey="articles"
                fill="#94a3b8"
                fillOpacity={0.3}
                radius={[4, 4, 0, 0]}
                yAxisId="right"
              />
            )}
            <Area
              type="monotone"
              dataKey="score"
              stroke="url(#splitStroke)"
              strokeWidth={isMobile ? 2 : 3}
              fill="url(#splitColor)"
              dot={<CustomDot />}
              activeDot={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={false}
              axisLine={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <p className="text-center text-[10px] sm:text-sm text-gray-600 mt-2 sm:mt-3 font-medium px-2">
          💡 {isMobile ? "Tap" : "Click"} any dot on the chart to view news from
          that day
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-green-800 font-bold uppercase tracking-wider">
            Bullish Days
          </p>
          <p className="text-2xl sm:text-4xl font-bold text-green-700 mt-1 sm:mt-2">
            {bullishDays}
          </p>
          <p className="text-[9px] sm:text-xs text-green-600 font-semibold mt-1">
            {((bullishDays / trendData.count) * 100).toFixed(0)}% of period
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-red-800 font-bold uppercase tracking-wider">
            Bearish Days
          </p>
          <p className="text-2xl sm:text-4xl font-bold text-red-700 mt-1 sm:mt-2">
            {bearishDays}
          </p>
          <p className="text-[9px] sm:text-xs text-red-600 font-semibold mt-1">
            {((bearishDays / trendData.count) * 100).toFixed(0)}% of period
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-gray-800 font-bold uppercase tracking-wider">
            Neutral Days
          </p>
          <p className="text-2xl sm:text-4xl font-bold text-gray-700 mt-1 sm:mt-2">
            {neutralDays}
          </p>
          <p className="text-[9px] sm:text-xs text-gray-600 font-semibold mt-1">
            {((neutralDays / trendData.count) * 100).toFixed(0)}% of period
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-blue-800 font-bold uppercase tracking-wider">
            Avg Score
          </p>
          <p
            className={`text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 ${
              avgSentiment >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {avgSentiment > 0 ? "+" : ""}
            {avgSentiment.toFixed(2)}
          </p>
          <p className="text-[9px] sm:text-xs text-blue-600 font-semibold mt-1">
            {avgSentiment >= 0 ? "Positive trend" : "Negative trend"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendChart;
