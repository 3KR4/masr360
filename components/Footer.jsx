"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaArrowUp } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/components/footer.css";

export default function Footer() {
  const t = useTranslate();
  const [hoveredValue, setHoveredValue] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight ||
        document.body.scrollHeight ||
        0;
      const currentScroll = window.scrollY || window.pageYOffset || 0;

      if (totalHeight >= 2000 && currentScroll >= totalHeight / 2) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const valuesData = [
    {
      id: "exploration",
      title: "Exploration",
      desc: "On M360, every trip is a quest, not a checklist. We turn Egypt's hidden alleys, under-the-radar eateries, and lesser-known heritage sites into challenges and badges — rewarding people for going beyond the pyramids and into the Egypt most tourists never see.",
    },
    {
      id: "innovation",
      title: "Innovation",
      desc: "We built the gamification layer nobody else built for Egyptian tourism — a real system behind Places, Nights, and Products, with rewards and social sharing baked into the experience. Not a static listings site. A living discovery engine.",
    },
    {
      id: "authenticity",
      title: "Authenticity",
      desc: "No stock photos, no generic 'top 10' lists. Every place on M360 is chosen for real cultural and experiential value — Egypt as Egyptians actually live it, not the postcard version sold to tourists.",
    },
  ];

  const connectLinks = [
    { label: "Website", href: "https://m360travel.com/" },
    { label: "Instagram", href: "https://www.instagram.com/m360.travel" },
    { label: "TikTok", href: "https://www.tiktok.com/@m360.travel" },
    { label: "LinkedIn", href: "http://linkedin.com/company/m360travel" },
    { label: "Facebook", href: "https://www.facebook.com/M360.travel" },
    { label: "WhatsApp", href: "https://wa.me/201101512242" },
    { label: "X", href: "https://x.com/M360travel" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Governorates", href: "/discover" },
    { label: "Attractions", href: "/places" },
    { label: "Nights", href: "/nights" },
    { label: "Events", href: "/events" },
    { label: "Products", href: "/marketplace" },
    { label: "Support", href: "/support" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="footer-redesign back-light">
      {/* Top Header Section with Logo and Tagline */}
      <div className="footer-top container">
        <Link href="/" className="footer-logo">
          <Image
            src="/main-logo.png"
            alt="Masr360 Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </Link>
        <p className="footer-tagline">
          Discover the beauty, history, and culture of Egypt — all in one place.
        </p>
      </div>

      {/* Orange Gradient Separator Line */}
      <div className="footer-divider-container container">
        <div className="orange-gradient-line"></div>
      </div>

      {/* Middle Sections Grid */}
      <div className="footer-main container">
        {/* Column 1: OUR VALUES */}
        <div className="footer-col our-values-col">
          <h4 className="footer-col-title">OUR VALUES</h4>
          <ul className="values-list">
            {valuesData.map((val) => {
              const isHovered = hoveredValue === val.id;
              return (
                <li
                  key={val.id}
                  className={`value-item ${isHovered ? "active" : ""}`}
                  onMouseEnter={() => setHoveredValue(val.id)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  <div className="value-header">
                    <span className="bullet">•</span>
                    <span className="value-name">{val.title}</span>
                    <FaAngleRight className="value-arrow" />
                  </div>

                  {/* Tooltip Popup Modal */}
                  {isHovered && (
                    <div className="value-popup backdrop-blur">
                      <p>{val.desc}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 2: CONNECT */}
        <div className="footer-col">
          <h4 className="footer-col-title">CONNECT</h4>
          <ul className="footer-links-list">
            {connectLinks.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: QUICK LINKS */}
        <div className="footer-col">
          <h4 className="footer-col-title">QUICK LINKS</h4>
          <ul className="footer-links-list">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: LEGAL */}
        <div className="footer-col">
          <h4 className="footer-col-title">LEGAL</h4>
          <ul className="footer-links-list">
            {legalLinks.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom container">
        <div className="footer-bottom-left">
          <p>© {new Date().getFullYear()} M360. All rights reserved.</p>
        </div>
        <div className="footer-bottom-right">
          <span className="footer-tag-dots">Masr360 · M360</span>
        </div>
      </div>

      {/* Global Fixed Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showScrollTop ? "active" : ""}`}
        title="Scroll to Top"
        aria-label="Scroll to Top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
}
