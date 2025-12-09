"use client";
import React, { useContext, useState, useRef } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { UserRound, CircleAlert } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const { screenSize } = useContext(mainContext);

  return (
    <div className="body">
      <form>
        <div
          className="box forInput"
          onClick={() => document.getElementById("fullname").focus()}
        >
          <label htmlFor="fullname">Full Name</label>
          <div className="inputHolder">
            <div className="holder">
              <input
                type="text"
                id="fullname"
                {...register("fullname", {
                  required: "Your Full Name is required",
                  validate: (value) => {
                    const words = value.trim().split(/\s+/);
                    if (words.length < 2)
                      return "Please enter at least two words";
                    if (words.some((word) => word.length < 2))
                      return "Each word must have at least 2 letters";
                    return true;
                  },
                })}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullname && (
              <span className="error">
                <CircleAlert />
                {errors.fullname.message}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
