"use client";
import Navigations from "@/components/navigations";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";

export default function DiscoverContent() {
  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          discover places
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
            name: "places",
            href: "",
          },
        ]}
      />

      <DisplayContent type={"place"} />
    </div>
  );
}
