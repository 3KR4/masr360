import EventDetailsClient from "./EventDetailsClient";
import { getCachedEvent, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const event = await getCachedEvent(slug);

  if (!event) {
    return buildSEO({
      title: "Upcoming Events & Festivals in Egypt",
      description:
        "Find upcoming cultural festivals, exhibitions, concerts, and community events across Egypt on Masr360.",
      url: `/events/${slug || ""}`,
    });
  }

  const eventName =
    event?.translations?.EN?.name || event?.name || "Cultural Event in Egypt";
  const eventGov =
    event?.governorate?.translations?.EN?.name ||
    event?.governorate?.name ||
    "";
  const eventDesc =
    event?.translations?.EN?.desc || event?.desc || event?.description || "";

  const locationPart = eventGov ? ` in ${eventGov}` : "";
  const dynamicDescription = `Discover ${eventName} and explore its schedule, location, highlights, and participation details with Masr360.${locationPart}${
    eventDesc ? ` ${eventDesc.slice(0, 140).trim()}...` : ""
  }`;

  const image =
    (Array.isArray(event?.imgs) && (typeof event.imgs[0] === "string" ? event.imgs[0] : event.imgs[0]?.url)) ||
    event?.image ||
    "/brand/og-image.jpg";

  return buildSEO({
    title: `${eventName} | Masr360 Events`,
    description: dynamicDescription,
    image,
    url: `/events/${slug}`,
    extraOpenGraph: {
      type: "article",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <EventDetailsClient slug={resolvedParams?.slug} />;
}
