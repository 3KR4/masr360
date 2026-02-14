"use client";
import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Link from "next/link";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import Navigations from "@/components/Navigations";
import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice";
import ReviewSection from "@/components/reviews/ReviewSection";
import useTranslate from "@/Contexts/useTranslation";
import {
  productCategoriesAr,
  productCategoriesEn,
  productsAr,
  productsEn,
  reviews,
} from "@/data";
import { mainContext } from "@/Contexts/mainContext";

export default function ProductDetails() {
  const t = useTranslate();
  const { slug } = useParams();
  const { screenSize, locale } = useContext(mainContext);

  const [product, setProduct] = useState(null);
  // const [productReviews, setProductReviews] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const fetchProduct = async () => {
    //   try {
    //     const { data } = await getService.getSingleProduct(slug);
    //     const item = data?.data;

    //     if (item) {
    //       setProduct(item);
    //       setProductReviews(item.reviews || null);
    //     }
    //   } catch (err) {
    //     console.error("Failed to fetch product:", err);
    //   }
    // };

    // if (slug) fetchProduct();
    const products = locale === "en" ? productsEn : productsAr;
    setProduct(products.find((x) => x.id == slug));
  }, [slug, locale]);

  const productCat =
    locale === "en"
      ? productCategoriesEn.find((x) => x.id === product?.category)
      : productCategoriesAr.find((x) => x.id === product?.category);
  return (
    <div className="single-page container for-product">
      <Navigations
        items={[
          { name: t.header.marketplace, href: "/marketplace" },
          { name: t.favorites.tableHeaders.product?.details, href: "" },
        ]}
        container="main"
      />

      <div className="holder big-holder">
        <div className="images-holder">
          {product?.images?.[0] && (
            <Image
              src={product?.images?.[currentImg]}
              alt={product?.name}
              fill
            />
          )}

          <div className="imgs">
            {product?.images?.map((x, index) => (
              <div className="img" key={index}>
                <Image
                  src={x}
                  alt={product?.name}
                  fill
                  className={`${index == currentImg ? "active" : ""}`}
                  onClick={() => setCurrentImg(index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="details-holder">
          <h3>{product?.name}</h3>

          <h5>
            {t.dashboard.forms.category}:{" "}
            <Link href={`/`}>{productCat?.name}</Link>
          </h5>
          {product?.rate && (
            <div className="reviews">
              <Rating
                name="read-only"
                value={product?.rate}
                precision={0.1}
                readOnly
                sx={{ color: "#ea8c43", fontSize: "18px" }}
              />
              <span className="count">
                {product?.reviewsCount} {t.mainCard.reviews}
              </span>
            </div>
          )}

          <DisplayPrice
            price={product?.price}
            sale={product?.sale}
            stock={product?.stock}
          />

          <div className="Availability">
            <div className="hold">
              {t.marketplace.availability}:{" "}
              {product?.stock > 0 ? (
                <span className="in">
                  <FaCircleCheck /> {t.marketplace.in_stock}
                </span>
              ) : (
                <span className="out">
                  <IoCloseCircleSharp /> {t.marketplace.out_of_stock}
                </span>
              )}
            </div>

            {product?.stock < 5 && product?.stock > 0 && (
              <p className="dont-miss">
                Dont Miss Out, only {product?.stock} pieces left in stock
              </p>
            )}
          </div>

          <p className="description">{product?.description}</p>

          <div className="actions">
            <button className="main-button forCart">
              {t.actions.buy_it_now}
            </button>
            <div className="hold">
              <button className="main-button forFavoriet">
                {t.actions.add_to_favorites}
              </button>
              <button className="main-button forFavoriet">
                {t.actions.add_to_cart}
              </button>
            </div>
          </div>

          {product?.specifications?.length > 0 && (
            <div className="specifications">
              <h5>{t.dashboard.forms.specifications}</h5>
              <ul>
                {product.specifications.map((spec, index) => (
                  <li key={index}>
                    <span>{spec.key}: </span>
                    {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <ReviewSection reviews={reviews[0]} />
    </div>
  );
}
