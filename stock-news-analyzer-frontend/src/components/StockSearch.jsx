import { useState } from "react";

const StockSearch = ({ onStockSelect, currentStock }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Your available stocks (you'll need to store these in your backend)
  const availableStocks = [
    {
      id: "697dc2fc0224a18255c77baf",
      name: "Tata Consultancy Services",
      symbol: "TCS",
      ticker: "TCS",
    },
    {
      id: "6985df3775e96d05f9d825e3", // You need to add these stocks to your backend
      name: "HCL Technologies",
      symbol: "HCLTECH",
      ticker: "HCLTECH",
    },
    {
      id: "6985df0475e96d05f9d825de",
      name: "Infosys",
      symbol: "INFY",
      ticker: "INFY",
    },
    {
      id: "6985df4375e96d05f9d825e5",
      name: "Tech Mahindra",
      symbol: "TECHM",
      ticker: "TECHM",
    },
    {
      id: "6985df2875e96d05f9d825e1",
      name: "Wipro",
      symbol: "WIPRO",
      ticker: "WIPRO",
    },
  ];

  const filteredStocks = availableStocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectStock = (stock) => {
    onStockSelect(stock);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search stocks (e.g., TCS, Infosys, Reliance)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 font-medium placeholder-gray-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
            🔍
          </span>
        </div>

        {currentStock && (
          <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-xl">
            <span className="text-sm font-semibold text-blue-800">
              Current:
            </span>
            <span className="text-sm font-bold text-blue-900">
              {currentStock.symbol}
            </span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && searchQuery && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-300 rounded-xl shadow-2xl z-20 max-h-80 overflow-y-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => handleSelectStock(stock)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{stock.name}</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {stock.symbol}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                      {stock.ticker}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <p className="font-semibold">No stocks found</p>
                <p className="text-sm mt-1">
                  Try searching for TCS, Infosys, or Reliance
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick Select Buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        <p className="text-sm text-gray-600 font-medium w-full mb-1">
          Quick Select:
        </p>
        {availableStocks.slice(0, 5).map((stock) => (
          <button
            key={stock.id}
            onClick={() => handleSelectStock(stock)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              currentStock?.id === stock.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            {stock.symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockSearch;
