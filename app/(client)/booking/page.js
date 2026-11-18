import BookingClient from "./BookingClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Book Your Experience | M360",
  description:
    "Reserve tickets and experiences for Egypt's top attractions and nightlife.",
  url: "/booking",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function BookingPage() {
  return <BookingClient />;
}
