"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";

function Marketplace() {
  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          Marketplace
          <hr />
        </h1>
        <p className="sub-title">
          Discover authentic Egyptian crafts and souvenirs made by local
          artisans — each piece reflects the spirit of Egypt.
        </p>
      </div>
      <Navigations
        items={[
          {
            name: "marketplace",
            href: "",
          },
        ]}
      />
      <DisplayContent type={"product"} />
    </div>
  );
}
export default Marketplace;
