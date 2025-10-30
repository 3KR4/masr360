"use client";
import "@/styles/components/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import * as MdIcons from "react-icons/md";
import {
  FaAngleRight,
  FaArrowUpLong,
  FaAngleDown,
  FaArrowRight,
} from "react-icons/fa6";
import { mainContext } from "@/Contexts/mainContext";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdLogout } from "react-icons/md";

import { FaCartShopping, FaUser } from "react-icons/fa6";

// ✅ Updated Navigation Links for Masr 360
const navLinks = [
  {
    title: "governments",
    departments: [
      {
        name: "Cairo",
        categories: [
          "Pyramids",
          "Citadel",
          "Khan El Khalili",
          "Egyptian Museum",
        ],
      },
      {
        name: "Alexandria",
        categories: [
          "Qaitbay Citadel",
          "Library of Alexandria",
          "Corniche",
          "Stanley Bridge",
        ],
      },
      {
        name: "Giza",
        categories: [
          "Pyramids",
          "Sphinx",
          "Sound & Light Show",
          "Grand Museum",
        ],
      },
      {
        name: "Luxor",
        categories: [
          "Karnak",
          "Luxor Temple",
          "Valley of Kings",
          "Hatshepsut Temple",
        ],
      },
      {
        name: "Aswan",
        categories: [
          "Philae Temple",
          "Nubian Village",
          "Unfinished Obelisk",
          "High Dam",
        ],
      },
    ],
  },
  {
    title: "Masr 360 Nights",
    departments: [
      {
        name: "Nile Parties",
        icon: "MdOutlineCelebration",
        categories: [
          "Dinner Cruises",
          "Night Tours",
          "Private Events",
          "Live Music",
        ],
      },
      {
        name: "Safari Nights",
        icon: "MdOutlineNightlife",
        categories: [
          "Desert Camps",
          "ATV Adventures",
          "Bedouin Nights",
          "Camel Rides",
        ],
      },
      {
        name: "Restaurants & Cafes",
        icon: "MdRestaurant",
        categories: [
          "Top Restaurants",
          "Rooftop Cafes",
          "Street Food",
          "View Spots",
        ],
      },
      {
        name: "Cultural Events",
        icon: "MdLocalActivity",
        categories: [
          "Theatre Shows",
          "Museums Events",
          "Workshops",
          "Festivals",
        ],
      },
    ],
  },
  {
    title: "Marketplace",
    departments: [
      { name: "Souvenirs", icon: "MdShoppingBag", categories: [] },
      { name: "Local Crafts", icon: "MdHandyman", categories: [] },
      { name: "Art & Decor", icon: "MdBrush", categories: [] },
      { name: "Traditional Clothes", icon: "MdCheckroom", categories: [] },
    ],
  },
  {
    title: "About Us",
    departments: [
      { name: "Our Story", icon: "MdInfoOutline", categories: [] },
      { name: "Team", icon: "MdGroups", categories: [] },
      { name: "Support", icon: "MdEmail", categories: [] },
    ],
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

  return (
    <header>
      <div className="container">
        {/* Logo */}
        <Link href="/" className="logo">
          <Image src={`/logo.png`} fill alt="Masr 360" />
        </Link>

        {/* Mobile Menu Icon */}
        {screenSize !== "large" && (
          <IoMenu className="menu-ico" onClick={() => setMobileMenu(true)} />
        )}

        <nav>
          {/* Top Section for Mobile */}
          {screenSize !== "large" && (
            <div className="top">
              <Link href="/" className="logo">
                <Image src={`/logo.png`} fill alt="Masr 360" />
              </Link>
              <IoClose
                className="menu-ico-close"
                onClick={() => setMobileMenu(false)}
              />
            </div>
          )}

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
                {x.title} <FaAngleDown />
              </li>
            ))}

            {/* Routes Menu */}
            <div
              className={`routs-menu`}
              onMouseEnter={() => setActiveBtn(activeNav)}
            >
              <div className={`container ${activeNav > 1 ? "wrap" : ""}`}>
                {navLinks[activeNav]?.departments?.map((dept, index) => {
                  const Icon = dept.icon ? MdIcons[dept.icon] : null;
                  return (
                    <div key={index}>
                      <h4>
                        {Icon && <Icon />} {/* render only if icon exists */}
                        <Link href={`/`}>{dept.name}</Link>
                        {activeNav > 2 && (
                          <FaAngleRight className="arrow-right" />
                        )}
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
                {activeNav < 1 && (
                  <Link href={""} className="main-button">
                    See More
                  </Link>
                )}
              </div>
            </div>
          </ul>
        </nav>

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
              </button>
              <button className="btn user">
                <FaUser title="Login / Register" />
                <div className="userMenu">
                  <div className="top">Mahmoud Elshzly</div>
                  <ul>
                    <li>
                      <Link href={``}>Your Visits</Link>
                    </li>
                    <li>
                      <Link href={``}>Your Orders</Link>
                    </li>
                    <li>
                      <Link href={``}>Messages</Link>
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
        </div>
      </div>
    </header>
  );
}

export default Header;
