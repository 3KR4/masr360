"use client";
import React, { useContext, useState, useEffect } from "react";

import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import CountDown from "@/components/CountDown";
import useTranslate from "@/Contexts/useTranslation";
import { eventsAr, eventsEn, governoratesEn, governoratesAr } from "@/data";

export default function Events() {
  const { screenSize, locale } = useContext(mainContext);

  const t = useTranslate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchevents = async () => {
      // try {
      //   const { data } = await getService.getEvents(6);
      //   setEvents(
      //     data || locale == "en" ? eventsEn : eventsAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setEvents(locale == "en" ? eventsEn : eventsAr);
      // }
      setEvents(locale == "en" ? eventsEn : eventsAr);
    };
    fetchevents();
  }, [locale]);

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
                  {t.dashboard.tables.categories}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.eventLasts}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.startingTime}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.viewsCount}
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
            {events.slice(0, 7).map((item) => {
              const placeGov =
                locale == "en"
                  ? governoratesEn?.find((x) => x.id == item?.governorate?.id)
                  : governoratesAr?.find((x) => x.id == item?.governorate?.id);
              return (
                <div key={item?.id} className="table-item">
                  <div className="holder">
                    <Link href={`/events/${item?.id}`} className="item-image">
                      <Image
                        src={item?.images[0]}
                        alt={item?.name}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/events/${item?.id}`} className="item-name">
                        {item?.name}
                      </Link>
                      <p className="description">{item?.description}</p>
                    </div>
                  </div>
                  <div className="categories">
                    <h4>{t.dashboard.tables.ancientEgypt}</h4>/
                    <h4>{t.dashboard.tables.deserts}</h4>
                  </div>
                  <div className="event-lasts">
                    <h4>{item?.eventLasts}</h4>
                  </div>
                  <div className="item-startAt">
                    <h4>
                      <CountDown
                        eventStartAt={item?.eventStartAt}
                        text={false}
                        startLabel={t.dashboard.tables.startsIn}
                      />
                    </h4>
                  </div>

                  <div className="item-overview">
                    <h4>
                      15000 <FaEye />
                    </h4>
                  </div>

                  <Link href={`/discover/${placeGov?.id}`} className="link">
                    <FaLocationDot />
                    {placeGov?.name}
                  </Link>

                  <div className="actions">
                    <Link href={`/events/${item?.id}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/events/form?edit=${item?.id}`}>
                      <MdEdit
                        className="edit"
                        title={t.dashboard.tables.edit}
                      />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => console.log("Delete event", item?.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Pagination
          pageCount={50}
          screenSize={screenSize}
          onPageChange={() => {}}
          isDashBoard={true}
          nextText={t.dashboard.tables.next}
          prevText={t.dashboard.tables.prev}
          firstText={t.dashboard.tables.first}
          lastText={t.dashboard.tables.last}
        />
      </div>
    </div>
  );
}
