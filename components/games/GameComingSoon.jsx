"use client";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FaArrowRight,
  FaArrowLeft,
  FaLock,
  FaVolumeHigh,
  FaVolumeXmark,
  FaXmark,
  FaMapLocationDot,
  FaCamera,
  FaCoins,
  FaTrophy,
  FaGift,
} from "react-icons/fa6";
import { GiScarabBeetle } from "react-icons/gi";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import "@/styles/components/pre-footer-cta.css";
import "@/styles/pages/game-coming-soon.css";

/* ===== Settings ===== */
const EXCAVATION = 78; // how "done" the game looks (0-100)
const KNOCKS_BEFORE_GIVING_IN = 5; // knocks before the guardian hands over the demo
const DEMO_URL = "https://about.m360travel.com/#game-demo";
const STORAGE_KEY = "m360-game-coming-soon";

const GLYPHS = [..."𓀀𓀁𓀃𓀉𓀔𓀠𓁐𓁷𓂋𓂝𓂧𓃀𓃭𓃒𓃹𓄿𓅃𓅓𓅱𓆑𓆓𓆛𓇋𓇌𓇳𓈖𓉐𓊃𓊖𓊪𓋴𓌳𓍯𓎛𓏏𓏤𓐍𓇯𓊹𓋞𓌻𓎟𓏲"];
// scarab positions inside the chamber, in % (x, y)
const SCARAB_SPOTS = [
  [8, 22],
  [91, 18],
  [12, 80],
  [88, 76],
  [70, 90],
];
const SECRET_ICONS = [FaMapLocationDot, FaCamera, FaCoins, FaTrophy, FaGift];

