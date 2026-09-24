"use client";
import "@/styles/components/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
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
  const { screenSize, locale, toggleLocale, theme, toggleTheme } =
    useContext(mainContext);
  const t = useTranslate();
  const { user, logout } = useAuth();

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveNav(null);
  }, [pathname]);

  const [activeNav, setActiveNav] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const getNavTitle = (titleObj) => {
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchActive) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [searchActive]);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleSubMenu = (index) => {
    setOpenSubMenuIndex((prev) => (prev === index ? null : index));
  };

  const nav = () => (
    <nav className="desktop-nav">
      <ul>
        {/* Dynamic Dropdown Menus */}
        {navLinks.map((x, index) => (
          <li
            key={index}
            className={`${activeNav === index ? "active" : ""} ${x.departments ? "has-menu" : ""}`}
            onMouseEnter={() => {
              setActiveNav(index || 0);
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
              className="main-button back-light-animation"
            >
              {locale === "AR" ? "عرض الكل" : "See All"}
            </Link>
          </div>
        </div>
      </ul>
    </nav>
  );

  const mobileNavDrawer = () => (
    <>
      <div
        className={`mobile-nav-backdrop ${mobileMenu ? "active" : ""}`}
        onClick={() => setMobileMenu(false)}
      />
      <div
        ref={mobileMenuRef}
        className={`mobile-nav-drawer backdrop-blur ${mobileMenu ? "active" : ""}`}
      >
        <div className="drawer-header">
          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
            className="drawer-logo"
          >
            <Image
              src="/main-logo.png"
              width={100}
              height={35}
              alt={t.header.logo_alt}
            />
          </Link>
        </div>

        <div className="drawer-body">
          <ul className="drawer-nav-list">
            {navLinks.map((item, index) => {
              const hasDepts = item.departments && item.departments.length > 0;
              const isOpen = openSubMenuIndex === index;

              return (
                <li key={index} className="drawer-nav-item">
                  {hasDepts ? (
                    <>
                      <div
                        className={`drawer-item-title ${isOpen ? "active" : ""}`}
                        onClick={() => toggleSubMenu(index)}
                      >
                        <span className="title-text">
                          {getNavTitle(item.title)}
                        </span>
                        <FaAngleDown
                          className={`arrow-icon ${isOpen ? "expanded" : ""}`}
                        />
                      </div>

                      <div
                        className="drawer-submenu-wrapper"
                        style={{
                          maxHeight: isOpen
                            ? `${(item.departments.length + 1) * 65 + 60}px`
                            : "0px",
                        }}
                      >
                        <ul className="drawer-submenu">
                          {item.departments.map((dept, dIdx) => {
                            const Icon = dept.icon ? MdIcons[dept.icon] : null;
                            return (
                              <li key={dIdx} className="submenu-item">
                                <Link
                                  href={dept.link || "/"}
                                  onClick={() => setMobileMenu(false)}
                                  className="submenu-link"
                                >
                                  {Icon && <Icon className="dept-icon" />}
                                  <span>{dept.name[locale]}</span>
                                </Link>

                                {dept.categories && (
                                  <ul className="categories-list">
                                    {dept.categories.map((cat, cIdx) => (
                                      <li key={cIdx}>
                                        <span>{cat[locale]}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}

                          <li className="submenu-item see-all-item">
                            <Link
                              href={item.link || "/"}
                              onClick={() => setMobileMenu(false)}
                              className="main-button drawer-see-all"
                            >
                              {locale === "AR" ? "عرض الكل" : "See All"}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.link || "/"}
                      onClick={() => setMobileMenu(false)}
                      className="drawer-single-link"
                    >
                      {getNavTitle(item.title)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );

  return (
    <header
      onMouseLeave={() => {
        setActiveNav(null);
      }}
      className="backdrop-blur"
    >
      <div className="container">
        <Link href="/" className="logo">
          <Image src="/main-logo.png" fill alt={t.header.logo_alt} />
          {/* <Image src="/M360 Logo.png" fill alt={t.header.logo_alt} /> */}
        </Link>

        {screenSize === "large" && nav()}
        <div className="actions-btns">
          <div className="search-wrapper" ref={searchRef}>
            <button
              type="button"
              className={`btn search ${searchActive ? "active" : ""}`}
              onClick={() => {
                setSearchActive((prev) => {
                  const next = !prev;
                  if (next) {
                    setTimeout(() => {
                      searchInputRef.current?.focus();
                    }, 60);
                  }
                  return next;
                });
              }}
              aria-label={t.header.search}
            >
              {searchActive ? (
                <IoIosClose className="close" title={t.header.close_search} />
              ) : (
                <FaSearch title={t.header.search} />
              )}
            </button>

            <div
              className={`searchMenu menu backdrop-blur ${searchActive ? "active" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="top">
                <FaSearch className="search-icon-inside" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    locale === "AR"
                      ? "ابحث عن أي شيء في مصر 360..."
                      : "Search anything in Masr 360..."
                  }
                  autoFocus={searchActive}
                />
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setSearchQuery("")}
                  title={locale === "AR" ? "مسح" : "Clear"}
                >
                  <IoIosClose onClick={() => setSearchActive(false)} />
                </button>
              </div>

              <div className="search-content">
                {searchQuery.trim().length < 3 ? (
                  <p className="search-info">
                    {locale === "AR"
                      ? "ستظهر نتائج بحثك هنا"
                      : "Your search results will appear here."}
                  </p>
                ) : (
                  <div className="search-results-list">
                    <Link href={""} onClick={() => setSearchActive(false)}>
                      {t.header?.search_results?.private_events ||
                        "الفعاليات الخاصة"}
                    </Link>
                    <Link href={""} onClick={() => setSearchActive(false)}>
                      {t.header?.search_results?.night_tours || "جولات الليل"}
                    </Link>
                    <Link href={""} onClick={() => setSearchActive(false)}>
                      {t.header?.search_results?.dinner_cruises ||
                        "رحلات العشاء النيلية"}
                    </Link>
                    <Link
                      className="main-button see-more-btn"
                      href={""}
                      onClick={() => setSearchActive(false)}
                    >
                      {t.header?.search_results?.see_more ||
                        "عرض المزيد من النتائج"}
                    </Link>
                  </div>
                )}
              </div>
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
                <div className="userMenu menu backdrop-blur">
                  <div className="top">{user?.username}</div>
                  <ul>
                    {user?.role === "admin" && (
                      <li>
                        <Link href={`/dashboard`}>
                          {t.header.open_dashboard}
                        </Link>
                      </li>
                    )}
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
                    <li className="lang not-link" onClick={toggleTheme}>
                      {theme === "light" ? <FaRegMoon /> : <FiSun />}
                      {theme === "light"
                        ? t.header.darkTheme
                        : t.header.lightTheme}
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
                  {locale === "EN" ? "EN" : "AR"}
                </span>
              </button>
              <button className="lang" onClick={toggleTheme}>
                <span className="lang-span">
                  {theme === "light" ? <FaRegMoon /> : <FiSun />}
                  {locale === "EN"
                    ? theme === "light"
                      ? "Dark"
                      : "Light"
                    : theme === "light"
                      ? "داكن"
                      : "فاتح"}
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
      {screenSize !== "large" &&
        mounted &&
        createPortal(mobileNavDrawer(), document.body)}
    </header>
  );
}

export default Header;
