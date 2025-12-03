"use client";
import { useEffect, useState } from "react";
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
import { getService } from "@/services/api/getService";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [productReviews, setProductReviews] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getService.getSingleProduct(slug);
        const item = data?.data;

        if (item) {
          setProduct(item);
          setProductReviews(item.reviews || null);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  return (
    <div className="single-page container">
      <Navigations
        items={[
          { name: "marketplace", href: "/marketplace" },
          { name: "product details", href: "" },
        ]}
        container="main"
      />

      <div className="holder big-holder">
        <div className="images-holder">
          <Image src={product?.images?.[currentImg]} alt={product?.name} fill />

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
            category: <Link href={`/`}>{product?.category}</Link>
          </h5>

          <div className="reviews">
            <Rating
              name="read-only"
              value={product?.rate}
              precision={0.1}
              readOnly
              sx={{ color: "#ea8c43", fontSize: "18px" }}
            />
            <span className="count">{product?.reviewsCount} Reviews</span>
          </div>

          <DisplayPrice
            price={product?.price}
            sale={product?.sale}
            stock={product?.stock}
          />

          <div className="Availability">
            <div className="hold">
              Availability:{" "}
              {product?.stock > 0 ? (
                <span className="in">
                  <FaCircleCheck /> in stock
                </span>
              ) : (
                <span className="out">
                  <IoCloseCircleSharp /> out of stock
                </span>
              )}
            </div>

            {product?.stock < 5 && product.stock > 0 && (
              <p className="dont-miss">
                Dont Miss Out, only {product?.stock} pieces left in stock
              </p>
            )}
          </div>

          <p className="description">{product?.description}</p>

          <div className="actions">
            <button className="main-button forCart">buy it now</button>
            <div className="hold">
              <button className="main-button forFavoriet">add to cart</button>
              <button className="main-button forFavoriet">
                add to favorites
              </button>
            </div>
          </div>

          {product?.specifications && (
            <div className="specifications">
              <h5>Specifications</h5>
              <ul>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <span>{key}: </span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {productReviews && <ReviewSection reviews={productReviews} />}
    </div>
  );
}
