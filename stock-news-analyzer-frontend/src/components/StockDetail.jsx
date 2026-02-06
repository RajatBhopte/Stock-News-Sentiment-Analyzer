import { useState } from "react";
import SentimentOverview from "./SentimentOverview";
import SentimentTrendChart from "./SentimentTrendChart";
import NewsFeed from "./NewsFeed";
import StockPriceWidget from "./StockPriceWidget";
import DateNewsView from "./DateNewsView";

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
      {/* Main Dashboard */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{stockName}</h1>
              <p className="text-blue-100 mt-2 font-medium">
                AI-Powered Real-Time Sentiment Analysis Dashboard
              </p>
            </div>

            <StockPriceWidget symbol={stockSymbol} />
          </div>

          {/* Overview Cards */}
          <SentimentOverview stockId={stockId} />

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sentiment Trend Chart */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
                <SentimentTrendChart
                  stockId={stockId}
                  onDateSelect={handleDateSelect}
                  
                />
              </div>
            </div>

            {/* RIGHT COLUMN - News Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 lg:sticky lg:top-6 max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
                <h2 className="text-4xl font-bold text-gray-900 mb-7 flex items-center gap-2 flex-shrink-0">
                  <span className="text-3xl">📰</span>
                  Latest News
                </h2>
                <div className="overflow-y-auto flex-1 -mr-2 pr-2 custom-scrollbar">
                  <NewsFeed stockId={stockId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date News Modal - OUTSIDE main container, appears as overlay */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleCloseNewsView}
        >
          <div
            className="w-full max-w-4xl my-8"
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
