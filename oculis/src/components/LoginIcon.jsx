import React from "react";

export default function LoginIcon({ onClick, className, style }) {
  return (
    <button
      onClick={onClick}
      className={`login-icon-btn ${className || ""}`}
      style={style}
      aria-label="Login"
      title="Login"
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
        {/* Arrow pointing right (login icon) */}
        <path d="M10 5l7 7-7 7M3 12h17" />
      </svg>
    </button>
  );
}
