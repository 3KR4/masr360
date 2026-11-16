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
import { getOne } from "@/services/nights/nights.service";
import useTranslate from "@/Contexts/useTranslation";
import ReviewSection from "@/components/reviews/ReviewSection";

function unwrapNightResponse(data) {
  return data?.night || data?.data?.night || data?.data || data;
}

export default function NightDetailsClient({ slug: propSlug }) {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const { addNotification } = useNotification();
  const params = useParams();
  const slug = propSlug || params?.slug;

  SwiperCore.use([Autoplay, EffectFade, Navigation]);

  const [night, setNight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchNight = async () => {
      setLoading(true);
      try {
        const res = await getOne(slug);
        const raw = unwrapNightResponse(res.data);
        if (!cancelled) setNight(raw);
      } catch (err) {
        console.error("Failed to fetch night:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNight();
    return () => { cancelled = true; };
  }, [slug]);

  const localeKey = String(locale || "EN").toUpperCase();
  const nightName =
    night?.translations?.[localeKey]?.name || night?.name || "";
  const nightDesc =
    night?.translations?.[localeKey]?.desc || night?.desc || night?.description || "";
  const nightImages = Array.isArray(night?.imgs)
    ? night.imgs.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
    : [];
  const nightGovName =
    night?.governorate?.translations?.[localeKey]?.name ||
    night?.governorate?.name ||
    "";

  const getGoogleMapsUrl = () => {
    const directLink =
      (typeof night?.location === "string" ? night.location : night?.location?.link) ||
      night?.googleMapsLink ||
      night?.locationLink;
    if (directLink && typeof directLink === "string" && directLink.trim()) {
      return directLink.trim();
    }
    const query = [nightName, nightGovName].filter(Boolean).join(" ");
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

  const locationIframe =
    night?.locationIframe ||
    night?.location?.iFrame ||
    (nightName
      ? `https://maps.google.com/maps?q=${encodeURIComponent(
          `${nightName} ${nightGovName}`.trim()
        )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
      : "");

  return (
    <div className="single-page forPlace container">
      <div className="holder big-holder">
        {/* HERO */}
        <div className="hero-image-holder">
          {nightImages[0] && (
            <Image src={nightImages[0]} alt={nightName} fill priority />
          )}
        </div>

        {/* NAV */}
        <Navigations
          items={[
            { name: t.sectionsTitles.masr_nights.title, href: "/nights" },
            { name: nightName, href: "" },
          ]}
          container="main"
        />

        {/* DETAILS */}
        <div className="holds">
          <div className="details-holder">
            {!loading && (
              <div className="details">
                <h3>{nightName}</h3>
              </div>
            )}
            <p className="description">{nightDesc}</p>
          </div>
        </div>

        {/* IMAGES */}
        {nightImages.length > 0 && (
          <div className="images-swiper">
            <div className="top">
              <h4>{t.singelPages.place_images}</h4>
              {nightImages.length > 2 && (
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
              {nightImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image src={img} alt={`night img - ${index}`} fill />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* LOCATION */}
        <div className="location">
          <div className="top">
            <h4>
              {t.singelPages.locationIn} {nightGovName}
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
                title={nightName || "Location Map"}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
