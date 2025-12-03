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
import { usePathname } from "next/navigation";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import MiniCart from "@/components/MiniCart";
import { navLinks } from "@/data";

function Header() {
  const pathname = usePathname();

  useEffect(() => {
    setActiveNav(null);
  }, [pathname]);

  const { screenSize } = useContext(mainContext);
  const [isLogin, setIsLogin] = useState(true);
  const [activeNav, setActiveNav] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const mobileMenuRef = useRef(null);

  return (
    <header>
      <Link href="/" className="logo">
        <Image src={`/logo.png`} fill alt="Masr 360" />
      </Link>

      <div className="actions-btns">
        {isLogin ? (
          <>
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
    </header>
  );
}

export default Header;
