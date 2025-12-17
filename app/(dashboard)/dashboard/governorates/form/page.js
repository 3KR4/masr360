"use client";
import React, { useContext } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import { forms } from "@/Contexts/forms";

import useTranslate from "@/Contexts/useTranslation";
export default function Governorate() {
  const { setisSubmited, images } = useContext(forms);
const t = useTranslate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      image: images[0],
    };

    console.log("FINAL DATA:", finalData);
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row-holder two-column">
          <div className="column-holder">
            <div className="box forInput">
              <label htmlFor="name">{t.dashboard.forms.governorateName}</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required:
                        t.dashboard.forms.errors.governorateNameRequired,
                      minLength: {
                        value: 3,
                        message:
                          t.dashboard.forms.errors.governorateNameMinLength,
                      },
                    })}
                    placeholder={t.dashboard.forms.governorateNamePlaceholder}
                  />
                </div>
                {errors.name && (
                  <span className="error">
                    <CircleAlert />
                    {errors.name.message}
                  </span>
                )}
              </div>
            </div>

            <div className="box forInput">
              <label htmlFor="description">
                {t.dashboard.forms.description}
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    id="description"
                    {...register("description")}
                    placeholder={
                      t.dashboard.forms.governorateDescriptionPlaceholder
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Images />
        </div>

        <button
          className="main-button"
          type="submit"
          onClick={() => setisSubmited(true)}
        >
          <span>{t.dashboard.forms.createGovernorate}</span>
        </button>
      </form>
    </div>
  );
}
