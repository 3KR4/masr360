"use client";
import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Navigations from "@/components/Navigations";
import { mainContext } from "@/Contexts/mainContext";
import { useNotification } from "@/Contexts/NotificationContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import "swiper/css";
import "swiper/css/effect-fade";
import PlaceTickets from "@/components/PlaceTickets";
import useTranslate from "@/Contexts/useTranslation";
import { getOne } from "@/services/places/places.service";

export default function PlaceDetailsClient({ slug: propSlug }) {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const { addNotification } = useNotification();
  const params = useParams();
  const slug = propSlug || params?.slug;

  SwiperCore.use([Autoplay, EffectFade, Navigation]);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const res = await getOne(slug);
        setPlace(res?.data?.place || null);
      } catch (error) {
        console.error(error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [slug]);

  const placeName =
    place?.translations?.[locale]?.name || place?.name || "";
  const placeDesc =
    place?.translations?.[locale]?.desc ||
    place?.description ||
    place?.desc ||
    "";
  const placeGov =
    place?.governorate?.translations?.[locale]?.name ||
    place?.governorate?.name ||
    place?.governorateName ||
    "";

  const getGoogleMapsUrl = () => {
    const directLink =
      (typeof place?.location === "string" ? place.location : place?.location?.link) ||
      place?.googleMapsLink ||
      place?.locationLink;
    if (directLink && typeof directLink === "string" && directLink.trim()) {
      return directLink.trim();
    }
    const query = [placeName, placeGov].filter(Boolean).join(" ");
    return query
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      : "https://maps.google.com";
  };

  const handleOpenMaps = () => {
    const url = getGoogleMapsUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const url = getGoogleMapsUrl();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (addNotification) {
        addNotification({
          type: "success",
          message:
            locale === "AR"
              ? "تم نسخ رابط خرائط جوجل بنجاح!"
              : "Google Maps link copied successfully!",
        });
      }
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const mapIframeSrc =
    place?.location?.iFrame ||
    place?.locationIframe ||
    (placeName
      ? `https://maps.google.com/maps?q=${encodeURIComponent(
          `${placeName} ${placeGov}`.trim()
        )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
      : "");

  return (
    <div className="single-page forPlace container">
      <div className="holder big-holder">
        {/* HERO */}
        <div className="hero-image-holder">
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <p>{t.dashboard.forms.loading || "Loading..."}</p>
            </div>
          ) : (
            place?.images?.[0] && (
              <Image src={place.images[0]} alt={placeName} fill priority />
            )
          )}
        </div>

        {/* NAV */}
        <Navigations
          items={[
            { name: t.sideNav.places, href: "/places" },
            { name: t.dashboard.tables.placeDetails, href: "" },
          ]}
          container="main"
        />

        {/* DETAILS */}
        <div className="holds">
          <div className="details-holder">
            {!loading && (
              <div className="details">
                <h3>{placeName}</h3>
                {place?.tickets?.type === "free" && (
                  <div className="free">{t.singelPages.freeToVisit}</div>
                )}
              </div>
            )}
            <p className="description">{placeDesc}</p>
          </div>

          {/* TICKETS */}
          <PlaceTickets tickets={place?.tickets} />
        </div>

        {/* IMAGES */}
        {place?.images?.length > 0 && (
          <div className="images-swiper">
            <div className="top">
              <h4>{t.singelPages.place_images}</h4>
              {place?.images?.length > 2 && (
                <div className="navigation">
                  <button className="custom-prev" aria-label="Previous image">
                    <IoIosArrowBack />
                  </button>
                  <button className="custom-next" aria-label="Next image">
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
              {place?.images?.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image src={img} alt={`place img - ${index}`} fill />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* LOCATION */}
        <div className="location">
          <div className="top">
            <h4>
              {t.singelPages.locationIn} {placeGov}
            </h4>
            <div className="actions">
              <div className="hold">
                <button
                  type="button"
                  className="main-button forFavoriet"
                  onClick={handleOpenMaps}
                  title={t.singelPages.view_in_google_maps}
                >
                  {t.singelPages.view_in_google_maps}
                </button>
                <button
                  type="button"
                  className="main-button forFavoriet"
                  onClick={handleCopyLink}
                  title={t.actions.copy_link}
                >
                  {copied ? (
                    <>
                      <FaCheck style={{ marginInlineEnd: 6 }} />
                      {locale === "AR" ? "تم النسخ!" : "Copied!"}
                    </>
                  ) : (
                    t.actions.copy_link
                  )}
                </button>
              </div>
            </div>
          </div>

          {mapIframeSrc && (
            <div className="i-frame">
              <iframe
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map"
                src={mapIframeSrc}
                title={placeName || "Location Map"}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
