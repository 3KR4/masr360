"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "@/styles/components/motion.css";

/**
 * MASR 360 motion layer — mounted once in the client layout.
 *
 *  1. Scroll reveals: auto-tags the site's sections/cards with [data-reveal]
 *     (also cards that arrive later from the API, via MutationObserver) and
 *     plays a staggered entrance when they scroll into view.
 *  2. Scroll progress: a thin sunset bar across the top of the page.
 *  3. Smart header: tucks away while you scroll down, returns on scroll up.
 *  4. 3D tilt: game-card tilt that follows the pointer on featured tiles.
 *
 * Everything is skipped for prefers-reduced-motion, and content is never
 * hidden unless this script is running (html.fx-ready gate).
 */

// [selector, reveal variant, stagger step in ms, force?]
// `force` tags an element even if it already runs its own (looping) animation;
// the CSS then layers the reveal on top of that animation instead of replacing it.
const REVEAL_RULES = [
  // "See All" buttons under the home grids (they loop the sunset gradient)
  [".grid-holder.limit-to-show > .main-button", "pop", 0, true],
  [".title-holder", "up", 0],
  [".what-is-m360 .top-tag, .what-is-m360 .hero-title, .what-is-m360 .description", "up", 90],
  [".what-is-m360 .stat-item", "pop", 90],
  [".what-is-m360 .formula-pillar", "up", 80],
  [".how-it-works .header-block > *", "up", 90],
  [".how-it-works .journey-step-card", "pop", 80],
  [".badge-quest__copy > *", "up", 80],
  // the carousel enters as one piece — per-slide reveals would leave autoplayed slides blank
  [".categories .swiper", "slide", 0],
  [".explore-more-card .image-side", "side", 0],
  [".explore-more-card .main-info > *, .explore-more-card .feature-item", "up", 80],
  [".grid-holder > .card, .grid-holder > a, .grid-holder > div:not(.overlay-layer)", "up", 70],
  [".pre-footer-cta .cta-content > *", "up", 90],
  ["footer .footer-top > *, footer .footer-col", "up", 80],
  [".error-page > *", "up", 90],
  [".about .about-section, .legal-page-container > *", "up", 0],
];

const TILT_SELECTOR =
  ".categories .box, .badge-tile.is-live, .how-it-works .journey-step-card, .what-is-m360 .stat-item";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MotionFX() {
  const pathname = usePathname();
  const barRef = useRef(null);
  const ioRef = useRef(null);
  const tagRef = useRef(() => {});

  /* ---------------- reveals ---------------- */
  useEffect(() => {
    if (reducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("fx-ready");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    ioRef.current = io;

    const tag = () => {
      // phones/tablets: tighter stagger so things don't feel sluggish
      const staggerScale = window.matchMedia("(max-width: 992px)").matches ? 1 : 2;
      REVEAL_RULES.forEach(([selector, variant, step, force]) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (el.dataset.reveal) return;
          // never hijack an element that already runs its own animation
          if (!force && getComputedStyle(el).animationName !== "none") return;
          const siblings = el.parentElement
            ? Array.from(el.parentElement.children).filter((c) => c.matches(selector))
            : [el];
          const index = Math.max(0, siblings.indexOf(el));
          // Each row scrolls into view on its own, so the stagger must restart
          // per row: delay = column position, never a running index across rows
          // (a running index made a row's last card land before its first).
          const firstTop = siblings[0]?.offsetTop ?? 0;
          const perRow = Math.max(1, siblings.filter((c) => c.offsetTop === firstTop).length);
          const slot = perRow > 1 ? index % perRow : Math.min(index, 6); // stacked text → simple cascade
          el.dataset.reveal = variant;
          // 2× stagger on desktop so items arrive at a calm pace (1× on mobile)
          el.style.setProperty("--rd", `${Math.round(slot * step * staggerScale)}ms`);
          io.observe(el);
        });
      });
    };
    tagRef.current = tag;
    tag();

    // content from the API arrives later — tag it as it lands
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tag);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      root.classList.remove("fx-ready");
    };
  }, []);

  // new route → tag the fresh page
  useEffect(() => {
    const id = requestAnimationFrame(() => tagRef.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  /* ---------------- progress bar + smart header ---------------- */
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      // shared with the scroll-to-top ring in the footer
      root.style.setProperty("--scroll-p", p.toFixed(4));
      root.classList.toggle("is-scrolled", y > 40);
      // hide only on a real downward scroll, well past the hero
      if (Math.abs(y - lastY) > 6) {
        root.classList.toggle("header-tucked", y > lastY && y > 420);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.classList.remove("is-scrolled", "header-tucked");
    };
  }, []);

  /* ---------------- header height (progress bar sits under it on mobile) ---------------- */
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const root = document.documentElement;
    const setH = () =>
      root.style.setProperty("--header-h", `${header.offsetHeight}px`);
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(header);
    return () => ro.disconnect();
  }, [pathname]);

  /* ---------------- 3D tilt ---------------- */
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let active = null;

    const reset = (el) => {
      if (!el) return;
      el.style.transform = "";
      el.classList.remove("is-tilting");
    };
    const onMove = (e) => {
      const el = e.target.closest?.(TILT_SELECTOR);
      if (el !== active) {
        reset(active);
        active = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add("is-tilting");
      el.style.transform = `perspective(900px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateY(-6px)`;
    };
    const onLeave = () => {
      reset(active);
      active = null;
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      reset(active);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}
