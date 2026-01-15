"use client";
import React from "react";
import "@/styles/pages/privacy.css";

import useTranslate from "@/Contexts/useTranslation";

export default function PrivacyPolicy() {
  const t = useTranslate();

  const sections = t.privacy.privacy_policy.sections;

  return (
    <div className="legal-document container">
      {/* Privacy Policy Section */}
      <div className="document-section">
        <h1>{t.privacy.privacy_policy.mainTitle}</h1>
        <div className="metadata">
          <p>
            <strong>Effective Date:</strong>{" "}
            {t.privacy.privacy_policy.effectiveDate}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {t.privacy.privacy_policy.lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <h2>{sections.introduction.title}</h2>
        {sections.introduction.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Information We Collect */}
        <h2>{sections.information_we_collect.title}</h2>
        {sections.information_we_collect.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
        {sections.information_we_collect.personal_info && (
          <>
            <h3>Personal Information</h3>
            <ul>
              {sections.information_we_collect.personal_info.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}
        {sections.information_we_collect.non_personal_info && (
          <>
            <h3>Non-Personal Information</h3>
            <ul>
              {sections.information_we_collect.non_personal_info.map(
                (item, i) => (
                  <li key={i}>{item}</li>
                )
              )}
            </ul>
          </>
        )}

        {/* How We Use */}
        <h2>{sections.how_we_use.title}</h2>
        {sections.how_we_use.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Sharing of Information */}
        <h2>{sections.sharing_of_information.title}</h2>
        {sections.sharing_of_information.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Data Security */}
        <h2>{sections.data_security.title}</h2>
        {sections.data_security.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* User Rights */}
        <h2>{sections.user_rights.title}</h2>
        {sections.user_rights.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Data Retention */}
        <h2>{sections.data_retention.title}</h2>
        {sections.data_retention.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Cookies */}
        <h2>{sections.cookies.title}</h2>
        {sections.cookies.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Third Party Links */}
        <h2>{sections.third_party_links.title}</h2>
        {sections.third_party_links.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Changes */}
        <h2>{sections.changes.title}</h2>
        {sections.changes.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Contact */}
        <h2>{sections.contact.title}</h2>
        {sections.contact.content.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </div>
  );
}
