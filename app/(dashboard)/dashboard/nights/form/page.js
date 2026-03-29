"use client";
import React, { useState, useContext, useEffect, useMemo } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import {
  create,
  update,
  getOne,
  removeImage,
} from "@/services/nights/nights.service";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";
import { FaCheck } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import { useNotification } from "@/Contexts/NotificationContext";

import {
  tourismCategoriesEn,
  tourismCategoriesAr,
} from "@/data";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";
import { useSearchParams, useRouter } from "next/navigation";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
export default function CreateNights() {
  const { setisSubmited, images, setImages } = useContext(forms);
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: {
        link: "",
        iFrame: "",
      },
    },
  });
  const tourismCategories =
    locale == "EN" ? tourismCategoriesEn : tourismCategoriesAr;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGov, setSelectedGov] = useState(null);
  const [governorateOptions, setGovernorateOptions] = useState([]);
  const filteredGovernorateOptions = useMemo(
    () => (governorateOptions.length > 0 ? governorateOptions : []),
    [governorateOptions]
  );
  const [loadingContent, setLoadingContent] = useState(false);
  const [oldImage, setOldImage] = useState(null);
  const { addNotification } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");
  const [translationErrors, setTranslationErrors] = useState({});

  const TEST_CATEGORY_ID = "6984f12c888f9d5d903f3a9a";
  const TEST_GOVERNORATE_ID = "699f4cb48c0b04cebf3b52cb";

  const subCategories = selectedCategory?.subcategories || [];

  const [translations, setTranslations] = useState({
    EN: { name: "", desc: "" },
    AR: { name: "", desc: "" },
  });

  const handleChange = (field, value) => {
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


  // GET ONE NIGHT --------------------------------------

    useEffect(() => {
    const loadGovernorates = async () => {
      try {
        const res = await getGovernorates("", 1, 200, locale);
        const governoratesData =
          res.data?.[0]?.data || res.data?.data || res.data || [];
        const options = Array.isArray(governoratesData)
          ? governoratesData.map((gov) => ({
              id: gov._id,
              name: gov.translations?.[locale]?.name || gov.name || "",
              raw: gov,
            }))
          : [];
        setGovernorateOptions(options);
      } catch (err) {
        console.error("Error loading governorates:", err);
        setGovernorateOptions([]);
      }
    };

    loadGovernorates();

    if (!editId) return;

    const fetchNight = async () => {
        try {
          setLoadingContent(true);
  
          const res = await getOne(editId);
          const gov = res.data?.night || res.data;

          if (!gov) {
            throw new Error("Night data not found");
          }

          // set translations
          setTranslations({
            EN: gov.translations?.EN || { name: gov.name, desc: gov.desc },
            AR: gov.translations?.AR || { name: gov.name, desc: gov.desc },
          });

          setValue("location.link", gov.location);
          setValue(
            "location.iFrame",
            gov.location?.iFrame || gov.locationIframe || "",
          );

          const categoryOption = tourismCategories.find(
            (item) =>
              String(item.id) === String(gov.category) ||
              String(item.name) === String(gov.category) ||
              String(item.name) === String(gov.category?.name),
          );
          if (categoryOption) {
            setSelectedCategory(categoryOption);

            const subCategoryOption = categoryOption.subcategories?.find(
              (sub) =>
                String(sub.id) === String(gov.subCategory) ||
                String(sub.name) === String(gov.subCategory) ||
                String(sub.name) === String(gov.subCategory?.name),
            );
            if (subCategoryOption) {
              setSelectedSubCategory(subCategoryOption);
            }
          }

          const govOption = filteredGovernorateOptions.find(
            (item) =>
              String(item.id) === String(gov.governorate) ||
              item.name === gov.governorate ||
              item.name === gov.governorate?.name ||
              item.name === gov.governorate?.translations?.[locale]?.name,
          );
          if (govOption) {
            setSelectedGov(govOption);
          }

          const existingImages = gov.imgs || (gov.img ? [gov.img] : undefined);
          if (existingImages?.length) {
            setImages(existingImages);
            setOldImage(existingImages[0]);
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
  
      fetchNight();
  }, [editId, addNotification, setImages, locale, setValue, tourismCategories, filteredGovernorateOptions]);
  // SUBMIT VALIDATION --------------------------------------

  const onSubmit = async (data) => {
    setisSubmited(true);
    setLoadingSubmit(true);

    const validationErrors = {};
    if (!translations.EN.name?.trim()) {
      validationErrors["EN.name"] = t.dashboard.forms.errors.titleRequired;
    }
    if (!translations.EN.desc?.trim()) {
      validationErrors["EN.desc"] = t.dashboard.forms.errors.descriptionRequired || t.dashboard.forms.errors.descriptionRequired || "Description is required";
    }
    if (!translations.AR.name?.trim()) {
      validationErrors["AR.name"] = t.dashboard.forms.errors.titleRequired;
    }
    if (!translations.AR.desc?.trim()) {
      validationErrors["AR.desc"] = t.dashboard.forms.errors.descriptionRequired || t.dashboard.forms.errors.descriptionRequired || "Description is required";
    }

    if (Object.keys(validationErrors).length) {
      setTranslationErrors(validationErrors);
      setLoadingSubmit(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", translations.EN.name);
      formData.append("desc", translations.EN.desc || "");
      formData.append(
        "translations",
        JSON.stringify({
          EN: translations.EN,
          AR: translations.AR,
        }),
      );

      formData.append(
        "category",
        selectedCategory?.id || TEST_CATEGORY_ID,
      );
      if (selectedSubCategory?.id) {
        formData.append("subCategory", selectedSubCategory.id);
      }
      formData.append(
        "governorate",
        selectedGov?.id || TEST_GOVERNORATE_ID,
      );

      if (data.location?.link) {
        formData.append("location", data.location.link);
      }
      if (data.location?.iFrame) {
        formData.append("locationIframe", data.location.iFrame);
      }

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("imgs", image);
        }
      });

      if (editId) {
        await update(editId, formData);
        addNotification({
          type: "success",
          message: "Night updated successfully",
        });
      } else {
        await create(formData);
        addNotification({
          type: "success",
          message: "Night created successfully",
        });
      }

      router.push("/dashboard/nights");
      setImages([]);
      setisSubmited(false);
    } catch (error) {
      console.error("Failed to submit night:", error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row-holder two-column">
          <div className="box forInput">
          <label htmlFor="title">
            {t.dashboard.forms.title} ({curentCreateLocale})
          </label>
          <div className="inputHolder">
            <div className="holder">
              <input
                type="text"
                id="title"
                value={translations[curentCreateLocale]?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={`${t.dashboard.forms.titlePlaceholder} (${curentCreateLocale})`}
              />
            </div>
            {translationErrors[`${curentCreateLocale}.name`] && (
              <span className="error">
                <CircleAlert />
                {translationErrors[`${curentCreateLocale}.name`]}
              </span>
            )}
          </div>
          </div>

          <SelectOptions
            label={t.dashboard.forms.governorate}
            placeholder={t.dashboard.forms.selectGovernorate}
            options={filteredGovernorateOptions}
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
          <label htmlFor="description">
            {t.dashboard.forms.description} ({curentCreateLocale})
          </label>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="description"
                value={translations[curentCreateLocale]?.desc || ""}
                onChange={(e) => handleChange("desc", e.target.value)}
                placeholder={`${t.dashboard.forms.descriptionPlaceholder} (${curentCreateLocale})`}
              />
            </div>
            {translationErrors[`${curentCreateLocale}.desc`] && (
              <span className="error">
                <CircleAlert />
                {translationErrors[`${curentCreateLocale}.desc`]}
              </span>
            )}
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
                        value: /^https?:/i,
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

        <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loadingSubmit}
          editId={editId}
          submitLabel={t.dashboard.forms.createNightPlace}
        />
      </form>
    </div>
  );
}
