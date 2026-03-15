import { motion } from "framer-motion";
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
  Bot
} from "lucide-react";
import LandingGraph from "../components/LandingGraph";

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">STOCK<span className="text-blue-500">PULSE</span></span>
          </div>
          <Link 
            to="/dashboard"
            className="group px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Launch Terminal
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black text-blue-100 uppercase tracking-widest">Next-Gen Sentiment Intel</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter italic">
                DON'T JUST TRADE.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-white">OBSERVE THE PULSE.</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                Bridging the gap between news sentiment and price action using advanced neural processing. Real-time insights for the modern investor.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <Link 
                  to="/dashboard"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Get Started Free
                </Link>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center font-bold text-[10px]">
                      H{i}
                    </div>
                  ))}
                  <div className="pl-4 text-xs font-bold text-gray-500">Joined by 2k+ traders</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
              <div className="relative z-10 scale-110 md:scale-125">
                <LandingGraph />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 hidden md:block"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400">TCS Sentiment</div>
                      <div className="text-sm font-black text-emerald-400">+84% Bullish</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">THE TERMINAL ADVANTAGE</h2>
            <p className="text-gray-400 font-medium max-w-lg mx-auto italic">High-frequency news processing meets deep-learning price modeling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1: AI Summary */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 relative overflow-hidden group border border-white/10 shadow-2xl"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-3 bg-white/20 rounded-2xl w-fit mb-6">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">Market Pulse AI</h3>
                <p className="text-blue-100/80 font-medium max-w-sm">Compress 1,000+ news articles into 3 impactful bullet points. Real-time intelligence at scale.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <BrainCircuit className="w-64 h-64 text-white" />
              </div>
            </motion.div>

            {/* Feature 2: Prediction */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-zinc-900 rounded-[32px] p-8 border border-white/5 shadow-2xl overflow-hidden group"
            >
              <div className="flex flex-col h-full">
                <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-6">
                  <BarChart3 className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-black mb-2">Price Forecast</h3>
                <p className="text-gray-500 text-sm font-medium">Neural engine correlated 30 days of data to predict next 48h movement with 85% accuracy.</p>
              </div>
            </motion.div>

            {/* Feature 3: Heatmap */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#111] rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-amber-500/10 rounded-2xl w-fit mb-6 text-amber-500">
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black mb-2 italic uppercase">Sector Heatmap</h3>
              </div>
              <p className="text-gray-500 text-sm font-medium">Identify capital rotation across sectors instantly through visual sentiment distribution.</p>
            </motion.div>

            {/* Feature 4: News Feed */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-gradient-to-r from-zinc-900 to-[#111] rounded-[32px] p-10 border border-white/5 shadow-2xl flex items-center gap-8 group"
            >
              <div className="hidden sm:flex flex-shrink-0 w-32 h-32 bg-blue-500/10 rounded-3xl items-center justify-center">
                <Newspaper className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Sources</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight">Real-time News Engine</h3>
                <p className="text-gray-500 font-medium">Auto-aggregating from top 20+ financial outlets including Yahoo, Reuters, and Investing.com</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[48px] p-12 text-center space-y-8 shadow-3xl shadow-blue-500/20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">
              READY TO OBSERVE<br /> THE INVISIBLE?
            </h2>
            <Link 
              to="/dashboard"
              className="inline-block px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-transform"
            >
              Enter the Dashboard
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">© 2026 STOCKPULSE AI TERMINAL v2.1</div>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold text-gray-500 hover:text-white cursor-pointer uppercase tracking-widest">Twitter</span>
              <span className="text-[10px] font-bold text-gray-500 hover:text-white cursor-pointer uppercase tracking-widest">Discord</span>
              <span className="text-[10px] font-bold text-gray-500 hover:text-white cursor-pointer uppercase tracking-widest">
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
