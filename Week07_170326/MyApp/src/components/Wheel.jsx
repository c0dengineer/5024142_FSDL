import { useState } from "react";

export default function Wheel({ options, setResult }) {
  const [rotation, setRotation] = useState(0);

  const getColor = (i, total) => {
    return `hsl(${(i * 360) / total}, 80%, 55%)`;
  };

  const spin = () => {
    if (!options.length) return;

    const index = Math.floor(Math.random() * options.length);
    const angle = 360 / options.length;

    const finalDeg = 360 * 6 + (360 - index * angle - angle / 2);

    setRotation((prev) => prev + finalDeg);

    const audio = new Audio("/tick.mp3");
    audio.play();

    setTimeout(() => {
      setResult(options[index]);
      launchConfetti();
    }, 3000);
  };

  const launchConfetti = () => {
    for (let i = 0; i < 80; i++) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.style.left = Math.random() * 100 + "%";
      el.style.background = `hsl(${Math.random() * 360},100%,50%)`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  };

  const radius = 140;
  const center = 150;

  const slices = options.map((opt, i) => {
    const angle = 360 / options.length;
    const start = (i * angle * Math.PI) / 180;
    const end = ((i + 1) * angle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);

    return (
      <g key={i}>
        <path
          d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
          fill={getColor(i, options.length)}
        />
      </g>
    );
  });

  return (
    <div className="wheel-wrapper">
      <div className="pointer"></div>

      <div className="wheel-box">
        <svg
          width="300"
          height="300"
          style={{ transform: `rotate(${rotation}deg)` }}
          className="wheel-svg"
        >
          <circle cx="150" cy="150" r="145" fill="#fff" />
          {slices}
        </svg>

        <button className="center-spin" onClick={spin}>
          SPIN
        </button>
      </div>
    </div>
  );
}