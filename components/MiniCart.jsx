"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useCart from "@/hooks/client/useCart";
import { IoIosCloseCircle } from "react-icons/io";

function MiniCart() {
  const { favorites, getItemPrice, grandTotal, removeItem } = useCart();

  return (
    <div className="cartMenu menu">
      {favorites.length === 0 ? (
        <>
          <h4 className="top forEmpety">Your cart is empty</h4>
          <p>
            Add some products you love — they’ll show up here when you’re ready
            to check out!
          </p>
        </>
      ) : (
        <>
          <h4 className="top">
            you have {favorites.length} items in your cart
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
                        <span className="discount">-{item?.sale}% OFF</span>
                      )}
                    </p>
                  </div>
                  <span>qty: x{item?.quantity} </span>
                </div>
                <IoIosCloseCircle
                  className="remove"
                  onClick={() => removeItem(item?.id)}
                />
              </div>
            ))}
          </div>

          <div className="total">
            <span>Total preice :</span>
            <strong>${grandTotal.toFixed(2)}</strong>
          </div>
          <div className="btns">
            <Link className="main-button forcart" href={`/cart`}>
              View Cart
            </Link>
            <Link className="main-button" href={`/cart?Checkout=true`}>
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default MiniCart;
