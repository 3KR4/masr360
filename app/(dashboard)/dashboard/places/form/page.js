"use client";
import React, { useState, useContext, useEffect, useMemo } from "react";
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
import { useSearchParams, useRouter } from "next/navigation";
import { getOne, update, create } from "@/services/places/places.service";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
import { getAll as getCategories } from "@/services/categories/categories.service";
import {
  govsEn,
  govsAr,
  tourismCategoriesEn,
  tourismCategoriesAr,
} from "@/data";

/** Axios body may be { place, ticket } or a legacy flat place object. */
function unwrapPlaceGetOneResponse(data) {
  const root = data?.data ?? data;
  const place = root?.place ?? root;
  const ticketField = root?.ticket ?? place?.ticket;
  return { place, ticketField };
}

function firstTicketDoc(ticketField) {
  if (ticketField == null) return null;
  if (Array.isArray(ticketField)) return ticketField[0] ?? null;
  if (typeof ticketField === "string") {
    try {
      const parsed = JSON.parse(ticketField);
      return Array.isArray(parsed) ? parsed[0] ?? null : parsed;
    } catch {
      return null;
    }
  }
  return ticketField;
}

/** API uses `pricing`; dashboard Tickets context uses `prices`. */
function mapApiTicketToForm(ticketDoc) {
  if (!ticketDoc || typeof ticketDoc !== "object") return { type: "free" };
  const type = ticketDoc.type;
  const pricing = ticketDoc.pricing || ticketDoc.prices || {};
  if (!type || type === "free") return { type: "free" };
  const numStr = (v) => (v != null && v !== "" ? String(v) : "");

  if (type === "static") {
    return {
      type: "static",
      prices: { staticPrice: numStr(pricing.staticPrice) },
    };
  }
  if (type === "pricePerRegion") {
    const p = pricing.pricePerRegion || {};
    return {
      type: "pricePerRegion",
      prices: {
        pricePerRegion: {
          egyptian: numStr(p.egyptian),
          foreign: numStr(p.foreign),
        },
      },
    };
  }
  if (type === "pricePerAge") {
    const p = pricing.pricePerAge || {};
    return {
      type: "pricePerAge",
      prices: {
        pricePerAge: {
          children: numStr(p.children),
          adults: numStr(p.adults),
          seniors: numStr(p.seniors),
        },
      },
    };
  }
  if (type === "ageAndRegion") {
    const a = pricing.ageAndRegion || {};
    const mapPair = (group) => ({
      egyptian: numStr(group?.egyptian),
      foreign: numStr(group?.foreign),
    });
    return {
      type: "ageAndRegion",
      prices: {
        ageAndRegion: {
          students: mapPair(a.students),
          adults: mapPair(a.adults),
          seniors: mapPair(a.seniors),
        },
      },
    };
  }
  return { type: "free" };
}

