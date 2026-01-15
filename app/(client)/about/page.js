"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import { FaCheck } from "react-icons/fa";
import "@/styles/pages/about.css";
import useTranslate from "@/Contexts/useTranslation";

function AboutUs() {
  const t = useTranslate();

  return (
    <div className="about">
      <div className="title-holder pages container">
        <span>{t.about.hero_tagline}</span>
        <h1 className="main-title">
          <hr />
          {t.about.hero_title}
          <hr />
        </h1>
        <p className="sub-title">{t.about.hero_subtitle}</p>
      </div>

      <Navigations
        items={[
          {
            name: t.about.nav.about,
            href: "",
          },
        ]}
        container="main"
      />

      <div className="container">
        {/* ABOUT */}
        <div className="about-section">
          <h3>{t.about.about_title}</h3>
          <p>
            {t.about.about_p1.main}
            <span>{t.about.about_p1.highlight}</span>
          </p>
          <p>{t.about.about_p2}</p>

          <h5>{t.about.ecosystem_title}</h5>
          <ul>
            {t.about.ecosystem.map((item, i) => (
              <li key={i}>
                <span>{item.title}</span> {item.text}
              </li>
            ))}
          </ul>

          <h5>{t.about.not_app_title}</h5>
          <p>
            <span>{t.about.not_app_highlight}</span>
            <br />
            {t.about.not_app_text}
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="vision-mission">
          <div className="mission">
            <h3>{t.about.mission_title}</h3>
            <h5>{t.about.ecosystem_title}</h5>
            <ul>
              {t.about.ecosystem.map((item, i) => (
                <li key={i}>
                  <span>{item.title}</span> {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="vision">
            <h3>{t.about.vision_title}</h3>
            <p>{t.about.vision_text}</p>
          </div>
        </div>

        {/* GAME CENTER */}
        <div className="game-center">
          <h3>{t.about.game_title}</h3>
          <h5>{t.about.game_subtitle}</h5>
          <p>{t.about.game_intro}</p>

          <ul>
            {t.about.game_points.map((point, i) => (
              <li key={i}>
                <FaCheck /> {point}
              </li>
            ))}
          </ul>

          <h5>{t.about.game_note_title}</h5>
          <p>
            <span>{t.about.game_note_highlight}</span>
          </p>
          <p>{t.about.game_note_end}</p>
        </div>

        {/* WHY MASR */}
        <div className="why-masr">
          <h3>{t.about.why_title}</h3>
          {t.about.why_text.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* VALUES */}
        <div className="our-values">
          <div className="top">
            <h3>{t.about.values_title}</h3>
            <p>{t.about.values_keywords}</p>
          </div>

          <div className="cards-grid">
            {t.about.values.map((val, i) => (
              <div className="card" key={i}>
                <h4>{val.title}</h4>
                <p>{val.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CLOSING */}
        <div className="closing">
          <h5>Masr360</h5>
          <div>
            {t.about.closing.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
