"use client";
import "@/styles/pages/games.css";
import React, { useContext, useState, useEffect } from "react";
import { gamesEn, gamesAr } from "@/data";
import Navigations from "@/components/Navigations";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import CardItem from "@/components/CardItem";

export default function GamesClient() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    setGames(locale == "EN" ? gamesEn : gamesAr);
  }, [locale]);

  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.explore_games.mainTitle}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.explore_games.subTitle}</p>
      </div>

      <Navigations
        items={[
          {
            name: t.sideNav.games,
            href: "",
          },
        ]}
        container="main"
      />

      <div className="container big-holder">
        <div className="holder">
          <div className="grid-holder for-games">
            {games?.map((item) => (
              <CardItem key={item.id} item={item} type="game" />
            ))}
          </div>

          <Pagination
            pageCount={50}
            screenSize={screenSize}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
