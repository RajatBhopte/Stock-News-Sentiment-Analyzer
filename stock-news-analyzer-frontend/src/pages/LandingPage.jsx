import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  BrainCircuit,
  LayoutGrid,
  ShieldCheck,
  BarChart3,
  Bot,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

// Mock news for the news carousel section
const MOCK_NEWS = [
  { company: "TCS", ticker: "NSE:TCS", headline: "TCS Q3 Results: Margins expand by 50bps, beats street estimates.", sentiment: 0.84, bullish: true, time: "2h ago" },
  { company: "Infosys", ticker: "NSE:INFY", headline: "Infosys bags $1.5B deal from global telecom major.", sentiment: 0.76, bullish: true, time: "4h ago" },
  { company: "Reliance", ticker: "NSE:RELIANCE", headline: "Reliance Retail valuation concerns weigh on stock despite Jio growth.", sentiment: -0.12, bullish: false, time: "5h ago" },
  { company: "HDFC Bank", ticker: "NSE:HDFCBANK", headline: "HDFC Bank deposit growth slows, margins face pressure this quarter.", sentiment: -0.45, bullish: false, time: "1d ago" },
];

// Floating tech icons config
const FLOAT_ICONS = [
  { emoji: "🐍", label: "Python",     top: "12%",  left: "8%",  anim: "se-f1 4.2s ease-in-out infinite",       bg: "rgba(55,118,171,.25)",  bc: "rgba(55,118,171,.5)" },
  { emoji: "🔤", label: "NLTK",       top: "28%",  left: "82%", anim: "se-f2 3.8s .4s ease-in-out infinite",   bg: "rgba(0,255,135,.12)",   bc: "rgba(0,255,135,.4)" },
  { emoji: "😊", label: "VADER",      top: "65%",  left: "88%", anim: "se-f3 5s .8s ease-in-out infinite",     bg: "rgba(0,201,184,.12)",   bc: "rgba(0,201,184,.4)" },
  { emoji: "🐼", label: "Pandas",     top: "78%",  left: "72%", anim: "se-f4 4.5s 1.2s ease-in-out infinite",  bg: "rgba(150,111,51,.25)",  bc: "rgba(200,160,80,.5)" },
  { emoji: "📊", label: "Plotly",     top: "80%",  left: "18%", anim: "se-f5 3.6s .2s ease-in-out infinite",   bg: "rgba(99,46,143,.25)",   bc: "rgba(159,86,203,.5)" },
  { emoji: "📰", label: "NewsAPI",    top: "60%",  left: "6%",  anim: "se-f6 4.8s .6s ease-in-out infinite",   bg: "rgba(255,69,0,.15)",    bc: "rgba(255,120,60,.4)" },
  { emoji: "🧠", label: "FinBERT",    top: "18%",  left: "72%", anim: "se-f7 4s 1s ease-in-out infinite",      bg: "rgba(0,100,180,.25)",   bc: "rgba(0,150,240,.4)" },
  { emoji: "⚡", label: "TensorFlow", top: "42%",  left: "91%", anim: "se-f8 5.2s 0s ease-in-out infinite",   bg: "rgba(255,130,0,.15)",   bc: "rgba(255,160,50,.4)" },
];

