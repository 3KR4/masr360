"use client";
import Navigations from "@/components/Navigations";
import DisplayContent from "@/components/DisplayContent";
import "@/styles/pages/discover.css";

export default function DiscoverContent() {
  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          discover egypt
          <hr />
        </h1>

        <p className="sub-title">
          With Masr 360, you can explore each governorate and experience Egypt
          like never before.
        </p>
      </div>
      <Navigations
        items={[
          {
            name: "governorates",
            href: "",
          },
        ]}
      />
      <DisplayContent type={"gov"} />
    </div>
  );
}
