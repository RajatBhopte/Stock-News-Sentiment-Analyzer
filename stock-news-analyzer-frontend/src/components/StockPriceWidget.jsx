import { useState, useEffect } from "react";

const StockPriceWidget = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockPrice = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call your backend API
        const response = await fetch(
          `http://localhost:5000/api/stock/price/${symbol}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stock price");
        }

        const data = await response.json();
        setStockData(data);
      } catch (err) {
        console.error("Stock price fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockPrice();

      // Refresh every 60 seconds
      const interval = setInterval(fetchStockPrice, 60000);

      return () => clearInterval(interval);
    }
  }, [symbol]);

  if (loading && !stockData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-blue-200 rounded w-1/3 mb-3"></div>
        <div className="h-12 bg-blue-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-blue-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (error && !stockData) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="text-yellow-900 font-bold text-lg">
              Live Price Unavailable
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Unable to fetch real-time price for {symbol}
            </p>
            <p className="text-yellow-600 text-xs mt-2">
              Market may be closed or data temporarily unavailable
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  const priceChange = parseFloat(stockData.change || 0);
  const percentChange = parseFloat(stockData.pChange || 0);
  const isPositive = priceChange >= 0;

  return (
    <div
      className={`bg-gradient-to-br ${
        isPositive
          ? "from-green-50 to-emerald-50 border-green-300"
          : "from-red-50 to-rose-50 border-red-300"
      } border-2 rounded-xl p-5 shadow-md relative overflow-hidden`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {stockData.companyName}
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                LIVE
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <p className="text-4xl lg:text-5xl font-bold text-gray-900">
                ₹
                {stockData.lastPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${
                  isPositive ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <span className="text-white text-xl font-bold">
                  {isPositive ? "▲" : "▼"}
                </span>
                <span className="text-white font-bold text-xl">
                  {Math.abs(priceChange).toFixed(2)} (
                  {Math.abs(percentChange).toFixed(2)}%)
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3 font-medium">
              📡 Live from NSE • Last updated:{" "}
              {new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-gray-200 min-w-[110px]">
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Open
              </p>
              <p className="text-gray-900 font-bold text-lg mt-1">
                ₹{parseFloat(stockData.open).toFixed(2)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-gray-200 min-w-[110px]">
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Prev Close
              </p>
              <p className="text-gray-900 font-bold text-lg mt-1">
                ₹{parseFloat(stockData.previousClose).toFixed(2)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-green-200 min-w-[110px]">
              <p className="text-green-700 font-semibold text-xs uppercase tracking-wide">
                Day High
              </p>
              <p className="text-green-800 font-bold text-lg mt-1">
                ₹{parseFloat(stockData.dayHigh).toFixed(2)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-red-200 min-w-[110px]">
              <p className="text-red-700 font-semibold text-xs uppercase tracking-wide">
                Day Low
              </p>
              <p className="text-red-800 font-bold text-lg mt-1">
                ₹{parseFloat(stockData.dayLow).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-300 flex items-center justify-between flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold">
            NSE: {symbol}
          </span>
          {stockData.volume > 0 && (
            <span className="text-xs text-gray-700 font-semibold">
              Volume: {stockData.volume.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockPriceWidget;
