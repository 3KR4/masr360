"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import { getAll, remove } from "@/services/events/events.service";
import { dashboard } from "@/Contexts/dashboard";
import { useNotification } from "@/Contexts/NotificationContext";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";

const DASHBOARD_LIST_IMAGE_PLACEHOLDER = "/images/dashboard-product-placeholder.svg";

const STATUS_LABELS = {
  ongoing: { EN: "Ongoing", AR: "جاري" },
  ended: { EN: "Ended", AR: "منتهي" },
  upcoming: { EN: "Upcoming", AR: "قادم" },
};

function getDurationLabel(startDate, endDate, lang) {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return "";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const isAR = lang === "AR";

  if (totalMinutes < 60) {
    return isAR ? `${totalMinutes} دقيقة` : `${totalMinutes} minutes`;
  }
  if (totalHours < 24) {
    return isAR ? `${totalHours} ساعة` : `${totalHours} hours`;
  }
  if (totalDays < 30) {
    return isAR ? `${totalDays} يوم` : `${totalDays} days`;
  }
  const months = Math.floor(totalDays / 30);
  if (months < 12) {
    return isAR ? `${months} شهر` : `${months} months`;
  }
  const years = Math.floor(months / 12);
  return isAR ? `${years} سنة` : `${years} years`;
}

function formatStartDateTime(dateStr, lang) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(lang === "AR" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function Events() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const { selectedCats, searchText, filtersState } = useContext(dashboard);
  const { addNotification } = useNotification();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [governorates, setGovernorates] = useState([]);
  const [governoratesLoading, setGovernoratesLoading] = useState(true);
  const limit = 6;

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const governorateId =
        selectedCats.gov?._id || selectedCats.gov?.id || selectedCats.gov || "";
      const status = filtersState.status || "";
      const { events: eventsData, totalCount } = await getAll(
        searchText,
        page,
        limit,
        locale,
        undefined,
        governorateId,
        "",
        "",
        status,
      );
      setEvents(eventsData || []);
      setTotalCount(totalCount || 0);
      setPageCount(Math.max(1, Math.ceil((totalCount || 0) / limit)));
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, [limit, locale, page, searchText, selectedCats, filtersState.status]);

  const fetchGovernoratesData = useCallback(async () => {
    try {
      setGovernoratesLoading(true);
      const { governorates: govData } = await getGovernorates("", 1, 10000, locale);
      setGovernorates(govData || []);
    } catch (error) {
      console.error("Error fetching governorates:", error);
      setGovernorates([]);
    } finally {
      setGovernoratesLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    setPage(1);
  }, [locale, searchText, selectedCats.gov, filtersState.status]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchGovernoratesData();
  }, [fetchGovernoratesData]);

  const getGovernorateDisplayName = useCallback(
    (governorateData) => {
      if (governoratesLoading) return t.dashboard?.tables?.loading || "Loading...";

      const govId = governorateData?._id || governorateData?.id || governorateData;
      const govFromList = governorates.find(
        (g) => String(g._id || g.id) === String(govId),
      );
      const localeKey = String(locale || "EN").toUpperCase();

      return (
        governorateData?.translations?.[localeKey]?.name ||
        govFromList?.translations?.[localeKey]?.name ||
        governorateData?.name ||
        govFromList?.name ||
        "Unknown Governorate"
      );
    },
    [governorates, governoratesLoading, locale, t],
  );

  const deleteEvent = async (id) => {
    try {
      await remove(id);
      await fetchEvents();
      addNotification({
        type: "success",
        message: "Event has been deleted successfully",
      });
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const getStatusLabel = (status) => {
    const key = String(status || "").toLowerCase();
    const localeKey = String(locale || "EN").toUpperCase();
    return STATUS_LABELS[key]?.[localeKey] || STATUS_LABELS[key]?.EN || status || "";
  };

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container governorates events">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.eventDetails}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.startingTime}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.eventLasts}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.status || "Status"}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.governorate}
                </div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                {t.dashboard.tables.events}
              </div>
            )}
          </div>

          <div className="table-items">
            {events.map((item) => {
              const itemId = item?._id || item?.id;
              const localeKey = String(locale || "EN").toUpperCase();
              const imageUrl = item?.imgs?.[0]?.url || item?.img?.url || "";
              const itemName =
                item?.translations?.[localeKey]?.name ||
                item?.name ||
                item?.translations?.EN?.name ||
                item?.translations?.AR?.name ||
                "";
              const itemDescription =
                item?.translations?.[localeKey]?.desc ||
                item?.desc ||
                item?.description ||
                item?.translations?.EN?.desc ||
                item?.translations?.AR?.desc ||
                "";

              const statusKey = String(item?.status || "").toLowerCase();

              return (
                <div key={itemId} className="table-item">
                  <div className="holder">
                    <Link href={`/events/${itemId}`} className="item-image">
                      <Image
                        src={imageUrl || DASHBOARD_LIST_IMAGE_PLACEHOLDER}
                        alt={itemName || "Event image"}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/events/${itemId}`} className="item-name">
                        {itemName}
                      </Link>
                      <p className="description">{itemDescription}</p>
                    </div>
                  </div>

                  <div className="item-startAt">
                    <h4>{formatStartDateTime(item?.startDate, locale)}</h4>
                  </div>

                  <div className="event-lasts">
                    <h4>
                      {getDurationLabel(item?.startDate, item?.endDate, locale)}
                    </h4>
                  </div>

                  <div className={`event-status status-badge status-${statusKey}`}>
                    <span>{getStatusLabel(item?.status)}</span>
                  </div>

                  <Link
                    href={`/discover/${item?.governorateId || ""}`}
                    className="link"
                  >
                    <FaLocationDot />
                    {getGovernorateDisplayName(item?.governorate)}
                  </Link>

                  <div className="actions">
                    <Link href={`/events/${itemId}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/events/form?edit=${itemId}`}>
                      <MdEdit className="edit" title={t.dashboard.tables.edit} />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => deleteEvent(itemId)}
                    />
                  </div>
                </div>
              );
            })}

            {!loading && events.length === 0 ? (
              <div className="table-item">
                <div className="holder">
                  <div className="item-details">
                    <p className="description">
                      {t.dashboard?.forms?.noResults || "No events found"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {totalCount > limit && (
          <Pagination
            pageCount={pageCount}
            screenSize={screenSize}
            isDashBoard={true}
            onPageChange={(selectedPage) => {
              setPage(selectedPage.selected + 1);
            }}
          />
        )}
      </div>
    </div>
  );
}
