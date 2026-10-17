"use client";

import React, { Suspense, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheck, FaReceipt, FaStore, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/pages/order-success.css";

function OrderSuccessContent() {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const isAr = locale === "AR";

  return (
    <div className="order-success-wrapper container">
      <div className="order-success-card">
        {/* Animated Checkmark Icon */}
        <div className="order-success-icon-wrap">
          <div className="order-success-ring" />
          <div className="order-success-icon-bg">
            <FaCheck />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="order-success-title">
          {isAr ? "تم تأكيد طلبك بنجاح!" : "Order Placed Successfully!"}
        </h1>

        <p className="order-success-desc">
          {isAr
            ? "شكراً لتسوقك من Masr360! تم استلام طلبك بنجاح وجاري الآن مراجعته وتجهيزه للتوصيل إلى عنوانك."
            : "Thank you for shopping with Masr360! Your order has been placed and is currently being processed for delivery."}
        </p>

        {/* Order ID Reference Badge */}
        {orderId && (
          <div className="order-success-badge-container">
            <span>{isAr ? "رقم الطلب:" : "Order Reference:"}</span>
            <strong>#{String(orderId).slice(-8).toUpperCase()}</strong>
          </div>
        )}

        {/* The Two Action Buttons */}
        <div className="order-success-actions">
          {/* Button 1: Go to Orders Page */}
          <Link href="/orders" className="btn-success-primary">
            <FaReceipt />
            <span>{isAr ? "عرض طلباتي" : "View My Orders"}</span>
          </Link>

          {/* Button 2: Go to Marketplace to Browse Again */}
          <Link href="/marketplace" className="btn-success-secondary">
            <FaStore />
            <span>{isAr ? "تصفح السوق ثانية" : "Continue Shopping"}</span>
            {isAr ? <FaArrowLeft size={12} /> : <FaArrowRight size={12} />}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="order-success-wrapper container">
          <div className="loader" style={{ margin: "60px auto" }} />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
