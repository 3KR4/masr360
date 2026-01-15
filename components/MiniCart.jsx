"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useCart from "@/hooks/client/useCart";
import { IoIosCloseCircle } from "react-icons/io";
import useTranslate from "@/Contexts/useTranslation";

function MiniCart() {
  const { favorites, getItemPrice, grandTotal, removeItem } = useCart();
  const t = useTranslate();

  return (
    <div className="cartMenu menu">
      {favorites.length === 0 ? (
        <>
          <h4 className="top forEmpety">{t.cart.emptyCart}</h4>
          <p>{t.cart.emptyMessage}</p>
        </>
      ) : (
        <>
          <h4 className="top">
            {t.cart.itemsInCart.replace("{count}", favorites.length)}
          </h4>
          <div className="holder">
            {favorites.map((item) => (
              <div key={item?.id} className="item">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  width={64}
                  height={60}
                />
                <div className="info">
                  <Link className="ellipsis" href={`/market/${item?.id}`}>
                    {item?.name}
                  </Link>

                  <div className="price-holder">
                    <p className={item?.sale > 0 ? "on-sale" : "regular-price"}>
                      <span className="new-price">
                        ${getItemPrice(item).toFixed(2)}
                      </span>
                      {item?.sale > 0 && (
                        <span className="discount">
                          -{item?.sale}% {t.cart.discount}
                        </span>
                      )}
                    </p>
                  </div>
                  <span>
                    {t.cart.quantityLabel} x{item?.quantity}{" "}
                  </span>
                </div>
                <IoIosCloseCircle
                  className="remove"
                  onClick={() => removeItem(item?.id)}
                />
              </div>
            ))}
          </div>

          <div className="total">
            <span>{t.cart.totalPrice}</span>
            <strong>${grandTotal.toFixed(2)}</strong>
          </div>
          <div className="btns">
            <Link className="main-button forcart" href={`/cart`}>
              {t.cart.viewCart}
            </Link>
            <Link className="main-button" href={`/cart?Checkout=true`}>
              {t.cart.checkout}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default MiniCart;
