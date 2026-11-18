import GovernorateDetailsClient from "./GovernorateDetailsClient";
import { getCachedGovernorate, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const gov = await getCachedGovernorate(slug);

  if (!gov) {
    return buildSEO({
      title: "Discover Egypt's Governorates & Regions",
      description:
        "Explore Egypt governorate by governorate. Learn about Cairo, Alexandria, Luxor, Aswan, and beyond with comprehensive guides on M360.",
      url: `/discover/${slug || ""}`,
    });
  }

  const govName =
    gov?.translations?.EN?.name || gov?.name || "Governorate in Egypt";
  const govDesc =
    gov?.translations?.EN?.desc || gov?.description || gov?.desc || "";

  const dynamicDescription = `Explore ${govName} with M360. Discover its top attractions, cultural landmarks, travel tips, and authentic experiences.${
    govDesc ? ` ${govDesc.slice(0, 140).trim()}...` : ""
  }`;

  const image = gov?.image || "/brand/og-image.jpg";

  return buildSEO({
    title: `Discover ${govName} | M360`,
    description: dynamicDescription,
    image,
    url: `/discover/${slug}`,
    extraOpenGraph: {
      type: "article",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <GovernorateDetailsClient slug={resolvedParams?.slug} />;
}
