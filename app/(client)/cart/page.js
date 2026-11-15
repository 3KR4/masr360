import CartClient from "./CartClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Your Shopping Cart | Masr360",
  description:
    "Review the authentic Egyptian products and crafts in your shopping cart.",
  url: "/cart",
  image: "/brand/og-image.jpg",
  noindex: true,
});

export default function CartPage() {
  return <CartClient />;
}
