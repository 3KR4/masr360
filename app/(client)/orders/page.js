import OrdersClient from "./OrdersClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Your Orders | Masr360",
  description: "Track and view your recent orders and purchases on Masr360.",
  url: "/orders",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function OrdersPage() {
  return <OrdersClient />;
}
