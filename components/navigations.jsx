"use client";
import Link from "next/link";
import React from "react";

export default function Navigations({
  items = [],
  container = "fluid",
  isDashBoard = false,
}) {
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
        <Link href={"/"}>home</Link>
      ) : (
        <>
          <Link href={"/"}>masr360</Link>
          <span className={`separator`}>/ </span>
          <Link href={"/dashboard"}>dashboard</Link>
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
