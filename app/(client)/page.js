import "@/styles/pages/home.css";
import LandingSwiper from "@/components/home/LandingSwiper";
import WhatIsM360 from "@/components/home/WhatIsM360";
import BadgeQuest from "@/components/home/BadgeQuest";
import Categories from "@/components/home/Categories";
import Governorates from "@/components/home/Governorates";
import Places from "@/components/home/Places";
import Products from "@/components/home/Products";
import Nights from "@/components/home/Nights";
import Events from "@/components/home/Events";
import Games from "@/components/home/Games";
import { buildSEO } from "@/utils/seo";

export const metadata = buildSEO({
  title: "Masr360 - Explore Egypt | Places, Culture, Events & Marketplace",
  description:
    "Masr360 is your ultimate interactive platform to explore Egypt. Discover historic places, vibrant nightlife, authentic marketplace products, upcoming events, and cultural games.",
  url: "/",
  image: "/brand/og-image.jpg",
});

export default function Home() {
  return (
    <>
      <LandingSwiper />
      <WhatIsM360 />
      <BadgeQuest />
      <Games />
      <Categories />
      <Governorates />
      <Places />
      <Products />
      <Nights />
      <Events />
    </>
  );
}
