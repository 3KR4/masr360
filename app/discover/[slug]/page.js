import Image from "next/image";
import { governments } from "@/data";
import { use } from "react";
import Navigations from "@/components/navigations";
import "@/styles/pages/discover.css";

export default function PlaceDetails({ params, searchParams }) {
  const { slug } = use(params);
  const { type } = use(searchParams);

  console.log("id:", slug);
  console.log("type:", type);

  const city =
    type === "governments" ? governments.find((x) => x.id == slug) : null;

  const data = city || null;

  console.log(data);

  if (!data) {
    return <h2>Not Found</h2>;
  }

  return (
    <div className="places-page">
      <div className="city fluid-container">
        <Image src={data?.image} fill alt={data?.name} />
        <div className="details">
          <h3>{data?.name}</h3>
          <p>{data?.description}</p>
        </div>
      </div>
      <Navigations
        items={[
          {
            name: type == "governments" ? "governments" : "categories",
            href: "/discover?type=governments",
          },
          { name: data?.name, href: "" },
        ]}
      />
    </div>
  );
}
