"use client";
import { useContext, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { nights, reviews } from "@/data";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Navigations from "@/components/Navigations";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import "swiper/css";
import "swiper/css/effect-fade";
import ReviewSection from "@/components/reviews/ReviewSection";
import Rating from "@mui/material/Rating";

export default function ProductDetails() {
  const { screenSize } = useContext(mainContext);
  SwiperCore.use([Autoplay, EffectFade, Navigation]);
  const { slug } = useParams();
  const place = nights.find((g) => g.id == slug.toLowerCase());
  const productReviews = reviews.find((g) => g.productId == slug.toLowerCase());

  return (
    <div className="single-page forPlace forNight container">
      <div className="holder big-holder">
        <div className="hero-image-holder ">
          <Image src={place?.image} alt={place?.name} fill />
        </div>

        <Navigations
          items={[
            {
              name: "places",
              href: "/places",
            },
            {
              name: "place details",
              href: "",
            },
          ]}
          container={`main`}
        />

        <div
          className={`holds ${
            place?.tickets
              ? place?.tickets?.free
                ? "noTikets"
                : ""
              : "noTikets"
          }`}
        >
          <div className="details-holder">
            <div className="details">
              <h3 className="">{place?.name}</h3>{" "}
              <div className="reviews">
                <Rating
                  name="read-only"
                  value={place?.rate}
                  precision={0.1}
                  readOnly
                  sx={{ color: "#ea8c43", fontSize: "20px" }}
                />
                <span className="count">{place?.reviewsCount} Review</span>
              </div>
            </div>
            <p className="description">{place?.description}</p>
          </div>
        </div>
        <div className="images-swiper">
          <div className="top">
            <h4>place images</h4>
            {place?.images?.length > 2 && (
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
              0: {
                slidesPerView: 1,
              },
              630: {
                slidesPerView: 1.3,
              },
              768: {
                slidesPerView: 1.5,
              },
              992: {
                slidesPerView: 2,
              },
            }}
          >
            {place?.images?.map((img, index) => (
              <SwiperSlide key={index}>
                <Image src={img} alt={`place img - ${index}`} fill />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="location">
          <div className="top">
            <h4>Location in {place?.govermorate}</h4>
            <div className="actions">
              <div className="hold">
                <button className="main-button forFavoriet">
                  view in google maps
                </button>
                <button className="main-button forFavoriet">copy link</button>
              </div>
            </div>
          </div>

          <div className="i-frame">
            <iframe
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110518.71491261623!2d31.460567384638452!3d30.045181193851644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458b14d72adf029%3A0x9a38f9bbb6edbfe4!2z2KfZhNmF2KrYrdmBINin2YTZhdi12LHZiiDYqNin2YTZgtin2YfYsdip!5e0!3m2!1sar!2seg!4v1763594565368!5m2!1sar!2seg"
            ></iframe>
          </div>
        </div>
        {reviews && <ReviewSection reviews={productReviews} />}
      </div>
    </div>
  );
}
