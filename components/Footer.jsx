"use client";

import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaAngleLeft, FaArrowUp } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import "@/styles/components/footer.css";

export default function Footer() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);
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
      title: t.footer?.values?.exploration?.title || "Exploration",
      desc:
        t.footer?.values?.exploration?.desc ||
        "On M360, every trip is a quest, not a checklist. We turn Egypt's hidden alleys, under-the-radar eateries, and lesser-known heritage sites into challenges and badges — rewarding people for going beyond the pyramids and into the Egypt most tourists never see.",
    },
    {
      id: "innovation",
      title: t.footer?.values?.innovation?.title || "Innovation",
      desc:
        t.footer?.values?.innovation?.desc ||
        "We built the gamification layer nobody else built for Egyptian tourism — a real system behind Places, Nights, and Products, with rewards and social sharing baked into the experience. Not a static listings site. A living discovery engine.",
    },
    {
      id: "authenticity",
      title: t.footer?.values?.authenticity?.title || "Authenticity",
      desc:
        t.footer?.values?.authenticity?.desc ||
        "No stock photos, no generic 'top 10' lists. Every place on M360 is chosen for real cultural and experiential value — Egypt as Egyptians actually live it, not the postcard version sold to tourists.",
    },
  ];

  const connectLinks = [
    {
      label: t.footer?.connect_links?.website || "Website",
      href: "https://m360travel.com/",
    },
    {
      label: t.footer?.connect_links?.instagram || "Instagram",
      href: "https://www.instagram.com/m360.travel",
    },
    {
      label: t.footer?.connect_links?.tiktok || "TikTok",
      href: "https://www.tiktok.com/@m360.travel",
    },
    {
      label: t.footer?.connect_links?.linkedin || "LinkedIn",
      href: "http://linkedin.com/company/m360travel",
    },
    {
      label: t.footer?.connect_links?.facebook || "Facebook",
      href: "https://www.facebook.com/M360.travel",
    },
    {
      label: t.footer?.connect_links?.whatsapp || "WhatsApp",
      href: "https://wa.me/201101512242",
    },
    {
      label: t.footer?.connect_links?.x || "X",
      href: "https://x.com/M360travel",
    },
  ];

  const quickLinks = [
    { label: t.footer?.quick_links_items?.home || "Home", href: "/" },
    {
      label: t.footer?.quick_links_items?.governorates || "Governorates",
      href: "/discover",
    },
    {
      label: t.footer?.quick_links_items?.attractions || "Attractions",
      href: "/places",
    },
    { label: t.footer?.quick_links_items?.nights || "Nights", href: "/nights" },
    { label: t.footer?.quick_links_items?.events || "Events", href: "/events" },
    {
      label: t.footer?.quick_links_items?.products || "Products",
      href: "/marketplace",
    },
    { label: t.footer?.quick_links_items?.support || "Support", href: "/support" },
  ];

  const legalLinks = [
    {
      label: t.footer?.legal_items?.privacy || "Privacy Policy",
      href: "/privacy",
    },
    {
      label: t.footer?.legal_items?.terms || "Terms & Conditions",
      href: "/terms",
    },
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
            alt={t.footer?.logo_alt || "Masr360 Logo"}
            fill
            style={{ objectFit: "contain" }}
          />
        </Link>
        <p className="footer-tagline">
          {t.footer?.tagline ||
            t.footer?.description ||
            "Discover the beauty, history, and culture of Egypt — all in one place."}
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
          <h4 className="footer-col-title">
            {t.footer?.our_values || "OUR VALUES"}
          </h4>
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
                    {locale === "AR" ? (
                      <FaAngleLeft className="value-arrow" />
                    ) : (
                      <FaAngleRight className="value-arrow" />
                    )}
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
          <h4 className="footer-col-title">
            {t.footer?.connect || "CONNECT"}
          </h4>
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
          <h4 className="footer-col-title">
            {t.footer?.quick_links || "QUICK LINKS"}
          </h4>
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
          <h4 className="footer-col-title">
            {t.footer?.legal || "LEGAL"}
          </h4>
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
          <p>
            © {new Date().getFullYear()}{" "}
            {locale === "AR" ? "مصر 360" : "M360"}.{" "}
            {t.footer?.rights || "All rights reserved."}
          </p>
        </div>
        <div className="footer-bottom-right">
          <span className="footer-tag-dots">
            {locale === "AR" ? "مصر 360 · M360" : "Masr360 · M360"}
          </span>
        </div>
      </div>

      {/* Global Fixed Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showScrollTop ? "active" : ""}`}
        title={t.footer?.scroll_to_top || "Scroll to Top"}
        aria-label={t.footer?.scroll_to_top || "Scroll to Top"}
      >
        <FaArrowUp />
      </button>
    </footer>
  );
}
