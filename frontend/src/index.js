import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./pages/global.css";

// Optional: A simple loading skeleton or spinner for the initial load
const PageLoader = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: '#0a0a0a' // Match your SpaceLayout theme
  }}>
    <div className="loader-shimmer">Loading System...</div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap in Suspense if you decide to use React.lazy for your pages later.
        This prevents the UI from breaking while chunks are being fetched.
      */}
      <Suspense fallback={<PageLoader />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);