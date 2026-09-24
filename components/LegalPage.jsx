"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigations from "@/components/Navigations";
import "@/styles/pages/privacy.css";
import { mainContext } from "@/Contexts/mainContext";

const PRIVACY_DATA = {
  title: "Privacy Policy",
  lastUpdated: "July 15, 2026",
  sections: [
    {
      id: "who-we-are",
      title: "Who We Are",
      type: "paragraph",
      text: "This Privacy Policy explains how m360 (a limited liability company), based in Cairo, Egypt, collects and uses personal information through about.m360travel.com. Contact: support@m360travel.com.",
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      type: "bullets",
      bullets: [
        "Name",
        "Email address",
        "Country",
        "Age range",
        "IP address and basic technical information needed for security",
      ],
    },
    {
      id: "why-we-collect-it",
      title: "Why We Collect It",
      type: "bullets",
      bullets: [
        "Manage the waitlist.",
        "Contact you about your waitlist status and the launch.",
        "Provide guaranteed launch credits associated with the waitlist where applicable.",
        "Improve our website and services using aggregated information.",
        "Protect the website against abuse and maintain security.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing",
      type: "paragraph",
      text: "We do not sell your personal information. We may share data only with service providers necessary to operate the website (such as our VPS hosting provider and MongoDB Atlas database hosting) or where required by law.",
    },
    {
      id: "retention",
      title: "Retention",
      type: "paragraph",
      text: "We retain waitlist information until it is no longer needed for the launch and related communications or until you request deletion, unless a longer retention period is required by law.",
    },
    {
      id: "your-rights",
      title: "Your Rights",
      type: "paragraph",
      text: "You may request access, correction, deletion, or ask questions about your information by emailing support@m360travel.com.",
    },
    {
      id: "security",
      title: "Security",
      type: "paragraph",
      text: "We use HTTPS, access controls, and reasonable technical and organizational measures to protect your information. No system can be guaranteed to be completely secure.",
    },
    {
      id: "international-visitors",
      title: "International Visitors",
      type: "paragraph",
      text: "Our company is based in Cairo, Egypt. By using the website, you understand your information may be processed in Egypt and by carefully selected service providers.",
    },
    {
      id: "changes",
      title: "Changes",
      type: "paragraph",
      text: "We may update this policy from time to time. Material changes will be reflected by updating the 'Last updated' date.",
    },
  ],
};

const TERMS_DATA = {
  title: "Terms & Conditions",
  lastUpdated: "July 15, 2026",
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance",
      type: "paragraph",
      text: "By accessing or using about.m360travel.com, you agree to these Terms. If you do not agree, please do not use the website.",
    },
    {
      id: "about-us",
      title: "2. About Us",
      type: "paragraph",
      text: "This website is operated by m360, a limited liability company based in Cairo, Egypt.",
    },
    {
      id: "purpose-of-the-website",
      title: "3. Purpose of the Website",
      type: "paragraph",
      text: "The website provides information about m360 and allows users to join the pre-launch waitlist. Launch dates, features, rewards, and content may change.",
    },
    {
      id: "eligibility",
      title: "4. Eligibility",
      type: "paragraph",
      text: "By using this website, you confirm you are legally able to use it under the laws applicable to you.",
    },
    {
      id: "information-you-provide",
      title: "5. Information You Provide",
      type: "paragraph",
      text: "You agree to provide accurate information. We may remove duplicate, fraudulent, or abusive submissions.",
    },
    {
      id: "waitlist-and-rewards",
      title: "6. Waitlist & Rewards",
      type: "paragraph",
      text: "Joining the waitlist makes you eligible for announced launch rewards where applicable. Rewards may be subject to eligibility checks and anti-fraud measures.",
    },
    {
      id: "intellectual-property",
      title: "7. Intellectual Property",
      type: "paragraph",
      text: "All content, logos, branding, graphics, text and software on this website are owned by or licensed to m360 and may not be copied or reused without permission.",
    },
    {
      id: "website-availability",
      title: "8. Website Availability",
      type: "paragraph",
      text: "We aim to keep the website available but do not guarantee uninterrupted or error-free operation.",
    },
    {
      id: "limitation-of-liability",
      title: "9. Limitation of Liability",
      type: "paragraph",
      text: "To the maximum extent permitted by law, m360 is not liable for indirect or consequential losses arising from use of the website.",
    },
    {
      id: "privacy",
      title: "10. Privacy",
      type: "paragraph",
      text: "Your use of the website is also governed by our Privacy Policy.",
    },
    {
      id: "terms-changes",
      title: "11. Changes",
      type: "paragraph",
      text: "We may update these Terms or the website from time to time. Continued use after updates constitutes acceptance of the revised Terms.",
    },
    {
      id: "governing-law",
      title: "12. Governing Law",
      type: "paragraph",
      text: "These Terms are governed by the laws of the Arab Republic of Egypt.",
    },
    {
      id: "contact",
      title: "13. Contact",
      type: "paragraph",
      text: "Questions: support@m360travel.com\n\nm360\nCairo, Egypt",
    },
  ],
};

