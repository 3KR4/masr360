import Image from "next/image";
import "@/styles/pages/home.css";
import LandingSwiper from "@/components/home/LandingSwiper";
import Categories from "@/components/home/Categories";
import Governorates from "@/components/home/Governorates";
import Places from "@/components/home/Places";
import Products from "@/components/home/Products";
import Nights from "@/components/home/Nights";
import Events from "@/components/home/Events";

export default function Home() {
  return (
    <>
      <LandingSwiper />
      <Categories />
      <Governorates />
      <Places />
      <Products />
      <Nights />
      <Events />
    </>
  );
}
