"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import "@/styles/pages/support.css";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/forms.css";
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
  { id: "technical", label: "Technical Issue", icon: <GrTechnology /> },
  { id: "account", label: "Account Problem", icon: <FaRegUser /> },
  { id: "payment", label: "Payment Issue", icon: <TbCashRegister /> },
  { id: "suggestion", label: "Suggestion", icon: <FaRegCommentDots /> },
  { id: "other", label: "something else", icon: <LuLayoutGrid /> },
];

const contactMethods = [
  { id: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
  { id: "email", label: "Email", icon: <MdMailOutline /> },
  { id: "phone", label: "Phone Call", icon: <FiPhone /> },
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
          need a help ?!
          <hr />
        </h1>

        <p className="sub-title">
          you can choose one of the problem types and describe it, then select a
          contact method
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="holder container">
        {/* ===== Categories ===== */}
        <div className="hold">
          <h4>problem categories</h4>
          <div className="grid ">
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
                <h5>{item.label}</h5>
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
                <h5>{item.label}</h5>
              </div>
            ))}
          </div>
          {categoryError && (
            <span className="error">
              <CircleAlert />
              {categoryError}
            </span>
          )}
        </div>

        {/* ===== Description ===== */}
        <div className="hold">
          <h4>type your problem</h4>
          <div className="box forInput">
            <div className="inputHolder">
              <div className="holder">
                <input
                  {...register("title", {
                    required: "problem title is required",
                    minLength: {
                      value: 5,
                      message: "Minimum 5 characters",
                    },
                  })}
                  placeholder={
                    t.dashboard.forms.titlePlaceholder || "your problem type"
                  }
                />
              </div>
            </div>
          </div>
          <div className="box forInput">
            <div className="inputHolder">
              <div className="holder">
                <textarea
                  id="description"
                  placeholder={t.dashboard.forms.descriptionPlaceholder}
                />
              </div>
            </div>
          </div>
          {errors.title && (
            <span className="error">
              <CircleAlert />
              {errors.title.message}
            </span>
          )}
        </div>

        {/* ===== Contact Method ===== */}
        <div className="hold contact">
          <h4>choose the contact method</h4>
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
                <h5>{item.label}</h5>
              </div>
            ))}
          </div>
          {contactError && (
            <span className="error">
              <CircleAlert />
              {contactError}
            </span>
          )}
        </div>

        {/* ===== Submit Error ===== */}

        <button
          type="submit"
          className="main-button submit-btn"
          onClick={() => {
            if (!cat) {
              setCategoryError("Please select your problem type");
            }
            if (!method) {
              setContactError("Please select your contact method");
            }
          }}
        >
          Submit your{" "}
          {cat == "other"
            ? "problem"
            : cat
            ? problemCategories.find((x) => x.id == cat).label
            : "problem"}
        </button>
      </form>
    </div>
  );
}
