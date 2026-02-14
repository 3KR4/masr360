"use client";
import "@/styles/components/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import * as MdIcons from "react-icons/md";
import { mainContext } from "@/Contexts/mainContext";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaSearch, FaRegMoon } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { FiSun } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { usePathname } from "next/navigation";
import {
  FaCartShopping,
  FaUser,
  FaAngleRight,
  FaAngleDown,
} from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";

import MiniCart from "@/components/MiniCart";
import { navLinks } from "@/data";
import useTranslate from "@/Contexts/useTranslation";
import { useAuth } from "@/Contexts/AuthContext";

function Header() {
  const { screenSize, locale, toggleLocale } = useContext(mainContext);
  const t = useTranslate();
  const { user, logout } = useAuth();

  const pathname = usePathname();

  useEffect(() => {
    setActiveNav(null);
  }, [pathname]);

  const [activeNav, setActiveNav] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const mobileMenuRef = useRef(null);

  const shortTitlesEn = {
    Governorates: "Govs",
    "Masr Nights": "Nights",
    Marketplace: "Market",
    "About Us": "About",
  };
  const getNavTitle = (titleObj) => {
    if (screenSize === "large") return titleObj[locale];

    // اختصارات EN فقط
    if (locale === "en") {
      return shortTitlesEn[titleObj.en] || titleObj.en;
    }

    // العربي يفضل يفضل كامل
    return titleObj[locale];
  };

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
  const nav = () => (
    <nav className={mobileMenu ? "active" : ""}>
      <ul>
        {/* Dynamic Dropdown Menus */}
        {navLinks.map((x, index) => (
          <li
            key={index}
            className={`${activeNav === index ? "active" : ""} ${x.departments ? "has-menu": ""}`}
            onMouseEnter={() => {
              setActiveNav(index || 0);
              console.log(index);
            }}
            onClick={() => {
              screenSize !== "large" && setActiveNav(index || 0);
            }}
          >
            {x.departments ? (
              <>
                {getNavTitle(x.title)}
                <FaAngleDown />
              </>
            ) : (
              <Link className="page-route" href={x.link}>
                {getNavTitle(x.title)}
              </Link>
            )}
          </li>
        ))}

        {/* Routes Menu */}
        <div className="routs-menu">
          <div className="container">
            {navLinks[activeNav]?.departments?.map((dept, index) => {
              const Icon = dept.icon ? MdIcons[dept.icon] : null;
              return (
                <div key={index}>
                  <h4>
                    {Icon && <Icon />}
                    <Link href={dept.link}>{dept.name[locale]}</Link>
                    <FaAngleRight className="arrow-right side-arrow" />
                  </h4>

                  {dept.categories && (
                    <ul>
                      {dept.categories.map((cat, idx) => (
                        <li key={idx}>{cat[locale]}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <Link
              href={navLinks[activeNav]?.link || "/"}
              className="main-button"
            >
              {locale === "ar" ? "عرض الكل" : "See All"}
            </Link>
          </div>
        </div>
      </ul>
    </nav>
  );

  return (
    <header
      onMouseLeave={() => {
        setActiveNav(null);
      }}
    >
      <div className="container">
        <Link href="/" className="logo">
          <Image src={`/logo.png`} fill alt={t.header.logo_alt} />
        </Link>

        {screenSize === "large" && nav()}
        <div className="actions-btns">
          <div className="search-holder">
            <div className={`input ${searchActive ? "active" : ""}`}>
              <input type="text" placeholder={t.header.search_placeholder} />
              {searchActive ? (
                <IoIosClose
                  className="close"
                  title={t.header.close_search}
                  onClick={() => setSearchActive(false)}
                />
              ) : (
                <FaSearch
                  title={t.header.search}
                  onClick={() => setSearchActive(true)}
                />
              )}
            </div>
            <div className="results">
              <Link href={""}>{t.header.search_results.private_events}</Link>
              <Link href={""}>{t.header.search_results.night_tours}</Link>
              <Link href={""}>{t.header.search_results.dinner_cruises}</Link>
              <Link href={""}>{t.header.search_results.private_events}</Link>
              <Link href={""}>{t.header.search_results.night_tours}</Link>
              <Link className="main-button" href={""}>
                {t.header.search_results.see_more}
              </Link>
            </div>
          </div>
          {user ? (
            <>
              <button className="btn cart">
                <FaCartShopping title={t.header.cart} />
                <MiniCart />
              </button>
              <button className="btn user">
                <FaUser title={t.header.user_menu} />
                <div className="userMenu menu">
                  <div className="top">{user?.username}</div>
                  <ul>
                    <li>
                      <Link href={`/booking`}>{t.header.my_bookings}</Link>
                    </li>
                    <li>
                      <Link href={`/orders`}>{t.header.my_orders}</Link>
                    </li>
                    <li>
                      <Link href={`/favorites`}>{t.header.favorites}</Link>
                    </li>
                    <li>
                      <Link href={`/support`}>{t.header.support}</Link>
                    </li>

                    <li className="lang not-link" onClick={toggleLocale}>
                      <GrLanguage />
                      {t.header.change_language}
                    </li>
                    <li className="not-link danger" onClick={logout}>
                      <MdLogout />
                      {t.header.logout}
                    </li>
                  </ul>
                </div>
              </button>
            </>
          ) : (
            <>
              <button className="lang" onClick={toggleLocale}>
                <span className="lang-span">
                  <GrLanguage />
                  {locale === "en" ? t.header.english : t.header.arabic}
                </span>
              </button>
              <Link
                href={`/register?redirect=${pathname}`}
                className="main-button"
              >
                {t.header.sign_up}
              </Link>
            </>
          )}
          {screenSize !== "large" && (
            <div className="menuHandler">
              {!mobileMenu ? (
                <IoMenu
                  className="menu-ico"
                  onClick={() => setMobileMenu(true)}
                />
              ) : (
                <IoClose
                  className="menu-ico-close"
                  onClick={() => setMobileMenu(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {screenSize !== "large" && nav()}
    </header>
  );
}

export default Header;
