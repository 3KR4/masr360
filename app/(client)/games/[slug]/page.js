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
import GameStepsAccordion from "@/components/GameStep";

export default function SingelGame() {
  const { locale } = useContext(mainContext);

  const t = useTranslate();
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [GameReviews, setGameReviews] = useState(null);

  useEffect(() => {
    // const fetchSingelGame = async () => {
    //   try {
    //     const { data } = await getService.getSingleGame(slug);
    //     const item = data?.data;

    //     if (item) {
    //       setGame(item);
    //       setGameReviews(item.reviews || null);
    //     }
    //   } catch (err) {
    //     console.error("Failed to fetch product:", err);
    //   }
    // };

    // if (slug) fetchSingelGame();
    const cureentGame =
      locale == "EN"
        ? gamesEn.find((x) => x.id == slug)
        : gamesAr.find((x) => x.id == slug);

    if (cureentGame) setGame(cureentGame);

    setGameReviews(reviews[0]);
  }, [slug, locale]);

  // const features = locale == "EN" ? featuresEn : featuresAr;

  return (
    <div className="game-page single-game container">
      <div className="title-holder pages">
        <h1 className="main-title">
          <hr />
          {game?.name}
          <hr />
        </h1>
        <p className="sub-title">here you can see the steps</p>
      </div>

      <div className="progress-holder">
        <div className="progress-bar">
          <div className="progress" style={{ width: `60%` }}></div>
        </div>
      </div>

      {game && <GameStepsAccordion game={game} />}
    </div>
  );
}
