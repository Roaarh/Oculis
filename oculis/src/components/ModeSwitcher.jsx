import React from "react";
import "../styles/modeselector.css";

export default function ModeSwitcher({ mode, setMode }) {
  return (
    <div className="mode-switcher">
      <button className={`mode-btn ${mode === "light" ? "active": ""}`} onClick={()=>setMode("light")}>
        #Capa_1 <span className="mode-label">Light</span>
      </button>
      <div className="sep" />
      <button className={`mode-btn ${mode === "dark" ? "active": ""}`} onClick={()=>setMode("dark")}>
        🌙 <span className="mode-label">Dark</span>
      </button>
      <div className="sep" />
      <button className={`mode-btn ${mode === "system" ? "active": ""}`} onClick={()=>setMode("system")}>
        🖥️ <span className="mode-label">Device</span>
      </button>
    </div>
  );
}
