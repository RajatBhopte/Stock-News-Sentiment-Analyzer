import { useEffect, useRef } from "react";

const LiveStockChart = ({ symbol, exchange = "NSE" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !symbol) return;

    // Clear any previous content
    containerRef.current.innerHTML = "";

    const containerId = `tradingview_${Date.now()}`;
    const div = document.createElement("div");
    div.id = containerId;
    div.style.height = "100%";
    div.style.width = "100%";
    containerRef.current.appendChild(div);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          width: "100%",
          height: "100%",
          symbol: `${exchange}:${symbol}`,
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          autosize: true,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [symbol, exchange]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-md bg-white"
      style={{ height: "500px", minHeight: "500px" }}
    />
  );
};

export default LiveStockChart;
