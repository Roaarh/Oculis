// src/components/MovingDotsBackground.jsx
import React, { useEffect, useRef } from "react";
import { useTheme } from "../ThemeContext";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function generateDots(numDots, color) {
  return Array.from({ length: numDots }).map((_, i) => ({
    left: `${random(0, 100)}vw`,
    top: `${random(0, 100)}vh`,
    width: `${random(7, 15)}px`,
    height: `${random(7, 15)}px`,
    background: color,
    borderRadius: "50%",
  }));
}

export default function MovingDotsBackground({ numDots = 56 }) {
  const { theme, THEME_STYLES } = useTheme();
  const containerRef = useRef();

  // Animates dots after initial render
  useEffect(() => {
    const dots = containerRef.current.querySelectorAll(".dot");
    dots.forEach(dot => {
      dot.animate([
        { transform: "translateY(0) scale(1)" },
        {
          transform: `translateY(${random(-90, 90)}px) translateX(${random(-120, 120)}px) scale(${random(0.75, 1.2)})`
        },
        { transform: "translateY(0) scale(1)" }
      ], {
        duration: random(5400, 9600),
        iterations: Infinity,
        direction: "alternate",
        delay: random(0, 3000),
        easing: "ease-in-out"
      });
    });
  }, [theme]); // reanimate if theme changes

  const dots = generateDots(numDots, THEME_STYLES[theme].dotColor);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        transition: "background 0.4s"
      }}
    >
      {dots.map((style, i) => (
        <div
          key={i}
          className="dot"
          style={{
            ...style,
            transition: "background 0.45s", // smooth dot color CHANGE
            // You can add blur or shadow for more depth:
            filter: "blur(0.5px)"
          }}
        />
      ))}
    </div>
  );
}
