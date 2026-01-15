"use client";
import Link from "next/link";
import React from "react";

import useTranslate from "@/Contexts/useTranslation";
export default function Navigations({
  items = [],
  container = "fluid",
  isDashBoard = false,
}) {
  const t = useTranslate();

  return (
    <nav
      className={`navigations ${
        container == "no"
          ? ""
          : container == "main"
          ? "container"
          : "fluid-container"
      }`}
    >
      {!isDashBoard ? (
        <Link href={"/"}>{t.header.home}</Link>
      ) : (
        <>
          <Link href={"/"}>{t.header.logo_alt}</Link>
          <span className={`separator`}>/ </span>
          <Link href={"/dashboard"}>{t.header.dashboard}</Link>
        </>
      )}

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span
            className={`separator ${index === items.length - 1 ? "last" : ""}`}
          >
            /{" "}
          </span>

          {index === items.length - 1 ? (
            <span className="active">{item.name}</span>
          ) : (
            <Link href={item.href}>{item.name}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
