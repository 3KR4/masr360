"use client";

import React, { Suspense, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheck, FaHeadset, FaHome, FaArrowRight, FaArrowLeft, FaListUl } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import { useAuth } from "@/Contexts/AuthContext";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/pages/order-success.css";

function SupportSuccessContent() {
  const { locale } = useContext(mainContext);
  const { isAuthenticated } = useAuth();
  const t = useTranslate();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId");
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
          {isAr ? "تم استلام رسالتك بنجاح!" : "Support Ticket Received!"}
        </h1>

        <p className="order-success-desc">
          {isAr
            ? "شكراً لتواصلك مع Masr360! تم استلام شكواك / استفسارك بنجاح وسيقوم فريق الدعم الفني بمراجعتها والتواصل معك عبر وسيلة الاتصال التي حددتها في أقرب وقت."
            : "Thank you for contacting Masr360! Your ticket has been received and our support team will review it and get in touch with you via your chosen contact method shortly."}
        </p>

        {/* Ticket Reference Badge */}
        {ticketId && (
          <div className="order-success-badge-container">
            <span>{isAr ? "رقم التذكرة:" : "Ticket Reference:"}</span>
            <strong>#{String(ticketId).slice(-8).toUpperCase()}</strong>
          </div>
        )}

        {/* Action Buttons */}
        <div className="order-success-actions">
          {isAuthenticated ? (
            <>
              {/* Button 1: View Tickets List */}
              <Link href="/support?tab=my_tickets" className="btn-success-primary">
                <FaListUl />
                <span>{isAr ? "رؤية قائمة التذاكر" : "View Tickets List"}</span>
              </Link>

              {/* Button 2: Return to Homepage */}
              <Link href="/" className="btn-success-secondary">
                <FaHome />
                <span>{isAr ? "العودة للهوم" : "Back to Home"}</span>
                {isAr ? <FaArrowLeft size={12} /> : <FaArrowRight size={12} />}
              </Link>
            </>
          ) : (
            <>
              {/* Button 1: Submit another ticket */}
              <Link href="/support" className="btn-success-primary">
                <FaHeadset />
                <span>{isAr ? "إرسال طلب آخر" : "Submit Another Ticket"}</span>
              </Link>

              {/* Button 2: Return to Homepage */}
              <Link href="/" className="btn-success-secondary">
                <FaHome />
                <span>{isAr ? "العودة للهوم" : "Back to Home"}</span>
                {isAr ? <FaArrowLeft size={12} /> : <FaArrowRight size={12} />}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SupportSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="order-success-wrapper container">
          <div className="loader" style={{ margin: "60px auto" }} />
        </div>
      }
    >
      <SupportSuccessContent />
    </Suspense>
  );
}
