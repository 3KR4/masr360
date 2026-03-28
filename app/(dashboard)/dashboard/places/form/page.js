"use client";
import React, { useState, useContext, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import Tickets from "@/components/dashboard/forms/Tickets";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";
import { useNotification } from "@/Contexts/NotificationContext";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";
import { useSearchParams } from "next/navigation";
import { getOne, update } from "@/services/places/places.service";
import {
  govsEn,
  govsAr,
  tourismCategoriesEn,
  tourismCategoriesAr,
} from "@/data";

export default function CreatePlace() {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const { setisSubmited, images, setImages, specifications } = useContext(forms);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mapLocation: {
        link: "",
        iFrame: "",
      },
    },
  });

  // ----------------- State -----------------
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGov, setSelectedGov] = useState(null);
    const [loadingContent, setLoadingContent] = useState(false);
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [translationErrors, setTranslationErrors] = useState({});
  const [oldImage, setOldImage] = useState(null);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { addNotification } = useNotification();
  const [translations, setTranslations] = useState({
    EN: { title: "", description: "" },
    AR: { title: "", description: "" },
  });

  const handleTranslationChange = (field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [curentCreateLocale]: {
        ...prev[curentCreateLocale],
        [field]: value,
      },
    }));
    setTranslationErrors((prev) => ({
      ...prev,
      [`${curentCreateLocale}.${field}`]: null,
    }));
  };

  // ----------------- Data -----------------
  const govs = locale === "EN" ? govsEn : govsAr;
  const tourismCategories =
    locale === "EN" ? tourismCategoriesEn : tourismCategoriesAr;

  const subCategories = selectedCategory?.subcategories || [];



    useEffect(() => {
    if (!editId) return;

    const fetchPlaces = async () => {
      try {
        setLoadingContent(true);

        const res = await getOne(editId);
        const place = res.data

        console.log(place);
        

        if (!place) {
          throw new Error("Place data is missing");
        }

        const formatTranslation = (translation) => ({
          title: translation?.title ?? translation?.name ?? place.name ?? "",
          description: translation?.description ?? translation?.desc ?? place.desc ?? "",
        });

        const translationsData = place.translations || {};

        // set translations
        setTranslations({
          EN: formatTranslation(translationsData.EN),
          AR: formatTranslation(translationsData.AR),
        });

        // Fill location fields when edit data uses flat strings or nested object
        setValue(
          "mapLocation.link",
          place.location?.link || place.location || ""
        );
        setValue(
          "mapLocation.iFrame",
          place.location?.iFrame || place.locationIframe || ""
        );

        // Set category option if the API returns expanded data
        const categoryOption = tourismCategories.find(
          (cat) =>
            cat.id === place.category ||
            cat.name === place.category ||
            cat.name === place.category?.name
        );
        if (categoryOption) {
          setSelectedCategory(categoryOption);
          const selectedSub = categoryOption.subcategories?.find(
            (sub) =>
              sub.id === place.subCategory ||
              sub.name === place.subCategory ||
              sub.name === place.subCategory?.name
          );
          if (selectedSub) {
            setSelectedSubCategory(selectedSub);
          }
        }

        // Set governorate option from static values
        const govLabel =
          locale === "EN"
            ? place.governorate?.name
            : place.governorate?.translations?.AR?.name || place.governorate?.name;
        const govOption = govs
          .map((g, i) => ({ id: i, name: g }))
          .find((gov) => gov.name === govLabel);
        if (govOption) {
          setSelectedGov(govOption);
        }

        // Use image data if available
        const existingImage = place.img || place.imgs?.[0] || place.imgs;
        if (existingImage) {
          const image = Array.isArray(existingImage)
            ? existingImage[0]
            : existingImage;
          setImages([image]);
          setOldImage(image);
        }
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Something went wrong ❌",
        });
      } finally {
        setLoadingContent(false);
      }
    };

    fetchPlaces();
  }, [editId, addNotification, govs, locale, setImages, setValue, tourismCategories]);


  // ----------------- Submit -----------------
  const onSubmit = (data) => {
    
    setisSubmited(true);
    setLoadingSubmit(true);

    const validationErrors = {};
    if (!translations.EN.title.trim()) {
      validationErrors.enTitle = t.dashboard.forms.errors.titleRequired;
    }
    if (!translations.AR.title.trim()) {
      validationErrors.arTitle = t.dashboard.forms.errors.titleRequired;
    }

    if (Object.keys(validationErrors).length) {
      setTranslationErrors(validationErrors);
      setLoadingSubmit(false);
      return;
    }

    const finalData = {
      category: selectedCategory?.id || null,
      subCategory: selectedSubCategory?.id || null,
      governorate: selectedGov?.id || null,
      translations: {
        EN: translations.EN,
        AR: translations.AR,
      },
      specifications: specifications.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
      location: data.mapLocation?.link || "",
      locationiframe: data.mapLocation?.iFrame || "",
      locationIframe: data.mapLocation?.iFrame || "",
    };

    const buildFormData = (payload) => {
      const formData = new FormData();

      if (payload.category) formData.append("category", payload.category);
      if (payload.subCategory) formData.append("subCategory", payload.subCategory);
      if (payload.governorate) formData.append("governorate", payload.governorate);
      formData.append("translations", JSON.stringify(payload.translations));

      if (Object.keys(payload.specifications).length) {
        formData.append("specifications", JSON.stringify(payload.specifications));
      }

      if (payload.location) formData.append("location", payload.location);
      if (payload.locationiframe) formData.append("locationiframe", payload.locationiframe);
      if (payload.locationIframe) formData.append("locationIframe", payload.locationIframe);

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("imgs", image);
        }
      });

      return formData;
    };

    const saveToAPI = async () => {
      try {
        if (!editId) {
        throw new Error("Edit ID is required for updating a place.");
      }

      const payload = buildFormData(finalData);
      const response = await update(editId, payload);

      addNotification({
        type: "success",
        message: "تم تحديث المكان بنجاح ✅",
      });

        console.log("Response:", response);
      } catch (error) {
        console.error("Error:", error);
        addNotification({
          type: "error",
          message: error.response?.data?.message || "حدث خطأ ❌",
        });
      } finally {
        setLoadingSubmit(false);
      }
    };

    saveToAPI();
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ----------------- Title ----------------- */}
        <div className="row-holder two-column">
          <div className="box forInput">
            <label htmlFor="title">{t.dashboard.forms.title}</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  id="title"
                  value={translations[curentCreateLocale].title}
                  onChange={(e) =>
                    handleTranslationChange("title", e.target.value)
                  }
                  placeholder={t.dashboard.forms.titlePlaceholder}
                />
              </div>
              {(translationErrors.enTitle && curentCreateLocale === "EN") ||
              (translationErrors.arTitle && curentCreateLocale === "AR") ? (
                <span className="error">
                  <CircleAlert />
                  {curentCreateLocale === "EN"
                    ? translationErrors.enTitle
                    : translationErrors.arTitle}
                </span>
              ) : null}
            </div>
          </div>

          {/* ----------------- Governorate ----------------- */}
          <SelectOptions
            label={t.dashboard.forms.governorate}
            placeholder={t.dashboard.forms.selectGovernorate}
            options={govs.map((g, i) => ({ id: i, name: g }))}
            value={selectedGov}
            onChange={(gov) => setSelectedGov(gov)}
          />
        </div>

        {/* ----------------- Category & Subcategory ----------------- */}
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

        {/* ----------------- Description ----------------- */}
        <div className="box forInput">
          <label htmlFor="description">{t.dashboard.forms.description}</label>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="description"
                value={translations[curentCreateLocale].description}
                onChange={(e) =>
                  handleTranslationChange("description", e.target.value)
                }
                placeholder={t.dashboard.forms.descriptionPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* ----------------- Google Maps ----------------- */}
        <div className="row-holder two-column">
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
                  {...register("mapLocation.link", {
                    required: t.dashboard.forms.errors.googleMapsLinkRequired,
                    pattern: {
                      value: /^https?:\/\/(www\.)?maps\.app\.goo\.gl\/.+$/i,
                      message: t.dashboard.forms.errors.googleMapsLinkInvalid,
                    },
                  })}
                />
              </div>
              {errors?.mapLocation?.link && (
                <span className="error">
                  <CircleAlert />
                  {errors.mapLocation.link.message}
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
                  {...register("mapLocation.iFrame", {
                    required: t.dashboard.forms.errors.googleMapsIframeRequired,
                    pattern: {
                      value:
                        /^https/i,
                      message: t.dashboard.forms.errors.googleMapsIframeInvalid,
                    },
                  })}
                />
              </div>
              {errors?.mapLocation?.iFrame && (
                <span className="error">
                  <CircleAlert />
                  {errors.mapLocation.iFrame.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ----------------- Tickets & Images ----------------- */}
        <div className="row-holder two-column">
          <Tickets />
          <Images />
        </div>

        {/* ----------------- Submit ----------------- */}
        <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loadingSubmit}
          submitLabel={t.dashboard.forms.createPlace}
        />
      </form>
    </div>
  );
}
