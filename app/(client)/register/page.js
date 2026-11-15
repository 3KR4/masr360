import RegisterClient from "./RegisterClient";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Join Masr360 | Sign Up & Start Exploring",
  description:
    "Create your account on Masr360 to save favorite places, book experiences, and order authentic Egyptian crafts.",
  url: "/register",
  image: "/brand/og-image.jpg",
});

export default function RegisterPage() {
  return <RegisterClient />;
}