export default function CreatePlace() {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const { setisSubmited, images, setImages, specifications, setSpecifications, tickets, setTickets } = useContext(forms);

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
  const router = useRouter();
  const editId = searchParams.get("edit");
  const { addNotification } = useNotification();
  const [translations, setTranslations] = useState({
    EN: { title: "", description: "" },
    AR: { title: "", description: "" },
  });
  const [governorateOptions, setGovernorateOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  /** Raw place from GET one; category/gov selects sync when option lists load. */
  const [editPlaceSnapshot, setEditPlaceSnapshot] = useState(null);

  const TEST_CATEGORY_ID = "6984f12c888f9d5d903f3a9a";
  const TEST_GOVERNORATE_ID = "699f4cb48c0b04cebf3b52cb";

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

  const filteredGovernorateOptions = useMemo(
    () => (governorateOptions.length > 0 ? governorateOptions : []),
    [governorateOptions]
  );

  const filteredCategoryOptions = useMemo(
    () => (categoryOptions.length > 0 ? categoryOptions : []),
    [categoryOptions]
  );

  const subCategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    const loadGovernorates = async () => {
      try {
        const { governorates: governoratesData } = await getGovernorates("", 1, 200, locale);
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

    const loadCategories = async () => {
      try {
        const res = await getCategories({ type: "place", lang: locale });
        const categoriesData = res.data?.data || res.data || [];
        const localeKey = String(locale || "EN").toUpperCase();
        
        const options = Array.isArray(categoriesData)
          ? categoriesData.map((cat) => ({
              id: cat._id || cat.id,
              name: cat.translations?.[localeKey]?.name || cat.name,
              subcategories: (cat.subCategories || cat.subcategories || []).map(sub => ({
                id: sub._id || sub.id,
                name: sub.translations?.[localeKey]?.name || sub.name,
                raw: sub
              })),
              raw: cat,
            }))
          : [];
        setCategoryOptions(options);
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategoryOptions([]);
      }
    };

    loadGovernorates();
    loadCategories();
  }, [locale]);

  useEffect(() => {
    if (!editId) {
      setImages([]);
      setTickets({ type: "free" });
      if (typeof setSpecifications === 'function') setSpecifications([]);
      setTranslations({
        EN: { title: "", description: "" },
        AR: { title: "", description: "" },
      });
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedGov(null);
      setValue("mapLocation.link", "");
      setValue("mapLocation.iFrame", "");
      setOldImage(null);
      setEditPlaceSnapshot(null);
    }
  }, [editId, setImages, setTickets, setSpecifications, setValue]);

  useEffect(() => {
    if (!editId) return;

    const fetchPlaces = async () => {
      try {
        setLoadingContent(true);
        setEditPlaceSnapshot(null);

        const res = await getOne(editId);
        const { place, ticketField } = unwrapPlaceGetOneResponse(res.data);

        if (!place || typeof place !== "object") {
          throw new Error("Place data is missing");
        }

        setEditPlaceSnapshot(place);

        const formatTranslation = (translation) => ({
          title: translation?.title ?? translation?.name ?? place.name ?? "",
          description: translation?.description ?? translation?.desc ?? place.desc ?? "",
        });

        const translationsData = place.translations || {};

        setTranslations({
          EN: formatTranslation(translationsData.EN),
          AR: formatTranslation(translationsData.AR),
        });

        const ticketDoc = firstTicketDoc(ticketField);
        setTickets(mapApiTicketToForm(ticketDoc));

        const locLink =
          typeof place.location === "string"
            ? place.location
            : (place.location?.link ?? "");
        setValue("mapLocation.link", locLink);
        setValue(
          "mapLocation.iFrame",
          place.locationIframe ?? place.location?.iFrame ?? ""
        );

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
  }, [editId, addNotification, setImages, setValue, setTickets]);

  useEffect(() => {
    if (!editId || !editPlaceSnapshot) return;

    const place = editPlaceSnapshot;

    const categoryOption = filteredCategoryOptions.find(
      (cat) =>
        cat.id === place.category ||
        cat.id === place.category?._id ||
        cat.name === place.category ||
        cat.name === place.category?.name
    );
    if (categoryOption) {
      setSelectedCategory(categoryOption);
      const selectedSub = categoryOption.subcategories?.find(
        (sub) =>
          sub.id === place.subCategory ||
          sub.id === place.subCategory?._id ||
          sub.name === place.subCategory ||
          sub.name === place.subCategory?.name
      );
      setSelectedSubCategory(selectedSub || null);
    } else if (typeof place.category === "string" && place.category) {
      setSelectedCategory({
        id: place.category,
        name: "",
        subcategories: [],
        raw: null,
      });
      setSelectedSubCategory(null);
    }

    const govLabel =
      locale === "EN"
        ? place.governorate?.name
        : place.governorate?.translations?.AR?.name || place.governorate?.name;
    const govOption = filteredGovernorateOptions.find(
      (gov) =>
        gov.id === place.governorate ||
        gov.id === place.governorate?._id ||
        gov.name === govLabel
    );
    if (govOption) {
      setSelectedGov(govOption);
    } else if (typeof place.governorate === "string" && place.governorate) {
      setSelectedGov({
        id: place.governorate,
        name: "",
        raw: null,
      });
    }
  }, [
    editId,
    editPlaceSnapshot,
    filteredCategoryOptions,
    filteredGovernorateOptions,
    locale,
  ]);


  // ----------------- Submit -----------------
  const onSubmit = (data) => {
    
    setisSubmited(true);
    setLoadingSubmit(true);

    const validationErrors = {};
    if (!translations.EN.title.trim()) {
      validationErrors.enTitle = t.dashboard.forms.errors.titleRequired;
    }
    if (!translations.EN.description.trim()) {
      validationErrors.enDescription = t.dashboard.forms.errors.descriptionRequired;
    }
    if (!translations.AR.title.trim()) {
      validationErrors.arTitle = t.dashboard.forms.errors.titleRequired;
    }
    if (!translations.AR.description.trim()) {
      validationErrors.arDescription = t.dashboard.forms.errors.descriptionRequired;
    }

    if (Object.keys(validationErrors).length) {
      setTranslationErrors(validationErrors);
      setLoadingSubmit(false);
      return;
    }

    const cleanObject = (obj) => {
      const cleaned = {};
      for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'object' && val !== null) {
          const nested = cleanObject(val);
          if (Object.keys(nested).length > 0) cleaned[key] = nested;
        } else if (val !== "" && val !== null && val !== undefined) {
          cleaned[key] = Number(val);
        }
      }
      return cleaned;
    };

    const formattedTicket = {
      type: tickets.type,
    };
    if (tickets.type !== "free" && tickets.prices) {
      formattedTicket.pricing = cleanObject(tickets.prices);
    }

    const finalData = {
      name: translations.EN.title,
      desc: translations.EN.description,
      category:
        selectedCategory?.id || categoryOptions?.[0]?.id || TEST_CATEGORY_ID,
      subCategory: selectedSubCategory?.id || null,
      governorate:
        selectedGov?.id || governorateOptions?.[0]?.id || TEST_GOVERNORATE_ID,
      ticket: formattedTicket,
      translations: {
        EN: {
          name: translations.EN.title,
          desc: translations.EN.description,
        },
        AR: {
          name: translations.AR.title,
          desc: translations.AR.description,
        },
      },
      specifications: specifications.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
      location: data.mapLocation?.link || "",
      locationIframe: data.mapLocation?.iFrame || "",
    };

    const buildFormData = (payload) => {
      const formData = new FormData();

      if (payload.name !== undefined) formData.append("name", payload.name);
      if (payload.desc !== undefined) formData.append("desc", payload.desc);
      if (payload.category) formData.append("category", payload.category);
      if (payload.subCategory) formData.append("subCategory", payload.subCategory);
      if (payload.governorate) formData.append("governorate", payload.governorate);
      if (payload.ticket) formData.append("ticket", JSON.stringify(payload.ticket));
      if (payload.translations) {
        formData.append("translations", JSON.stringify(payload.translations));
      }

      if (Object.keys(payload.specifications).length) {
        formData.append("specifications", JSON.stringify(payload.specifications));
      }

      if (payload.location) formData.append("location", payload.location);
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
        const payload = buildFormData(finalData);

        if (editId) {
          await update(editId, payload);
          addNotification({
            type: "success",
            message: "تم تحديث المكان بنجاح ✅",
          });
        } else {
          await create(payload);
          addNotification({
            type: "success",
            message: "تم إنشاء المكان بنجاح ✅",
          });
        }

        router.push("/dashboard/places");
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
            options={filteredGovernorateOptions}
            value={selectedGov}
            onChange={(gov) => setSelectedGov(gov)}
          />
          {translationErrors.governorate ? (
            <span className="error">
              <CircleAlert />
              {translationErrors.governorate}
            </span>
          ) : null}
        </div>

        {/* ----------------- Category & Subcategory ----------------- */}
        <div className="row-holder two-column">
          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={filteredCategoryOptions.map(cat => ({ ...cat, subcategories: undefined, _subcategories: cat.subcategories }))}
            value={selectedCategory}
            onChange={(cat) => {
              setSelectedCategory({ ...cat, subcategories: cat._subcategories });
              setSelectedSubCategory(null);
            }}
          />
          {translationErrors.category ? (
            <span className="error">
              <CircleAlert />
              {translationErrors.category}
            </span>
          ) : null}
          {subCategories.length > 0 && (
            <SelectOptions
              label={t.dashboard.forms.subCategory}
              placeholder={t.dashboard.forms.selectSubCategory}
              options={subCategories}
              value={selectedSubCategory}
              disabled={!selectedCategory}
              onChange={(sub) => setSelectedSubCategory(sub)}
            />
          )}
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
            {(translationErrors.enDescription && curentCreateLocale === "EN") ||
            (translationErrors.arDescription && curentCreateLocale === "AR") ? (
              <span className="error">
                <CircleAlert />
                {curentCreateLocale === "EN"
                  ? translationErrors.enDescription
                  : translationErrors.arDescription}
              </span>
            ) : null}
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
