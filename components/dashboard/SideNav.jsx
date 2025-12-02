"use client";
import "@/styles/components/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { mainContext } from "@/Contexts/mainContext";
import { RiGovernmentFill } from "react-icons/ri";
import {
  FaPlaceOfWorship,
  FaShoppingCart,
  FaHome,
  FaMoon,
} from "react-icons/fa";
import { FaAngleLeft, FaChartPie } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { MdEventNote } from "react-icons/md";
import { HiChartBar } from "react-icons/hi2";
import "@/styles/dashboard/side-nav.css"

function SideNav() {
  const { screenSize } = useContext(mainContext);
  const [isNavOpen, setIsNavOpen] = useState(true);

  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="side-nav">
      <div className="actions-btns">
        <h3>menu</h3>
        {isNavOpen ? (
          <FaAngleLeft
            className="menu-ico-close"
            onClick={() => setIsNavOpen(false)}
          />
        ) : (
          <IoMenu className="menu-ico" onClick={() => setIsNavOpen(true)} />
        )}
      </div>
      <Link href={`/dashboard/`}>
        <h3>OverView</h3>
        <FaHome />
      </Link>
      <Link href={`/dashboard/products`}>
        <h3>products</h3>
        <FaShoppingCart />
      </Link>
      <Link href={`/dashboard/governorates`}>
        <h3>governorates</h3>
        <RiGovernmentFill />
      </Link>
      <Link href={`/dashboard/places`}>
        <h3>places</h3>
        <FaPlaceOfWorship />
      </Link>
      <Link href={`/dashboard/nights`}>
        <h3>nights</h3>
        <FaMoon />
      </Link>
      <Link href={`/dashboard/events`}>
        <h3>events</h3>
        <MdEventNote />
      </Link>
      <Link href={`/dashboard/games`}>
        <h3>games</h3>
        <FaChartPie />
      </Link>
      <Link href={`/dashboard/orders`}>
        <h3>orders</h3>
        <HiChartBar />
      </Link>
    </div>
  );
}

export default SideNav;
