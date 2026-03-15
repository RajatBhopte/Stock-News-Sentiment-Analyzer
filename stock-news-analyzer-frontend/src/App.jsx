import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StockDetail from "./components/StockDetail";
import StockSearch from "./components/StockSearch";
import LiveIndicesTicker from "./components/LiveIndicesTicker";
import SectorHeatmap from "./pages/SectorHeatmap";
import LandingPage from "./pages/LandingPage";
import { LayoutGrid } from "lucide-react";

function Dashboard() {
  const [selectedStock, setSelectedStock] = useState({
    id: "697dc2fc0224a18255c77baf",
    name: "Tata Consultancy Services",
    symbol: "TCS",
    ticker: "TCS",
  });

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LiveIndicesTicker />
     
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-12">
        {/* Navigation & Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              BullBear
            </h2>
            <StockSearch onStockSelect={handleStockSelect} />
          </div>
        </div>
        
        {/* Dashboard */}
        <StockDetail
          stockId={selectedStock.id}
          stockName={selectedStock.name}
          stockSymbol={selectedStock.symbol}
        />

        {/* Market Heatmap at the bottom */}
        <div className="pt-12 border-t-2 border-gray-200/50 dark:border-gray-700/50">
          <SectorHeatmap standalone={false} onStockSelect={handleStockSelect} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/heatmap" element={<SectorHeatmap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
