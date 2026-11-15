"use client";
import "@/styles/pages/discover.css";
import { useParams } from "next/navigation";
import { gamesEn, gamesAr, reviews, featuresEn, featuresAr } from "@/data";
import "@/styles/pages/games.css";
import ReviewSection from "@/components/reviews/ReviewSection";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { useState, useContext, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import CardItem from "@/components/CardItem";

export default function GamePreviewClient({ slug: propSlug }) {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const params = useParams();
  const slug = propSlug || params?.slug;

  const [game, setGame] = useState(null);
  const [GameReviews, setGameReviews] = useState(null);

  useEffect(() => {
    const cureentGame =
      locale == "EN"
        ? gamesEn.find((x) => x.id == slug)
        : gamesAr.find((x) => x.id == slug);

    if (cureentGame) setGame(cureentGame);

    setGameReviews(reviews[0]);
  }, [slug, locale]);

  const features = locale == "EN" ? featuresEn : featuresAr;

  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {game?.name}
          <hr />
        </h1>
        <p className="sub-title">{game?.description}</p>
      </div>

      <div className="fluid-container big-holder for-games">
        <div className="holder">
          <div className="pruche-now">
            {game && (
              <CardItem
                key={game.id}
                item={game}
                type="game"
                previewGame={true}
              />
            )}
          </div>
          <ul className="steps-list">
            {game?.steps.map((step, index) => {
              const feature = features.find((f) => f.id === step.feature);
              const featureIcon = feature ? feature.icon : "📍";

              return (
                <li
                  key={step.id}
                  className={`step ${index % 2 === 0 ? "left" : "right"}`}
                >
                  {index !== 0 && <span className="line" />}

                  <div className="icon-wrapper">
                    <span className="feature-icon">{featureIcon}</span>
                  </div>

                  <h4 className="title">
                    {step.stepNumber}- {step.title}
                  </h4>

                  <span className="coins">
                    {step.coins}
                    <FaMoneyBillWave />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        {GameReviews && <ReviewSection reviews={GameReviews} />}
      </div>
    </div>
  );
}
