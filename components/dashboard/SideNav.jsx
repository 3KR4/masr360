"use client";
import "@/styles/components/header.css";
import "@/styles/dashboard/side-nav.css";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// icons …
import {
  FaHome,
  FaPlaceOfWorship,
  FaShoppingCart,
  FaUsers,
  FaMoon,
} from "react-icons/fa";
import { FaAngleLeft, FaChartPie, FaUser } from "react-icons/fa6";
import { RiGovernmentFill } from "react-icons/ri";
import { PiCardsFill } from "react-icons/pi";
import { FaHeadset } from "react-icons/fa6";
import { MdEventNote, MdLogout, MdSunny } from "react-icons/md";
import { IoMenu, IoLanguage } from "react-icons/io5";
import { HiChartBar } from "react-icons/hi2";

function SideNav() {
  const pathname = usePathname();

  // --- Active Logic ---
  const isActive = (paths) => {
    if (!Array.isArray(paths)) {
      paths = [paths];
    }

    return paths.includes(pathname); // أو pathname من usePathname()
  };

  // --- Nav open/close with localStorage ---
  const [isNavOpen, setIsNavOpen] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("nav-open");
    setIsNavOpen(saved === null ? true : saved === "true");
  }, []);

  useEffect(() => {
    if (isNavOpen !== null) {
      localStorage.setItem("nav-open", isNavOpen ? "true" : "false");
    }
  }, [isNavOpen]);

  if (isNavOpen === null) return null;

  return (
    <div className={`side-nav ${isNavOpen ? "active" : ""}`}>
      <ul>
        <li className="actions-btns" onClick={() => setIsNavOpen((p) => !p)}>
          <h4>menu routes</h4>
          {isNavOpen ? (
            <FaAngleLeft className="menu-ico-close" />
          ) : (
            <IoMenu style={{ fontSize: "21px" }} className="menu-ico" />
          )}
        </li>

        <Link
          className={isActive(["/dashboard"]) ? "active a" : "a"}
          href="/dashboard"
        >
          <div className="hold">
            <h4>OverView</h4>
            <FaHome />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/slieds"]) ? "active a" : "a"}
          href="/dashboard/slieds"
        >
          <div className="hold">
            <h4>slieds</h4>
            <PiCardsFill />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/users"]) ? "active a" : "a"}
          href="/dashboard/users"
        >
          <div className="hold">
            <h4>users</h4>
            <FaUsers />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/governorates"]) ? "active a" : "a"}
          href="/dashboard/governorates"
        >
          <div className="hold">
            <h4>governorates</h4>
            <RiGovernmentFill />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/places"]) ? "active a" : "a"}
          href="/dashboard/places"
        >
          <div className="hold">
            <h4>places</h4>
            <FaPlaceOfWorship />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/nights"]) ? "active a" : "a"}
          href="/dashboard/nights"
        >
          <div className="hold">
            <h4>nights</h4>
            <FaMoon />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/events"]) ? "active a" : "a"}
          href="/dashboard/events"
        >
          <div className="hold">
            <h4>events</h4>
            <MdEventNote />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/games"]) ? "active a" : "a"}
          href="/dashboard/games"
        >
          <div className="hold">
            <h4>games</h4>
            <FaChartPie />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/orders"]) ? "active a" : "a"}
          href="/dashboard/orders"
        >
          <div className="hold">
            <h4>orders</h4>
            <HiChartBar />
          </div>
        </Link>

        {/* -------- PRODUCTS with form detection -------- */}
        <Link
          href="/dashboard/products"
          className={
            isActive(["/dashboard/products", "/dashboard/products/form"])
              ? "active a"
              : "a"
          }
        >
          <div className="hold">
            <h4>products</h4>
            <FaShoppingCart />
          </div>
        </Link>

        <Link
          className={isActive(["/dashboard/support"]) ? "active a" : "a"}
          href="/dashboard/support"
        >
          <div className="hold">
            <h4>support</h4>
            <FaHeadset />
          </div>
        </Link>
      </ul>

      {/* bottom section */}
      <ul>
        <div className="a a-user">
          <div className="hold">
            <h4>mahmoud elshazly</h4>
            <FaUser />
          </div>
        </div>

        <div className="a">
          <div className="hold">
            <h4>dark theme</h4>
            <MdSunny />
          </div>
        </div>

        <div className="a">
          <div className="hold">
            <h4>arabic language</h4>
            <IoLanguage />
          </div>
        </div>

        <div className="a danger">
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
