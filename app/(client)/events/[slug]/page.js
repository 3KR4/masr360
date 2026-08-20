"use client";
import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Navigations from "@/components/Navigations";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import "swiper/css";
import "swiper/css/effect-fade";
import { getOne } from "@/services/events/events.service";
import useTranslate from "@/Contexts/useTranslation";
import CountDown from "@/components/CountDown";

function unwrapEventResponse(data) {
  return data?.event || data?.data?.event || data?.data || data;
}

function formatDateTime(dateStr, locale) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale === "AR" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getDurationLabel(startDate, endDate, lang) {
  if (!startDate || !endDate) return "";
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  if (diff <= 0) return "";
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (totalMinutes < 60) return `${totalMinutes} ${lang === "AR" ? "دقيقة" : "minutes"}`;
  if (totalHours < 24) return `${totalHours} ${lang === "AR" ? "ساعات" : "hours"}`;
  if (totalDays < 30) return `${totalDays} ${lang === "AR" ? "أيام" : "days"}`;
  const months = Math.floor(totalDays / 30);
  return `${months} ${lang === "AR" ? "أشهر" : "months"}`;
}

const STATUS_LABELS = {
  ongoing: { EN: "Ongoing", AR: "جاري" },
  ended: { EN: "Ended", AR: "منتهي" },
  upcoming: { EN: "Upcoming", AR: "قادم" },
};

export default function EventDetails() {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const { slug } = useParams();

  SwiperCore.use([Autoplay, EffectFade, Navigation]);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await getOne(slug);
        const raw = unwrapEventResponse(res.data);
        if (!cancelled) setEvent(raw);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvent();
    return () => { cancelled = true; };
  }, [slug]);

  const localeKey = String(locale || "EN").toUpperCase();
  const eventName =
    event?.translations?.[localeKey]?.name || event?.name || "";
  const eventDesc =
    event?.translations?.[localeKey]?.desc || event?.desc || event?.description || "";
  const eventImages = Array.isArray(event?.imgs)
    ? event.imgs.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
    : [];
  const eventGovName =
    event?.governorate?.translations?.[localeKey]?.name ||
    event?.governorate?.name ||
    "";
  const locationIframe = event?.locationIframe || event?.location?.iFrame || "";
  const statusKey = String(event?.status || "").toLowerCase();
  const statusLabel = STATUS_LABELS[statusKey]?.[localeKey] || STATUS_LABELS[statusKey]?.EN || "";

  return (
    <div className="single-page forPlace container">
      <div className="holder big-holder">
        {/* HERO */}
        <div className="hero-image-holder">
          {eventImages[0] && (
            <Image src={eventImages[0]} alt={eventName} fill />
          )}
          {screenSize !== "small" && (
            <div className="details">
              <h3 className="ellipsis">{eventName}</h3>
            </div>
          )}
        </div>

        {/* NAV */}
        <Navigations
          items={[
            { name: t.sectionsTitles.upcoming_events.title, href: "/events" },
            { name: eventName, href: "" },
          ]}
          container="main"
        />

        {/* EVENT INFO */}
        <div className="holds">
          <div className="details-holder">
            {screenSize === "small" && (
              <div className="details">
                <h3>{eventName}</h3>
              </div>
            )}

            {statusLabel && (
              <div className="event-status-badge" style={{
                display: "inline-block",
                padding: "5px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "12px",
                backgroundColor: statusKey === "ongoing" ? "#e8f5e9" : statusKey === "ended" ? "#fce4ec" : "#e3f2fd",
                color: statusKey === "ongoing" ? "#2e7d32" : statusKey === "ended" ? "#c62828" : "#1565c0",
              }}>
                {statusLabel}
              </div>
            )}

            <p className="description">{eventDesc}</p>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {event?.startDate && (
                <div style={{ fontSize: "15px", fontWeight: 600 }}>
                  <span style={{ color: "var(--main-color)" }}>{t.dashboard?.tables?.startingTime || "Starts"}: </span>
                  {formatDateTime(event.startDate, locale)}
                </div>
              )}
              {event?.endDate && (
                <div style={{ fontSize: "15px", fontWeight: 600 }}>
                  <span style={{ color: "var(--main-color)" }}>{t.dashboard?.tables?.endDate || "Ends"}: </span>
                  {formatDateTime(event.endDate, locale)}
                </div>
              )}
              {event?.startDate && event?.endDate && (
                <div style={{ fontSize: "15px", fontWeight: 600 }}>
                  <span style={{ color: "var(--main-color)" }}>{t.dashboard?.tables?.eventLasts || "Duration"}: </span>
                  {getDurationLabel(event.startDate, event.endDate, locale)}
                </div>
              )}
            </div>

            {event?.startDate && (
              <div style={{ marginTop: "16px" }}>
                <CountDown eventStartAt={event.startDate} />
              </div>
            )}
          </div>
        </div>

        {/* IMAGES */}
        {eventImages.length > 1 && (
          <div className="images-swiper">
            <div className="top">
              <h4>{t.singelPages.place_images}</h4>
              {eventImages.length > 2 && (
                <div className="navigation">
                  <button className="custom-prev">
                    <IoIosArrowBack />
                  </button>
                  <button className="custom-next">
                    <IoIosArrowForward />
                  </button>
                </div>
              )}
            </div>

            <Swiper
              key={locale}
              dir={locale === "AR" ? "rtl" : "ltr"}
              modules={[Autoplay, EffectFade]}
              slidesPerView={2}
              spaceBetween={8}
              loop={true}
              speed={1000}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              className="categories-swiper"
              breakpoints={{
                0: { slidesPerView: 1 },
                630: { slidesPerView: 1.3 },
                768: { slidesPerView: 1.5 },
                992: { slidesPerView: 2 },
              }}
            >
              {eventImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image src={img} alt={`event img - ${index}`} fill />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* LOCATION */}
        <div className="location">
          <div className="top">
            <h4>
              {t.singelPages.locationIn} {eventGovName}
            </h4>
          </div>

          {locationIframe && (
            <div className="i-frame">
              <iframe
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map"
                src={locationIframe}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
