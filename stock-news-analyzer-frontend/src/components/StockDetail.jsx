import SentimentOverview from "./SentimentOverview";
import SentimentTrendChart from "./SentimentTrendChart";
import NewsFeed from "./NewsFeed";
import StockPriceWidget from "./StockPriceWidget";

const StockDetail = ({ stockId, stockName, stockSymbol }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{stockName}</h1>
          <p className="text-blue-100 mt-2 font-medium">
            AI-Powered Real-Time Sentiment Analysis Dashboard
          </p>
        </div>

        {/* Overview Cards */}
        <SentimentOverview stockId={stockId} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sentiment Trend Chart */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <SentimentTrendChart stockId={stockId} />
            </div>

            {/* Stock Price Widget */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Price Overview
              </h3>
              <StockPriceWidget symbol={stockSymbol} />
            </div>
          </div>

          {/* RIGHT COLUMN - News Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 lg:sticky lg:top-6 max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 flex-shrink-0">
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
  );
};

export default StockDetail;
