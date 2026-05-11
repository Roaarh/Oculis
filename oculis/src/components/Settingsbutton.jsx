import React from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/settings");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open settings"
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "0",
        background: "rgba(255, 255, 255, 0.11)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        backdropFilter: "blur(6px)",
        color: "#ffffff", // makes the SVG white
      }}
    >
      <svg
        width="30"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"   // inherits white from button
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.01.08a2 2 0 0 1-3.32 0l-.01-.08A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l-.08.01a2 2 0 0 1 0-3.32l.08-.01A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82L10.34 2a2 2 0 0 1 3.32 0l.01.08A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1.82.33l.08-.01a2 2 0 0 1 0 3.32l-.08.01A1.65 1.65 0 0 0 19.4 15z" />
      </svg>
    </button>
  );
}
