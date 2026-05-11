// src/components/FloatingDotsBackground.jsx
import React, { useEffect, useRef } from "react";

const FloatingDotsBackground = ({ color = "rgba(255, 251, 251, 1)" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("FloatingDotsBackground mounted");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    const numParticles = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0.7 + Math.random() * 1.5,
          vx: -0.3 + Math.random() * 0.6,
          vy: -0.3 + Math.random() * 0.6,
          alpha: 0.3 + Math.random() * 0.7,
        });
      }
    };

    const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    const outer = p.radius * 2.2;
    const inner = p.radius * 0.6;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(0); // you can randomize rotation if you want

    // softer overall opacity
    ctx.globalAlpha = p.alpha * 0.5;

    // glow
    ctx.beginPath();
    ctx.moveTo(0, -outer);
    ctx.lineTo(inner, -inner);
    ctx.lineTo(outer, 0);
    ctx.lineTo(inner, inner);
    ctx.lineTo(0, outer);
    ctx.lineTo(-inner, inner);
    ctx.lineTo(-outer, 0);
    ctx.lineTo(-inner, -inner);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fill();

    // core
    ctx.beginPath();
    ctx.arc(0, 0, p.radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 0;
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
  });

  animationFrameId = requestAnimationFrame(draw);
};

    createParticles();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
        background: "transparent",
      }}
    />
  );
};

export default FloatingDotsBackground;
