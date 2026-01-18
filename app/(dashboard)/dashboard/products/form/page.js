"use client";
import React, { useState, useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import "@/styles/dashboard/forms.css";

import Tags from "@/components/dashboard/forms/Tags";
import Images from "@/components/dashboard/forms/Images";
import Specs from "@/components/dashboard/forms/Specs";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";

import { forms } from "@/Contexts/forms";
import { tourismCategoriesEn, tourismCategoriesAr } from "@/data";
import useTranslate from "@/Contexts/useTranslation";

export default function CreateProduct() {
  const { locale } = useContext(mainContext);

  const t = useTranslate();

  const { setisSubmited, tags, images, specifications } = useContext(forms);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const tourismCategories =
    locale == "en" ? tourismCategoriesEn : tourismCategoriesAr;

  const [selectedCategory, setSelectedCategory] = useState(null);

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      tags,
      images,
      category: selectedCategory,
      specifications: specifications.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
    };

    console.log("FINAL DATA:", finalData);
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ---------- TITLE & CATEGORY ---------- */}
        <div className="row-holder two-column">
          <div className="box forInput">
            <label htmlFor="title">{t.dashboard.forms.title}</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  id="title"
                  type="text"
                  placeholder={t.dashboard.forms.titlePlaceholder}
                  {...register("title", {
                    required: t.dashboard.forms.errors.titleRequired,
                    minLength: {
                      value: 3,
                      message: t.dashboard.forms.errors.titleMin,
                    },
                  })}
                />
              </div>
              {errors.title && (
                <span className="error">
                  <CircleAlert />
                  {errors.title.message}
                </span>
              )}
            </div>
          </div>

          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={tourismCategories}
            value={selectedCategory}
            onChange={(cat) => {
              setSelectedCategory(cat);
            }}
          />
        </div>

        {/* ---------- STOCK / PRICE / SALE ---------- */}
        <div className="row-holder">
          <InputBox
            label={t.dashboard.forms.stock}
            placeholder={t.dashboard.forms.stockPlaceholder}
            error={errors.stock}
          >
            <input
              type="number"
              {...register("stock", {
                required: t.dashboard.forms.errors.stockRequired,
                min: {
                  value: 1,
                  message: t.dashboard.forms.errors.stockMin,
                },
              })}
            />
          </InputBox>

          <InputBox
            label={t.dashboard.forms.price}
            placeholder={t.dashboard.forms.pricePlaceholder}
            error={errors.price}
          >
            <input
              type="number"
              {...register("price", {
                required: t.dashboard.forms.errors.priceRequired,
                min: {
                  value: 1,
                  message: t.dashboard.forms.errors.priceMin,
                },
              })}
            />
          </InputBox>

          <InputBox
            label={t.dashboard.forms.sale}
            placeholder={t.dashboard.forms.salePlaceholder}
            error={errors.sale}
          >
            <input
              type="number"
              {...register("sale", {
                validate: (v) =>
                  v === "" || v <= 90 || t.dashboard.forms.errors.saleMax,
              })}
            />
          </InputBox>
        </div>

        {/* ---------- DESCRIPTION ---------- */}
        <div className="box forInput">
          <label htmlFor="description">{t.dashboard.forms.description}</label>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="description"
                {...register("description")}
                placeholder={t.dashboard.forms.descriptionPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* ---------- TAGS / SPECS / IMAGES ---------- */}
        <div className="row-holder two-column">
          <div className="column-holder">
            <Tags />
            <Specs />
          </div>
          <Images />
        </div>

        {/* ---------- SUBMIT ---------- */}
        <button
          type="submit"
          className="main-button"
          onClick={() => setisSubmited(true)}
        >
          <span>{t.dashboard.forms.createProduct}</span>
        </button>
      </form>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function InputBox({ label, placeholder, error, children }) {
  return (
    <div className="box forInput">
      <label>{label}</label>
      <div className="inputHolder">
        <div className="holder">
          {React.cloneElement(children, { placeholder })}
        </div>
        {error && (
          <span className="error">
            <CircleAlert />
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
}
