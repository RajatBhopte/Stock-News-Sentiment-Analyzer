// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// import { useState, useEffect } from "react";
// import {
//   ComposedChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   ReferenceLine,
// } from "recharts";

// const PriceSentimentChart = ({ stockId }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState(7);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${BASE_URL}/api/stock/price-sentiment/${stockId}?days=${timeRange}`,
//         );
//         const result = await response.json();

//         // Calculate price change from previous day
//         const formatted = result.map((item, index) => {
//           let priceChange = 0;
//           let priceChangePercent = 0;

//           if (index > 0) {
//             const prevClose = result[index - 1].close;
//             priceChange = item.close - prevClose;
//             priceChangePercent = ((priceChange / prevClose) * 100).toFixed(2);
//           }

//           return {
//             date: new Date(item.date).toLocaleDateString("en-IN", {
//               month: "short",
//               day: "numeric",
//             }),
//             fullDate: item.date,
//             close: parseFloat(item.close.toFixed(2)),
//             sentiment: item.sentiment
//               ? parseFloat(item.sentiment.toFixed(3))
//               : null,
//             label: item.label,
//             articleCount: item.articleCount || 0,
//             high: parseFloat(item.high.toFixed(2)),
//             low: parseFloat(item.low.toFixed(2)),
//             open: parseFloat(item.open.toFixed(2)),
//             priceChange: parseFloat(priceChange.toFixed(2)),
//             priceChangePercent: parseFloat(priceChangePercent),
//           };
//         });

//         setData(formatted);
//       } catch (err) {
//         console.error("Failed to fetch data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (stockId) fetchData();
//   }, [stockId, timeRange]);

//   if (loading) {
//     return (
//       <div className="h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
//         <div className="text-gray-500 animate-pulse font-semibold text-lg">
//           Loading comparison data...
//         </div>
//       </div>
//     );
//   }

//   if (data.length === 0) {
//     return (
//       <div className="h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg font-semibold">
//             No data available
//           </p>
//           <p className="text-gray-500 text-sm mt-2">Check back later</p>
//         </div>
//       </div>
//     );
//   }

//   // Calculate stats
//   const totalReturn = (
//     ((data[data.length - 1].close - data[0].close) / data[0].close) *
//     100
//   ).toFixed(2);
//   const avgSentiment =
//     data
//       .filter((d) => d.sentiment !== null)
//       .reduce((sum, d) => sum + d.sentiment, 0) /
//       data.filter((d) => d.sentiment !== null).length || 0;
//   const totalArticles = data.reduce((sum, d) => sum + d.articleCount, 0);

//   const bullishDays = data.filter((d) => d.label === "bullish").length;
//   const bearishDays = data.filter((d) => d.label === "bearish").length;
//   const neutralDays = data.filter((d) => d.label === "neutral").length;

//   // FIXED Y-AXIS CALCULATION
//   const prices = data.map((d) => d.close);
//   const minPrice = Math.min(...prices);
//   const maxPrice = Math.max(...prices);
//   const priceRange = maxPrice - minPrice;
//   const pricePadding = priceRange * 0.1; // 10% padding

//   const priceDomain = [
//     Math.floor(minPrice - pricePadding),
//     Math.ceil(maxPrice + pricePadding),
//   ];

//   // Sentiment domain
//   const sentiments = data
//     .filter((d) => d.sentiment !== null)
//     .map((d) => d.sentiment);
//   const minSentiment = Math.min(...sentiments);
//   const maxSentiment = Math.max(...sentiments);
//   const sentimentRange = maxSentiment - minSentiment;
//   const sentimentPadding = sentimentRange * 0.15;

//   const sentimentDomain = [
//     parseFloat((minSentiment - sentimentPadding).toFixed(2)),
//     parseFloat((maxSentiment + sentimentPadding).toFixed(2)),
//   ];

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-white p-4 border-2 border-gray-300 rounded-xl shadow-2xl min-w-[280px]">
//           <p className="font-bold text-gray-900 text-base mb-3">{data.date}</p>

