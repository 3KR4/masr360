"use client";
import Image from "next/image";

import React, { useContext } from "react";
import { games } from "@/data";
import CardItem from "@/components/CardItem";
import Navigations from "@/components/navigations";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { mainContext } from "@/Contexts/mainContext";

function Page() {
  const { screenSize } = useContext(mainContext);

  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          explore games
          <hr />
        </h1>
        <p className="sub-title">
          explore hidden details only seen on-site, and earn coins you can
          redeem for real rewards in our marketplace
        </p>
      </div>

      <Navigations
        items={[
          {
            name: "games",
            href: "",
          },
        ]}
        container={`main`}
      />

      <div className="container big-holder">
        <div className="holder">
          <div className="grid-holder">
            {games?.map((item) => (
              <CardItem key={item.id} item={item} type={"game"} />
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