// ── Live Indices Ticker (dark-themed, uses real API) ──────────────────────────
const DarkLiveIndicesTicker = () => {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/indices`);
        if (!res.ok) return;
        const data = await res.json();
        setIndices(data);
      } catch (_) {}
    };
    fetchIndices();
    const id = setInterval(fetchIndices, 10000);
    return () => clearInterval(id);
  }, []);

  if (!indices.length) return null;

  const items = [...indices, ...indices, ...indices];

  return (
    <div style={{ overflow: "hidden", background: "rgba(0,255,135,.04)", borderBottom: "1px solid rgba(0,255,135,.1)", padding: "8px 0", position: "relative", zIndex: 100 }}>
      <div style={{ display: "flex", gap: 56, animation: "se-ticker 28s linear infinite", width: "max-content" }}>
        {items.map((idx, i) => {
          const isUp = idx.changePercent >= 0;
          return (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#8ca0c0", whiteSpace: "nowrap", padding: "0 8px" }}>
              <span style={{ color: "#f0f8ff", fontWeight: 700, letterSpacing: ".04em" }}>{idx.name}</span>
              <span>{idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, color: isUp ? "#00ff87" : "#ff4d6a" }}>
                {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {isUp ? "+" : ""}{idx.change.toFixed(2)} ({isUp ? "+" : ""}{idx.changePercent.toFixed(2)}%)
              </span>
              <span style={{ color: "rgba(255,255,255,.1)", fontSize: 10 }}>|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const canvasRef = useRef(null);

  /* Canvas: starfield + candlestick grid */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, stars = [], candles = [], raf;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = Array.from({ length: Math.floor(W * H / 3500) }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + .2,
        speed: Math.random() * .002 + .001,
        phase: Math.random() * Math.PI * 2,
      }));
      candles = Array.from({ length: Math.ceil(W / 28) }, (_, i) => {
        const open = .25 + Math.random() * .5, close = .25 + Math.random() * .5;
        return { x: i * 28 + 14, open, close, high: Math.max(open, close) + Math.random() * .15, low: Math.min(open, close) - Math.random() * .15 };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,201,184,.025)"; ctx.lineWidth = .5;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const now = Date.now() / 1000;
      stars.forEach(s => {
        const a = .25 + .45 * Math.sin(now * s.speed * 40 + s.phase);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${a})`; ctx.fill();
      });
      const baseY = H * .9, scale = H * .16;
      candles.forEach(c => {
        const bull = c.close >= c.open;
        ctx.strokeStyle = bull ? "rgba(0,255,135,.06)" : "rgba(255,77,106,.06)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(c.x, baseY - c.high * scale); ctx.lineTo(c.x, baseY - c.low * scale); ctx.stroke();
        ctx.fillStyle = bull ? "rgba(0,255,135,.06)" : "rgba(255,77,106,.06)";
        const y1 = baseY - c.open * scale, y2 = baseY - c.close * scale;
        ctx.fillRect(c.x - 5, Math.min(y1, y2), 10, Math.max(2, Math.abs(y1 - y2)));
      });
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize(); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{ background: "#050d1a", color: "#f0f8ff", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>

      {/* ── Canvas BG ── */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* ── Top Banner ── */}
      <div style={{
        position: "relative", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        padding: "8px 20px",
        background: "linear-gradient(90deg,rgba(0,255,135,.07),rgba(0,201,184,.07))",
        borderBottom: "1px solid rgba(0,201,184,.15)",
        fontSize: 13, fontWeight: 500, backdropFilter: "blur(8px)",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff87", boxShadow: "0 0 8px #00ff87", animation: "se-pulse 1.8s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ color: "#c8dff8" }}>Now Live: Real-Time Market Sentiment</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, border: "1px solid #00ff87", color: "#00ff87", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          Try for Free →
        </span>
      </div>

      {/* ── Live Indices Ticker (real data) ── */}
      <DarkLiveIndicesTicker />

      {/* ── Navbar ── */}
      <nav style={{
        position: "relative", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 60px",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,.04)",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#00ff87,#00c9b8)", borderRadius: 10, display: "grid", placeItems: "center", boxShadow: "0 0 18px rgba(0,255,135,.35)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: ".06em", background: "linear-gradient(135deg,#00ff87,#00c9b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SentimentEdge
          </span>
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: 34, listStyle: "none", margin: 0, padding: 0 }}>
          {["Home", "Features", "About"].map(l => (
            <li key={l}>
              <Link to="/" style={{ textDecoration: "none", color: "#8ca0c0", fontSize: 14, fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = "#f0f8ff"}
                onMouseLeave={e => e.target.style.color = "#8ca0c0"}>{l}</Link>
            </li>
          ))}
          <li>
            <Link to="/dashboard" style={{ textDecoration: "none", color: "#8ca0c0", fontSize: 14, fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = "#f0f8ff"}
              onMouseLeave={e => e.target.style.color = "#8ca0c0"}>Dashboard</Link>
          </li>
          <li>
            <Link to="/dashboard"
              style={{ padding: "9px 22px", borderRadius: 8, background: "linear-gradient(135deg,#00ff87,#00c9b8)", color: "#050d1a", fontWeight: 700, fontSize: 13.5, textDecoration: "none", display: "inline-block", transition: "transform .2s, box-shadow .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,255,135,.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              Get Started →
            </Link>
          </li>
        </ul>
      </nav>

      {/* ══ HERO — Centered layout like reference ══ */}
      <section style={{ position: "relative", zIndex: 10, minHeight: "calc(100vh - 140px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 40px", overflow: "hidden", textAlign: "center" }}>

        {/* Floating icons scattered in background */}
        {FLOAT_ICONS.map(({ emoji, label, top, left, bg, bc, anim }) => (
          <div key={label} style={{ position: "absolute", top, left, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, animation: anim, zIndex: 2, pointerEvents: "none" }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, display: "grid", placeItems: "center", fontSize: 24, background: bg, border: `1px solid ${bc}`, backdropFilter: "blur(12px)", boxShadow: `0 4px 20px ${bc}` }}>
              {emoji}
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 600, letterSpacing: ".08em", color: "#8ca0c0" }}>{label}</span>
          </div>
        ))}

        {/* Radial glow behind headline */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,255,135,.06) 0%,transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100, border: "1px solid rgba(0,201,184,.25)", background: "rgba(0,201,184,.08)", fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#00c9b8", marginBottom: 28, backdropFilter: "blur(8px)", zIndex: 3, animation: "se-fadeUp .6s ease backwards" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00c9b8", animation: "se-pulse 2s ease-in-out infinite" }} />
          AI-Powered. Market-Ready.
        </div>

        {/* Main Headline — same centered style as reference */}
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(52px, 7.5vw, 100px)", lineHeight: 1, letterSpacing: ".02em", color: "#f0f8ff", marginBottom: 24, zIndex: 3, maxWidth: 900, animation: "se-fadeUp .7s .1s ease backwards" }}>
          Know What The Market{" "}
          <span style={{ background: "linear-gradient(135deg,#00ff87,#00c9b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px rgba(0,255,135,.5))" }}>
            Feels
          </span>{" "}
          Before It Moves.
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: 17, lineHeight: 1.72, color: "#8bacc8", maxWidth: 620, marginBottom: 42, zIndex: 3, animation: "se-fadeUp .7s .2s ease backwards" }}>
          Analyze real-time news sentiment across thousands of stocks.
          From{" "}
          <span style={{ color: "#ff6b6b", fontWeight: 600 }}>bearish panic</span> to{" "}
          <span style={{ color: "#00ff87", fontWeight: 600 }}>bullish momentum</span>{" "}
          — stay ahead of the herd using Sentiment Analysis, NLP, and Live News Feeds.
        </p>

        {/* CTA */}
        <div style={{ zIndex: 3, animation: "se-fadeUp .7s .3s ease backwards", marginBottom: 56 }}>
          <Link to="/dashboard"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 38px", borderRadius: 12, background: "linear-gradient(135deg,#00ff87,#00c9b8)", color: "#050d1a", fontSize: 16, fontWeight: 800, textDecoration: "none", letterSpacing: ".04em", transition: "transform .2s, box-shadow .2s", boxShadow: "0 0 40px rgba(0,255,135,.3)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 48px rgba(0,255,135,.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,135,.3)"; }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            Get Started →
          </Link>
        </div>

        {/* Social proof companies strip */}
        <div style={{ zIndex: 3, animation: "se-fadeUp .7s .45s ease backwards", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "#4a6580", fontWeight: 600 }}>Our Users Are Affiliated With</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {["Zerodha", "Angel One", "Groww", "NSE", "BSE", "Robinhood", "Upstox"].map(b => (
              <span key={b}
                style={{ padding: "6px 18px", borderRadius: 100, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#4a6580", fontSize: 13, fontWeight: 700, cursor: "default", transition: "all .2s", backdropFilter: "blur(6px)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,201,184,.4)"; e.currentTarget.style.color = "#c8dff8"; e.currentTarget.style.background = "rgba(0,201,184,.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "#4a6580"; e.currentTarget.style.background = "rgba(255,255,255,.03)"; }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Keyframe CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes se-pulse     { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.7} }
        @keyframes se-ticker    { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes se-fadeUp    { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes se-f1 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-14px)} }
        @keyframes se-f2 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-18px)} }
        @keyframes se-f3 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-10px)} }
        @keyframes se-f4 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-20px)} }
        @keyframes se-f5 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-12px)} }
        @keyframes se-f6 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-16px)} }
        @keyframes se-f7 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-8px)}  }
        @keyframes se-f8 { 0%,100%{transform:translate(-50%,-50%) translateY(0px)}   50%{transform:translate(-50%,-50%) translateY(-22px)} }
      `}</style>

      {/* ══ REST OF PAGE (dark-adapted) ══ */}
      <main style={{ position: "relative", zIndex: 10 }}>

        {/* Latest News Section */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(7,17,32,.8)", padding: "96px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 48, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff87", boxShadow: "0 0 8px #00ff87", animation: "se-pulse 1.8s ease-in-out infinite" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#00ff87", textTransform: "uppercase", letterSpacing: ".14em" }}>Live Feed</span>
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(28px,4vw,40px)", letterSpacing: ".04em", color: "#f0f8ff", margin: 0 }}>COMPANY IMPULSE</h2>
                <p style={{ color: "#8ca0c0", fontWeight: 500, marginTop: 8 }}>Real-time sentiment aggregated from thousands of financial articles.</p>
              </div>
              <Link to="/dashboard" style={{ color: "#00c9b8", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "#00ff87"}
                onMouseLeave={e => e.currentTarget.style.color = "#00c9b8"}>
                View All Signals <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ position: "relative", overflow: "hidden", margin: "0 -24px", padding: "0 24px" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg,rgba(7,17,32,1),transparent)", zIndex: 10, pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(270deg,rgba(7,17,32,1),transparent)", zIndex: 10, pointerEvents: "none" }} />
              <motion.div
                animate={{ x: ["0%", "calc(-50% - 12px)"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                style={{ display: "flex", width: "max-content", gap: 24, padding: "16px 0" }}
              >
                {[...MOCK_NEWS, ...MOCK_NEWS, ...MOCK_NEWS].map((news, idx) => (
                  <div key={`${news.company}-${idx}`} style={{ width: 340, flexShrink: 0, background: "rgba(5,20,45,.8)", border: "1px solid rgba(0,201,184,.14)", borderRadius: 24, padding: 24, backdropFilter: "blur(12px)", cursor: "pointer", transition: "border-color .2s, transform .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,135,.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,201,184,.14)"; e.currentTarget.style.transform = ""; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: "#f0f8ff", fontSize: 15 }}>{news.company}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#4a6580", fontFamily: "'JetBrains Mono',monospace" }}>{news.ticker}</div>
                      </div>
                      <div style={{ padding: "4px 10px", borderRadius: 8, background: news.bullish ? "rgba(0,255,135,.1)" : "rgba(255,77,106,.1)", border: `1px solid ${news.bullish ? "rgba(0,255,135,.3)" : "rgba(255,77,106,.3)"}`, color: news.bullish ? "#00ff87" : "#ff4d6a", fontSize: 11, fontWeight: 800 }}>
                        {news.bullish ? "BULLISH" : "BEARISH"} {Math.abs(news.sentiment * 100).toFixed(0)}%
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#8ca0c0", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      "{news.headline}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Newspaper size={12} color="#4a6580" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#4a6580", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>{news.time}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,5vw,52px)", letterSpacing: ".04em", color: "#f0f8ff", margin: "0 0 12px" }}>THE TERMINAL ADVANTAGE</h2>
            <p style={{ color: "#8ca0c0", fontWeight: 500, maxWidth: 480, margin: "0 auto", fontStyle: "italic" }}>High-frequency news processing meets deep-learning price modeling.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, gridAutoRows: 250 }}>
            {/* Feature 1 */}
            <motion.div whileHover={{ y: -5 }} style={{ gridColumn: "span 2", background: "linear-gradient(135deg,rgba(0,255,135,.15),rgba(0,201,184,.1))", border: "1px solid rgba(0,255,135,.2)", borderRadius: 32, padding: 32, position: "relative", overflow: "hidden", backdropFilter: "blur(12px)" }}>
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ padding: 12, background: "rgba(0,255,135,.15)", borderRadius: 18, width: "fit-content", marginBottom: 20, border: "1px solid rgba(0,255,135,.25)" }}>
                  <Bot size={28} color="#00ff87" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: "#f0f8ff", marginBottom: 8 }}>SentimentEdge AI</h3>
                <p style={{ color: "#8bacc8", fontWeight: 500, maxWidth: 340 }}>Compress 1,000+ news articles into 3 impactful bullet points. Real-time intelligence at scale.</p>
              </div>
              <div style={{ position: "absolute", right: -20, bottom: -20, opacity: .06 }}>
                <BrainCircuit size={220} color="#00ff87" />
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div whileHover={{ y: -5 }} style={{ background: "rgba(5,20,45,.8)", border: "1px solid rgba(0,201,184,.15)", borderRadius: 32, padding: 32, backdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ padding: 12, background: "rgba(0,201,184,.1)", borderRadius: 18, width: "fit-content", marginBottom: 20, border: "1px solid rgba(0,201,184,.2)" }}>
                  <BarChart3 size={26} color="#00c9b8" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#f0f8ff", marginBottom: 8 }}>Price Forecast</h3>
                <p style={{ color: "#8ca0c0", fontSize: 13, fontWeight: 500 }}>Neural engine correlated 30 days of data to predict next 48h movement with 85% accuracy.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div whileHover={{ y: -5 }} style={{ background: "rgba(5,20,45,.8)", border: "1px solid rgba(0,201,184,.15)", borderRadius: 32, padding: 32, backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ padding: 12, background: "rgba(255,180,0,.08)", borderRadius: 18, width: "fit-content", marginBottom: 20, border: "1px solid rgba(255,180,0,.2)" }}>
                  <LayoutGrid size={26} color="#ffb400" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#f0f8ff", marginBottom: 8, textTransform: "uppercase", fontStyle: "italic" }}>Sector Heatmap</h3>
              </div>
              <p style={{ color: "#8ca0c0", fontSize: 13, fontWeight: 500 }}>Identify capital rotation across sectors instantly through visual sentiment distribution.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div whileHover={{ y: -5 }} style={{ gridColumn: "span 2", background: "rgba(5,20,45,.8)", border: "1px solid rgba(0,201,184,.15)", borderRadius: 32, padding: 40, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ flexShrink: 0, width: 100, height: 100, background: "rgba(0,201,184,.07)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,201,184,.15)" }}>
                <Newspaper size={48} color="rgba(0,201,184,.4)" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <ShieldCheck size={14} color="#00ff87" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#00ff87", textTransform: "uppercase", letterSpacing: ".1em", background: "rgba(0,255,135,.08)", padding: "3px 8px", borderRadius: 6 }}>Verified Sources</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: "#f0f8ff", marginBottom: 6 }}>Real-time News Engine</h3>
                <p style={{ color: "#8ca0c0", fontWeight: 500 }}>Auto-aggregating from top 20+ financial outlets including Yahoo, Reuters, and Investing.com</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Footer */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 96px" }}>
          <div style={{ background: "linear-gradient(135deg,rgba(0,255,135,.15),rgba(0,201,184,.1))", border: "1px solid rgba(0,255,135,.2)", borderRadius: 48, padding: "72px 48px", textAlign: "center", backdropFilter: "blur(16px)", boxShadow: "0 0 80px rgba(0,255,135,.08)" }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,6vw,64px)", letterSpacing: ".04em", color: "#f0f8ff", lineHeight: 1, marginBottom: 32, fontStyle: "italic" }}>
              READY TO OBSERVE<br />THE INVISIBLE?
            </h2>
            <Link to="/dashboard"
              style={{ display: "inline-block", padding: "16px 44px", background: "linear-gradient(135deg,#00ff87,#00c9b8)", color: "#050d1a", borderRadius: 16, fontWeight: 900, fontSize: 18, textDecoration: "none", transition: "transform .2s, box-shadow .2s", boxShadow: "0 0 40px rgba(0,255,135,.3)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 16px 60px rgba(0,255,135,.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,135,.3)"; }}>
              Enter the Dashboard
            </Link>
          </div>

          <div style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#2a3a50", textTransform: "uppercase", letterSpacing: ".14em" }}>© 2026 SentimentEdge v2.1</div>
            <div style={{ display: "flex", gap: 24 }}>
              {["Twitter", "Discord"].map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 700, color: "#2a3a50", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".1em", transition: "color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#8ca0c0"}
                  onMouseLeave={e => e.currentTarget.style.color = "#2a3a50"}>{s}</span>
              ))}
              <a href="https://github.com/RajatBhopte/Stock-News-Sentiment-Analyzer" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 10, fontWeight: 700, color: "#2a3a50", textTransform: "uppercase", letterSpacing: ".1em", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#8ca0c0"}
                onMouseLeave={e => e.currentTarget.style.color = "#2a3a50"}>GitHub</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
