"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { products } from "@/data";
import "@/styles/pages/product-details.css";
import Image from "next/image";
import Link from "next/link";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import Navigations from "@/components/navigations";
import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice"; // optional, only for product

export default function ProductDetails() {
  const { slug } = useParams();

  const product = products.find((g) => g.id == slug.toLowerCase());

  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="product-page container">
      <Navigations
        items={[
          {
            name: "market place",
            href: "/market",
          },
          {
            name: "product details",
            href: "",
          },
        ]}
        container={`main`}
      />

      <div className="holder big-holder">
        <div className="images-holder">
          <Image
            src={product?.images[currentImg]}
            alt={product?.name}
            fill
          />
          <div className="imgs">
            {product?.images?.map((x, index) => (
              <div className="img">
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
            <span className="count">{product?.reviewsCount} Review</span>
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
                  <FaCircleCheck />
                  in stock
                </span>
              ) : (
                <span className="out">
                  <IoCloseCircleSharp />
                  out of stock
                </span>
              )}
            </div>
            {product?.stock > 5 && (
              <p className="dont-miss">
                Don't Miss Out, only 0{product?.stock} pieces left in stock
              </p>
            )}
          </div>
          <p className="description">{product?.description}</p>
          <div className="actions">
            <button className="main-button forCart">add to cart</button>
            <button className="main-button forFavoriet">
              add to favoriets
            </button>
          </div>
          {product.specifications && (
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
    </div>
  );
}
