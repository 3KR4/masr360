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
import {
  getOne,
  update,
  create,
  removeImage,
} from "@/services/places/places.service";
import { update as updateTicket } from "@/services/tickets/tickets.service";

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
      return Array.isArray(parsed) ? (parsed[0] ?? null) : parsed;
    } catch {
      return null;
    }
  }
  return ticketField;
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
    const p = pricing.pricePerRegion || pricing || {};
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
    const p = pricing.pricePerAge || pricing || {};
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
function toTicketNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function hasTicketValue(value) {
  return String(value ?? "").trim() !== "";
}

function hasPositiveTicketValue(value) {
  return hasTicketValue(value) && toTicketNumber(value) > 0;
}

function buildApiTicketPayload(tickets) {
  const type = tickets?.type || "free";

  if (type === "free") {
    return { ticket: { type: "free", pricing: { staticPrice: 0 } } };
  }

  if (type === "static") {
    return {
      ticket: {
        type: "static",
        pricing: { staticPrice: toTicketNumber(tickets?.prices?.staticPrice) },
      },
    };
  }

  if (type === "pricePerRegion") {
    const prices = tickets?.prices?.pricePerRegion || {};
    if (
      !hasPositiveTicketValue(prices.egyptian) ||
      !hasPositiveTicketValue(prices.foreign)
    ) {
      return { error: "Egyptian and foreign ticket prices must be greater than 0" };
    }

    return {
      ticket: {
        type: "pricePerRegion",
        pricing: {
          egyptian: toTicketNumber(prices.egyptian),
          foreign: toTicketNumber(prices.foreign),
        },
      },
    };
  }

  if (type === "pricePerAge") {
    const prices = tickets?.prices?.pricePerAge || {};
    const requiredGroups = ["children", "adults", "seniors"];
    const missingGroup = requiredGroups.find(
      (group) => !hasPositiveTicketValue(prices[group]),
    );

    if (missingGroup) {
      return { error: "Children, adults, and seniors ticket prices must be greater than 0" };
    }

    return {
      ticket: {
        type: "pricePerAge",
        pricing: {
          children: toTicketNumber(prices.children),
          adults: toTicketNumber(prices.adults),
          seniors: toTicketNumber(prices.seniors),
        },
      },
    };
  }

  if (type === "ageAndRegion") {
    const prices = tickets?.prices?.ageAndRegion || {};
    const requiredGroups = ["students", "adults", "seniors"];
    const missingGroup = requiredGroups.find(
      (group) =>
        !hasTicketValue(prices[group]?.egyptian) ||
        !hasTicketValue(prices[group]?.foreign),
    );

    if (missingGroup) {
      return { error: "All age and region ticket prices are required" };
    }

    return {
      ticket: {
        type: "ageAndRegion",
        pricing: {
          ageAndRegion: {
            students: {
              egyptian: toTicketNumber(prices.students?.egyptian),
              foreign: toTicketNumber(prices.students?.foreign),
            },
            adults: {
              egyptian: toTicketNumber(prices.adults?.egyptian),
              foreign: toTicketNumber(prices.adults?.foreign),
            },
            seniors: {
              egyptian: toTicketNumber(prices.seniors?.egyptian),
              foreign: toTicketNumber(prices.seniors?.foreign),
            },
          },
        },
      },
    };
  }

  return { ticket: { type: "free", pricing: { staticPrice: 0 } } };
}
export default function CreatePlace() {
  const { locale, governorates, placeCategories, referenceDataLoading } =
    useContext(mainContext);
  const t = useTranslate();
  const {
    setisSubmited,
    images,
    setImages,
    specifications,
    setSpecifications,
    tickets,
    setTickets,
  } = useContext(forms);

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
  const [oldImages, setOldImages] = useState([]);
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
  const [editTicketSnapshot, setEditTicketSnapshot] = useState(null);

  const handleTranslationChange = (field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [curentCreateLocale]: {
        ...prev[curentCreateLocale],
        [field]: value,
      },
    }));
    // clear matching error key
    if (field === "title") {
      setTranslationErrors((prev) => ({
        ...prev,
        enTitle: null,
        arTitle: null,
      }));
    } else if (field === "description") {
      setTranslationErrors((prev) => ({
        ...prev,
        enDescription: null,
        arDescription: null,
      }));
    }
  };


  const filteredGovernorateOptions = useMemo(
    () => (governorateOptions.length > 0 ? governorateOptions : []),
    [governorateOptions],
  );

  const filteredCategoryOptions = useMemo(
    () => (categoryOptions.length > 0 ? categoryOptions : []),
    [categoryOptions],
  );

  const subCategories = selectedCategory?.subcategories || [];

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
      Array.isArray(placeCategories)
        ? placeCategories.map((cat) => ({
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
  }, [governorates, placeCategories, locale]);

  useEffect(() => {
    if (!editId) {
      setImages([]);
      setTickets({ type: "free" });
      if (typeof setSpecifications === "function") setSpecifications([]);
      setTranslations({
        EN: { title: "", description: "" },
        AR: { title: "", description: "" },
      });
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedGov(null);
      setValue("mapLocation.link", "");
      setValue("mapLocation.iFrame", "");
      setOldImages([]);
      setEditPlaceSnapshot(null);
      setEditTicketSnapshot(null);
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
          description:
            translation?.description ?? translation?.desc ?? place.desc ?? "",
        });

        const translationsData = place.translations || {};

        setTranslations({
          EN: formatTranslation(translationsData.EN),
          AR: formatTranslation(translationsData.AR),
        });

        const ticketDoc = firstTicketDoc(ticketField);
        setEditTicketSnapshot(ticketDoc);
        setTickets(mapApiTicketToForm(ticketDoc));

        const locLink =
          typeof place.location === "string"
            ? place.location
            : (place.location?.link ?? "");
        setValue("mapLocation.link", locLink);
        setValue(
          "mapLocation.iFrame",
          place.locationIframe ?? place.location?.iFrame ?? "",
        );

        const existingImages = Array.isArray(place.imgs)
          ? place.imgs
          : place.img
            ? [place.img]
            : [];

        if (existingImages.length) {
          setImages(existingImages);
          setOldImages(existingImages);
        }
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Something went wrong",
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

    const placeCategoryId = place.category?._id || place.category?.id || place.category;
    const placeCategoryName = place.category?.name || place.category;
    const placeSubCategoryId =
      place.subCategory?._id || place.subCategory?.id || place.subCategory;
    const placeSubCategoryName = place.subCategory?.name || place.subCategory;

    const categoryOption = filteredCategoryOptions.find((cat) => {
      const isDirectCategory =
        String(cat.id) === String(placeCategoryId) || cat.name === placeCategoryName;
      const hasSelectedSubCategory = cat.subcategories?.some(
        (sub) =>
          String(sub.id) === String(placeCategoryId) ||
          String(sub.id) === String(placeSubCategoryId) ||
          sub.name === placeCategoryName ||
          sub.name === placeSubCategoryName,
      );

      return isDirectCategory || hasSelectedSubCategory;
    });

    if (categoryOption) {
      setSelectedCategory(categoryOption);
      const selectedSub = categoryOption.subcategories?.find(
        (sub) =>
          String(sub.id) === String(placeCategoryId) ||
          String(sub.id) === String(placeSubCategoryId) ||
          sub.name === placeCategoryName ||
          sub.name === placeSubCategoryName,
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
        gov.name === govLabel,
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

  // ----------------- Validation (runs on button click) -----------------
  const handleClickSubmit = async () => {
    setisSubmited(true);

    const hasImage = images.some(Boolean);

    // Run react-hook-form validation + custom validation simultaneously
    const rhfValid = await trigger(["mapLocation.link", "mapLocation.iFrame"]);

    const customErrors = {};
    if (!translations.EN.title.trim()) {
      customErrors.enTitle =
        t.dashboard.forms.errors?.titleRequired || "English title is required";
    }
    if (!translations.EN.description.trim()) {
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

    // All valid — trigger form submission
    handleSubmit(onSubmit)();
  };

  // ----------------- Submit (only runs when all validation passes) -----------------
  const onSubmit = (data) => {
    setLoadingSubmit(true);

    const selectedCategoryId = selectedCategory?.id;
    const selectedSubCategoryId = selectedSubCategory?.id;
    const selectedGovernorateId = selectedGov?.id;

    const { ticket: formattedTicket, error: ticketError } =
      buildApiTicketPayload(tickets);

    if (ticketError) {
      addNotification({ type: "warning", message: ticketError });
      setLoadingSubmit(false);
      return;
    }

    const finalData = {
      name: translations.EN.title,
      desc: translations.EN.description,
      category: selectedCategoryId,
      subCategory: selectedSubCategoryId,
      governorate: selectedGovernorateId,
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
      location: data.mapLocation?.link || "",
      locationIframe: normalizeMapEmbedValue(data.mapLocation?.iFrame),
    };

    const buildFormData = (payload, includeTicket = true) => {
      const formData = new FormData();

      if (payload.name !== undefined) formData.append("name", payload.name);
      if (payload.desc !== undefined) formData.append("desc", payload.desc);
      if (payload.subCategory) {
        formData.append("subCategory", payload.subCategory);
        if (editId && payload.category) formData.append("category", payload.category);
      } else if (payload.category) {
        formData.append("category", payload.category);
      }
      if (payload.governorate)
        formData.append("governorate", payload.governorate);
      if (includeTicket && payload.ticket)
        formData.append("ticket", JSON.stringify(payload.ticket));
      if (payload.translations) {
        formData.append("translations", JSON.stringify(payload.translations));
      }

      if (payload.location) formData.append("location", payload.location);
      if (payload.locationIframe)
        formData.append("locationIframe", payload.locationIframe);

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("imgs", image);
        }
      });

      return formData;
    };

    const saveToAPI = async () => {
      try {
        const payload = buildFormData(finalData, !editId);

        if (editId) {
          await update(editId, payload);
          if (editTicketSnapshot?._id) {
            await updateTicket(editTicketSnapshot._id, formattedTicket);
          }
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
                removeImage(image.publicId, "place", editId),
              ),
            );
          }
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
          message: error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Something went wrong",
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
        {/* ----------------- Title ----------------- */}
        <div className="row-holder two-column">
          <div className="box forInput">
            <div>
              <label htmlFor="title">{t.dashboard.forms.title}</label>
              <label>({curentCreateLocale.toUpperCase()})</label>
            </div>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  id="title"
                  value={translations[curentCreateLocale].title}
                  onChange={(e) =>
                    handleTranslationChange("title", e.target.value)
                  }
                  placeholder={`${t.dashboard.forms.titlePlaceholder} (${curentCreateLocale.toUpperCase()})`}
                />
              </div>
              {translationErrors.enTitle  ? (
                <span className="error">
                  <CircleAlert />
                  {translationErrors.enTitle}
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
            loading={referenceDataLoading}
            error={translationErrors.governorate}
            onChange={(gov) => {
              setSelectedGov(gov);
              setTranslationErrors((prev) => ({ ...prev, governorate: null }));
            }}
          />

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
            placeholder={t.dashboard.forms.selectSubCategory}
            options={subCategories}
            value={selectedSubCategory}
            loading={referenceDataLoading}
            disabled={!selectedCategory}
            onChange={(sub) => setSelectedSubCategory(sub)}
          />
        </div>

        {/* ----------------- Description ----------------- */}
        <div className="box forInput">
          <div>
            <label htmlFor="description">{t.dashboard.forms.description}</label>
            <label>({curentCreateLocale.toUpperCase()})</label>
          </div>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="description"
                value={translations[curentCreateLocale].description}
                onChange={(e) =>
                  handleTranslationChange("description", e.target.value)
                }
                placeholder={`${t.dashboard.forms.descriptionPlaceholder} (${curentCreateLocale.toUpperCase()})`}
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
                    required:
                      t.dashboard.forms.errors.googleMapsIframeRequired ||
                      "Google Maps iframe is required",
                    pattern: {
                      value: /^https/i,
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
          editId={editId}
          submitLabel={
            editId
              ? locale === "AR"
                ? "تعديل المكان"
                : "Edit place"
              : t.dashboard.forms.createPlace
          }
        />
      </form>
    </div>
  );
}
