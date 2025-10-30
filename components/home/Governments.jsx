import React from "react";
import Image from "next/image";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import { FaArrowRight } from "react-icons/fa6";
import { governments } from "@/data";

function Governments() {
  return (
    <div className="governments">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          discover egypt
          <hr />
        </h1>
        <p className="sub-title">
          Take a look at the most famous governments in Egypt
        </p>
        <Link href={`/discover?type=governments`} className="main-button">
          See All
        </Link>
      </div>

      <div className="grid-holder container">
        {governments.slice(0, 6).map((gov) => (
          <CardItem item={gov} type="gov" />
        ))}
      </div>
    </div>
  );
}

export default Governments;
