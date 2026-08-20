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
} from "@/services/events/events.service";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { useNotification } from "@/Contexts/NotificationContext";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";
import { useSearchParams, useRouter } from "next/navigation";

function unwrapEventGetOneResponse(data) {
  return data?.event || data?.data?.event || data?.data || data;
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

function toDatetimeLocalString(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function CreateEvent() {
  const { setisSubmited, images, setImages } = useContext(forms);
  const t = useTranslate();
  const { locale, governorates, referenceDataLoading } =
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
      startDate: "",
      endDate: "",
    },
  });
  const [selectedGov, setSelectedGov] = useState(null);
  const [governorateOptions, setGovernorateOptions] = useState([]);
  const filteredGovernorateOptions = useMemo(
    () => (governorateOptions.length > 0 ? governorateOptions : []),
    [governorateOptions],
  );

  const [oldImages, setOldImages] = useState([]);
  const { addNotification } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");
  const [translationErrors, setTranslationErrors] = useState({});

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
  }, [governorates, locale]);

  useEffect(() => {
    if (!editId) {
      setImages([]);
      setTranslations({
        EN: { name: "", desc: "" },
        AR: { name: "", desc: "" },
      });
      setSelectedGov(null);
      setValue("location.link", "");
      setValue("location.iFrame", "");
      setValue("startDate", "");
      setValue("endDate", "");
      setOldImages([]);
    }
  }, [editId, setImages, setValue]);

  useEffect(() => {
    if (!editId) return;

    const fetchEvent = async () => {
      try {
        const res = await getOne(editId);
        const event = unwrapEventGetOneResponse(res.data);

        if (!event) {
          throw new Error("Event data not found");
        }

        const formatTranslation = (translation) => ({
          name: translation?.name ?? event?.name ?? "",
          desc:
            translation?.desc ?? translation?.description ?? event?.desc ?? "",
        });

        setTranslations({
          EN: formatTranslation(event.translations?.EN),
          AR: formatTranslation(event.translations?.AR),
        });

        const locationLink =
          typeof event.location === "string"
            ? event.location
            : event.location?.link || "";

        setValue("location.link", locationLink);
        setValue(
          "location.iFrame",
          event.location?.iFrame || event.locationIframe || "",
        );

        setValue("startDate", toDatetimeLocalString(event.startDate));
        setValue("endDate", toDatetimeLocalString(event.endDate));

        const govOption = filteredGovernorateOptions.find(
          (item) =>
            String(item.id) === String(event.governorate) ||
            String(item.id) === String(event.governorate?._id) ||
            item.name === event.governorate ||
            item.name === event.governorate?.name ||
            item.name ===
              event.governorate?.translations?.[
                String(locale || "EN").toUpperCase()
              ]?.name,
        );
        if (govOption) {
          setSelectedGov(govOption);
        }

        const existingImages = Array.isArray(event.imgs)
          ? event.imgs
          : event.img
            ? [event.img]
            : [];
        if (existingImages.length) {
          setImages(existingImages);
          setOldImages(existingImages);
        }
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    };

    fetchEvent();
  }, [
    editId,
    addNotification,
    setImages,
    locale,
    setValue,
    filteredGovernorateOptions,
  ]);

  const handleClickSubmit = async () => {
    setisSubmited(true);

    const hasImage = images.some(Boolean);
    const rhfValid = await trigger([
      "location.link",
      "location.iFrame",
      "startDate",
      "endDate",
    ]);

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
    if (!hasImage) {
      customErrors.images = "At least one image is required";
    }

    setTranslationErrors(customErrors);

    if (!rhfValid || Object.keys(customErrors).length) return;

    handleSubmit(onSubmit)();
  };

  const onSubmit = (data) => {
    setLoadingSubmit(true);

    const selectedGovernorateId = selectedGov?.id;

    const startDateISO = data.startDate
      ? new Date(data.startDate).toISOString()
      : "";
    const endDateISO = data.endDate
      ? new Date(data.endDate).toISOString()
      : "";

    const finalData = {
      name: translations.EN.name,
      desc: translations.EN.desc,
      governorate: selectedGovernorateId,
      translations: {
        EN: translations.EN,
        AR: translations.AR,
      },
      location: data.location?.link || "",
      locationIframe: normalizeMapEmbedValue(data.location?.iFrame),
      startDate: startDateISO,
      endDate: endDateISO,
    };

    const buildFormData = (payload) => {
      const formData = new FormData();

      if (payload.name !== undefined) formData.append("name", payload.name);
      if (payload.desc !== undefined) formData.append("desc", payload.desc);
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
      if (payload.startDate) formData.append("startDate", payload.startDate);
      if (payload.endDate) formData.append("endDate", payload.endDate);

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
                removeImage(image.publicId, "event", editId),
              ),
            );
          }
          addNotification({
            type: "success",
            message: "Event updated successfully",
          });
        } else {
          await create(formData);
          addNotification({
            type: "success",
            message: "Event created successfully",
          });
        }

        router.push("/dashboard/events");
        setImages([]);
        setisSubmited(false);
      } catch (error) {
        console.error("Failed to submit event:", error);
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
          <div className="box forInput">
            <label htmlFor="startDate">
              {t.dashboard.tables.startingTime || "Start Date"}
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="datetime-local"
                  id="startDate"
                  {...register("startDate", {
                    required:
                      t.dashboard.forms.errors?.startDateRequired ||
                      "Start date is required",
                  })}
                />
              </div>
              {errors.startDate && (
                <span className="error">
                  <CircleAlert />
                  {errors.startDate.message}
                </span>
              )}
            </div>
          </div>

          <div className="box forInput">
            <label htmlFor="endDate">
              {t.dashboard.tables.endDate || "End Date"}
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="datetime-local"
                  id="endDate"
                  {...register("endDate", {
                    required:
                      t.dashboard.forms.errors?.endDateRequired ||
                      "End date is required",
                  })}
                />
              </div>
              {errors.endDate && (
                <span className="error">
                  <CircleAlert />
                  {errors.endDate.message}
                </span>
              )}
            </div>
          </div>
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
          <Images limit={20} />
        </div>

        <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loadingSubmit}
          editId={editId}
          submitLabel={
            editId
              ? locale === "AR"
                ? "تعديل الحدث"
                : "Edit Event"
              : locale === "AR"
                ? "إنشاء حدث"
                : "Create Event"
          }
        />
      </form>
    </div>
  );
}
