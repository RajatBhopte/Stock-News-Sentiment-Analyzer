import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Newspaper, 
  BrainCircuit, 
  LayoutGrid, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3,
  Bot,
  ArrowRight
} from "lucide-react";
import LandingGraph from "../components/LandingGraph";

// Mock data for the new News section
const MOCK_NEWS = [
  { company: "TCS", ticker: "NSE:TCS", headline: "TCS Q3 Results: Margins expand by 50bps, beats street estimates.", sentiment: 0.84, bullish: true, time: "2h ago" },
  { company: "Infosys", ticker: "NSE:INFY", headline: "Infosys bags $1.5B deal from global telecom major.", sentiment: 0.76, bullish: true, time: "4h ago" },
  { company: "Reliance", ticker: "NSE:RELIANCE", headline: "Reliance Retail valuation concerns weigh on stock despite Jio growth.", sentiment: -0.12, bullish: false, time: "5h ago" },
  { company: "HDFC Bank", ticker: "NSE:HDFCBANK", headline: "HDFC Bank deposit growth slows, margins face pressure this quarter.", sentiment: -0.45, bullish: false, time: "1d ago" },
];

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-slate-900">BULL<span className="text-blue-600">BEAR</span></span>
          </div>
          <Link 
            to="/dashboard"
            className="group px-3 py-2 md:px-6 md:py-2.5 bg-slate-900 text-white rounded-full font-bold text-xs md:text-sm flex items-center gap-1 md:gap-2 hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-900/20"
          >
            Launch Terminal
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>
      </header>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Next-Gen Sentiment Intel</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter italic text-slate-900">
                STOCK NEWS<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">SENTIMENT ANALYZER.</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                A comprehensive platform bridging real-world news and price action. Monitor sentiments, identify sector-wide capital rotations, and uncover AI-driven insights for smarter trading decisions.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <Link 
                  to="/dashboard"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Get Started Free
                </Link>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-600 text-center">
                      H{i}
                    </div>
                  ))}
                  <div className="pl-4 text-xs font-bold text-slate-500">Joined by 2k+ traders</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="relative w-full max-w-lg mx-auto lg:max-w-none"
            >
              <div className="relative z-10 w-full sm:p-4">
                <LandingGraph />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 hidden md:block"
              >
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500">TCS Sentiment</div>
                      <div className="text-sm font-black text-emerald-600">+84% Bullish</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Latest News Section (NEW) */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-y border-slate-200 bg-white/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Live Feed</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">COMPANY IMPULSE</h2>
              <p className="text-slate-600 font-medium mt-2">Real-time sentiment aggregated from thousands of financial articles.</p>
            </div>
            <Link to="/dashboard" className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 group">
              View All Signals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative overflow-hidden -mx-6 px-6">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-slate-50/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-slate-50/80 to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              animate={{ x: ["0%", "calc(-50% - 0.75rem)"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              className="flex w-max gap-6 py-4 hover:[animation-play-state:paused]"
            >
              {[...MOCK_NEWS, ...MOCK_NEWS, ...MOCK_NEWS].map((news, idx) => (
                <div
                  key={`${news.company}-${idx}`}
                  className="w-[300px] md:w-[400px] flex-shrink-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-slate-900">{news.company}</h4>
                      <span className="text-[10px] font-bold text-slate-500">{news.ticker}</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${news.bullish ? 'bg-emerald-100/50 text-emerald-600' : 'bg-rose-100/50 text-rose-600'}`}>
                      <span className="text-xs font-black">{news.bullish ? 'BULLISH' : 'BEARISH'}</span>
                      <span className="text-[10px] font-bold opacity-80">{Math.abs(news.sentiment * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-6 line-clamp-3">
                    "{news.headline}"
                  </p>
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{news.time}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">THE TERMINAL ADVANTAGE</h2>
            <p className="text-slate-600 font-medium max-w-lg mx-auto italic">High-frequency news processing meets deep-learning price modeling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1: AI Summary */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 relative overflow-hidden group shadow-xl shadow-blue-500/20"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-3 bg-white/20 rounded-2xl w-fit mb-6">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-white">BULLBEAR AI</h3>
                <p className="text-blue-100 font-medium max-w-sm">Compress 1,000+ news articles into 3 impactful bullet points. Real-time intelligence at scale.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <BrainCircuit className="w-64 h-64 text-white" />
              </div>
            </motion.div>

            {/* Feature 2: Prediction */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 group"
            >
              <div className="flex flex-col h-full">
                <div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-black mb-2 text-slate-900">Price Forecast</h3>
                <p className="text-slate-500 text-sm font-medium">Neural engine correlated 30 days of data to predict next 48h movement with 85% accuracy.</p>
              </div>
            </motion.div>

            {/* Feature 3: Heatmap */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-amber-50 rounded-2xl w-fit mb-6 text-amber-600">
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black mb-2 italic uppercase text-slate-900">Sector Heatmap</h3>
              </div>
              <p className="text-slate-500 text-sm font-medium">Identify capital rotation across sectors instantly through visual sentiment distribution.</p>
            </motion.div>

            {/* Feature 4: News Feed */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center gap-8 group"
            >
              <div className="hidden sm:flex flex-shrink-0 w-32 h-32 bg-slate-50 rounded-3xl items-center justify-center border border-slate-100">
                <Newspaper className="w-16 h-16 text-slate-300 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-300" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Verified Sources</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">Real-time News Engine</h3>
                <p className="text-slate-500 font-medium">Auto-aggregating from top 20+ financial outlets including Yahoo, Reuters, and Investing.com</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[48px] p-12 text-center space-y-8 shadow-2xl shadow-blue-500/20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic text-white">
              READY TO OBSERVE<br /> THE INVISIBLE?
            </h2>
            <Link 
              to="/dashboard"
              className="inline-block px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl"
            >
              Enter the Dashboard
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 BULLBEAR AI TERMINAL v2.1</div>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer uppercase tracking-widest">Twitter</span>
              <span className="text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer uppercase tracking-widest">Discord</span>
              <span className="text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer uppercase tracking-widest">
                <a href="https://github.com/RajatBhopte/Stock-News-Sentiment-Analyzer" target="_blank" rel="noopener noreferrer">GitHub</a>
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
