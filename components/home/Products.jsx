"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot, FaCartShopping } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import { FaHeart } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import { products } from "@/data";

import CardItem from "@/components/CardItem";

function Products() {
  return (
    <div className="products">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          popular products
          <hr />
        </h1>
        <p className="sub-title">
          Discover Egypt’s most loved handmade creations — crafted with passion,
          tradition, and authentic local artistry.
        </p>
        <Link href={`/marketplace`} className="main-button">
          Explore More
        </Link>
      </div>

      <div className="grid-holder container">
        {products.slice(0, 10).map((product) => (
          <CardItem key={product.id} item={product} type="product" />
        ))}
      </div>
    </div>
  );
}

export default Products;
