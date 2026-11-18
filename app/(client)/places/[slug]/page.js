import PlaceDetailsClient from "./PlaceDetailsClient";
import { getCachedPlace, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const place = await getCachedPlace(slug);

  if (!place) {
    return buildSEO({
      title: "Explore Historic Places in Egypt",
      description:
        "Discover ancient monuments, historical landmarks, and hidden gems across Egypt with M360.",
      url: `/places/${slug || ""}`,
    });
  }

  const name =
    place?.translations?.EN?.name || place?.name || "Historic Place in Egypt";
  const govName =
    place?.governorate?.translations?.EN?.name ||
    place?.governorate?.name ||
    place?.governorateName ||
    "";
  const rawDesc =
    place?.translations?.EN?.desc || place?.description || place?.desc || "";

  const locationPart = govName ? ` in ${govName}` : "";
  const dynamicDescription = `Discover ${name}${locationPart} with M360. Explore its history, highlights, location, and everything you need to know before visiting.${
    rawDesc ? ` ${rawDesc.slice(0, 150).trim()}...` : ""
  }`;

  const image = place?.images?.[0] || place?.imgs?.[0] || "/brand/og-image.jpg";

  return buildSEO({
    title: `${name} | Explore Places in Egypt`,
    description: dynamicDescription,
    image,
    url: `/places/${slug}`,
    extraOpenGraph: {
      type: "article",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <PlaceDetailsClient slug={resolvedParams?.slug} />;
}
