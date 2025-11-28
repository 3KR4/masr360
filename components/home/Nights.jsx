"use client";
import Link from "next/link";
import { nights } from "@/data";

import CardItem from "@/components/CardItem";

function Nights() {
  return (
    <div className="nights">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          masr nights
          <hr />
        </h1>
        <p className="sub-title">
          Discover the vibrant nightlife of Egypt — from lively evening events
          and cultural shows to riverside cruises and hidden gems waiting to be
          explored after dark.
        </p>
        <Link href={`/nights`} className="main-button">
          Explore More
        </Link>
      </div>

      <div className="grid-holder container">
        {nights.slice(0, 6).map((night) => (
          <CardItem key={night.id} item={night} type="night" />
        ))}
      </div>
    </div>
  );
}

export default Nights;
