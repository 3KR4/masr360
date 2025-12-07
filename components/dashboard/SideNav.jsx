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
import { FaAngleLeft, FaChartPie, FaUser } from "react-icons/fa6";
import { IoMenu, IoLanguage } from "react-icons/io5";
import { MdEventNote, MdLogout, MdSunny } from "react-icons/md";
import { HiChartBar } from "react-icons/hi2";
import "@/styles/dashboard/side-nav.css";
import { usePathname } from "next/navigation";

function SideNav() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const [isNavOpen, setIsNavOpen] = useState(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nav-open");

      if (saved === null) {
        setIsNavOpen(true);
      } else {
        setIsNavOpen(saved === "true");
      }
    } catch (e) {
      console.error("LocalStorage read error", e);
      setIsNavOpen(true);
    }
  }, []);

  // حفظ القيمة بعد التغيير
  useEffect(() => {
    if (isNavOpen !== null) {
      localStorage.setItem("nav-open", isNavOpen ? "true" : "false");
    }
  }, [isNavOpen]);

  // لغاية ما القيمة تتحمل → منرندرش حاجة
  if (isNavOpen === null) return null;
  return (
    <div className={`side-nav ${isNavOpen ? "active" : ""}`}>
      <ul>
        <li
          className="actions-btns"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <h4>menu routes</h4>
          {isNavOpen ? (
            <FaAngleLeft className="menu-ico-close" />
          ) : (
            <IoMenu style={{ fontSize: "21px" }} className="menu-ico" />
          )}
        </li>
        <Link
          href="/dashboard"
          className={isActive("/dashboard") ? "active a" : "a"}
        >
          <div className="hold">
            <h4>OverView</h4>
            <FaHome />
          </div>
        </Link>

        <Link
          href="/dashboard/products"
          className={isActive("/dashboard/products") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>products</h4>
            <FaShoppingCart />
          </div>
        </Link>

        <Link
          href="/dashboard/governorates"
          className={isActive("/dashboard/governorates") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>governorates</h4>
            <RiGovernmentFill />
          </div>
        </Link>

        <Link
          href="/dashboard/places"
          className={isActive("/dashboard/places") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>places</h4>
            <FaPlaceOfWorship />
          </div>
        </Link>

        <Link
          href="/dashboard/nights"
          className={isActive("/dashboard/nights") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>nights</h4>
            <FaMoon />
          </div>
        </Link>

        <Link
          href="/dashboard/events"
          className={isActive("/dashboard/events") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>events</h4>
            <MdEventNote />
          </div>
        </Link>

        <Link
          href="/dashboard/games"
          className={isActive("/dashboard/games") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>games</h4>
            <FaChartPie />
          </div>
        </Link>

        <Link
          href="/dashboard/orders"
          className={isActive("/dashboard/orders") ? "active a" : " a"}
        >
          <div className="hold">
            <h4>orders</h4>
            <HiChartBar />
          </div>
        </Link>
      </ul>
      <ul>
        <div href="/dashboard/orders" className={`a a-user`}>
          <div className="hold">
            <h4>mahmoud elshazly</h4>
            <FaUser />
          </div>
        </div>
        <div href="/dashboard/orders" className={`a`}>
          <div className="hold">
            <h4>dark theme</h4>
            <MdSunny />
          </div>
        </div>
        <div href="/dashboard/orders" className={`a`}>
          <div className="hold">
            <h4>arabic language</h4>
            <IoLanguage />
          </div>
        </div>
        <div href="/dashboard/orders" className={`a danger`}>
          <div className="hold">
            <h4>log out</h4>
            <MdLogout />
          </div>
        </div>
      </ul>
    </div>
  );
}

export default SideNav;
