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

const LandingGraph = () => {
  return (
    <div className="w-full h-full min-h-[300px] bg-white/70 dark:bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Live Correlation Engine</h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-80">Sentiment vs Price Pulse</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
            <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Sentiment</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={demoData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl transform scale-105 transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em]">{payload[0].payload.date}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Price</span>
                        <p className="text-sm font-black text-blue-500">₹{payload[0].value.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Sentiment</span>
                        <p className={`text-sm font-black ${payload[1].value >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
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
            stroke="#3b82f6"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={2000}
            filter="url(#glow)"
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Area
            yAxisId="sentiment"
            type="monotone"
            dataKey="sentiment"
            stroke="#10b981"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorSentiment)"
            animationDuration={2500}
            filter="url(#glow)"
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
