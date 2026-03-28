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
import FormLangSwitch from "@/components/dashboard/shared/FormLangSwitch";

export default function Governorate() {
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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!editId) return;

    const fetchGovernorate = async () => {
      try {
        setLoadingContent(true);

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
        setLoadingContent(false);
      }
    };

    fetchGovernorate();
  }, [editId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setisSubmited(true);

    if (!validate()) return;

    setLoadingSubmit(true);

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
            {/* Name */}
            <div className="box forInput">
              <div>
                <label>{t.dashboard.forms.governorateName}</label>
                <label>({curentCreateLocale.toUpperCase()})</label>
              </div>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    value={translations[curentCreateLocale]?.name}
                    onChange={(e) => {
                      handleChange("name", e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        enName: null,
                      }));
                    }}
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
                <label>({curentCreateLocale.toUpperCase()})</label>
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
          </div>
          <Images limit={1} />
        </div>

       <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loadingSubmit}
          editId={editId}
        />
      </form>
    </div>
  );
}
