import { Link, useLocation } from "react-router-dom";
import "./header.css";

function Header() {
  const loc = useLocation();

  const navItems = [
    { to: "/", label: "COMM_CENTER", alias: "Home" },
    { to: "/console", label: "LINK_ESTABLISH", alias: "Console" },
    { to: "/analysis", label: "DATA_CORE", alias: "Analysis" },
    { to: "/results", label: "MISSION_LOG", alias: "Results" },
    { to: "/about", label: "SYS_INFO", alias: "Project" },
    { to: "/live", label: "NEURAL_LIVE", alias: "Live Model" },
  ];

  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo">LRN-07</div>
        <div className="system-status">
          <span className="pulse"></span>
          <span className="status-text">ROVER_STABLE</span>
        </div>
      </div>

      <nav className="navs">
        {navItems.map((item) => (
          <Link 
            key={item.to}
            className={loc.pathname === item.to ? "nav-item active" : "nav-item"} 
            to={item.to}
          >
            <span className="nav-label">{item.label}</span>
            <span className="nav-alias">{item.alias}</span>
          </Link>
        ))}
      </nav>
      
      <div className="coordinates">
        LAT: 0.6740° N | LONG: 23.4720° E
      </div>
    </header>
  );
}

export default Header;