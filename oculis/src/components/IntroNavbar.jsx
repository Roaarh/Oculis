import React from "react";
import mainlogo1 from "../assets/icons/mainlogo1.png";
import SoundSwitch from "./SoundSwitch";
import { useNavigate } from "react-router-dom";

// Props:
// - currentStyle: { logo: "#hexColor" }  (for dynamic color)
// - isMuted
// - toggleMute (function)

export default function Navbar({ currentStyle, isMuted, toggleMute }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth?mode=login");
  };


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
        {/* Login SVG Button */}
       <SoundSwitch isMuted={isMuted} onToggle={toggleMute} />
       <button
          type="button"
          onClick={handleLoginClick}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            padding: 0,
          }}
          aria-label="Login"
          title="Login"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 5l7 7-7 7M3 12h17" />
          </svg>
        </button>

      </div>
    </div>
  );
}
