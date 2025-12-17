"use client";
import React, { useContext } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import { forms } from "@/Contexts/forms";

export default function Governorate() {
  const { setisSubmited, images } = useContext(forms);

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
              {/* PRODUCT TITLE */}
              <label htmlFor="name">name</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "the Governorate name is required",
                      minLength: {
                        value: 3,
                        message:
                          "the Governorate name must be at least 3 letters",
                      },
                    })}
                    placeholder="Enter Governorate name"
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

            {/* DESCRIPTION */}
            <div className="box forInput">
              <label htmlFor="description">description</label>
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter governorate description"
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
          onClick={() => {
            setisSubmited(true);
          }}
        >
          <span>Create Governorates</span>
        </button>
      </form>
    </div>
  );
}
