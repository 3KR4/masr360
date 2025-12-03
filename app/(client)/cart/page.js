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
import useCart from "@/hooks/useCart";
import { SlLocationPin } from "react-icons/sl";
import { MdRemoveShoppingCart } from "react-icons/md";
import Link from "next/link";
import { mainContext } from "@/Contexts/mainContext";

function Cart() {
  const { screenSize } = useContext(mainContext);

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

  const applyCoupon = () => {
  };

  const renderStep1 = () => (
    <div className="table-container">
      <div className="table-header">
        {screenSize !== "small" ? (
          <>
            <div className="header-item details">product details</div>
            <div className="header-item">Price</div>
            <div className="header-item">Quantity</div>
            <div className="header-item">Remove</div>
          </>
        ) : (
          <div className="header-item" style={{ fontSize: "17px" }}>
            cart items
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
                    src={item.image}
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
                        <span>Category:</span> {item.category}
                      </Link>
                      <div className="item-rating">
                        <Rating
                          name="read-only"
                          value={item.rate}
                          precision={0.1}
                          readOnly
                          sx={{ color: "#ea8c43", fontSize: "18px" }}
                        />
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
        <h3 className="section-title">Order Information</h3>

        <div
          className="box forInput"
          onClick={() => document.getElementById("address").focus()}
        >
          <label htmlFor="address">Delivery Address</label>
          <div className="inputHolder">
            <div className="holder">
              <SlLocationPin />
              <input
                type="text"
                id="address"
                {...register("address", {
                  required: "Please enter your delivery address",
                })}
                placeholder="e.g. 15 Ahmed Orabi St, Nasr City, Cairo"
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
          <label htmlFor="instructions">Delivery Instructions (Optional)</label>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="instructions"
                {...register("instructions")}
                placeholder="e.g. Call me when you arrive, or leave the package at the gate"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="summary-section">
        <h3 className="section-title">Order Summary</h3>

        <div className="summary-items">
          {favorites.map((item) => {
            const totalPrice = getTotalPrice(item);
            return (
              <div key={item.id} className="summary-item">
                <div className="summary-item-image">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="product-image"
                  />
                </div>
                <div className="summary-item-details">
                  <h4 className="summary-item-name">{item.name}</h4>
                  <p className="summary-item-quantity">Qty: x{item.quantity}</p>
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
            <span>Shipping:</span>
            <span>$18.00</span>
          </div>
        </div>
        <div className="coupon-section box forInput">
          <div className="hold">
            <label htmlFor="coupon">Coupon Code</label>
            <div className="inputHolder">
              <div className="holder coupon-holder">
                <input
                  type="text"
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleInputChange}
                  placeholder="Enter coupon code"
                />
                <button onClick={applyCoupon} className="apply-coupon-btn">
                  Apply
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
      <h1 className="payment-title">Payment Method</h1>
      <p className="payment-subtitle">
        Payment integration will be implemented in the next phase.
      </p>
    </div>
  );

  return (
    <div>
      {favorites.length === 0 ? (
        <div className="error-page container">
          <MdRemoveShoppingCart />
          <h4>Your cart is empty</h4>
          <p>
            Add some products you love — they’ll show up here when you’re ready
            to check out!
          </p>
          <Link href={`/market`} className={`main-button`}>
            Explore the marketplace
          </Link>
        </div>
      ) : (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              {currentStep === 0 && "Shopping Cart"}
              {currentStep === 1 && "Checkout details"}
              {currentStep === 2 && "Payment method"}
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
                </div>
                <div
                  className={`progress-step ${
                    currentStep >= 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="step-number">2</span>
                </div>
                <div
                  className={`progress-step ${
                    currentStep >= 2 ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(2)}
                >
                  <span className="step-number">3</span>
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
                Previous
              </button>
              <div className="navigation-total">
                <span className="total-label">Total:</span>
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
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
