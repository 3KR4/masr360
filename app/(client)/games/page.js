"use client";
import Image from "next/image";
import "@/styles/pages/games.css";

import React, { useContext, useState, useEffect } from "react";
import { gamesEn, gamesAr } from "@/data";
import Navigations from "@/components/Navigations";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import CardItem from "@/components/CardItem";

function Page() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchgames = async () => {
      // try {
      //   const { data } = await getService.getGames(6);
      //   setGames(
      //     data || locale == "EN" ? gamesEn : gamesAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch games:", err);
      //   setGames(locale == "EN" ? gamesEn : gamesAr);
      // }
      setGames(locale == "EN" ? gamesEn : gamesAr);
    };
    fetchgames();
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
        container={`main`}
      />

      <div className="container big-holder">
        <div className="holder">
          <div className="grid-holder for-games">
            {games?.map((item) => (
              <CardItem key={item.id} item={item} type={`game`} />
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

export default Page;
