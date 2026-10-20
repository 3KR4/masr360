"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import "@/styles/pages/support.css";
import "@/styles/dashboard/forms.css";

import useTranslate from "@/Contexts/useTranslation";

import { CircleAlert } from "lucide-react";

import { GrTechnology } from "react-icons/gr";
import { FaRegUser, FaWhatsapp } from "react-icons/fa";
import { TbCashRegister } from "react-icons/tb";
import { FaRegCommentDots } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { LuLayoutGrid } from "react-icons/lu";

/* ================== DATA ================== */

const problemCategories = [
  { id: "technical", icon: <GrTechnology /> },
  { id: "account", icon: <FaRegUser /> },
  { id: "payment", icon: <TbCashRegister /> },
  { id: "suggestion", icon: <FaRegCommentDots /> },
  { id: "other", icon: <LuLayoutGrid /> },
];

const contactMethods = [
  { id: "whatsapp", icon: <FaWhatsapp /> },
  { id: "email", icon: <MdMailOutline /> },
  { id: "phone", icon: <FiPhone /> },
];

/* ================== COMPONENT ================== */

export default function Support() {
  const t = useTranslate();

  const [cat, setCat] = useState("");
  const [method, setMethod] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [contactError, setContactError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  /* ================== SUBMIT ================== */

  const onSubmit = (data) => {
    if (!cat || !method) return;

    setCategoryError("");
    setContactError("");

    const ticket = {
      id: crypto.randomUUID(),
      category: cat,
      description: data.description,
      contactMethod: method,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    console.log("Ticket Submitted:", ticket);

    reset();
    setCat("");
    setMethod("");
  };

  /* ================== UI ================== */

  return (
    <div className="support">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.support.hero_title}
          <hr />
        </h1>

        <p className="sub-title">{t.support.hero_subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="holder container">
        {/* ===== Categories ===== */}
        <div className="hold">
          <h4>{t.support.categories_title}</h4>
          <div className="grid">
            {problemCategories.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className={`option ${cat === item.id ? "active" : ""}`}
                onClick={() => {
                  setCat(item.id);
                  setCategoryError("");
                }}
              >
                {item.icon}
                <h5>{t.support.categories[item.id]}</h5>
              </div>
            ))}
          </div>
          <div className="grid second">
            {problemCategories.slice(3, 5).map((item) => (
              <div
                key={item.id}
                className={`option ${cat === item.id ? "active" : ""}`}
                onClick={() => {
                  setCat(item.id);
                  setCategoryError("");
                }}
              >
                {item.icon}
                <h5>{t.support.categories[item.id]}</h5>
              </div>
            ))}
          </div>
          {categoryError && (
            <span className="error">
              <CircleAlert size={14} />
              {categoryError}
            </span>
          )}
        </div>

        {/* ===== Description ===== */}
        <div className="hold">
          <h4>{t.support.description_title}</h4>

          {/* Title Field (without icon) */}
          <div className="box forInput support-field">
            <label htmlFor="support-title">
              {t.support.description_placeholder_title}
            </label>
            <div className="inputHolder">
              <div className="holder support-holder">
                <input
                  type="text"
                  id="support-title"
                  {...register("title", {
                    required: t.support.errors.title_required,
                    minLength: {
                      value: 5,
                      message: t.support.errors.title_minLength,
                    },
                  })}
                  placeholder={t.support.description_placeholder_title}
                />
              </div>
              {errors.title && (
                <span className="error">
                  <CircleAlert size={14} />
                  {errors.title.message}
                </span>
              )}
            </div>
          </div>

          {/* Description Textarea Field */}
          <div className="box forInput support-field">
            <label htmlFor="support-description">
              {t.support.description_placeholder_details}
            </label>
            <div className="inputHolder">
              <div className="holder textarea-holder support-holder">
                <textarea
                  id="support-description"
                  {...register("description")}
                  placeholder={t.support.description_placeholder_details}
                  rows={4}
                />
              </div>
              {errors.description && (
                <span className="error">
                  <CircleAlert size={14} />
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===== Contact Method ===== */}
        <div className="hold contact">
          <h4>{t.support.contact_title}</h4>
          <div className="grid">
            {contactMethods.map((item) => (
              <div
                key={item.id}
                className={`option ${method === item.id ? "active" : ""}`}
                onClick={() => {
                  setMethod(item.id);
                  setContactError("");
                }}
              >
                {item.icon}
                <h5>{t.support.contact_methods[item.id]}</h5>
              </div>
            ))}
          </div>
          {contactError && (
            <span className="error">
              <CircleAlert size={14} />
              {contactError}
            </span>
          )}
        </div>

        {/* ===== Submit Button ===== */}
        <button
          type="submit"
          className="main-button submit-btn"
          onClick={() => {
            if (!cat) setCategoryError(t.support.errors.category_required);
            if (!method) setContactError(t.support.errors.contact_required);
          }}
        >
          {cat
            ? cat === "other"
              ? t.support.submit_btn.other
              : `${t.support.submit_btn.default} (${t.support.categories[cat]})`
            : t.support.submit_btn.default}
        </button>
      </form>
    </div>
  );
}
