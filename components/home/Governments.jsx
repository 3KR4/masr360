"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import { FaArrowRight } from "react-icons/fa6";
import { getService } from "@/services/api/getService";

function Governments() {
  const [governments, setGovernments] = useState([]);
  console.log(governments[0]?.img);

  useEffect(() => {
    const fetchGovernments = async () => {
      try {
        const { data } = await getService.getGovernorates(6);
        setGovernments(data || []);
      } catch (err) {
        console.error("Failed to fetch governments:", err);
        setGovernments([]);
      }
    };
    fetchGovernments();
  }, []);

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
        <Link href={`/discover`} className="main-button">
          See All
        </Link>
      </div>

      <div className="grid-holder container">
        {governments.slice(0, 6).map((gov) => (
          <CardItem key={gov.id} item={gov} type="gov" />
        ))}
      </div>
    </div>
  );
}

export default Governments;
