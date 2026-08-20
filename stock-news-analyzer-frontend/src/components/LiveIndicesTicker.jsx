import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;
const SlimIndicesTicker = () => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/indices`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setIndices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const IndexItem = ({ data }) => {
    const isPositive = data.changePercent >= 0;

    return (
      <div className="flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 whitespace-nowrap">
        <span className="text-[10px] sm:text-sm font-bold text-gray-800 uppercase tracking-wide">
          {data.name}
        </span>
        <span className="text-xs sm:text-lg font-bold text-gray-900">
          {data.value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <div
          className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-sm font-bold ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {data.change.toFixed(2)}
          </span>
          <span className="opacity-80">
            ({isPositive ? "+" : ""}
            {data.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="py-2 sm:py-3 text-center text-xs sm:text-sm text-gray-600">
        Loading market data...
      </div>
    );
  if (error)
    return (
      <div className="py-2 sm:py-3 px-3 text-center text-xs sm:text-sm text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b-2 border-gray-200 shadow-md overflow-hidden">
      <div className="relative py-2 sm:py-3">
        <div className="flex animate-scroll">
          {indices.map((index, idx) => (
            <IndexItem key={`first-${idx}`} data={index} />
          ))}
          {indices.map((index, idx) => (
            <IndexItem key={`second-${idx}`} data={index} />
          ))}
          {indices.map((index, idx) => (
            <IndexItem key={`third-${idx}`} data={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlimIndicesTicker;