//           {/* Price */}
//           <div className="mb-3 pb-3 border-b border-gray-200">
//             <div className="flex items-center gap-2 mb-1">
//               <div className="w-3 h-3 rounded-full bg-blue-600"></div>
//               <span className="text-xs font-bold text-gray-600 uppercase">
//                 Price
//               </span>
//             </div>
//             <p className="text-2xl font-bold text-blue-600">₹{data.close}</p>
//             {data.priceChange !== 0 && (
//               <p
//                 className={`text-sm font-semibold ${data.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
//               >
//                 {data.priceChange >= 0 ? "+" : ""}₹{data.priceChange} (
//                 {data.priceChangePercent >= 0 ? "+" : ""}
//                 {data.priceChangePercent}%)
//               </p>
//             )}
//             <p className="text-xs text-gray-600 mt-1">
//               High: ₹{data.high} • Low: ₹{data.low}
//             </p>
//           </div>

//           {/* Sentiment */}
//           {data.sentiment !== null ? (
//             <>
//               <div className="flex items-center gap-2 mb-1">
//                 <div
//                   className={`w-3 h-3 rounded-full ${data.sentiment >= 0 ? "bg-green-600" : "bg-red-600"}`}
//                 ></div>
//                 <span className="text-xs font-bold text-gray-600 uppercase">
//                   Sentiment
//                 </span>
//               </div>
//               <p
//                 className={`text-2xl font-bold ${
//                   data.sentiment >= 0 ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 {data.sentiment > 0 ? "+" : ""}
//                 {data.sentiment}
//               </p>
//               <p className="text-sm font-semibold text-gray-700 capitalize mt-1">
//                 {data.label} • {data.articleCount} articles
//               </p>
//             </>
//           ) : (
//             <p className="text-sm text-gray-500">No sentiment data</p>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h3 className="text-2xl font-bold text-gray-900">
//             Price vs Sentiment Comparison
//           </h3>
//           <p className="text-sm text-gray-600 mt-1 font-medium">
//             {data.length} days • {totalArticles} articles •{" "}
//             {totalReturn >= 0 ? "+" : ""}
//             {totalReturn}% return
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {[7, 14, 30].map((days) => (
//             <button
//               key={days}
//               onClick={() => setTimeRange(days)}
//               className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
//                 timeRange === days
//                   ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
//                   : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
//               }`}
//             >
//               {days}D
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* SINGLE CHART WITH BOTH LINES */}
//       <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
//         <ResponsiveContainer width="100%" height={400}>
//           <ComposedChart
//             data={data}
//             margin={{ top: 10, right: 70, left: 20, bottom: 0 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

//             <XAxis
//               dataKey="date"
//               tick={{ fontSize: 12, fontWeight: 600 }}
//               stroke="#6b7280"
//             />

//             {/* LEFT Y-AXIS: Price */}
//             <YAxis
//               yAxisId="price"
//               domain={priceDomain}
//               tick={{ fontSize: 12, fontWeight: 600 }}
//               stroke="#3b82f6"
//               label={{
//                 value: "Price (₹)",
//                 angle: -90,
//                 position: "insideLeft",
//                 style: { fill: "#3b82f6", fontWeight: "bold", fontSize: 14 },
//               }}
//             />

//             {/* RIGHT Y-AXIS: Sentiment */}
//             <YAxis
//               yAxisId="sentiment"
//               orientation="right"
//               domain={sentimentDomain}
//               tick={{ fontSize: 12, fontWeight: 600 }}
//               stroke="#16a34a"
//               tickFormatter={(value) => value.toFixed(1)}
//               label={{
//                 value: "Sentiment",
//                 angle: 90,
//                 position: "insideRight",
//                 style: { fill: "#16a34a", fontWeight: "bold", fontSize: 14 },
//               }}
//             />

//             <Tooltip content={<CustomTooltip />} />

//             <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />

//             {/* Reference line at sentiment 0 */}
//             <ReferenceLine
//               yAxisId="sentiment"
//               y={0}
//               stroke="#9ca3af"
//               strokeDasharray="5 5"
//               strokeWidth={1.5}
//             />

//             {/* PRICE LINE (Blue) - CURVED */}
//             <Line
//               yAxisId="price"
//               type="monotone"
//               dataKey="close"
//               stroke="#3b82f6"
//               strokeWidth={4}
//               dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6, stroke: "#fff" }}
//               activeDot={{ r: 8 }}
//               name="Stock Price (₹)"
//             />

//             {/* SENTIMENT LINE (Green/Red) - CURVED */}
//             <Line
//               yAxisId="sentiment"
//               type="monotone"
//               dataKey="sentiment"
//               stroke="#16a34a"
//               strokeWidth={4}
//               dot={(props) => {
//                 const { cx, cy, payload } = props;
//                 if (payload.sentiment === null) return null;
//                 const color = payload.sentiment >= 0 ? "#16a34a" : "#dc2626";
//                 return (
//                   <circle
//                     cx={cx}
//                     cy={cy}
//                     r={6}
//                     fill={color}
//                     stroke="#fff"
//                     strokeWidth={2}
//                   />
//                 );
//               }}
//               activeDot={{ r: 8 }}
//               name="Sentiment Score"
//               connectNulls
//             />
//           </ComposedChart>
//         </ResponsiveContainer>

//         <p className="text-center text-sm text-gray-600 mt-3 font-medium">
//           📊 Blue line = Stock price (left axis) • Green/Red line = Sentiment
//           score (right axis)
//         </p>
//       </div>

//       {/* STATS CARDS */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
//           <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">
//             Price Change
//           </p>
//           <p
//             className={`text-4xl font-bold mt-2 ${
//               totalReturn >= 0 ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {totalReturn > 0 ? "+" : ""}
//             {totalReturn}%
//           </p>
//           <p className="text-xs text-blue-600 font-semibold mt-1">
//             ₹{data[0]?.close} → ₹{data[data.length - 1]?.close}
//           </p>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
//           <p className="text-xs text-green-800 font-bold uppercase tracking-wider">
//             Bullish Days
//           </p>
//           <p className="text-4xl font-bold text-green-700 mt-2">
//             {bullishDays}
//           </p>
//           <p className="text-xs text-green-600 font-semibold mt-1">
//             {data.length > 0
//               ? ((bullishDays / data.length) * 100).toFixed(0)
//               : 0}
//             % of period
//           </p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
//           <p className="text-xs text-red-800 font-bold uppercase tracking-wider">
//             Bearish Days
//           </p>
//           <p className="text-4xl font-bold text-red-700 mt-2">{bearishDays}</p>
//           <p className="text-xs text-red-600 font-semibold mt-1">
//             {data.length > 0
//               ? ((bearishDays / data.length) * 100).toFixed(0)
//               : 0}
//             % of period
//           </p>
//         </div>

//         <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
//           <p className="text-xs text-purple-800 font-bold uppercase tracking-wider">
//             Avg Sentiment
//           </p>
//           <p
//             className={`text-4xl font-bold mt-2 ${
//               avgSentiment >= 0 ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {avgSentiment > 0 ? "+" : ""}
//             {avgSentiment.toFixed(2)}
//           </p>
//           <p className="text-xs text-purple-600 font-semibold mt-1">
//             {avgSentiment >= 0 ? "Positive trend" : "Negative trend"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceSentimentChart;
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

const PriceSentimentChart = ({ stockId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/stock/price-sentiment/${stockId}?days=${timeRange}`,
        );
        const result = await response.json();

        const formatted = result.map((item, index) => {
          let priceChange = 0;
          let priceChangePercent = 0;

          if (index > 0) {
            const prevClose = result[index - 1].close;
            priceChange = item.close - prevClose;
            priceChangePercent = ((priceChange / prevClose) * 100).toFixed(2);
          }

          return {
            date: new Date(item.date).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            }),
            fullDate: item.date,
            close: parseFloat(item.close.toFixed(2)),
            sentiment: item.sentiment
              ? parseFloat(item.sentiment.toFixed(3))
              : null,
            label: item.label,
            articleCount: item.articleCount || 0,
            high: parseFloat(item.high.toFixed(2)),
            low: parseFloat(item.low.toFixed(2)),
            open: parseFloat(item.open.toFixed(2)),
            priceChange: parseFloat(priceChange.toFixed(2)),
            priceChangePercent: parseFloat(priceChangePercent),
          };
        });

        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (stockId) fetchData();
  }, [stockId, timeRange]);

  if (loading) {
    return (
      <div className="h-[300px] sm:h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-gray-500 animate-pulse font-semibold text-base sm:text-lg">
          Loading comparison data...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] sm:h-[450px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <p className="text-gray-600 text-base sm:text-lg font-semibold">
            No data available
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Check back later
          </p>
        </div>
      </div>
    );
  }

  const totalReturn = (
    ((data[data.length - 1].close - data[0].close) / data[0].close) *
    100
  ).toFixed(2);
  const avgSentiment =
    data
      .filter((d) => d.sentiment !== null)
      .reduce((sum, d) => sum + d.sentiment, 0) /
      data.filter((d) => d.sentiment !== null).length || 0;
  const totalArticles = data.reduce((sum, d) => sum + d.articleCount, 0);

  const bullishDays = data.filter((d) => d.label === "bullish").length;
  const bearishDays = data.filter((d) => d.label === "bearish").length;
  const neutralDays = data.filter((d) => d.label === "neutral").length;

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const pricePadding = priceRange * 0.1;

  const priceDomain = [
    Math.floor(minPrice - pricePadding),
    Math.ceil(maxPrice + pricePadding),
  ];

  const sentiments = data
    .filter((d) => d.sentiment !== null)
    .map((d) => d.sentiment);
  const minSentiment = Math.min(...sentiments);
  const maxSentiment = Math.max(...sentiments);
  const sentimentRange = maxSentiment - minSentiment;
  const sentimentPadding = sentimentRange * 0.15;

  const sentimentDomain = [
    parseFloat((minSentiment - sentimentPadding).toFixed(2)),
    parseFloat((maxSentiment + sentimentPadding).toFixed(2)),
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 sm:p-4 border-2 border-gray-300 rounded-lg sm:rounded-xl shadow-2xl min-w-[200px] sm:min-w-[280px] max-w-[90vw]">
          <p className="font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">
            {data.date}
          </p>

          <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600"></div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase">
                Price
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              ₹{data.close}
            </p>
            {data.priceChange !== 0 && (
              <p
                className={`text-xs sm:text-sm font-semibold ${data.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {data.priceChange >= 0 ? "+" : ""}₹{data.priceChange} (
                {data.priceChangePercent >= 0 ? "+" : ""}
                {data.priceChangePercent}%)
              </p>
            )}
            <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
              High: ₹{data.high} • Low: ₹{data.low}
            </p>
          </div>

          {data.sentiment !== null ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${data.sentiment >= 0 ? "bg-green-600" : "bg-red-600"}`}
                ></div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase">
                  Sentiment
                </span>
              </div>
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  data.sentiment >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {data.sentiment > 0 ? "+" : ""}
                {data.sentiment}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 capitalize mt-1">
                {data.label} • {data.articleCount} articles
              </p>
            </>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              No sentiment data
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Price vs Sentiment
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            {data.length} days • {totalArticles} articles •{" "}
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn}% return
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                timeRange === days
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* CHART - Responsive height and margins */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-3 sm:p-6 shadow-lg">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: isMobile ? 10 : 70,
              left: isMobile ? 0 : 20,
              bottom: 0,
            }}
            onClick={() => {}} // Enables mobile touch events - DO NOT REMOVE
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
              stroke="#6b7280"
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
              interval={isMobile ? "preserveStartEnd" : 0}
            />

            {/* LEFT Y-AXIS: Price */}
            <YAxis
              yAxisId="price"
              domain={priceDomain}
              tick={{ fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
              stroke="#3b82f6"
              width={isMobile ? 50 : 60}
              label={
                !isMobile
                  ? {
                      value: "Price (₹)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "#3b82f6",
                        fontWeight: "bold",
                        fontSize: 14,
                      },
                    }
                  : undefined
              }
            />

            {/* RIGHT Y-AXIS: Sentiment */}
            <YAxis
              yAxisId="sentiment"
              orientation="right"
              domain={sentimentDomain}
              tick={{ fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
              stroke="#16a34a"
              tickFormatter={(value) => value.toFixed(1)}
              width={isMobile ? 45 : 60}
              label={
                !isMobile
                  ? {
                      value: "Sentiment",
                      angle: 90,
                      position: "insideRight",
                      style: {
                        fill: "#16a34a",
                        fontWeight: "bold",
                        fontSize: 14,
                      },
                    }
                  : undefined
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              trigger={isMobile ? "click" : "hover"}
              allowEscapeViewBox={{ x: true, y: true }}
            />

            {!isMobile && (
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            )}

            <ReferenceLine
              yAxisId="sentiment"
              y={0}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />

            {/* PRICE LINE */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke="#3b82f6"
              strokeWidth={isMobile ? 2 : 4}
              dot={
                isMobile
                  ? { fill: "#3b82f6", strokeWidth: 1, r: 3, stroke: "#fff" }
                  : { fill: "#3b82f6", strokeWidth: 2, r: 6, stroke: "#fff" }
              }
              activeDot={{ r: isMobile ? 5 : 8 }}
              name="Stock Price (₹)"
            />

            {/* SENTIMENT LINE */}
            <Line
              yAxisId="sentiment"
              type="monotone"
              dataKey="sentiment"
              stroke="#16a34a"
              strokeWidth={isMobile ? 2 : 4}
              dot={
                isMobile
                  ? (props) => {
                      const { cx, cy, payload } = props;
                      if (payload.sentiment === null) return null;
                      const color =
                        payload.sentiment >= 0 ? "#16a34a" : "#dc2626";
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      );
                    }
                  : (props) => {
                      const { cx, cy, payload } = props;
                      if (payload.sentiment === null) return null;
                      const color =
                        payload.sentiment >= 0 ? "#16a34a" : "#dc2626";
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }
              }
              activeDot={{ r: isMobile ? 5 : 8 }}
              name="Sentiment Score"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>

        <p className="text-center text-[10px] sm:text-sm text-gray-600 mt-2 sm:mt-3 font-medium px-2">
          📊 Blue = Price (left) • Green/Red = Sentiment (right)
        </p>
      </div>

      {/* STATS CARDS - Responsive text sizes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-blue-800 font-bold uppercase tracking-wider">
            Price Change
          </p>
          <p
            className={`text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 ${
              totalReturn >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalReturn > 0 ? "+" : ""}
            {totalReturn}%
          </p>
          <p className="text-[9px] sm:text-xs text-blue-600 font-semibold mt-1">
            ₹{data[0]?.close} → ₹{data[data.length - 1]?.close}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-green-800 font-bold uppercase tracking-wider">
            Bullish Days
          </p>
          <p className="text-2xl sm:text-4xl font-bold text-green-700 mt-1 sm:mt-2">
            {bullishDays}
          </p>
          <p className="text-[9px] sm:text-xs text-green-600 font-semibold mt-1">
            {data.length > 0
              ? ((bullishDays / data.length) * 100).toFixed(0)
              : 0}
            % of period
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-red-800 font-bold uppercase tracking-wider">
            Bearish Days
          </p>
          <p className="text-2xl sm:text-4xl font-bold text-red-700 mt-1 sm:mt-2">
            {bearishDays}
          </p>
          <p className="text-[9px] sm:text-xs text-red-600 font-semibold mt-1">
            {data.length > 0
              ? ((bearishDays / data.length) * 100).toFixed(0)
              : 0}
            % of period
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[10px] sm:text-xs text-purple-800 font-bold uppercase tracking-wider">
            Avg Sentiment
          </p>
          <p
            className={`text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 ${
              avgSentiment >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {avgSentiment > 0 ? "+" : ""}
            {avgSentiment.toFixed(2)}
          </p>
          <p className="text-[9px] sm:text-xs text-purple-600 font-semibold mt-1">
            {avgSentiment >= 0 ? "Positive trend" : "Negative trend"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSentimentChart;
