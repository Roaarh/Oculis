import React from "react";
import mainlogo1 from "../assets/icons/mainlogo1.png";
import SoundSwitch from "./SoundSwitch";
import SettingsButton from "./SettingsButton";
// Props:
// - currentStyle: { logo: "#hexColor" }  (for dynamic color)
// - isMuted
// - toggleMute (function)

export default function Navbar({ currentStyle, isMuted, toggleMute }) {
  return (
    <div className="welcome-header">
      <div className="logo-left">
        <img
          src={mainlogo1}
          alt="logo"
          className="logo-image"
          
        />
        <h2
          className="brand-title"
          style={{ color: currentStyle?.logo || "#6a11cb" }}
        >
          Oculis
        </h2>
      </div>

      <div
        className="sound-right"
        style={{ display: "flex", gap: "12px", alignItems: "center" }}
      >
        <SoundSwitch isMuted={isMuted} onToggle={toggleMute} />
          <SettingsButton />
      </div>
    </div>
  );
}
