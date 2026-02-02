"use client";
import "@/styles/components/header.css";
import "@/styles/dashboard/side-nav.css";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons
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
import { FaHeadset } from "react-icons/fa";
import { MdEventNote, MdLogout, MdSunny } from "react-icons/md";
import { IoMenu, IoLanguage } from "react-icons/io5";
import { HiChartBar } from "react-icons/hi2";

import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";

function SideNav() {
  const pathname = usePathname();
  const { toggleLocale } = useContext(mainContext);
  const t = useTranslate();

  // ---------- Active link ----------
  const isActive = (paths) => {
    if (!Array.isArray(paths)) paths = [paths];
    return paths.includes(pathname);
  };

  // ---------- Open / Close nav ----------
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
      {/* ---------- TOP NAV ---------- */}
      <ul>
        <li className="actions-btns" onClick={() => setIsNavOpen((p) => !p)}>
          <h4>{t.sideNav.menuRoutes}</h4>
          {isNavOpen ? (
            <FaAngleLeft className="menu-ico-close" />
          ) : (
            <IoMenu className="menu-ico" />
          )}
        </li>

        <NavLink
          href="/dashboard"
          active={isActive("/dashboard")}
          icon={<FaHome />}
          text={t.sideNav.overview}
        />

        <NavLink
          href="/dashboard/slieds"
          active={isActive("/dashboard/slieds")}
          icon={<PiCardsFill />}
          text={t.sideNav.slides}
        />

        <NavLink
          href="/dashboard/users"
          active={isActive("/dashboard/users")}
          icon={<FaUsers />}
          text={t.sideNav.users}
        />

        <NavLink
          href="/dashboard/governorates"
          active={isActive("/dashboard/governorates")}
          icon={<RiGovernmentFill />}
          text={t.sideNav.governorates}
        />

        <NavLink
          href="/dashboard/places"
          active={isActive("/dashboard/places")}
          icon={<FaPlaceOfWorship />}
          text={t.sideNav.places}
        />

        <NavLink
          href="/dashboard/nights"
          active={isActive("/dashboard/nights")}
          icon={<FaMoon />}
          text={t.sideNav.nights}
        />

        <NavLink
          href="/dashboard/events"
          active={isActive("/dashboard/events")}
          icon={<MdEventNote />}
          text={t.sideNav.events}
        />

        <NavLink
          href="/dashboard/games"
          active={isActive("/dashboard/games")}
          icon={<FaChartPie />}
          text={t.sideNav.games}
        />

        <NavLink
          href="/dashboard/orders"
          active={isActive("/dashboard/orders")}
          icon={<HiChartBar />}
          text={t.sideNav.orders}
        />

        <NavLink
          href="/dashboard/products"
          active={isActive(["/dashboard/products", "/dashboard/products/form"])}
          icon={<FaShoppingCart />}
          text={t.sideNav.products}
        />

        <NavLink
          href="/dashboard/support"
          active={isActive("/dashboard/support")}
          icon={<FaHeadset />}
          text={t.sideNav.support}
        />
      </ul>

      {/* ---------- BOTTOM ---------- */}
      <ul>
        <li className="a a-user">
          <div className="hold">
            <h4 className="ellipsis">Mahmoud el-shazly</h4>
            <FaUser />
          </div>
        </li>

        <li className="a">
          <div className="hold">
            <h4>{t.sideNav.darkTheme}</h4>
            <MdSunny />
          </div>
        </li>

        <li className="a" onClick={toggleLocale}>
          <div className="hold">
            <h4>{t.sideNav.language}</h4>
            <IoLanguage />
          </div>
        </li>

        <li className="a danger">
          <div className="hold">
            <h4>{t.sideNav.logout}</h4>
            <MdLogout />
          </div>
        </li>
      </ul>
    </div>
  );
}

/* ---------- Reusable Nav Link ---------- */
function NavLink({ href, active, icon, text }) {
  return (
    <Link href={href} className={active ? "active a" : "a"}>
      <div className="hold">
        <h4>{text}</h4>
        {icon}
      </div>
    </Link>
  );
}

export default SideNav;
