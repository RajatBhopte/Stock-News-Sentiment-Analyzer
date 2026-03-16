import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AISummary = ({ stockId }) => {
  const [data, setData] = useState({ summary: "", stockName: "", symbol: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ai/summary/${stockId}`, { signal });
      setData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error("Summary Error:", err);
      const message = err.response?.data?.message || (err.response?.status === 429 ? "AI is resting. Retry in a minute." : "Network or Fetch error.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (stockId) fetchSummary(controller.signal);
    return () => controller.abort();
  }, [stockId]);

  const parseSummary = (text) => {
    if (!text) return { grade: null, bullets: [] };
    
    // Extract Grade
    const gradeMatch = text.match(/GRADE:\s?(\[?[\w\s]+\]?)/i);
    const grade = gradeMatch ? gradeMatch[1].replace(/[\[\]]/g, '').trim() : null;
    
    // Remove the GRADE line for bullet parsing
    const cleanText = text.replace(/GRADE:.*$/im, "").trim();

    // Split by common bullet points or newlines
    const bulletLines = cleanText.split(/\n[•*-]\s?|\n(?=[•*-])|[•*-]\s?/).filter(l => l.trim());
    
    const bullets = bulletLines.map(line => {
      // Look for **THEME**
      const parts = line.split(/\*\*(.*?)\*\*/);
      if (parts.length >= 3) {
        return {
          emoji: parts[0].replace(/[•*-]/g, '').trim() || "💡",
          theme: parts[1].trim(),
          content: parts.slice(2).join('').replace(/^:\s?/, '').trim()
        };
      }
      return null;
    }).filter(Boolean);

    return { grade, bullets, raw: cleanText };
  };

  const { grade, bullets, raw } = parseSummary(data.summary);

  const getGradeStyles = (g) => {
    const val = g?.toUpperCase();
    if (val?.includes('BULLISH')) return "bg-emerald-500 text-white shadow-emerald-500/20";
    if (val?.includes('BEARISH')) return "bg-rose-500 text-white shadow-rose-500/20";
    if (val?.includes('CAUTIOUS') || val?.includes('NEUTRAL')) return "bg-amber-500 text-white shadow-amber-500/20";
    return "bg-blue-500 text-white shadow-blue-500/20";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative group min-h-[200px]">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">BULLBEAR AI</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time analysis</p>
          </div>
        </div>
        {grade && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getGradeStyles(grade)}`}>
            {grade}
          </div>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-50 dark:bg-gray-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{error}</p>
              <button 
                onClick={() => fetchSummary()}
                className="text-xs font-black text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700 transition-colors"
              >
                Try Again Now
              </button>
            </div>
          ) : bullets.length > 0 ? (
            <div className="space-y-5">
              {bullets.map((b, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <span className="text-xl filter drop-shadow-sm">{b.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                        {b.theme}
                      </span>
                      <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/50" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                      {b.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : data.summary ? (
            /* Fallback for raw text if parsing fails */
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-medium bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              {raw}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
              Analyzing latest reports...
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Engine v2.1 Active</span>
        </div>
        <button 
          onClick={() => fetchSummary()} 
          className="text-[10px] font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors uppercase tracking-widest"
        >
          Force Refresh
        </button>
      </div>
    </div>
  );
};

export default AISummary;
