import "./footer.css";
import { useState, useEffect } from "react";

function Footer() {
  const [missionTime, setMissionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setMissionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="status-group">
          <span className="blink-dot"></span>
          <div className="main-title">NEURAL_LINK [LUNAR-1]</div>
          <div className="sub-title">
            AE-QUANT-HUFF // MODE: ACTIVE_TRANSMISSION
          </div>
        </div>

        <div className="telemetry-group">
          <div className="stat">
            <label>MISSION_CLOCK:</label> 
            <span>{missionTime}s</span>
          </div>
          <div className="stat">
            <label>SIGNAL:</label> 
            <span className="signal-bars">|||||</span>
          </div>
        </div>
      </div>
      <div className="scanline-footer"></div>
    </footer>
  );
}

export default Footer;