export default function LegalPage({ activeTab = "privacy" }) {
  const { locale } = useContext(mainContext);
  const router = useRouter();

  const currentData = activeTab === "terms" ? TERMS_DATA : PRIVACY_DATA;
  const sections = currentData.sections;

  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const isClickingRef = useRef(false);

  useEffect(() => {
    setActiveId(sections[0]?.id || "");
  }, [activeTab, sections]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, activeTab]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveId(id);
    isClickingRef.current = true;

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 800);
  };

  const tagline = locale === "AR" ? "السياسات والشروط" : "LEGAL & COMPLIANCE";
  const subtitle =
    activeTab === "terms"
      ? locale === "AR"
        ? "اقرأ الشروط والقواعد المنظمة لاستخدام منصة وخدمات مصر 360."
        : "Read the rules, terms, and guidelines for using the m360 platform and services."
      : locale === "AR"
      ? "تعرّف على كيفية حماية وإدارة بياناتك الشخصية في مصر 360."
      : "Learn how m360 protects, handles, and respects your personal information and privacy.";

  return (
    <div className="legal-page-container">
      <div className="title-holder pages container">
        <span>{tagline}</span>
        <h1 className="main-title">
          <hr />
          {currentData.title}
          <hr />
        </h1>
        <p className="sub-title">{subtitle}</p>
      </div>

      <Navigations
        items={[
          {
            name: currentData.title,
            href: "",
          },
        ]}
        container="main"
      />

      <div className="container">
        {/* Main 2-Column Layout */}
        <div className="legal-layout">
          {/* Left Sticky Sidebar */}
          <aside className="legal-sidebar" aria-label="On this page navigation">
            <h4 className="sidebar-title">QUICK NAVIGATION</h4>
            <nav className="sidebar-nav">
              <ul className="sidebar-list">
                {sections.map((sec) => {
                  const isActive = activeId === sec.id;
                  return (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className={`sidebar-item ${isActive ? "active" : ""}`}
                        onClick={(e) => handleNavClick(e, sec.id)}
                      >
                        {sec.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Right Main Content Card */}
          <main className="legal-content-card">
            <p className="last-updated">
              <strong>Last updated:</strong> {currentData.lastUpdated}
            </p>

            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="legal-section">
                <h2 className="section-heading">{sec.title}</h2>

                {sec.type === "paragraph" && (
                  <div className="section-paragraph-wrapper">
                    {sec.text.split("\n\n").map((para, idx) => (
                      <p key={idx} className="section-paragraph">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {sec.type === "bullets" && (
                  <ul className="section-bullets">
                    {sec.bullets.map((bItem, idx) => (
                      <li key={idx}>{bItem}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
