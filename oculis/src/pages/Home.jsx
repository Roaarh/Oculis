import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import mainlogo from '../assets/icons/mainlogo.png'; // ensure this path is correct
import { useSound } from "../SoundContext";
export default function Home() {
  const navigate = useNavigate();
   const [showOverlay, setShowOverlay] = useState(true);
  const { playMusic } = useSound();

  const handleStart = () => {
    console.log("START CLICKED");   // <‑‑ add this line
    playMusic();                    // start the music
    navigate("/welcome");           // or whatever route
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2200); // quick fade! change/remove as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Power-on overlay: make it semi-transparent if you want! */}
      {showOverlay && <div id="power-on-overlay"></div>}

      <div className="home-container">
        <img src={mainlogo} alt="Oculis Logo" className="home-logo" />
        <h1 className="home-title"></h1>
        <button onClick={handleStart} className="home-button">
  Start
</button>

      </div>
    </>
  );
  }
