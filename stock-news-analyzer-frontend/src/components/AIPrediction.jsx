import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, Minus, Info, BrainCircuit, Target, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AIPrediction = ({ stockId }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (signal = null) => {
    if (!stockId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ai/predict/${stockId}`, { signal });
      setPrediction(response.data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error("Prediction Error:", err);
      const errMsg = err.response?.data?.message || "AI Forecast temporarily unavailable.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchPrediction(controller.signal);
    return () => controller.abort();
  }, [stockId]);

  const getDirectionInfo = (dir) => {
    switch (dir?.toLowerCase()) {
      case "bullish": return { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Bullish Outlook" };
      case "bearish": return { icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Bearish Outlook" };
      default: return { icon: Minus, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "Neutral Stance" };
    }
  };

  const info = getDirectionInfo(prediction?.direction);
  const DirIcon = info.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 shadow-xl overflow-hidden relative">
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex-shrink-0">
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">AI Price Forecast</h2>
              <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Next 24-48 Hours</p>
            </div>
          </div>
          <button
            onClick={() => fetchPrediction()}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <BrainCircuit className={`w-5 h-5 text-indigo-500 ${loading ? "animate-pulse" : ""}`} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 sm:py-12 flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-indigo-500 rounded-full animate-spin" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 animate-pulse text-center px-4">Running Correlation Analysis...</p>
            </motion.div>
          ) : error ? (
            <motion.div key="error" className="py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-full w-fit mx-auto mb-4">
                <Info className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 px-2">{error}</p>
              <button
                onClick={() => fetchPrediction()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Request Analysis
              </button>
            </motion.div>
          ) : prediction && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Main Signal Card */}
              <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl ${info.bg} border ${info.border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`p-2.5 sm:p-3 rounded-full bg-white dark:bg-gray-900 shadow-sm flex-shrink-0 ${info.color}`}>
                    <DirIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${info.color}`}>Signal</span>
                    <h3 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white leading-tight">{info.label}</h3>
                  </div>
                </div>
                <div className="sm:text-right flex-shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 sm:w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        className="h-full bg-indigo-500"
                      />
                    </div>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{prediction.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Target className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Target Range</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                      ₹{prediction.predictedRange.low.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">to</span>
                    <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                      ₹{prediction.predictedRange.high.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">AI Reasoning</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 font-medium line-clamp-3 sm:line-clamp-2 italic">
                    "{prediction.reasoning}"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 px-1 sm:px-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mt-1 flex-shrink-0" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Neural engine correlated 30 days of sentiment vs price data
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIPrediction;
