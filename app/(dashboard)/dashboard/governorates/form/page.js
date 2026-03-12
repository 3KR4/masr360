"use client";
import React, { useContext, useState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import { forms } from "@/Contexts/forms";
import {
  create,
  update,
  getOne,
  removeImage,
} from "@/services/govenorates/govenorates.service";
import useTranslate from "@/Contexts/useTranslation";
import { useRouter } from "next/navigation";
import { useNotification } from "@/Contexts/NotificationContext";
import { useSearchParams } from "next/navigation";

export default function Governorate() {
  const { setisSubmited, images, setImages } = useContext(forms);
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [oldImage, setOldImage] = useState(null);
  const { addNotification } = useNotification();
  const router = useRouter();
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");

  const [translations, setTranslations] = useState({
    EN: { name: "", desc: "" },
    AR: { name: "", desc: "" },
  });

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

    if (!translations.EN.name.trim()) {
      newErrors.enName = "English name is required";
    } else if (translations.EN.name.length < 3) {
      newErrors.enName = "English name must be at least 3 characters";
    }

    if (!translations.AR.name.trim()) {
      newErrors.arName = "Arabic name is required";
    } else if (translations.AR.name.length < 3) {
      newErrors.arName = "Arabic name must be at least 3 characters";
    }

    if (!images || !images[0]) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!editId) return;

    const fetchGovernorate = async () => {
      try {
        setLoading(true);

        const res = await getOne(editId);
        const gov = res.data.governorate;

        // set translations
        setTranslations({
          EN: gov.translations?.EN || { name: gov.name, desc: gov.desc },
          AR: gov.translations?.AR || { name: gov.name, desc: gov.desc },
        });

        // نحط الصورة القديمة في images
        if (gov.img) {
          setImages([gov.img]); // object فيه publicId + url
          setOldImage(gov.img);
        }
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Something went wrong ❌",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGovernorate();
  }, [editId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setisSubmited(true);

    if (!validate()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", translations.EN.name);
      formData.append("desc", translations.EN.desc);

      formData.append(
        "translations",
        JSON.stringify({
          EN: translations.EN,
          AR: translations.AR,
        }),
      );

      // لو في صورة جديدة (File)
      if (images[0] instanceof File) {
        formData.append("img", images[0]);
      }

      if (editId) {
        // لو الصورة القديمة كانت موجودة واتشالت
        if (!images.length && oldImage?.publicId) {
          await removeImage(oldImage.publicId, "governorate", editId);
        }

        await update(editId, formData); // نفس create عندك للـ update

        addNotification({
          type: "success",
          message: "Governorate Updated Successfully",
        });
      } else {
        formData.append("img", images[0]);

        await create(formData);

        addNotification({
          type: "success",
          message: "Governorate Created Successfully",
        });
      }

      router.push("/dashboard/governorates");
      setImages([]);
      setisSubmited(false);
    } catch (error) {
      console.log("error:", error);

      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <form onSubmit={onSubmit}>
        <div className="row-holder two-column">
          <div className="column-holder">
            {/* Name */}
            <div className="box forInput">
              <div>
                <label>{t.dashboard.forms.governorateName}</label>
                <label>(for -- {curentCreateLocale.toUpperCase()})</label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    value={translations[curentCreateLocale]?.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter governorate name"
                  />
                </div>

                {errors.enName && curentCreateLocale === "EN" && (
                  <span className="error">
                    <CircleAlert size={16} />
                    {errors.enName}
                  </span>
                )}

                {errors.arName && curentCreateLocale === "AR" && (
                  <span className="error">
                    <CircleAlert size={16} />
                    {errors.arName}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="box forInput">
              <div>
                <label>{t.dashboard.forms.description}</label>
                <label>(for -- {curentCreateLocale.toUpperCase()})</label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    value={translations[curentCreateLocale]?.desc}
                    onChange={(e) => handleChange("desc", e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {/* Image Error */}
            {errors.image && (
              <span className="error">
                <CircleAlert size={16} />
                {errors.image}
              </span>
            )}
          </div>
          <Images limit={1} />
        </div>

        <div className="row-holder">
          <div className="lang-switch">
            {["EN", "AR"].map((lng) => (
              <button
                key={lng}
                type="button"
                className={curentCreateLocale === lng ? "active" : ""}
                onClick={() => setCurentCreateLocale(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="main-button" type="submit" disabled={loading}>
            <span
              className="loader"
              style={{ opacity: loading ? "1" : "0" }}
            ></span>
            <span style={{ opacity: loading ? "0" : "1" }}>
              Create Governorate
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
