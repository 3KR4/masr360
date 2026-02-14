"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import "@/styles/pages/games.css";

import CardItem from "@/components/CardItem";
import { FaArrowRight } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { gamesEn, gamesAr } from "@/data";
import { mainContext } from "@/Contexts/mainContext";

function Games() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchgames = async () => {
      // try {
      //   const { data } = await getService.getGames(6);
      //   setGames(
      //     data || locale == "en" ? gamesEn : gamesAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setGames(locale == "en" ? gamesEn : gamesAr);
      // }
      setGames(locale == "en" ? gamesEn : gamesAr);
    };
    fetchgames();
  }, [locale]);

  return (
    <div className="governorates games">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.explore_games.mainTitle}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.explore_games.subTitle}</p>
        <Link href={`/games`} className="main-button">
          {t.sectionsTitles.explore_games.btn}
        </Link>
      </div>

      <div className="grid-holder container">
        {games.slice(0, 3).map((game) => (
          <CardItem key={game.id} item={game} type="game" />
        ))}
      </div>
    </div>
  );
}

export default Games;
