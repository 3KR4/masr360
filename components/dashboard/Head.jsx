"use client";
import React, { useContext } from "react";
import Link from "next/link";
import Navigations from "@/components/Navigations";
import { dashboard } from "@/Contexts/dashboard";
import { getBreadcrumbItems } from "@/utlies/getBreadcrumbItems";
import useTranslate from "@/Contexts/useTranslation";

function Head() {
  const { pathname, searchParams } = useContext(dashboard);
  const t = useTranslate();
  const navigationitems = getBreadcrumbItems(pathname, searchParams);
  const pageKey = navigationitems[0]?.name?.toLowerCase().replace(/\s+/g, "_");

  function getBaseName(name) {
    if (!name) return "";
    return name.replace(" list", "").trim();
  }

  function canCreate(name) {
    const base = getBaseName(name);
    const allowed = [
      "product",
      "governorate",
      "place",
      "night",
      "event",
      "game",
      "user",
    ];
    return allowed.some((word) => base.includes(word));
  }

  function getCreateLink(currentPathname) {
    return currentPathname.split("?")[0] + "/form";
  }

  return (
    <div className="head">
      <Navigations items={navigationitems} container="no" isDashBoard />

      {!pathname.includes("/form") && canCreate(pageKey) && navigationitems[0] ? (
        <Link href={getCreateLink(pathname)} className="main-button">
          {t.head.create} {getBaseName(navigationitems[0]?.name)}
        </Link>
      ) : null}
    </div>
  );
}

export default Head;
