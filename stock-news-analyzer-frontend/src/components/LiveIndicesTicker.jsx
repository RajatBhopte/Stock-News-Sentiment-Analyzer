import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const SlimIndicesTicker = () => {
  const [indices, setIndices] = useState([
    {
      name: "NIFTY 50",
      baseValue: 22485.1,
      value: 22485.1,
      change: 0,
      changePercent: 0,
    },
    {
      name: "NIFTY IT",
      baseValue: 35420.5,
      value: 35420.5,
      change: 0,
      changePercent: 0,
    },
    {
      name: "BANK NIFTY",
      baseValue: 48190.3,
      value: 48190.3,
      change: 0,
      changePercent: 0,
    },
    {
      name: "SENSEX",
      baseValue: 74280.45,
      value: 74280.45,
      change: 0,
      changePercent: 0,
    },
  ]);

  useEffect(() => {
    const updateIndices = () => {
      setIndices((prev) =>
        prev.map((index) => {
          const randomChange = (Math.random() - 0.5) * 0.01;
          const newValue = index.baseValue * (1 + randomChange);
          const change = newValue - index.baseValue;
          const changePercent = (change / index.baseValue) * 100;

          return {
            ...index,
            value: newValue,
            change,
            changePercent,
          };
        }),
      );
    };

    updateIndices();
    const interval = setInterval(updateIndices, 2000); // Updates every 2 seconds
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

  return (
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b-2 border-gray-200 shadow-md overflow-hidden">
      <div className="relative py-3">
        {/* Scrolling animation */}
        <div className="flex animate-scroll">
          {/* First set of indices */}
          {indices.map((index, idx) => (
            <IndexItem key={`first-${idx}`} data={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {indices.map((index, idx) => (
            <IndexItem key={`second-${idx}`} data={index} />
          ))}
          {/* Another duplicate for smooth continuous scroll */}
          {indices.map((index, idx) => (
            <IndexItem key={`third-${idx}`} data={index} />
          ))}
        </div>
      </div>

      {/* Add this to your global CSS or index.css */}
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
