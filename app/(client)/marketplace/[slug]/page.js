"use client";
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Link from "next/link";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCartOutline, IoHeartOutline, IoCartSharp, IoHeart } from "react-icons/io5";
import Navigations from "@/components/Navigations";
import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice";
import ReviewSection from "@/components/reviews/ReviewSection";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { getOne } from "@/services/porducts/products.service";
import { normalizeProduct } from "@/services/normalizers/productNormalizer";
import useCart from "@/hooks/client/useCart";
import useFavoriet from "@/hooks/client/useFavoriet";

export default function ProductDetails() {
  const t = useTranslate();
  const { slug } = useParams();
  const router = useRouter();
  const { screenSize, locale } = useContext(mainContext);
  const { addItem, isInCart } = useCart();
  const { toggleItem, isFavorited } = useFavoriet();

  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await getOne(slug);
      const raw = res.data?.data || res.data;
      setProduct(normalizeProduct(raw));
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    setAddingToCart(true);
    const added = await addItem(product.id, 1);
    if (added) {
      setProduct((prev) => (prev ? { ...prev, cartItem: { cartQuantity: 1 } } : prev));
    }
    setAddingToCart(false);
  };

  const handleToggleFavorite = async () => {
    if (isFavorited("Product", product.id)) {
      router.push("/favorites");
      return;
    }
    setTogglingFav(true);
    await toggleItem("Product", product.id);
    setTogglingFav(false);
  };

  if (loading) {
    return (
      <div className="single-page container for-product">
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p>{t.dashboard.forms.loading || "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="single-page container for-product">
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p>{t.marketplace.not_found || "Product not found"}</p>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const inCart = !!product?.cartItem || isInCart(product.id);

  return (
    <div className="single-page container for-product">
      <Navigations
        items={[
          { name: t.header.marketplace, href: "/marketplace" },
          { name: product.name, href: "" },
        ]}
        container="main"
      />

      <div className="holder big-holder">
        <div className="images-holder">
          {product.images?.[0] && (
            <Image
              src={product.images[currentImg]}
              alt={product.name}
              fill
            />
          )}
          <div className="imgs">
            {product.images?.map((x, index) => (
              <div className="img" key={index}>
                <Image
                  src={x}
                  alt={product.name}
                  fill
                  className={`${index === currentImg ? "active" : ""}`}
                  onClick={() => setCurrentImg(index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="details-holder">
          <h3>{product.name}</h3>

          <h5>
            {t.dashboard.forms.category}:{" "}
            <Link href={`/marketplace?cat=${product.category}`}>
              {product.categoryName}
            </Link>
          </h5>

          {product.rate > 0 && (
            <div className="reviews">
              <Rating
                name="read-only"
                value={product.rate}
                precision={0.1}
                readOnly
                sx={{ color: "#ea8c43", fontSize: "18px" }}
              />
              <span className="count">
                {product.reviewsCount} {t.mainCard.reviews}
              </span>
            </div>
          )}

          <DisplayPrice
            price={product.price}
            sale={product.sale}
            stock={product.stock}
          />

          <div className="Availability">
            <div className="hold">
              {t.marketplace.availability}:{" "}
              {!isOutOfStock ? (
                <span className="in">
                  <FaCircleCheck /> {t.marketplace.in_stock}
                </span>
              ) : (
                <span className="out">
                  <IoCloseCircleSharp /> {t.marketplace.out_of_stock}
                </span>
              )}
            </div>
            {isLowStock && (
              <p className="dont-miss">
                Dont Miss Out, only {product.stock} pieces left in stock
              </p>
            )}
          </div>

          <p className="description">{product.description}</p>

          <div className="actions">
            <div className="actions-cart">
              <button
                className="main-button forCart"
                disabled
              >
                {t.actions.buy_it_now}
              </button>
              <button
                className={`main-button forCart ${inCart ? "active" : ""}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                style={{ position: "relative" }}
              >
                {addingToCart ? (
                  <span className="loader" />
                ) : (
                  <>
                    {inCart ? <IoCartSharp /> : <IoCartOutline />}
                    {inCart
                      ? (t.actions.in_cart || "In Cart")
                      : t.actions.add_to_cart}
                  </>
                )}
              </button>
            </div>
            <button
              className={`main-button forCart ${isFavorited("Product", product.id) ? "active" : ""}`}
              onClick={handleToggleFavorite}
              disabled={togglingFav}
              style={{ position: "relative" }}
            >
              {togglingFav ? (
                <span className="loader" />
              ) : (
                <>
                  {isFavorited("Product", product.id) ? <IoHeart /> : <IoHeartOutline />}
                  {isFavorited("Product", product.id)
                    ? (t.actions.in_favorites_list || "In Favorites List")
                    : t.actions.add_to_favorites}
                </>
              )}
            </button>
          </div>

          {product.specifications?.length > 0 && (
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

      <ReviewSection productId={product.id} />
    </div>
  );
}
