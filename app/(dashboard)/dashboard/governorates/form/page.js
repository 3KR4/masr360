"use client";
import React, { useContext, useState } from "react";
import { CircleAlert } from "lucide-react";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import { forms } from "@/Contexts/forms";
import { create } from "@/services/govenorates/govenorates.service";
import useTranslate from "@/Contexts/useTranslation";
import { useRouter } from "next/navigation";

export default function Governorate() {
  const { setisSubmited, images } = useContext(forms);
  const t = useTranslate();

  const router = useRouter();
  const [curentCreateLocale, setCurentCreateLocale] = useState("en");

  const [translations, setTranslations] = useState({
    en: { name: "", desc: "" },
    ar: { name: "", desc: "" },
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

    if (!translations.en.name.trim()) {
      newErrors.enName = "English name is required";
    } else if (translations.en.name.length < 3) {
      newErrors.enName = "English name must be at least 3 characters";
    }

    if (!translations.ar.name.trim()) {
      newErrors.arName = "Arabic name is required";
    } else if (translations.ar.name.length < 3) {
      newErrors.arName = "Arabic name must be at least 3 characters";
    }

    if (!images || !images[0]) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    console.log(images[0]);

    try {
      const formData = new FormData();
      formData.append("img", images[0]);
      formData.append("name", translations.en.name);
      formData.append("desc", translations.en.desc);

      formData.append(
        "translations",
        JSON.stringify({
          en: translations.en,
          ar: translations.ar,
        }),
      );

      const response = await create(formData); // هنا بيجي الرد من السيرفر
      console.log("Server Response:", response); // تشوف الرد هنا

      setisSubmited(true);
      alert("Governorate Created Successfully ✅");
      router.push("/dashboard/governorates");
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
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
                    value={translations[curentCreateLocale].name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter governorate name"
                  />
                </div>

                {errors.enName && curentCreateLocale === "en" && (
                  <span className="error">
                    <CircleAlert size={16} />
                    {errors.enName}
                  </span>
                )}

                {errors.arName && curentCreateLocale === "ar" && (
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
                    value={translations[curentCreateLocale].desc}
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

          <Images />
        </div>

        <div className="row-holder">
          <div className="lang-switch">
            {["en", "ar"].map((lng) => (
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

          <button className="main-button" type="submit">
            <span>Create Governorate</span>
          </button>
        </div>
      </form>
    </div>
  );
}
