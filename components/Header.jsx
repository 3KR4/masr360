"use client";
import "@/styles/components/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import * as MdIcons from "react-icons/md";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { mainContext } from "@/Contexts/mainContext";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdLogout } from "react-icons/md";

import { FaCartShopping, FaUser } from "react-icons/fa6";
import MiniCart from "@/components/MiniCart";
const navLinks = [
  {
    title: "Discover",
    departments: [
      {
        name: "Cairo",
        link: "/",
      },
      {
        name: "Alexandria",
        link: "/",
      },
      {
        name: "Giza",
        link: "/",
      },
      {
        name: "Luxor",
        link: "/",
      },
      {
        name: "Aswan",
        link: "/",
      },
    ],
  },
  {
    title: "Masr 360 Nights",
    departments: [
      {
        name: "Nile Parties",
        icon: "MdOutlineCelebration",
        link: "/",
      },
      {
        name: "Safari Nights",
        icon: "MdOutlineNightlife",
        link: "/",
      },
      {
        name: "Restaurants & Cafes",
        icon: "MdRestaurant",
        link: "/",
      },
      {
        name: "Cultural Events",
        icon: "MdLocalActivity",
        link: "/",
      },
    ],
  },
  {
    title: "Marketplace",
    departments: [
      { name: "Souvenirs", icon: "MdShoppingBag", link: "/" },
      { name: "Local Crafts", icon: "MdHandyman", link: "/" },
      { name: "Art & Decor", icon: "MdBrush", link: "/" },
      { name: "Traditional Clothes", icon: "MdCheckroom", link: "/" },
    ],
  },
  {
    title: "games",
    link: "/games",
  },
  {
    title: "About Us",
    link: "/about",
  },
];

function Header() {
  const { screenSize } = useContext(mainContext);
  const [isLogin, setIsLogin] = useState(true);
  const [activeNav, setActiveNav] = useState(0);
  const [activeBtn, setActiveBtn] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
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

  const nav = () => (
    <nav className={mobileMenu ? "active" : ""}>
      <ul>
        {/* Dynamic Dropdown Menus */}
        {navLinks.map((x, index) => (
          <li
            key={index}
            className={activeBtn === index ? `active` : ``}
            onMouseEnter={() => {
              setActiveNav(index);
              setActiveBtn(null);
            }}
            onClick={() => {
              setActiveNav(index);
              setActiveBtn(null);
            }}
          >
            {x.departments ? (
              <>
                {x.title} <FaAngleDown />
              </>
            ) : (
              <Link className="page-route" href={x.link}>
                {x.title}
              </Link>
            )}
          </li>
        ))}

        {/* Routes Menu */}
        {navLinks[activeNav]?.departments && (
          <div
            className={`routs-menu`}
            onMouseEnter={() => setActiveBtn(activeNav)}
          >
            <div className={`container`}>
              {navLinks[activeNav]?.departments?.map((dept, index) => {
                const Icon = dept.icon ? MdIcons[dept.icon] : null;
                return (
                  <div key={index}>
                    <h4>
                      {Icon && <Icon />} {/* render only if icon exists */}
                      <Link href={`/${dept.link}`}>{dept.name}</Link>
                      <FaAngleRight className="arrow-right" />
                    </h4>
                    <ul>
                      {dept.categories?.map((cat, idx) => (
                        <Link href={`/`} key={idx}>
                          {cat}
                        </Link>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <Link href={""} className="main-button">
                See All
              </Link>
            </div>
          </div>
        )}
      </ul>
    </nav>
  );

  return (
    <header>
      <div className="container">
        <Link href="/" className="logo">
          <Image src={`/logo.png`} fill alt="Masr 360" />
        </Link>

        {screenSize === "large" && nav()}
        <div className="actions-btns">
          <div className="search-holder">
            <div className={`input ${searchActive ? "active" : ""}`}>
              <input type="text" placeholder="Explore Egypt" />
              {searchActive ? (
                <IoIosClose
                  className="close"
                  title="close"
                  onClick={() => setSearchActive(false)}
                />
              ) : (
                <FaSearch
                  title="Search"
                  onClick={() => setSearchActive(true)}
                />
              )}
            </div>
            <div className="results">
              <Link href={""}>Private Events</Link>
              <Link href={""}>Night Tours</Link>
              <Link href={""}>Dinner Cruises</Link>
              <Link href={""}>Private Events</Link>
              <Link href={""}>Night Tours</Link>
              <Link className="main-button" href={""}>
                See More results
              </Link>
            </div>
          </div>
          {isLogin ? (
            <>
              <button className="btn cart">
                <FaCartShopping title="Cart" />
                <MiniCart />
              </button>
              <button className="btn user">
                <FaUser title="Login / Register" />
                <div className="userMenu menu">
                  <div className="top">Mahmoud Elshzly</div>
                  <ul>
                    <li>
                      <Link href={`/booking`}>Bookings</Link>
                    </li>
                    <li>
                      <Link href={`/orders`}>Orders</Link>
                    </li>
                    <li>
                      <Link href={`/favorites`}>favorites</Link>
                    </li>
                    <li>
                      <Link href={`/Messages`}>Messages</Link>
                    </li>
                    <li className="danger" onClick={() => setIsLogin(false)}>
                      <MdLogout />
                      log out
                    </li>
                  </ul>
                </div>
              </button>
            </>
          ) : (
            <Link href={"/register"} className="main-button">
              Create Account
            </Link>
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
