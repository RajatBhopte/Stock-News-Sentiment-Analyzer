import { useState } from "react";
import SentimentOverview from "./SentimentOverview";
import SentimentTrendChart from "./SentimentTrendChart";
import NewsFeed from "./NewsFeed";
import StockPriceWidget from "./StockPriceWidget";
import DateNewsView from "./DateNewsView";
import PriceSentimentChart from "./PriceSentimentChart";
import AISummary from "./AISummary";
import AIPrediction from "./AIPrediction";

const StockDetail = ({ stockId, stockName, stockSymbol }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCloseNewsView = () => {
    setSelectedDate(null);
  };

  return (
    <>
      {/* Main Dashboard Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
              {stockName}
            </h1>
            <p className="text-blue-100 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base font-medium">
              AI-Powered Real-Time Sentiment Analysis Dashboard
            </p>
          </div>

          <StockPriceWidget symbol={stockSymbol} />
        </div>

        {/* AI Insight Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <AISummary stockId={stockId} />
          <AIPrediction stockId={stockId} />
        </div>

        {/* Overview Cards */}
        <SentimentOverview stockId={stockId} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Sentiment Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-3 sm:p-6">
              <SentimentTrendChart
                stockId={stockId}
                onDateSelect={handleDateSelect}
              />
            </div>
          </div>

          {/* RIGHT COLUMN - News Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-6 lg:sticky lg:top-6 max-h-[70vh] lg:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-5 flex items-center gap-2 flex-shrink-0">
                <span className="text-xl sm:text-2xl lg:text-3xl">📰</span>
                Latest News
              </h2>
              <div className="overflow-y-auto flex-1 -mr-1 pr-1 sm:-mr-2 sm:pr-2 custom-scrollbar overscroll-contain">
                <NewsFeed stockId={stockId} />
              </div>
            </div>
          </div>
        </div>

        {/* Price vs Sentiment Chart - NOW AT BOTTOM */}
        <PriceSentimentChart stockId={stockId} />
      </div>

      {/* Date News Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={handleCloseNewsView}
        >
          <div
            className="w-full max-w-4xl my-4 sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <DateNewsView
              stockId={stockId}
              selectedDate={selectedDate}
              onClose={handleCloseNewsView}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockDetail;