/* ----- tiny synth, silent until the visitor turns sound on ----- */
function createSfx() {
  let ac = null;
  const ensure = () => {
    if (!ac) {
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  };
  const tone = (f0, f1, dur, type = "sine", g = 0.3, delay = 0) => {
    const a = ensure();
    if (!a) return;
    const t0 = a.currentTime + delay;
    const o = a.createOscillator();
    const v = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    v.gain.setValueAtTime(g, t0);
    v.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(v).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  };
  const noise = (dur, ftype, freq, g = 0.3, attack = 0.005) => {
    const a = ensure();
    if (!a) return;
    const t0 = a.currentTime;
    const len = Math.ceil(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource();
    const f = a.createBiquadFilter();
    const v = a.createGain();
    s.buffer = buf;
    f.type = ftype;
    f.frequency.value = freq;
    v.gain.setValueAtTime(0.001, t0);
    v.gain.exponentialRampToValueAtTime(g, t0 + attack);
    v.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    s.connect(f).connect(v).connect(a.destination);
    s.start(t0);
  };
  return {
    knock() {
      noise(0.09, "lowpass", 500, 0.5);
      tone(140, 60, 0.12, "sine", 0.5);
      tone(140, 60, 0.12, "sine", 0.45, 0.17);
    },
    rumble() {
      noise(0.7, "lowpass", 140, 0.6, 0.15);
    },
    shh() {
      noise(0.8, "bandpass", 4200, 0.22, 0.12);
    },
    slam() {
      tone(110, 38, 0.4, "sine", 0.9);
      noise(0.35, "lowpass", 320, 0.7);
    },
    chime() {
      tone(880, 880, 0.5, "triangle", 0.18);
      tone(1320, 1320, 0.6, "triangle", 0.12, 0.08);
      tone(1760, 1760, 0.7, "sine", 0.08, 0.16);
    },
  };
}

function Guardian({ pupilRef }) {
  return (
    <svg viewBox="0 0 200 220" aria-hidden="true">
      <defs>
        <clipPath id="gcsHeadClip">
          <ellipse cx="100" cy="128" rx="72" ry="88" />
        </clipPath>
        <radialGradient id="gcsEyeGlow">
          <stop offset="0" stopColor="#fff6d2" />
          <stop offset=".5" stopColor="#f3ae1c" />
          <stop offset="1" stopColor="#f3ae1c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gcsGoldBand" x1="0" x2="1">
          <stop offset="0" stopColor="#f7c355" />
          <stop offset="1" stopColor="#e7802c" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="128" rx="72" ry="88" fill="#efcf9e" />
      <g clipPath="url(#gcsHeadClip)" fill="none" strokeLinecap="round">
        <g stroke="#c99b5c" strokeWidth="6" opacity=".85">
          <path d="M20 66 L180 84" />
          <path d="M20 140 L180 124" />
          <path d="M20 180 L180 198" />
          <path d="M20 206 L180 176" />
        </g>
        <g stroke="#fbe8c6" strokeWidth="4" opacity=".9">
          <path d="M20 152 L180 140" />
          <path d="M20 76 L180 94" />
        </g>
      </g>
      <path d="M34 82 Q100 18 166 82" stroke="url(#gcsGoldBand)" strokeWidth="11" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="46" r="8" fill="#f3ae1c" stroke="#7a4a10" strokeWidth="2" />
      <path d="M98 100 L174 94 L172 122 L98 124 Z" fill="#dcb47c" />
      <ellipse className="slit" cx="134" cy="110" rx="14" ry="3.5" fill="url(#gcsEyeGlow)" />
      <circle cx="72" cy="112" r="18" fill="#fffaf0" stroke="#c99b5c" strokeWidth="3" />
      <g ref={pupilRef}>
        <circle cx="72" cy="112" r="8" fill="#0b0b0b" />
        <circle cx="69" cy="109" r="2.4" fill="#fff" />
      </g>
      <path className="brow" d="M54 88 Q72 80 90 92" stroke="#7a5428" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="56" cy="144" rx="10" ry="5" fill="#e7802c" opacity=".25" />
      <ellipse cx="100" cy="160" rx="7" ry="6" fill="#3b2410" />
      <g className="arm">
        <rect x="92" y="130" width="16" height="46" rx="8" fill="#f6dcae" stroke="#c99b5c" strokeWidth="3" />
        <path d="M94 148 h12" stroke="#c99b5c" strokeWidth="3" />
        <rect x="90" y="166" width="50" height="38" rx="14" fill="#f6dcae" stroke="#c99b5c" strokeWidth="3" />
        <path d="M110 166 v12 M122 166 v12 M104 189 h26" stroke="#c99b5c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function GameComingSoon() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const isAr = locale === "AR";
  const c = t.sectionsTitles.game_coming_soon;

  const [found, setFound] = useState([]);
  const [knocks, setKnocks] = useState(0);
  const [gaveDemo, setGaveDemo] = useState(false);
  const [sound, setSound] = useState(false);
  const [touchy, setTouchy] = useState(false);
  const [doorState, setDoorState] = useState(""); // classes on the tomb
  const [bubble, setBubble] = useState("");
  const [toast, setToast] = useState(null); // { n, idx }
  const [modal, setModal] = useState(null); // null | "insist" | "all"
  const [pct, setPct] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const chamberRef = useRef(null);
  const wallCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const pupilRef = useRef(null);
  const doorRef = useRef(null);
  const demoRef = useRef(null);
  const scarabRefs = useRef([]);
  const busyRef = useRef(false);
  const sfxRef = useRef(null);
  const soundRef = useRef(false);
  const sparksRef = useRef([]);
  const pinRef = useRef(null);
  const toastTimer = useRef(null);
  const toastKey = useRef(0);
  const reducedRef = useRef(false);

  /* ----- restore progress ----- */
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sfxRef.current = createSfx();
    // read saved progress after the first paint, so server and client markup match
    const id = requestAnimationFrame(() => {
      try {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        if (Array.isArray(s.found)) setFound(s.found);
        if (s.knocks) setKnocks(s.knocks);
        if (s.gaveDemo) setGaveDemo(true);
        if (s.sound) setSound(true);
      } catch (e) {}
      setTouchy(window.matchMedia("(hover: none)").matches);
      setLoaded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ found, knocks, gaveDemo, sound }));
    } catch (e) {}
  }, [found, knocks, gaveDemo, sound, loaded]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  const play = useCallback((name) => {
    if (soundRef.current && sfxRef.current) sfxRef.current[name]();
  }, []);

  /* ----- excavation counter ----- */
  useEffect(() => {
    let v = 0;
    let raf;
    const step = () => {
      v = Math.min(EXCAVATION, v + 1);
      setPct(v);
      if (v < EXCAVATION) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ----- wall, torch, dust -----
     Everything moving is drawn on one canvas. The wall glyphs are drawn once
     (dim on a static canvas, lit into an offscreen image), and each frame only
     the circle around the torch is copied, so the browser never repaints the
     whole wall. The loop pauses when the chamber is off screen or the tab is
     hidden, and drops to 30fps while the torch wanders on its own. */
  useEffect(() => {
    const stage = chamberRef.current;
    const canvas = canvasRef.current;
    const wallCanvas = wallCanvasRef.current;
    if (!stage || !canvas || !wallCanvas) return;
    const ctx = canvas.getContext("2d");
    const wctx = wallCanvas.getContext("2d");
    const lit = document.createElement("canvas"); // lit glyphs, drawn once
    const lctx = lit.getContext("2d");
    const scratch = document.createElement("canvas"); // torch circle, per frame
    const sctx = scratch.getContext("2d");
    const tomb = stage.querySelector(".gcs-tomb");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const reduced = reducedRef.current;
    let W = 0;
    let H = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let ptrX = 0;
    let ptrY = 0;
    let lastMove = -1e9;
    let lastFrame = 0;
    let raf = 0;
    let visible = true;
    let fontAsked = false;
    let fontsGone = false;
    let scarabPos = [];
    const scarabAlpha = SCARAB_SPOTS.map(() => -1);
    const motes = [];

    // same falloff the CSS mask used: 1 → .8 at 34% → 0 at 72% of the radius
    const maskAt = (d, r) => {
      const t = d / r;
      if (t <= 0.34) return 1 - (t / 0.34) * 0.2;
      if (t >= 0.72) return 0;
      return 0.8 * (1 - (t - 0.34) / 0.38);
    };

    const drawWall = () => {
      const fs = Math.max(24, Math.min(38, window.innerWidth * 0.028));
      const fam = getComputedStyle(stage).getPropertyValue("--font-glyph").trim();
      const font = `${fs}px ${fam ? fam + "," : ""} "Noto Sans Egyptian Hieroglyphs", "Segoe UI Historic", serif`;
      // canvas text doesn't trigger web-font loading, so ask for it and redraw once it's in
      if (document.fonts && !fontAsked) {
        fontAsked = true;
        document.fonts.load(font, GLYPHS[0]).then(() => !fontsGone && build(), () => {});
      }
      const lineH = fs * 1.9;
      const track = fs * 0.32;
      const pad = 10;
      const cw = Math.round(W * dpr);
      const ch = Math.round(H * dpr);
      for (const c of [wallCanvas, lit]) {
        c.width = cw;
        c.height = ch;
      }
      const widths = new Map();
      const setup = (c) => {
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.font = font;
        c.textBaseline = "middle";
      };
      setup(wctx);
      setup(lctx);
      const measure = (g) => {
        if (!widths.has(g)) widths.set(g, wctx.measureText(g).width);
        return widths.get(g);
      };

      // ruled lines (dim on the wall, brighter in the lit copy)
      for (let top = pad; top < H; top += lineH) {
        const ly = Math.round(top + lineH) - 1;
        wctx.fillStyle = "rgba(243,174,28,0.05)";
        wctx.fillRect(0, ly, W, 1);
        lctx.fillStyle = "rgba(243,174,28,0.35)";
        lctx.fillRect(0, ly, W, 1);
      }

      // glyphs flow like the old text block: letter-spaced, wrapping per line
      const placed = [];
      for (let top = pad; top < H + lineH; top += lineH) {
        let gx = pad;
        while (gx < W - pad) {
          const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          const w = measure(g);
          if (gx + w > W - pad && gx > pad) break;
          placed.push([g, gx, top + lineH / 2]);
          gx += w + track;
        }
      }
      wctx.fillStyle = "#21190e";
      for (const [g, gx, gy] of placed) wctx.fillText(g, gx, gy);

      // lit copy carries the same glow the CSS text-shadow had, baked in once
      lctx.fillStyle = "#f7c355";
      lctx.shadowColor = "rgba(243,174,28,0.55)";
      lctx.shadowBlur = 14 * dpr;
      for (const [g, gx, gy] of placed) lctx.fillText(g, gx, gy);
      lctx.shadowColor = "rgba(255,226,182,0.6)";
      lctx.shadowBlur = 2 * dpr;
      for (const [g, gx, gy] of placed) lctx.fillText(g, gx, gy);
      lctx.shadowColor = "transparent";
    };

    const build = () => {
      const r = stage.getBoundingClientRect();
      if (!r.width) return;
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawWall();
      scarabPos = SCARAB_SPOTS.map(([px, py]) => [(px / 100) * W, (py / 100) * H]);
      scarabAlpha.fill(-1);
      motes.length = 0;
      const n = reduced ? 16 : Math.round(Math.min(70, (W * H) / 9000));
      for (let i = 0; i < n; i++)
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.05 - Math.random() * 0.18,
          s: 0.6 + Math.random() * 1.6,
          p: Math.random() * 6,
        });
      wake();
    };

    const onMove = (e) => {
      const s = stage.getBoundingClientRect();
      tx = e.clientX - s.left;
      ty = e.clientY - s.top;
      lastMove = performance.now();
      if (e.type === "pointerdown" && e.pointerType !== "mouse") {
        x = tx;
        y = ty;
      }
    };
    const onWinMove = (e) => {
      ptrX = e.clientX;
      ptrY = e.clientY;
    };

    const frame = (now) => {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(frame);

      const pin = pinRef.current;
      const active = pin || now - lastMove < 2600 || sparksRef.current.length;
      // the slow idle wander doesn't need 60fps
      if (!active && now - lastFrame < 31) return;
      lastFrame = now;

      if (pin) {
        tx = pin.x;
        ty = pin.y;
      } else if (now - lastMove > 2600) {
        tx = W / 2 + Math.cos(now * 0.00042) * W * 0.4;
        ty = H / 2 + Math.sin(now * 0.00071) * H * 0.34;
      }
      const k = now - lastMove < 2600 && !pin ? 0.22 : 0.05;
      x += (tx - x) * k;
      y += (ty - y) * k;
      const base = Math.min(210, Math.max(120, Math.min(W, H) * 0.3));
      const r = base * (1 + Math.sin(now * 0.012) * 0.025 + (Math.random() - 0.5) * 0.03);

      ctx.clearRect(0, 0, W, H);

      // lit glyphs, only inside the torch circle
      const rr = r * 0.72;
      const sx = Math.floor((x - rr) * dpr);
      const sy = Math.floor((y - rr) * dpr);
      const size = Math.ceil(rr * 2 * dpr) + 2;
      if (scratch.width !== size) {
        scratch.width = size;
        scratch.height = size;
      }
      sctx.globalCompositeOperation = "source-over";
      sctx.clearRect(0, 0, size, size);
      // copy just the torch square out of the lit image
      const ox = Math.max(0, sx);
      const oy = Math.max(0, sy);
      const ow = Math.min(lit.width, sx + size) - ox;
      const oh = Math.min(lit.height, sy + size) - oy;
      if (ow > 0 && oh > 0) sctx.drawImage(lit, ox, oy, ow, oh, ox - sx, oy - sy, ow, oh);
      sctx.globalCompositeOperation = "destination-in";
      const cx = x * dpr - sx;
      const cy = y * dpr - sy;
      const mg = sctx.createRadialGradient(cx, cy, 0, cx, cy, r * dpr);
      mg.addColorStop(0, "rgba(0,0,0,1)");
      mg.addColorStop(0.34, "rgba(0,0,0,0.8)");
      mg.addColorStop(0.72, "rgba(0,0,0,0)");
      sctx.fillStyle = mg;
      sctx.fillRect(0, 0, size, size);
      ctx.drawImage(scratch, sx / dpr, sy / dpr, size / dpr, size / dpr);

      // warm glow
      const gr = r * 1.7;
      const gg = ctx.createRadialGradient(x, y, 0, x, y, gr);
      gg.addColorStop(0, "rgba(231,128,44,0.2)");
      gg.addColorStop(0.38, "rgba(243,174,28,0.07)");
      gg.addColorStop(0.7, "rgba(243,174,28,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gg;
      ctx.fillRect(x - gr, y - gr, gr * 2, gr * 2);
      ctx.globalCompositeOperation = "source-over";

      // dust
      for (const m of motes) {
        m.x += m.vx + Math.sin(now * 0.001 + m.p) * 0.12;
        m.y += m.vy;
        if (m.y < -5) {
          m.y = H + 5;
          m.x = Math.random() * W;
        }
        if (m.x < -5) m.x = W + 5;
        if (m.x > W + 5) m.x = -5;
        const d = Math.hypot(m.x - x, m.y - y);
        const a = 0.05 + 0.75 * Math.max(0, 1 - d / (r * 1.25));
        ctx.fillStyle = `rgba(247,195,85,${a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.s, 0, 7);
        ctx.fill();
      }
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.98;
        p.life -= 0.018;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, 7);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // scarabs show only under the torch, with the same falloff
      for (let i = 0; i < scarabPos.length; i++) {
        const el = scarabRefs.current[i];
        if (!el) continue;
        const a = maskAt(Math.hypot(scarabPos[i][0] - x, scarabPos[i][1] - y), r);
        if (Math.abs(a - scarabAlpha[i]) > 0.01) {
          scarabAlpha[i] = a;
          el.style.opacity = a.toFixed(3);
        }
      }

      // the guardian's eye only matters while he's out
      const pupil = pupilRef.current;
      if (pupil && tomb && tomb.classList.contains("peek")) {
        const box = pupil.ownerSVGElement.getBoundingClientRect();
        const ex = box.left + box.width * 0.36;
        const ey = box.top + box.height * 0.51;
        const dx = ptrX - ex;
        const dy = ptrY - ey;
        const d = Math.hypot(dx, dy) || 1;
        const m = Math.min(7, d / 30);
        pupil.setAttribute("transform", `translate(${(dx / d) * m} ${(dy / d) * m})`);
      }
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    build();
    x = tx = W * 0.3;
    y = ty = H * 0.4;
    if (document.fonts) {
      document.fonts.ready.then(() => !fontsGone && build());
      document.fonts.addEventListener("loadingdone", build);
    }
    const ro = new ResizeObserver(() => {
      const b = stage.getBoundingClientRect();
      if (Math.abs(b.width - W) > 1 || Math.abs(b.height - H) > 1) build();
    });
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    io.observe(stage);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onMove);
    window.addEventListener("pointermove", onWinMove, { passive: true });
    wake();
    return () => {
      fontsGone = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.fonts?.removeEventListener("loadingdone", build);
      document.removeEventListener("visibilitychange", onVis);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointermove", onWinMove);
    };
  }, []);

  const burst = (bx, by, n, color) => {
    if (reducedRef.current) n = Math.min(n, 6);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 1 + Math.random() * 3.5;
      sparksRef.current.push({
        x: bx,
        y: by,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 1.2,
        life: 1,
        s: 1 + Math.random() * 2.4,
        c: color,
      });
    }
  };

  const localPoint = (el) => {
    const s = chamberRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  };

  /* ----- guardian scene ----- */
  const wait = (ms) => new Promise((r) => setTimeout(r, reducedRef.current ? Math.min(ms, 250) : ms));

  const guardianScene = useCallback(
    async (line, mad = false) => {
      busyRef.current = true;
      play("rumble");
      setDoorState("open rumble");
      await wait(520);
      setDoorState(`open peek${mad ? " mad" : ""}`);
      await wait(320);
      setDoorState(`open peek shh${mad ? " mad" : ""}`);
      play("shh");
      setBubble(line);
      await wait(1700);
      setDoorState(`open peek${mad ? " mad" : ""}`);
      await wait(160);
      setDoorState("open");
      setBubble("");
      await wait(200);
      setDoorState("slam");
      await wait(170);
      play("slam");
      const d = doorRef.current?.getBoundingClientRect();
      const s = chamberRef.current?.getBoundingClientRect();
      if (d && s) {
        burst(d.left - s.left + d.width * 0.15, d.bottom - s.top - 4, 22, "#c99b5c");
        burst(d.left - s.left + d.width * 0.85, d.bottom - s.top - 4, 22, "#c99b5c");
      }
      setDoorState("slam shake");
      await wait(380);
      setDoorState("");
      busyRef.current = false;
    },
    [play]
  );

  const openModal = (kind) => {
    setGaveDemo(true);
    setModal(kind);
    play("chime");
  };

  const knock = async () => {
    if (busyRef.current) return;
    const n = knocks + 1;
    setKnocks(n);
    setDoorState("knock");
    play("knock");
    await wait(380);
    setDoorState("");
    if (n < KNOCKS_BEFORE_GIVING_IN) {
      await guardianScene(c.knocks[Math.min(n - 1, 3)], n >= 3);
    } else if (n === KNOCKS_BEFORE_GIVING_IN || !gaveDemo) {
      await guardianScene(c.knocks[4]);
      openModal("insist");
    } else {
      const a = c.after;
      await guardianScene(a[(n - KNOCKS_BEFORE_GIVING_IN - 1) % a.length], true);
    }
  };

  const askGuardian = async () => {
    if (busyRef.current) return;
    chamberRef.current?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth", block: "center" });
    await wait(500);
    await guardianScene(c.knocks[4]);
    openModal("insist");
  };

  /* ----- secrets ----- */
  const showToast = (n, idx) => {
    toastKey.current += 1;
    setToast({ n, idx, key: toastKey.current });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  };

  const findSecret = (i) => {
    const el = scarabRefs.current[i];
    if (found.includes(i)) {
      showToast(found.indexOf(i) + 1, i);
      return;
    }
    const next = [...found, i];
    setFound(next);
    if (el) {
      const p = localPoint(el);
      burst(p.x, p.y, 26, "#f7c355");
    }
    play("chime");
    showToast(next.length, i);
    if (next.length === SCARAB_SPOTS.length) {
      setTimeout(async () => {
        if (busyRef.current) return;
        await guardianScene(c.allFound);
        openModal("all");
      }, 1400);
    }
  };

  // a locked card nudges the torch toward its scarab, without giving it away
  const hintSecret = (i) => {
    const stage = chamberRef.current;
    if (!stage) return;
    stage.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth", block: "center" });
    const r = stage.getBoundingClientRect();
    const [px, py] = SCARAB_SPOTS[i];
    const sx = (px / 100) * r.width;
    const sy = (py / 100) * r.height;
    const off = Math.min(200, Math.max(120, Math.min(r.width, r.height) * 0.3)) * 0.95;
    const a = Math.atan2(r.height / 2 - sy, r.width / 2 - sx);
    pinRef.current = { x: sx + Math.cos(a) * off, y: sy + Math.sin(a) * off };
    setTimeout(() => (pinRef.current = null), 2200);
  };

  /* ----- modal ----- */
  const closeModal = () => {
    setModal(null);
    doorRef.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (!modal) return;
    demoRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    soundRef.current = next;
    if (next) sfxRef.current?.chime();
  };

  const hint = knocks >= 2 && found.length < SCARAB_SPOTS.length ? c.hintHunt : touchy ? c.hintTouch : c.hintMouse;
  const Arrow = isAr ? FaArrowLeft : FaArrowRight;

  return (
    <div className="game-coming-soon">
      {/* ===== Header block ===== */}
      <section className="gcs-head container">
        <div className="top-tag">
          <hr />
          <span>{c.tag}</span>
          <hr />
        </div>
        <h1 className="hero-title">
          <span className="line1">{c.titleLine1}</span>
          <span className="line2">{c.titleLine2}</span>
        </h1>
        <p className="description">{c.description}</p>
      </section>

      {/* ===== The chamber ===== */}
      <section className="gcs-chamber-section container">
        <div className={`gcs-chamber ${doorState.includes("shake") ? "shake" : ""}`} ref={chamberRef}>
          <canvas className="wall-canvas" ref={wallCanvasRef} aria-hidden="true" />
          <canvas className="fx-canvas" ref={canvasRef} aria-hidden="true" />

          <div className="secrets">
            {SCARAB_SPOTS.map(([px, py], i) => (
              <button
                key={i}
                ref={(el) => (scarabRefs.current[i] = el)}
                className={`scarab ${found.includes(i) ? "found" : ""}`}
                style={{ left: `${px}%`, top: `${py}%` }}
                onClick={() => findSecret(i)}
                onFocus={(e) => (pinRef.current = localPoint(e.currentTarget))}
                onBlur={() => (pinRef.current = null)}
                aria-label={`${c.scarabLabel} ${i + 1}`}
              >
                <GiScarabBeetle />
              </button>
            ))}
          </div>
          <div className="vignette" aria-hidden="true" />

          <div className={`gcs-tomb ${doorState}`}>
            <div className="lintel">
              <span className="cartouche">
                M360 <i aria-hidden="true">𓂀</i> {c.cartouche}
              </span>
            </div>
            <div className="doorway">
              <div className="beyond" />
              <div className="guardian">
                <Guardian pupilRef={pupilRef} />
              </div>
              <button className="slab" ref={doorRef} onClick={knock} aria-label={c.doorLabel}>
                <span className="seal" aria-hidden="true">
                  <Image src="/eye of hours.png" alt="" width={160} height={96} />
                </span>
                <span className="glyphrow" aria-hidden="true">
                  𓋹𓆣𓋹
                </span>
                <span className="peepers" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </div>
            <div className={`bubble ${bubble ? "show" : ""}`} role="status" aria-live="polite">
              {bubble}
            </div>
          </div>

          <p className="gcs-hint">{hint}</p>

          {toast && (
            <div className="gcs-toast" key={toast.key} role="status" aria-live="polite">
              <small>
                {c.secretHead.replace("{n}", toast.n).replace("{total}", SCARAB_SPOTS.length)}
              </small>
              <strong>{c.secrets[toast.idx].title}</strong>
              <p>{c.secrets[toast.idx].sub}</p>
            </div>
          )}
        </div>

        {/* status row, same language as the game cards' time-holder */}
        <div className="gcs-status">
          <div className="item excavation">
            <span className="label">{c.excavation}</span>
            <div className="bar" aria-hidden="true">
              <div className="fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="value">{pct}%</span>
          </div>
          <hr />
          <div className="item">
            <span className="label">{c.secretsFound}</span>
            <span className="value main-color">
              {found.length}/{SCARAB_SPOTS.length}
            </span>
          </div>
          <hr />
          <button className="item sound-toggle" onClick={toggleSound} aria-pressed={sound}>
            {sound ? <FaVolumeHigh /> : <FaVolumeXmark />}
            <span className="label">{c.sound}</span>
          </button>
        </div>
      </section>

      {/* ===== Secrets grid ===== */}
      <section className="gcs-secrets container">
        <div className="title-holder">
          <h2 className="main-title">
            <hr />
            {c.secretsTitle}
            <hr />
          </h2>
          <p className="sub-title">{c.secretsSub}</p>
        </div>

        <div className="secrets-grid">
          {c.secrets.map((s, i) => {
            const open = found.includes(i);
            const Icon = SECRET_ICONS[i];
            return (
              <button
                key={i}
                className={`secret-card ${open ? "open" : "locked"}`}
                onClick={() => (open ? showToast(found.indexOf(i) + 1, i) : hintSecret(i))}
              >
                <span className="bg-floating-icon" aria-hidden="true">
                  <GiScarabBeetle />
                </span>
                <span className="circle-icon">{open ? <Icon /> : <FaLock />}</span>
                <span className="step-title">{open ? s.title : c.locked}</span>
                <span className="step-sub">{open ? s.sub : c.lockedHint}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== CTA, reusing the site's pre-footer CTA ===== */}
      <section className="pre-footer-cta gcs-cta">
        <div className="container cta-content">
          <h2 className="cta-title">
            {c.ctaTitle} <span className="gold-text">{c.ctaGold}</span>
          </h2>
          <p className="cta-subtitle">{c.ctaSub}</p>
          <button className="cta-button back-light-animation main-button" onClick={askGuardian}>
            <span>{c.ctaBtn}</span>
            <Arrow />
          </button>
        </div>
      </section>

      {/* ===== The guardian gives in ===== */}
      {modal && (
        <div className="gcs-overlay backdrop-blur" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="gcs-modal" role="dialog" aria-modal="true" aria-labelledby="gcs-modal-title">
            <button className="close" onClick={closeModal} aria-label={c.later}>
              <FaXmark />
            </button>
            <Image className="eye" src="/eye of hours.png" alt="" width={220} height={132} />
            <div className="top-tag">
              <hr />
              <span>{modal === "all" ? c.modalPreAll : c.modalPre}</span>
              <hr />
            </div>
            <h2 id="gcs-modal-title">{modal === "all" ? c.modalTitleAll : c.modalTitle}</h2>
            <p className="body">{c.modalBody}</p>
            <p className="promise">{c.modalPromise}</p>
            <a
              ref={demoRef}
              className="main-button back-light-animation"
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.play} <Arrow />
            </a>
            <button className="later" onClick={closeModal}>
              {c.later}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
