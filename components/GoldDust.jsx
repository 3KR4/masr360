"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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

function GoldDust({ particleCount: customCount }) {
  const containerRef = useRef(null);
  const [riseDistance, setRiseDistance] = useState(0);
  const pathname = usePathname();

  // Dynamically calculate particle count based on page height (1 particle per ~30px, capped between 25 and 220)
  const activeParticleCount = useMemo(() => {
    if (customCount) return customCount;
    if (riseDistance > 0) {
      return Math.min(220, Math.max(25, Math.round(riseDistance / 30)));
    }
    return 120;
  }, [customCount, riseDistance]);

  const particles = useMemo(() => {
    const rand = mulberry32(0x9e3779b9);
    return Array.from({ length: activeParticleCount }, (_, i) => {
      const left = (rand() * 97 + 1.5).toFixed(1);
      // Smaller particle size (2.2px to 5.0px for fine gold dust)
      const size = (2.2 + rand() * 2.8).toFixed(1);
      const opacity = (0.2 + rand() * 0.55).toFixed(2);
      // Speed slowed down by 15% (duration increased to 82s - 141s)
      const duration = (82 + rand() * 59).toFixed(1);
      const delay = (-rand() * 82).toFixed(1);
      // Angled movement (-80px to +80px horizontal drift)
      const drift = (rand() * 160 - 80).toFixed(1);
      const rise = (rand() * 0.95).toFixed(2);
      const scale = (0.7 + rand() * 0.6).toFixed(2);
      const blur = rand() > 0.5 ? (0.3 + rand() * 0.6).toFixed(2) : 0;
      const isFalling = i % 3 === 0; // 1/3 of total particles fall top-to-bottom
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
      return { id: i, style, isFalling };
    });
  }, [activeParticleCount]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const h = Math.max(
        document.body?.scrollHeight || 0,
        document.documentElement?.scrollHeight || 0,
        el.clientHeight || 0
      );
      setRiseDistance(h);
    };

    update();
    const timer = setTimeout(update, 200);

    const ro = new ResizeObserver(update);
    if (document.body) ro.observe(document.body);
    window.addEventListener("resize", update);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className={`gold-dust ${riseDistance > 0 ? "is-ready" : ""}`}
      style={{ "--rise-distance": `${riseDistance}px` }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`gold-dust__particle ${p.isFalling ? "gold-dust__particle--falling" : ""}`}
          style={p.style}
        />
      ))}
    </div>
  );
}

export default GoldDust;
