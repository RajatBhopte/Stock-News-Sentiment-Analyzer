import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const demoData = [
  { date: "Day 1", price: 1340, sentiment: 0.2 },
  { date: "Day 2", price: 1355, sentiment: 0.5 },
  { date: "Day 3", price: 1345, sentiment: -0.1 },
  { date: "Day 4", price: 1348, sentiment: -0.2 },
  { date: "Day 5", price: 1352, sentiment: 0.4 },
  { date: "Day 6", price: 1360, sentiment: 0.7 },
  { date: "Day 7", price: 1350, sentiment: 0.1 },
  { date: "Day 8", price: 1345, sentiment: -0.1 },
  { date: "Day 9", price: 1355, sentiment: 0.3 },
  { date: "Day 10", price: 1340, sentiment: -0.3 },
];

const splitOffset = (() => {
  const dataMax = Math.max(...demoData.map((i) => i.sentiment));
  const dataMin = Math.min(...demoData.map((i) => i.sentiment));
  if (dataMax <= 0) return 0;
  if (dataMin >= 0) return 1;
  return dataMax / (dataMax - dataMin);
})();

const LandingGraph = () => {
  return (
    <div className="w-full h-full min-h-[300px] bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Live Correlation Engine</h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-80">Sentiment vs Price Pulse</p>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.6)]" />
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Sentiment</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={demoData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="splitColorSentiment" x1="0" y1="0" x2="0" y2="1">
              <stop offset={splitOffset} stopColor="#10b981" stopOpacity={0.4} />
              <stop offset={splitOffset} stopColor="#ef4444" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="splitColorSentimentLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset={splitOffset} stopColor="#10b981" stopOpacity={1} />
              <stop offset={splitOffset} stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
            dy={10}
          />
          <YAxis 
            yAxisId="price"
            domain={[1330, 1370]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 700, fill: '#3b82f6' }}
            width={35}
          />
          <YAxis 
            yAxisId="sentiment"
            orientation="right"
            domain={[-1, 1]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 700, fill: '#10b981' }}
            width={35}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transform scale-105 transition-all">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-3 tracking-[0.2em]">{payload[0].payload.date}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Price</span>
                        <p className="text-sm font-black text-slate-700">₹{payload[0].value.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Sentiment</span>
                        <p className={`text-sm font-black ${payload[1].value >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {(payload[1].value * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine yAxisId="sentiment" y={0} stroke="#9ca3af" strokeDasharray="3 3" opacity={0.3} />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="#64748b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={2000}
            dot={{ fill: "#64748b", strokeWidth: 2, r: 4, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#475569" }}
          />
          <Area
            yAxisId="sentiment"
            type="monotone"
            dataKey="sentiment"
            stroke="url(#splitColorSentimentLine)"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#splitColorSentiment)"
            animationDuration={2500}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const color = payload.sentiment >= 0 ? "#10b981" : "#ef4444";
              return (
                <circle
                  key={`dot-${payload.date}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Correlating 24h News Impact</p>
      </div>
    </div>
  );
};

export default LandingGraph;
