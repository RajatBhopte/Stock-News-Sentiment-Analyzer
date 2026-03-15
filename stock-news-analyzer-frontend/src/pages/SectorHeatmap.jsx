import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutGrid, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SectorHeatmap = ({ standalone = true, onStockSelect }) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sectors/heatmap");
        setSectors(response.data);
      } catch (error) {
        console.error("Error fetching heatmap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  const getSentimentColor = (score) => {
    if (score > 0.1) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    if (score < -0.1) return "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400";
    return "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400";
  };

  const getIntensityColor = (score) => {
    const abs = Math.abs(score);
    if (score > 0.1) {
      if (abs > 0.5) return "bg-emerald-600";
      if (abs > 0.3) return "bg-emerald-500";
      return "bg-emerald-400";
    }
    if (score < -0.1) {
      if (abs > 0.5) return "bg-rose-600";
      if (abs > 0.3) return "bg-rose-500";
      return "bg-rose-400";
    }
    return "bg-slate-400";
  };

  if (loading) {
    return (
      <div className={`${standalone ? "min-h-screen" : "py-12"} flex items-center justify-center`}>
        <div className="animate-pulse flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full mb-4 opacity-50"></div>
          <p className="text-gray-500 font-medium">Loading Heatmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={standalone ? "min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8" : "py-8"}>
      <div className={standalone ? "max-w-7xl mx-auto space-y-8" : "space-y-6"}>
        {standalone && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <LayoutGrid className="w-8 h-8 text-blue-500" />
                  Market Sector Heatmap
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Real-time sentiment distribution across industries</p>
              </div>
            </div>
          </div>
        )}

        {!standalone && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <LayoutGrid className="w-6 h-6 text-blue-500" />
              BULLBEAR Heatmap
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sentiment distribution across major industries</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, idx) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white uppercase tracking-wider">{sector.name}</h2>
                  <p className="text-sm text-gray-400">{sector.stocks.length} Companies</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${getSentimentColor(sector.avgSentiment)}`}>
                  {sector.avgSentiment > 0.1 ? <TrendingUp className="w-4 h-4" /> : sector.avgSentiment < -0.1 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  {(sector.avgSentiment * 100).toFixed(1)}% Score
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {sector.stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    title={`${stock.name}: ${(stock.sentiment * 100).toFixed(1)}%`}
                    onClick={() => onStockSelect?.({ id: stock._id, name: stock.name, symbol: stock.symbol })}
                    className={`h-16 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-md ${getIntensityColor(stock.sentiment)}`}
                  >
                    <span className="text-white font-bold text-xs">{stock.symbol}</span>
                    <span className="text-white/80 text-[10px]">{(stock.sentiment * 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Bullish (&gt;0.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Positive (&gt;0.1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-400 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Negative (&lt;-0.1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Bearish (&lt;-0.5)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorHeatmap;
