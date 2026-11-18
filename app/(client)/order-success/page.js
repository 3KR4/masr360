import OrderSuccessClient from "./OrderSuccessClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Order Confirmation | M360",
  description:
    "Thank you for your order. Your purchase has been received and is being processed.",
  url: "/order-success",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
