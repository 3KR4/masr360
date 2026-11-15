import EventsClient from "./EventsClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Upcoming Events & Festivals in Egypt | Masr360",
  description:
    "Find upcoming cultural festivals, exhibitions, concerts, and community events across Egypt on Masr360.",
  url: "/events",
  image: "/brand/og-image.jpg",
});

export default function EventsPage() {
  return <EventsClient />;
}
