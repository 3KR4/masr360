"use client";
import Image from "next/image";
import { governments } from "@/data";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";
import { useParams } from "next/navigation";

export default function GovernmentDetails() {
  const { slug } = useParams();

  const government = governments.find((gov) => gov.id == slug);

  return (
    <div className="discover">
      <div className="city fluid-container">
        <Image src={government?.image} fill alt={government?.name} />
        <div className="details">
          <h3>{government?.name}</h3>
          <p>{government?.description}</p>
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
      <DisplayContent type={"place"} />
    </div>
  );
}
