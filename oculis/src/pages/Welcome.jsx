import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import ThemeSelector from "../components/ThemeSelector";
import Navbar from "../components/IntroNavbar";
import "../styles/Welcome.css";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Welcome() {
  const [username, setUsername] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();

  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleContinue = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    try {
      // DON'T save to localStorage here anymore
      // Just pass the username via state to Auth page
      navigate("/auth?mode=signup", { 
        state: { welcomeUsername: trimmed } 
      });
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const handleLoginClick = () => {
    navigate("/auth?mode=login");
  };

  return (
    <div
      className="welcome-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
      {/* NAVBAR */}
      <Navbar
        currentStyle={currentStyle}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      {/* MAIN */}
      <main className="welcome-main">
        <h1 className="welcome-h1" style={{ color: currentStyle.text }}>
          Welcome
        </h1>
        <p className="welcome-sub" style={{ color: currentStyle.text }}>
          Choose your name and the world you'll dream in
        </p>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
            width: "250px",
            textAlign: "center",
            fontSize: "18px",
            color: "#260872ff",
            backgroundColor: "#fdfdfdff",
          }}
          aria-label="Username"
          onKeyPress={(e) => {
            if (e.key === "Enter" && username.trim()) {
              handleContinue();
            }
          }}
        />

        <ThemeSelector />
      </main>

      {/* FOOTER with Continue button */}
      <footer className="welcome-footer">
        <Button
          disabled={!username.trim()}
          onClick={handleContinue}
          style={{
            position: "fixed",
            right: 32,
            bottom: 32,
            borderRadius: "36px",
            fontSize: "18px",
          }}
        >
          Continue
        </Button>
      </footer>
    </div>
  );
}
