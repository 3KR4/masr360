import NightDetailsClient from "./NightDetailsClient";
import { getCachedNight, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const night = await getCachedNight(slug);

  if (!night) {
    return buildSEO({
      title: "Nightlife & Evening Entertainment in Egypt",
      description:
        "Experience the best of Egyptian nightlife, live music, river cruises, and evening entertainment with M360.",
      url: `/nights/${slug || ""}`,
    });
  }

  const nightName =
    night?.translations?.EN?.name ||
    night?.name ||
    "Egyptian Nightlife Experience";
  const nightGov =
    night?.governorate?.translations?.EN?.name ||
    night?.governorate?.name ||
    "";
  const nightDesc =
    night?.translations?.EN?.desc || night?.desc || night?.description || "";

  const locationPart = nightGov ? ` in ${nightGov}` : "";
  const dynamicDescription = `Discover ${nightName} and explore Egypt's vibrant nightlife, music, and evening entertainment with M360.${locationPart}${
    nightDesc ? ` ${nightDesc.slice(0, 140).trim()}...` : ""
  }`;

  const image =
    (Array.isArray(night?.imgs) &&
      (typeof night.imgs[0] === "string"
        ? night.imgs[0]
        : night.imgs[0]?.url)) ||
    night?.image ||
    "/brand/og-image.jpg";

  return buildSEO({
    title: `${nightName} | M360 Nights`,
    description: dynamicDescription,
    image,
    url: `/nights/${slug}`,
    extraOpenGraph: {
      type: "article",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <NightDetailsClient slug={resolvedParams?.slug} />;
}
