"use client";
import React, { useState, useContext } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";
import { FaCheck } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";

import {
  govsEn,
  govsAr,
  tourismCategoriesEn,
  tourismCategoriesAr,
} from "@/data";
export default function CreateNights() {
  const { setisSubmited, images, selectedCat } = useContext(forms);
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const tourismCategories =
    locale == "en" ? tourismCategoriesEn : tourismCategoriesAr;
  const govs = locale === "en" ? govsEn : govsAr;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedGov, setSelectedGov] = useState("");

  const subCategories = selectedCategory?.subcategories || [];

  // SUBMIT VALIDATION --------------------------------------

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      images: images,
      category: selectedCat,
      subCategory: selectedCat,
      Governorate: selectedCat,
    };
    console.log("FINAL DATA:", finalData);
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row-holder two-column">
          <div className="box forInput">
            <label htmlFor="title">{t.dashboard.forms.title}</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  id="title"
                  {...register("title", {
                    required: t.dashboard.forms.errors.titleRequired,
                    minLength: {
                      value: 3,
                      message: t.dashboard.forms.errors.titleMinLength,
                    },
                  })}
                  placeholder={t.dashboard.forms.titlePlaceholder}
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
            label={t.dashboard.forms.governorate}
            placeholder={t.dashboard.forms.selectGovernorate}
            options={govs.map((g, i) => ({ id: i, name: g }))}
            value={selectedGov}
            onChange={(gov) => setSelectedGov(gov)}
          />
        </div>

        <div className="row-holder two-column">
          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={tourismCategories}
            value={selectedCategory}
            onChange={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory(null);
            }}
          />
          <SelectOptions
            label={t.dashboard.forms.subCategory}
            placeholder={t.dashboard.forms.selectSubCategory}
            options={subCategories}
            value={selectedSubCategory}
            disabled={!selectedCategory}
            onChange={(sub) => setSelectedSubCategory(sub)}
          />
        </div>

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

        <div className="row-holder two-column">
          <div className="column-holder">
            <div className="box forInput">
              <label htmlFor="locationLink">
                {t.dashboard.forms.googleMapsLink}
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="url"
                    id="locationLink"
                    placeholder={t.dashboard.forms.googleMapsLinkPlaceholder}
                    {...register("location.link", {
                      required: t.dashboard.forms.errors.googleMapsLinkRequired,
                      pattern: {
                        value: /^https?:\/\/(www\.)?maps\.app\.goo\.gl\/.+$/i,
                        message: t.dashboard.forms.errors.googleMapsLinkInvalid,
                      },
                    })}
                  />
                </div>
                {errors?.location?.link && (
                  <span className="error">
                    <CircleAlert />
                    {errors.location.link.message}
                  </span>
                )}
              </div>
            </div>
            <div className="box forInput">
              <label htmlFor="locationIframe">
                {t.dashboard.forms.googleMapsIframe}
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="url"
                    id="locationIframe"
                    placeholder={t.dashboard.forms.googleMapsIframePlaceholder}
                    {...register("location.iFrame", {
                      required:
                        t.dashboard.forms.errors.googleMapsIframeRequired,
                      pattern: {
                        value:
                          /^https?:\/\/www\.google\.com\/maps\/embed\?pb=.*/i,
                        message:
                          t.dashboard.forms.errors.googleMapsIframeInvalid,
                      },
                    })}
                  />
                </div>
                {errors?.location?.iFrame && (
                  <span className="error">
                    <CircleAlert />
                    {errors.location.iFrame.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Images />
        </div>

        <button
          className="main-button"
          type="submit"
          onClick={() => setisSubmited(true)}
        >
          <span>{t.dashboard.forms.createNightPlace}</span>
        </button>
      </form>
    </div>
  );
}
