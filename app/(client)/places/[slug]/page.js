"use client";
import { useContext, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { places } from "@/data";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Navigations from "@/components/navigations";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import "swiper/css";
import "swiper/css/effect-fade";
import formatCurrency from "@/utlies/curancy";

export default function ProductDetails() {
  const { screenSize } = useContext(mainContext);
  SwiperCore.use([Autoplay, EffectFade, Navigation]);
  const { slug } = useParams();
  const place = places.find((g) => g.id == slug.toLowerCase());

  return (
    <div className="single-page forPlace container">
      <div className="holder big-holder">
        <div className="hero-image-holder ">
          <Image src={place?.image} alt={place?.name} fill />
          {screenSize !== "small" && (
            <div className="details">
              <h3 className="ellipsis">{place?.name}</h3>{" "}
              {place.tickets.free && <div className="free">free to visit</div>}
            </div>
          )}
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

        <div className={`holds ${place.tickets.free ? "noTikets" : ""}`}>
          <div className="details-holder">
            {screenSize == "small" && (
              <div className="details">
                <h3 className="ellipsis">{place?.name}</h3>{" "}
                {place.tickets.free && (
                  <div className="free">free to visit</div>
                )}
              </div>
            )}
            <p className="description">{place?.description}</p>
          </div>
          {!place.tickets.free && (
            <div className="tickets">
              <div className="top">
                <h4>tickets price</h4>
              </div>
              <div className="tickets-list">
                <div>
                  <h5>Students:</h5>
                  <ul>
                    {Object.entries(place.tickets.students).map(
                      ([type, price]) => (
                        <li
                          key={type}
                          className={type == "egyptian" ? "egyption" : ""}
                        >
                          {type} {formatCurrency(price)}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h5>Adults:</h5>
                  <ul>
                    {Object.entries(place.tickets.adults).map(
                      ([type, price]) => (
                        <li
                          key={type}
                          className={type == "egyptian" ? "egyption" : ""}
                        >
                          {type} {formatCurrency(price)}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h5>Seniors:</h5>
                  <ul>
                    {Object.entries(place.tickets.seniors).map(
                      ([type, price]) => (
                        <li
                          key={type}
                          className={type == "egyptian" ? "egyption" : ""}
                        >
                          {type}
                          {formatCurrency(price)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
}
