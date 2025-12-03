"use client";
import Image from "next/image";
import { governments } from "@/data";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getService } from "@/services/api/getService";

export default function GovernmentDetails() {
  const { slug } = useParams();
  const [government, setGovernment] = useState(null);

  useEffect(() => {
    const GetSingleGovernment = async () => {
      try {
        const { data } = await getService.getSingleGovernorate(slug);

        const gov = data.g;

        if (gov) {
          setGovernment(gov);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (slug) {
      GetSingleGovernment();
    }
  }, [slug]);

  return (
    <div className="discover">
      <div className="hero-image-holder fluid-container">
        <Image src={government?.img} fill alt={government?.name} />
        <div className="details">
          <h3>{government?.name}</h3>
          <p>{government?.desc}</p>
        </div>
      </div>
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {`${government?.name} places`}
          <hr />
        </h1>

        <p className="sub-title">
          Explore the beauty and attractions of{" "}
          <strong>{government?.name}</strong>. <br />
          Discover its history, landmarks, and hidden treasures only on Masr
          360.
        </p>
      </div>
      {government?.places && (
        <DisplayContent
          type={"place"}
          isSharedData={true}
          shared={government?.places}
        />
      )}
    </div>
  );
}
