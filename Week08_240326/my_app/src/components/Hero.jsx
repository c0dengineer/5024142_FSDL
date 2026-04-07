import { useState } from "react";
import "./Hero.css";

export default function Hero() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="hero" onMouseMove={handleMove}>

      <div className="bg vecna"></div>

      <div
        className="bg will"
        style={{
          WebkitMaskImage: `radial-gradient(circle 250px at ${pos.x}px ${pos.y}px, transparent 0%, rgba(0,0,0,0.6) 60%, black 100%)`,
        }}
      ></div>

      <div className="overlay"></div>
      <div className="noise"></div>

      <div className="hero-content">
        <button className="cta">Enter the Upside Down</button>
      </div>
    </section>
  );
}