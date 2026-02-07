
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const SlimIndicesTicker = () => {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/indices");
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
      <div className="flex items-center gap-3 px-6 whitespace-nowrap">
        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          {data.name}
        </span>
        <span className="text-lg font-bold text-gray-900">
          {data.value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-bold ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
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
    return <div className="py-3 text-center">Loading market data...</div>;
  if (error)
    return <div className="py-3 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b-2 border-gray-200 shadow-md overflow-hidden">
      <div className="relative py-3">
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

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default SlimIndicesTicker;
