"use client";
import Image from "next/image";
import React, { useState, useContext, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import {
  FaTrashAlt,
  FaRoad,
  FaHome,
  FaCity,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaMoneyBillWave,
  FaCreditCard,
  FaWallet,
} from "react-icons/fa";
import { SiContactlesspayment } from "react-icons/si";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCloseCircleSharp } from "react-icons/io5";
import DisplayPrice from "@/components/DisplayPrice";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/forms.css";
import useCart from "@/hooks/client/useCart";
import { useAuth } from "@/Contexts/AuthContext";
import { createOrder } from "@/services/orders/orders.service";
import { EGYPT_CITIES } from "@/constants/egyptCities";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { SlLocationPin } from "react-icons/sl";
import { MdRemoveShoppingCart } from "react-icons/md";
import Link from "next/link";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";

function Cart() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const currency = locale === "AR" ? "ج.م" : "L.E";
  const SHIPPING_FEE = 80;

  const {
    carts,
    loading,
    updateQuantity,
    removeItem,
    clearAll,
    getItemPrice,
    getTotalPrice,
    grandTotal,
  } = useCart();

  const totalAmount = useMemo(() => {
    return carts.length > 0 ? grandTotal + SHIPPING_FEE : 0;
  }, [carts.length, grandTotal, SHIPPING_FEE]);
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
    clearErrors,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      city: "",
      street: "",
      home: "",
      fullAddress: "",
      googleMapsLink: "",
      instructions: "",
    },
  });

  const cityOptions = useMemo(() => {
    return EGYPT_CITIES.map((c) => ({
      id: c.value,
      name: locale === "AR" ? c.labelAr : c.labelEn,
      value: c.value,
    }));
  }, [locale]);

  const currentCityValue = watch("city");
  const selectedCity = useMemo(() => {
    if (!currentCityValue) return null;
    return cityOptions.find((c) => c.value === currentCityValue) || null;
  }, [currentCityValue, cityOptions]);

  useEffect(() => {
    register("city", { required: t.cart.cityRequired });
  }, [register, t.cart.cityRequired]);

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [formData, setFormData] = useState({
    coupon: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 1) {
      const isValid = await trigger([
        "city",
        "street",
        "home",
        "fullAddress",
        "googleMapsLink",
      ]);
      if (isValid) {
        setOrderError(null);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/cart");
      return;
    }

    const isValid = await trigger([
      "city",
      "street",
      "home",
      "fullAddress",
      "googleMapsLink",
    ]);
    if (!isValid) {
      setCurrentStep(1);
      return;
    }

    const values = getValues();
    setSubmittingOrder(true);
    setOrderError(null);

    try {
      const mapLink = values.googleMapsLink?.trim();
      const formattedMapLink = mapLink
        ? mapLink.startsWith("http://") || mapLink.startsWith("https://")
          ? mapLink
          : `https://${mapLink}`
        : `https://maps.google.com/?q=${encodeURIComponent(values.city)}`;

      const payload = {
        location: {
          nearMetro: false,
          nearmetro: false,
          street: values.street?.trim(),
          fullAddress: values.fullAddress?.trim(),
          home: values.home?.trim(),
          city: values.city,
          googleMapsLink: formattedMapLink,
        },
        paymentMethod: "cash",
      };

      const res = await createOrder(payload);
      const newOrderId =
        res?.data?._id ||
        res?.data?.id ||
        res?._id ||
        res?.id ||
        "";
      await clearAll();
      if (newOrderId) {
        router.push(`/order-success?orderId=${newOrderId}`);
      } else {
        router.push("/order-success");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        t.cart.orderFailed;
      setOrderError(errMsg);
    } finally {
      setSubmittingOrder(false);
    }
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
        {carts.map((item) => {
          const itemPrice = getItemPrice(item);
          const totalPrice = getTotalPrice(item);
console.log(item);

          return (
            <div key={item.id} className="table-item">
              <div className="holder">
                <Link href={`/marketplace/${item.id}`} className="item-image">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="product-image"
                  />
                </Link>

                <div className="item-details">
                  <Link href={`/marketplace/${item.id}`} className="item-name">
                    {item.name}
                  </Link>
                  {screenSize !== "small" && (
                    <>
                      <Link href={`/marketplace/${item.id}`} className="link">
                         {item.category?.translations?.[locale]?.name || item.categoryName}
                      </Link>
                      <div className="item-availability">
                        <div className="hold">
                          {t.marketplace.availability}:{" "}
                          {item.stock > 0 ? (
                            <span className="in">
                              <FaCircleCheck /> {t.marketplace.in_stock}
                            </span>
                          ) : (
                            <span className="out">
                              <IoCloseCircleSharp /> {t.marketplace.out_of_stock}
                            </span>
                          )}
                        </div>
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
                    -
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
    <div className="order-information">
      <div className="form-section">
        <h3 className="section-title">{t.cart.orderInformation}</h3>

        {/* City Select with our site-wide SelectOptions component */}
        <SelectOptions
          label={t.cart.city}
          className="city-select-options"
          placeholder={t.cart.selectCity}
          options={cityOptions}
          value={selectedCity}
          onChange={(item) => {
            setValue("city", item.value, { shouldValidate: true });
            clearErrors("city");
          }}
          error={errors.city?.message}
        />

        {/* Row 1: Street Name & Apartment / Home / Building */}
        <div className="rowHolder">
          <div className="box forInput">
            <label htmlFor="street">{t.cart.street}</label>
            <div className="inputHolder">
              <div className="holder">
                <FaRoad />
                <input
                  type="text"
                  id="street"
                  {...register("street", {
                    required: t.cart.streetRequired,
                  })}
                  placeholder={t.cart.streetPlaceholder}
                />
              </div>
              {errors.street && (
                <span className="error">
                  <CircleAlert size={14} />
                  {errors.street.message}
                </span>
              )}
            </div>
          </div>

          <div className="box forInput">
            <label htmlFor="home">{t.cart.home}</label>
            <div className="inputHolder">
              <div className="holder">
                <FaHome />
                <input
                  type="text"
                  id="home"
                  {...register("home", {
                    required: t.cart.homeRequired,
                  })}
                  placeholder={t.cart.homePlaceholder}
                />
              </div>
              {errors.home && (
                <span className="error">
                  <CircleAlert size={14} />
                  {errors.home.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Full Address & Google Maps Link */}
        <div className="rowHolder">
          <div className="box forInput">
            <label htmlFor="fullAddress">{t.cart.fullAddress}</label>
            <div className="inputHolder">
              <div className="holder">
                <SlLocationPin />
                <input
                  type="text"
                  id="fullAddress"
                  {...register("fullAddress", {
                    required: t.cart.fullAddressRequired,
                  })}
                  placeholder={t.cart.fullAddressPlaceholder}
                />
              </div>
              {errors.fullAddress && (
                <span className="error">
                  <CircleAlert size={14} />
                  {errors.fullAddress.message}
                </span>
              )}
            </div>
          </div>

          <div className="box forInput">
            <label htmlFor="googleMapsLink">{t.cart.googleMapsLink}</label>
            <div className="inputHolder">
              <div className="holder">
                <FaMapMarkedAlt />
                <input
                  type="text"
                  id="googleMapsLink"
                  {...register("googleMapsLink", {
                    validate: (val) => {
                      if (!val || !val.trim()) return true;
                      const trimmed = val.trim();
                      const urlPattern =
                        /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
                      if (!urlPattern.test(trimmed)) {
                        return t.cart.googleMapsLinkInvalid;
                      }
                      try {
                        new URL(
                          trimmed.startsWith("http://") ||
                            trimmed.startsWith("https://")
                            ? trimmed
                            : `https://${trimmed}`
                        );
                        return true;
                      } catch {
                        return t.cart.googleMapsLinkInvalid;
                      }
                    },
                  })}
                  placeholder={t.cart.googleMapsLinkPlaceholder}
                />
              </div>
              {errors.googleMapsLink && (
                <span className="error">
                  <CircleAlert size={14} />
                  {errors.googleMapsLink.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Instructions (Optional) */}
        <div className="box forInput">
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
      </div>

      <div className="summary-section">
        <h3 className="section-title">{t.cart.orderSummary}</h3>

        <div className="summary-items">
          {carts.map((item) => {
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
                  {totalPrice.toFixed(2)} {currency}
                </div>
              </div>
            );
          })}
        </div>
        <div className="summary-total">
          <div className="total-line">
            <span>{t.cart.shipping}:</span>
            <span>{SHIPPING_FEE.toFixed(2)} {currency}</span>
          </div>
        </div>
        <div className="coupon-section box forInput" style={{ display: "none" }}>
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

      {orderError && (
        <div
          className="checkout-error-banner"
          style={{ maxWidth: 750, margin: "1.5rem auto 0" }}
        >
          <CircleAlert />
          <span>{orderError}</span>
        </div>
      )}

      <div className="payment-methods-grid">
        {/* Cash - Active */}
        <div
          className={`payment-card ${paymentMethod === "cash" ? "active" : ""}`}
          onClick={() => setPaymentMethod("cash")}
        >
          <div className="payment-card-header">
            <FaMoneyBillWave className="payment-card-icon" />
            <span className="payment-card-badge active-badge">
              <FaCheckCircle style={{ marginInlineEnd: 4 }} />
              Active
            </span>
          </div>
          <div className="payment-card-body">
            <h4>{t.cart.cashOnDelivery}</h4>
            <p>{t.cart.cashDesc}</p>
          </div>
        </div>

        {/* Credit Card - Disabled */}
        <div className="payment-card disabled">
          <div className="payment-card-header">
            <FaCreditCard className="payment-card-icon" />
            <span className="payment-card-badge">{t.cart.comingSoon}</span>
          </div>
          <div className="payment-card-body">
            <h4>{t.cart.creditCard}</h4>
            <p>{t.cart.notAvailableYet}</p>
          </div>
          <span className="payment-tooltip">{t.cart.notAvailableYet}</span>
        </div>

        {/* Vodafone Cash - Disabled */}
        <div className="payment-card disabled">
          <div className="payment-card-header">
            <FaWallet className="payment-card-icon" />
            <span className="payment-card-badge">{t.cart.comingSoon}</span>
          </div>
          <div className="payment-card-body">
            <h4>{t.cart.vodafoneCash}</h4>
            <p>{t.cart.notAvailableYet}</p>
          </div>
          <span className="payment-tooltip">{t.cart.notAvailableYet}</span>
        </div>

        {/* InstaPay - Disabled */}
        <div className="payment-card disabled">
          <div className="payment-card-header">
            <SiContactlesspayment className="payment-card-icon" />
            <span className="payment-card-badge">{t.cart.comingSoon}</span>
          </div>
          <div className="payment-card-body">
            <h4>{t.cart.instapay}</h4>
            <p>{t.cart.notAvailableYet}</p>
          </div>
          <span className="payment-tooltip">{t.cart.notAvailableYet}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart">
      {loading ? (
        <div className="error-page container">
          <div className="loader" />
        </div>
      ) : carts.length === 0 ? (
        <div className="error-page container">
          <MdRemoveShoppingCart />
          <h4>{t.cart.emptyCart}</h4>
          <p>{t.cart.emptyMessage}</p>
          <Link href={`/marketplace`} className={`main-button`}>
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
                  onClick={() => nextStep()}
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
                className={`nav-btn main-button prev-btn back-light-animation`}
                onClick={() => {
                  prevStep();
                }}
              >
                {t.cart.previous}
              </button>
              {currentStep > 0 && (
                <div className="navigation-total">
                <span className="total-label">{t.cart.total}:</span>
                <span className="total-amount">{totalAmount.toFixed(2)} {currency}</span>
              </div>
              )}
              {currentStep === 2 ? (
                <button
                  disabled={submittingOrder}
                  className={`nav-btn main-button place-order-btn back-light-animation`}
                  onClick={handlePlaceOrder}
                >
                  {submittingOrder ? (
                    <span>{t.cart.placingOrder}</span>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>{t.cart.placeOrder}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  className={`nav-btn main-button next-btn back-light-animation`}
                  onClick={() => {
                    nextStep();
                  }}
                >
                  {t.cart.next}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
