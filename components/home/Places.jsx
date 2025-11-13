"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import { FaHeart } from "react-icons/fa";
import { places } from "@/data";
import CardItem from "@/components/CardItem";

function Places() {
  return (
    <div className="places">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          top attractions
          <hr />
        </h1>
        <p className="sub-title">
          Step into history and explore Egypt’s most breathtaking landmarks —
          from ancient wonders to timeless treasures.
        </p>
        <Link href={`/places`} className="main-button">
          See More
        </Link>
      </div>

      <div className="grid-holder container">
        {places.map((place) => (
          <CardItem key={place.id} item={place} type="place" />
        ))}
      </div>
    </div>
  );
}

export default Places;
