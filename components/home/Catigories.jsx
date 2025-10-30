"use client";
import React from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data";

const breakpoints = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};


function Catigories() {
  return (
    <div className="catigories">
      <div className="title-holder">
        <h1 className="main-title">
          <hr />
          Categories
          <hr />
        </h1>
        <p className="sub-title">
          From ancient temples to sunlit shores - your journey starts here
        </p>
      </div>

      <div className="masonry-horizontal">
        {categories.map((cat) => (
          <Link key={cat.id}href={`/places/${cat.id}?type=category`} className="box">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="text-holder">
              <h2 className="name">{cat.name}</h2>
              <span className="places-count">{cat.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Catigories;
