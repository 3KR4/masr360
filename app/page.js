import Image from "next/image";
import "@/styles/pages/home.css";
import LandingSwiper from "@/components/home/LandingSwiper";
import Catigories from "@/components/home/Catigories";
import Governments from "@/components/home/Governments";
import Places from "@/components/home/Places";
import Products from "@/components/home/Products";

export default function Home() {
  return (
    <>
      <LandingSwiper />
      <Catigories />
      <Governments />
      <Places />
      <Products />
    </>
  );
}
