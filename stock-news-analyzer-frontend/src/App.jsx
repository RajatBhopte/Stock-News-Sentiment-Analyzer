import { useState } from "react";
import StockDetail from "./components/StockDetail";
import StockSearch from "./components/StockSearch";
import LiveIndicesTicker from "./components/LiveIndicesTicker";

function App() {
  const [selectedStock, setSelectedStock] = useState({
    id: "697dc2fc0224a18255c77baf",
    name: "Tata Consultancy Services",
    symbol: "TCS",
    ticker: "TCS",
  });

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <LiveIndicesTicker />
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Stock Sentiment Analyzer
          </h2>
          <StockSearch
            onStockSelect={handleStockSelect}
          />
        </div>

        {/* Dashboard */}
        <StockDetail
          stockId={selectedStock.id}
          stockName={selectedStock.name}
          stockSymbol={selectedStock.symbol}
        />
      </div>
    </div>
  );
}

export default App;
