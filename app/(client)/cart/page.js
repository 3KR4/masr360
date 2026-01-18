"use client";
import Image from "next/image";
import React, { useState, useContext } from "react";
import Rating from "@mui/material/Rating";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/forms.css";
import useCart from "@/hooks/client/useCart";
import { SlLocationPin } from "react-icons/sl";
import { MdRemoveShoppingCart } from "react-icons/md";
import Link from "next/link";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";

function Cart() {
  const { screenSize } = useContext(mainContext);
  const t = useTranslate();

  const {
    favorites,
    updateQuantity,
    removeItem,
    getItemPrice,
    getTotalPrice,
    grandTotal,
  } = useCart();
  const {
    register,
    formState: { errors },
  } = useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    address: "",
    note: "",
    coupon: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const applyCoupon = () => {};

  const renderStep1 = () => (
    <div className="table-container">
      <div className="table-header">
        {screenSize !== "small" ? (
          <>
            <div className="header-item details">{t.cart.productDetails}</div>
            <div className="header-item">{t.cart.price}</div>
            <div className="header-item">{t.cart.quantity}</div>
            <div className="header-item">{t.cart.remove}</div>
          </>
        ) : (
          <div className="header-item" style={{ fontSize: "17px" }}>
            {t.cart.cartItems}
          </div>
        )}
      </div>

      {/* Favorites items */}
      <div className="table-items">
        {favorites.map((item) => {
          const itemPrice = getItemPrice(item);
          const totalPrice = getTotalPrice(item);

          return (
            <div key={item.id} className="table-item">
              <div className="holder">
                <Link href={``} className="item-image">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="product-image"
                  />
                </Link>

                <div className="item-details">
                  <Link href={``} className="item-name">
                    {item.name}
                  </Link>
                  {screenSize !== "small" && (
                    <>
                      <Link href={``} className="link">
                        <span>{t.cart.category}:</span> {item.category}
                      </Link>
                      <div className="item-rating">
                        <Rating
                          name="read-only"
                          value={item.rate}
                          precision={0.1}
                          readOnly
                          sx={{ color: "#ea8c43", fontSize: "18px" }}
                        />
                        <span className="reviews-count">
                          ({item?.reviewsCount}) {t.mainCard.reviews}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="item-price">
                <DisplayPrice
                  price={item?.price}
                  sale={item?.sale}
                  stock={item?.stock}
                  qty={item?.quantity}
                  priceLabel={t.cart.price}
                  saleLabel={t.cart.sale}
                  outOfStockLabel={t.cart.outOfStock}
                  lastPriceLabel={t.cart.lastPrice}
                  discountLabel={t.cart.discount}
                />
              </div>
              <div className="item-quantity">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    —
                  </button>
                  <span className="quantity-number">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                  {screenSize == "small" && (
                    <div className="item-remove">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {screenSize !== "small" && (
                <div className="item-remove">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="order-information  ">
      <form className="form-section ">
        <h3 className="section-title">{t.cart.orderInformation}</h3>

        <div
          className="box forInput"
          onClick={() => document.getElementById("address").focus()}
        >
          <label htmlFor="address">{t.cart.deliveryAddress}</label>
          <div className="inputHolder">
            <div className="holder">
              <SlLocationPin />
              <input
                type="text"
                id="address"
                {...register("address", {
                  required: t.cart.addressRequired,
                })}
                placeholder={t.cart.addressPlaceholder}
              />
            </div>
            {errors.address && (
              <span className="error">
                <CircleAlert />
                {errors.address.message}
              </span>
            )}
          </div>
        </div>
        <div
          className="box forInput"
          onClick={() => document.getElementById("instructions").focus()}
        >
          <label htmlFor="instructions">{t.cart.deliveryInstructions}</label>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="instructions"
                {...register("instructions")}
                placeholder={t.cart.instructionsPlaceholder}
              />
            </div>
          </div>
        </div>
      </form>

      <div className="summary-section">
        <h3 className="section-title">{t.cart.orderSummary}</h3>

        <div className="summary-items">
          {favorites.map((item) => {
            const totalPrice = getTotalPrice(item);
            return (
              <div key={item.id} className="summary-item">
                <div className="summary-item-image">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="product-image"
                  />
                </div>
                <div className="summary-item-details">
                  <h4 className="summary-item-name">{item.name}</h4>
                  <p className="summary-item-quantity">
                    {t.cart.quantityLabel} x{item.quantity}
                  </p>
                </div>
                <div className="summary-item-price">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="summary-total">
          <div className="total-line">
            <span>{t.cart.shipping}:</span>
            <span>$18.00</span>
          </div>
        </div>
        <div className="coupon-section box forInput">
          <div className="hold">
            <label htmlFor="coupon">{t.cart.couponCode}</label>
            <div className="inputHolder">
              <div className="holder coupon-holder">
                <input
                  type="text"
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleInputChange}
                  placeholder={t.cart.couponPlaceholder}
                />
                <button onClick={applyCoupon} className="apply-coupon-btn">
                  {t.cart.apply}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="payment-method">
      <h1 className="payment-title">{t.cart.paymentMethod}</h1>
      <p className="payment-subtitle">{t.cart.paymentIntegration}</p>
    </div>
  );

  return (
    <div>
      {favorites.length === 0 ? (
        <div className="error-page container">
          <MdRemoveShoppingCart />
          <h4>{t.cart.emptyCart}</h4>
          <p>{t.cart.emptyMessage}</p>
          <Link href={`/market`} className={`main-button`}>
            {t.cart.exploreMarketplace}
          </Link>
        </div>
      ) : (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              {currentStep === 0 && t.cart.shoppingCart}
              {currentStep === 1 && t.cart.checkoutDetails}
              {currentStep === 2 && t.cart.paymentMethod}
              <hr />
            </h1>
          </div>

          <div className="container">
            <div className="checkout-progress">
              <div className="progress-steps">
                <div
                  className={`progress-step ${
                    currentStep >= 0 ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(0)}
                >
                  <span className="step-number">1</span>
                  <span className="step-label">{t.cart.step1}</span>
                </div>
                <div
                  className={`progress-step ${
                    currentStep >= 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="step-number">2</span>
                  <span className="step-label">{t.cart.step2}</span>
                </div>
                <div
                  className={`progress-step ${
                    currentStep >= 2 ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(2)}
                >
                  <span className="step-number">3</span>
                  <span className="step-label">{t.cart.step3}</span>
                </div>
              </div>
            </div>

            <div className="step-content">
              {currentStep === 0 && renderStep1()}
              {currentStep === 1 && renderStep2()}
              {currentStep === 2 && renderStep3()}
            </div>

            <div className="checkout-navigation">
              <button
                disabled={currentStep === 0}
                className={`nav-btn prev-btn `}
                onClick={() => {
                  prevStep();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {t.cart.previous}
              </button>
              <div className="navigation-total">
                <span className="total-label">{t.cart.total}:</span>
                <span className="total-amount">${grandTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={currentStep === 2}
                className={`nav-btn next-btn`}
                onClick={() => {
                  nextStep();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {t.cart.next}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
