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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGov, setSelectedGov] = useState(null);
  const [governorateOptions, setGovernorateOptions] = useState([]);
  const filteredGovernorateOptions = useMemo(
    () => (governorateOptions.length > 0 ? governorateOptions : []),
    [governorateOptions]
  );
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const filteredCategoryOptions = useMemo(
    () => (categoryOptions.length > 0 ? categoryOptions : []),
    [categoryOptions]
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
            desc: translation?.desc ?? translation?.description ?? night?.desc ?? "",
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
              item.name === night.governorate?.translations?.[String(locale || "EN").toUpperCase()]?.name,
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
  }, [editId, addNotification, setImages, locale, setValue, filteredCategoryOptions, filteredGovernorateOptions]);
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
      const normalizedIframe = normalizeMapEmbedValue(data.location?.iFrame);
      if (normalizedIframe) {
        formData.append("locationIframe", normalizedIframe);
      }

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("imgs", image);
        }
      });

      if (editId) {
        await update(editId, formData);
        const currentImagePublicIds = new Set(
          images
            .filter((image) => image && !(image instanceof File) && image.publicId)
            .map((image) => image.publicId),
        );
        const removedImages = oldImages.filter(
          (image) => image?.publicId && !currentImagePublicIds.has(image.publicId),
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
            loading={referenceDataLoading}
            onChange={(gov) => setSelectedGov(gov)}
          />
        </div>

        <div className="row-holder two-column">
          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={filteredCategoryOptions.map(cat => ({ ...cat, subcategories: undefined, _subcategories: cat.subcategories }))}
            value={selectedCategory}
            loading={referenceDataLoading}
            onChange={(cat) => {
              setSelectedCategory({ ...cat, subcategories: cat._subcategories });
              setSelectedSubCategory(null);
            }}
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
