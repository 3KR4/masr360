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
import { mainContext } from "@/Contexts/mainContext";
import { useNotification } from "@/Contexts/NotificationContext";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";
import { useSearchParams, useRouter } from "next/navigation";

function unwrapNightGetOneResponse(data) {
  return data?.night || data?.data?.night || data?.data || data;
}

function normalizeMapEmbedValue(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";

  const srcMatch = rawValue.match(/src=["']([^"']+)["']/i);
  if (srcMatch?.[1]) {
    return srcMatch[1].trim();
  }

  return rawValue;
}

export default function CreateNights() {
  const { setisSubmited, images, setImages } = useContext(forms);
  const t = useTranslate();
  const { locale, governorates, nightCategories, referenceDataLoading } =
    useContext(mainContext);
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      location: {
        link: "",
        iFrame: "",
      },
    },
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGov, setSelectedGov] = useState(null);
  const [governorateOptions, setGovernorateOptions] = useState([]);
  const filteredGovernorateOptions = useMemo(
    () => (governorateOptions.length > 0 ? governorateOptions : []),
    [governorateOptions],
  );

  const [categoryOptions, setCategoryOptions] = useState([]);
  const filteredCategoryOptions = useMemo(
    () => (categoryOptions.length > 0 ? categoryOptions : []),
    [categoryOptions],
  );
  const [, setLoadingContent] = useState(false);
  const [oldImages, setOldImages] = useState([]);
  const { addNotification } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");
  const [translationErrors, setTranslationErrors] = useState({});


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
    if (field === "name") {
      setTranslationErrors((prev) => ({
        ...prev,
        enTitle: null,
        arTitle: null,
      }));
    } else if (field === "desc") {
      setTranslationErrors((prev) => ({
        ...prev,
        enDescription: null,
        arDescription: null,
      }));
    }
  };

  // GET ONE NIGHT --------------------------------------

  useEffect(() => {
    const localeKey = String(locale || "EN").toUpperCase();

    setGovernorateOptions(
      Array.isArray(governorates)
        ? governorates.map((gov) => ({
            id: gov._id,
            name: gov.translations?.[localeKey]?.name || gov.name || "",
            raw: gov,
          }))
        : [],
    );

    setCategoryOptions(
      Array.isArray(nightCategories)
        ? nightCategories.map((cat) => ({
            id: cat._id || cat.id,
            name: cat.translations?.[localeKey]?.name || cat.name,
            subcategories: (cat.subCategories || cat.subcategories || []).map(
              (sub) => ({
                id: sub._id || sub.id,
                name: sub.translations?.[localeKey]?.name || sub.name,
                raw: sub,
              }),
            ),
            raw: cat,
          }))
        : [],
    );
  }, [governorates, nightCategories, locale]);

  useEffect(() => {
    if (!editId) {
      setImages([]);
      setTranslations({
        EN: { name: "", desc: "" },
        AR: { name: "", desc: "" },
      });
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedGov(null);
      setValue("location.link", "");
      setValue("location.iFrame", "");
      setOldImages([]);
    }
  }, [editId, setImages, setValue]);

  useEffect(() => {
    if (!editId) return;

    const fetchNight = async () => {
      try {
        setLoadingContent(true);

        const res = await getOne(editId);
        const night = unwrapNightGetOneResponse(res.data);

        if (!night) {
          throw new Error("Night data not found");
        }

        const formatTranslation = (translation) => ({
          name: translation?.name ?? night?.name ?? "",
          desc:
            translation?.desc ?? translation?.description ?? night?.desc ?? "",
        });

        // set translations
        setTranslations({
          EN: formatTranslation(night.translations?.EN),
          AR: formatTranslation(night.translations?.AR),
        });

        const locationLink =
          typeof night.location === "string"
            ? night.location
            : night.location?.link || "";

        setValue("location.link", locationLink);
        setValue(
          "location.iFrame",
          night.location?.iFrame || night.locationIframe || "",
        );

        const categoryOption = filteredCategoryOptions.find(
          (item) =>
            String(item.id) === String(night.category) ||
            String(item.id) === String(night.category?._id) ||
            String(item.name) === String(night.category) ||
            String(item.name) === String(night.category?.name),
        );
        if (categoryOption) {
          setSelectedCategory(categoryOption);

          const subCategoryOption = categoryOption.subcategories?.find(
            (sub) =>
              String(sub.id) === String(night.subCategory) ||
              String(sub.id) === String(night.subCategory?._id) ||
              String(sub.name) === String(night.subCategory) ||
              String(sub.name) === String(night.subCategory?.name),
          );
          if (subCategoryOption) {
            setSelectedSubCategory(subCategoryOption);
          }
        }

        const govOption = filteredGovernorateOptions.find(
          (item) =>
            String(item.id) === String(night.governorate) ||
            String(item.id) === String(night.governorate?._id) ||
            item.name === night.governorate ||
            item.name === night.governorate?.name ||
            item.name ===
              night.governorate?.translations?.[
                String(locale || "EN").toUpperCase()
              ]?.name,
        );
        if (govOption) {
          setSelectedGov(govOption);
        }

        const existingImages = Array.isArray(night.imgs)
          ? night.imgs
          : night.img
            ? [night.img]
            : [];
        if (existingImages.length) {
          setImages(existingImages);
          setOldImages(existingImages);
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
  }, [
    editId,
    addNotification,
    setImages,
    locale,
    setValue,
    filteredCategoryOptions,
    filteredGovernorateOptions,
  ]);
  // ----------------- Validation (runs on button click) -----------------
  const handleClickSubmit = async () => {
    setisSubmited(true);

    const hasImage = images.some(Boolean);
    const rhfValid = await trigger(["location.link", "location.iFrame"]);

    const customErrors = {};
    if (!translations.EN.name.trim()) {
      customErrors.enTitle =
        t.dashboard.forms.errors?.titleRequired || "English title is required";
    }
    if (!translations.EN.desc.trim()) {
      customErrors.enDescription =
        t.dashboard.forms.errors?.descriptionRequired ||
        "English description is required";
    }
    if (!selectedGov?.id) {
      customErrors.governorate =
        t.dashboard.forms.errors?.governorateRequired || "Governorate is required";
    }
    if (!selectedCategory?.id) {
      customErrors.category =
        t.dashboard.forms.errors?.categoryRequired || "Category is required";
    }
    if (!hasImage) {
      customErrors.images = "At least one image is required";
    }

    setTranslationErrors(customErrors);

    if (!rhfValid || Object.keys(customErrors).length) return;

    handleSubmit(onSubmit)();
  };

  // ----------------- Submit (only runs when all validation passes) -----------------
  const onSubmit = (data) => {
    setLoadingSubmit(true);

    const selectedCategoryId = selectedCategory?.id;
    const selectedSubCategoryId = selectedSubCategory?.id;
    const selectedGovernorateId = selectedGov?.id;

    const finalData = {
      name: translations.EN.name,
      desc: translations.EN.desc,
      category: selectedCategoryId,
      subCategory: selectedSubCategoryId,
      governorate: selectedGovernorateId,
      translations: {
        EN: translations.EN,
        AR: translations.AR,
      },
      location: data.location?.link || "",
      locationIframe: normalizeMapEmbedValue(data.location?.iFrame),
    };

    const buildFormData = (payload) => {
      const formData = new FormData();

      if (payload.name !== undefined) formData.append("name", payload.name);
      if (payload.desc !== undefined) formData.append("desc", payload.desc);
      if (payload.subCategory) {
        formData.append("subCategory", payload.subCategory);
        if (editId && payload.category) formData.append("category", payload.category);
      } else if (payload.category) {
        formData.append("category", payload.category);
      }
      if (payload.governorate) {
        formData.append("governorate", payload.governorate);
      }
      if (payload.translations) {
        formData.append("translations", JSON.stringify(payload.translations));
      }
      if (payload.location) formData.append("location", payload.location);
      if (payload.locationIframe) {
        formData.append("locationIframe", payload.locationIframe);
      }

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("imgs", image);
        }
      });

      return formData;
    };

    const saveToAPI = async () => {
      try {
        const formData = buildFormData(finalData);

        if (editId) {
          await update(editId, formData);
          const currentImagePublicIds = new Set(
            images
              .filter(
                (image) => image && !(image instanceof File) && image.publicId,
              )
              .map((image) => image.publicId),
          );
          const removedImages = oldImages.filter(
            (image) =>
              image?.publicId && !currentImagePublicIds.has(image.publicId),
          );

          if (removedImages.length) {
            await Promise.all(
              removedImages.map((image) =>
                removeImage(image.publicId, "night", editId),
              ),
            );
          }
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
          message:
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            "Something went wrong",
        });
      } finally {
        setLoadingSubmit(false);
      }
    };

    saveToAPI();
  };
  return (
    <div className="body">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleClickSubmit();
        }}
      >
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
              {translationErrors.enTitle ? (
                <span className="error">
                  <CircleAlert />
                  {translationErrors.enTitle}
                </span>
              ) : null}
            </div>
          </div>

          <SelectOptions
            label={t.dashboard.forms.governorate}
            placeholder={t.dashboard.forms.selectGovernorate}
            options={filteredGovernorateOptions}
            value={selectedGov}
            loading={referenceDataLoading}
            error={translationErrors.governorate}
            onChange={(gov) => {
              setSelectedGov(gov);
              setTranslationErrors((prev) => ({ ...prev, governorate: null }));
            }}
          />
        </div>

        <div className="row-holder two-column">
          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={filteredCategoryOptions.map((cat) => ({
              ...cat,
              subcategories: undefined,
              _subcategories: cat.subcategories,
            }))}
            value={selectedCategory}
            loading={referenceDataLoading}
            onChange={(cat) => {
              setSelectedCategory({
                ...cat,
                subcategories: cat._subcategories,
              });
              setSelectedSubCategory(null);
              setTranslationErrors((prev) => ({ ...prev, category: null }));
            }}
            error={translationErrors.category}
          />
          <SelectOptions
            label={t.dashboard.forms.subCategory}
            placeholder={
              !selectedCategory
                ? t.dashboard.forms.selectSubCategory
                : subCategories.length > 0
                  ? t.dashboard.forms.selectSubCategory
                  : locale === "AR"
                    ? "لا توجد أقسام فرعية بعد"
                    : "No nested categories yet"
            }
            options={subCategories}
            value={selectedSubCategory}
            loading={referenceDataLoading}
            disabled={!selectedCategory || subCategories.length === 0}
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
            {translationErrors.enDescription ? (
              <span className="error">
                <CircleAlert />
                {translationErrors.enDescription}
              </span>
            ) : null}
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
                      required:
                        t.dashboard.forms.errors.googleMapsLinkRequired ||
                        "Google Maps link is required",
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
                        t.dashboard.forms.errors.googleMapsIframeRequired ||
                        "Google Maps iframe is required",
                      pattern: {
                        value: /^https/i,
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
          submitLabel={
            editId
              ? locale === "AR"
                ? "تعديل المزار الليلي"
                : "Edit Night Place"
              : t.dashboard.forms.createNightPlace
          }
        />
      </form>
    </div>
  );
}
