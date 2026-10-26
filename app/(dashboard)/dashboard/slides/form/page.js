"use client";
import React, { useContext, useState, useEffect, Suspense } from "react";
import { CircleAlert } from "lucide-react";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import { forms } from "@/Contexts/forms";
import {
  create,
  update,
  getOne,
} from "@/services/slides/slides.service";
import useTranslate from "@/Contexts/useTranslation";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/Contexts/NotificationContext";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";

function SlideFormContent() {
  const { setisSubmited, images, setImages } = useContext(forms);
  const t = useTranslate();
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [oldImage, setOldImage] = useState(null);
  const { addNotification } = useNotification();
  const router = useRouter();
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");

  const [translations, setTranslations] = useState({
    EN: { title: "", smallTitle: "", desc: "" },
    AR: { title: "", smallTitle: "", desc: "" },
  });

  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [curentCreateLocale]: {
        ...prev[curentCreateLocale],
        [field]: value,
      },
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!translations.EN.title.trim()) {
      newErrors.enTitle = "English title is required";
    } else if (translations.EN.title.trim().length < 3) {
      newErrors.enTitle = "English title must be at least 3 characters";
    }

    if (!translations.EN.desc.trim()) {
      newErrors.enDesc = "English description is required";
    }

    if (!editId && !images.length) {
      newErrors.img = "Slide image is required";
    }

    if (link.trim()) {
      try {
        const parsed = new URL(link.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          newErrors.link = "Link must start with http:// or https://";
        }
      } catch {
        if (!link.trim().startsWith("/")) {
          newErrors.link = "Please enter a valid URL (e.g. https://... or /...)";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!editId) return;

    const fetchSlide = async () => {
      try {
        setLoadingContent(true);
        const res = await getOne(editId);
        const slide = res?.slide || res?.data?.slide || res?.data || res;

        if (slide) {
          const enData = slide.translations?.EN || slide.translations?.en || {};
          const arData = slide.translations?.AR || slide.translations?.ar || {};

          const safeStr = (v, lang) => {
            if (typeof v === "string") return v;
            if (v && typeof v === "object") return v[lang] || v.EN || v.AR || "";
            return "";
          };

          setTranslations({
            EN: {
              title: safeStr(enData.title) || safeStr(slide.title, "EN"),
              smallTitle: safeStr(enData.smallTitle) || safeStr(slide.smallTitle, "EN"),
              desc: safeStr(enData.desc) || safeStr(slide.desc, "EN"),
            },
            AR: {
              title: safeStr(arData.title) || safeStr(slide.title, "AR"),
              smallTitle: safeStr(arData.smallTitle) || safeStr(slide.smallTitle, "AR"),
              desc: safeStr(arData.desc) || safeStr(slide.desc, "AR"),
            },
          });

          setLink(slide.link || "");
          setIsActive(slide.isActive !== undefined ? Boolean(slide.isActive) : true);

          if (slide.img) {
            const imgObj =
              typeof slide.img === "string"
                ? { url: slide.img }
                : { url: slide.img.url || slide.img, publicId: slide.img.publicId };
            setImages([imgObj]);
            setOldImage(imgObj);
          }
        }
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Failed to fetch slide data ❌",
        });
      } finally {
        setLoadingContent(false);
      }
    };

    fetchSlide();
  }, [editId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setisSubmited(true);

    if (!validate()) return;

    setLoadingSubmit(true);

    try {
      const formData = new FormData();

      formData.append("title", translations.EN.title || translations.AR.title);
      if (translations.EN.smallTitle || translations.AR.smallTitle) {
        formData.append(
          "smallTitle",
          translations.EN.smallTitle || translations.AR.smallTitle || ""
        );
      }
      formData.append("desc", translations.EN.desc || translations.AR.desc);

      if (link.trim()) {
        formData.append("link", link.trim());
      }

      formData.append(
        "translations",
        JSON.stringify({
          EN: {
            title: translations.EN.title,
            smallTitle: translations.EN.smallTitle,
            desc: translations.EN.desc,
          },
          AR: {
            title: translations.AR.title || translations.EN.title,
            smallTitle: translations.AR.smallTitle || translations.EN.smallTitle,
            desc: translations.AR.desc || translations.EN.desc,
          },
        })
      );

      // Single image file attached to "img"
      if (images[0] instanceof File) {
        formData.append("img", images[0]);
      }

      if (editId) {
        formData.append("isActive", String(isActive));
        await update(editId, formData);
        addNotification({
          type: "success",
          message:
            curentCreateLocale === "AR"
              ? "تم تحديث الشريحة بنجاح"
              : "Slide Updated Successfully",
        });
      } else {
        await create(formData);
        addNotification({
          type: "success",
          message:
            curentCreateLocale === "AR"
              ? "تم إنشاء الشريحة بنجاح"
              : "Slide Created Successfully",
        });
      }

      router.push("/dashboard/slides");
      setImages([]);
      setisSubmited(false);
    } catch (error) {
      console.error("error submitting slide:", error);
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
      <form onSubmit={onSubmit}>
        <div
          className="row-holder two-column"
          style={{
            position: "relative",
            opacity: loadingContent ? "0.6" : "1",
          }}
        >
          {loadingContent && (
            <div className="loading-content">
              <span
                className="loader"
                style={{ opacity: loadingContent ? "1" : "0" }}
              ></span>
            </div>
          )}

          <div className="column-holder">
            {/* Title */}
            <div className="box forInput">
              <div>
                <label>
                  {curentCreateLocale === "AR" ? "عنوان الشريحة" : "Slide Title"}
                </label>
                <label>({curentCreateLocale.toUpperCase()})</label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    value={translations[curentCreateLocale]?.title || ""}
                    onChange={(e) => {
                      handleChange("title", e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        enTitle: null,
                      }));
                    }}
                    placeholder={
                      curentCreateLocale === "AR"
                        ? "أدخل العنوان الرئيسي للشريحة"
                        : "Enter slide main title"
                    }
                  />
                </div>

                {errors.enTitle && curentCreateLocale === "EN" && (
                  <span className="error">
                    <CircleAlert size={16} />
                    {errors.enTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Small Title / Subtitle */}
            <div className="box forInput">
              <div>
                <label>
                  {curentCreateLocale === "AR"
                    ? "العنوان الصغير / الفرعي"
                    : "Small Title / Subtitle"}
                </label>
                <label>({curentCreateLocale.toUpperCase()})</label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    value={translations[curentCreateLocale]?.smallTitle || ""}
                    onChange={(e) => handleChange("smallTitle", e.target.value)}
                    placeholder={
                      curentCreateLocale === "AR"
                        ? "أدخل النص الصغير فوق العنوان"
                        : "Enter small title / subtitle"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="box forInput">
              <div>
                <label>
                  {curentCreateLocale === "AR" ? "الوصف" : "Description"}
                </label>
                <label>({curentCreateLocale.toUpperCase()})</label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    value={translations[curentCreateLocale]?.desc || ""}
                    onChange={(e) => {
                      handleChange("desc", e.target.value);
                      setErrors((prev) => ({ ...prev, enDesc: null }));
                    }}
                    placeholder={
                      curentCreateLocale === "AR"
                        ? "أدخل وصف الشريحة"
                        : "Enter slide description"
                    }
                  />
                </div>

                {errors.enDesc && curentCreateLocale === "EN" && (
                  <span className="error">
                    <CircleAlert size={16} />
                    {errors.enDesc}
                  </span>
                )}
              </div>
            </div>

            {/* Link */}
            <div className="box forInput">
              <div>
                <label>
                  {curentCreateLocale === "AR"
                    ? "رابط التوجيه (اختياري)"
                    : "Slide Link (Optional)"}
                </label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      setErrors((prev) => ({ ...prev, link: null }));
                    }}
                    placeholder="https://... or /places/..."
                  />
                </div>

                {errors.link && (
                  <span className="error">
                    <CircleAlert size={16} />
                    {errors.link}
                  </span>
                )}
              </div>
            </div>

            {/* Status (Active / Inactive) */}
            <div className="box forInput">
              <div>
                <label>
                  {curentCreateLocale === "AR" ? "الحالة" : "Status"}
                </label>
              </div>

              <div className="inputHolder">
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    padding: "8px 0",
                    color: "var(--color-white, #fff)",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "var(--color-primary, #b39359)",
                    }}
                  />
                  <span>
                    {isActive
                      ? curentCreateLocale === "AR"
                        ? "نشط (تظهر في السلايدر الرئيسي)"
                        : "Active (Visible on homepage slider)"
                      : curentCreateLocale === "AR"
                        ? "غير نشط (مخفية)"
                        : "Inactive (Hidden)"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <Images limit={1} />
            {errors.img && (
              <span
                className="error"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--color-red, #ff5757)",
                  marginTop: "8px",
                  fontSize: "13px",
                }}
              >
                <CircleAlert size={16} />
                {errors.img}
              </span>
            )}
          </div>
        </div>

        <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loadingSubmit}
          editId={editId}
          submitLabel={
            editId
              ? curentCreateLocale === "AR"
                ? "تحديث الشريحة"
                : "Update Slide"
              : curentCreateLocale === "AR"
                ? "إنشاء الشريحة"
                : "Create Slide"
          }
        />
      </form>
    </div>
  );
}

export default function SlideForm() {
  return (
    <Suspense
      fallback={
        <div className="body" style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="loader"></span>
        </div>
      }
    >
      <SlideFormContent />
    </Suspense>
  );
}
