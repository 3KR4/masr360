"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";

export default function DiscoverContent() {
  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          masr nights
          <hr />
        </h1>

        <p className="sub-title">
          With Masr 360, explore top destinations, uncover local stories, and
          experience the true essence of every location.
        </p>
      </div>

      <Navigations
        items={[
          {
            name: "nights",
            href: "",
          },
        ]}
      />

      <DisplayContent type={"night"} />
    </div>
  );
}
