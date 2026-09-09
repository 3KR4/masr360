"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "@/styles/components/gold-dust.css";

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function GoldDust({ particleCount = 35 }) {
  const containerRef = useRef(null);
  const [riseDistance, setRiseDistance] = useState(0);

  const particles = useMemo(() => {
    const rand = mulberry32(0x9e3779b9);
    return Array.from({ length: particleCount }, (_, i) => {
      const left = (rand() * 97 + 1.5).toFixed(1);
      const size = (6 + rand() * 5).toFixed(1);
      const opacity = (0.15 + rand() * 0.35).toFixed(2);
      const duration = (10 + rand() * 12).toFixed(1);
      const delay = (-rand() * 22).toFixed(1);
      const drift = (rand() * 26 - 13).toFixed(1);
      const rise = (rand() * 0.9).toFixed(2);
      const scale = (0.7 + rand() * 0.6).toFixed(2);
      const blur = rand() > 0.55 ? (0.4 + rand() * 0.8).toFixed(2) : 0;
      const style = {
        "--left": `${left}%`,
        "--size": `${size}px`,
        "--opacity": opacity,
        "--duration": `${duration}s`,
        "--delay": `${delay}s`,
        "--drift-x": `${drift}px`,
        "--rise-pct": rise,
        "--scale": scale,
        "--blur": blur ? `${blur}px` : "0px",
      };
      return { id: i, style };
    });
  }, [particleCount]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setRiseDistance(el.clientHeight || 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`gold-dust ${riseDistance > 0 ? "is-ready" : ""}`}
      style={{ "--rise-distance": `${riseDistance}px` }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span key={p.id} className="gold-dust__particle" style={p.style} />
      ))}
    </div>
  );
}

export default GoldDust;
