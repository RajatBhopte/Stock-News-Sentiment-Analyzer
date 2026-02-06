import { useState, useEffect } from "react";

const StockPriceWidget = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      // Mock realistic data - you can update these values
      const mockData = {
        companyName: "Tata Consultancy Services Ltd.",
        lastPrice: 4235.5 + (Math.random() * 10 - 5), // Slight random variation
        previousClose: 4198.2,
        open: 4210.0,
        dayHigh: 4248.75,
        dayLow: 4205.3,
      };

      mockData.change = mockData.lastPrice - mockData.previousClose;
      mockData.pChange = (mockData.change / mockData.previousClose) * 100;

      setStockData(mockData);
      setLoading(false);
    }, 500);

    // Simulate price updates every 10 seconds
    const interval = setInterval(() => {
      setStockData((prev) => {
        if (!prev) return null;
        const newPrice = prev.lastPrice + (Math.random() * 2 - 1);
        return {
          ...prev,
          lastPrice: newPrice,
          change: newPrice - prev.previousClose,
          pChange: ((newPrice - prev.previousClose) / prev.previousClose) * 100,
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-blue-200 rounded w-1/3 mb-3"></div>
        <div className="h-12 bg-blue-200 rounded w-1/2"></div>
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
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                DEMO MODE
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
              📍 Simulated data • Updates every 10s
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-gray-200 min-w-[110px]">
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Open
              </p>
              <p className="text-gray-900 font-bold text-lg mt-1">
                ₹{stockData.open.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-gray-200 min-w-[110px]">
              <p className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Prev Close
              </p>
              <p className="text-gray-900 font-bold text-lg mt-1">
                ₹{stockData.previousClose.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-green-200 min-w-[110px]">
              <p className="text-green-700 font-semibold text-xs uppercase tracking-wide">
                Day High
              </p>
              <p className="text-green-800 font-bold text-lg mt-1">
                ₹{stockData.dayHigh.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border-2 border-red-200 min-w-[110px]">
              <p className="text-red-700 font-semibold text-xs uppercase tracking-wide">
                Day Low
              </p>
              <p className="text-red-800 font-bold text-lg mt-1">
                ₹{stockData.dayLow.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-300 flex items-center justify-between">
          <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold">
            NSE: {symbol}
          </span>
          <span className="text-xs text-gray-600 font-medium">

          </span>
        </div>
      </div>
    </div>
  );
};

export default StockPriceWidget;
