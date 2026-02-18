import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../pages/global.css";

function SpaceLayout({ children }) {
  const location = useLocation();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Trigger a brief "Signal Sync" effect on route change
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="space-root">
      {/* Background Layers */}
      <div className="space-bg"></div>
      <div className="space-noise"></div>
      <div className={`signal-glitch ${isSyncing ? "active" : ""}`}></div>

      <Header />

      <main className="page-wrapper">
        <div className="ui-frame-lines"></div>
        {/* The "page" div handles the entrance animation */}
        <div key={location.pathname} className="page-content fade-in">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SpaceLayout;