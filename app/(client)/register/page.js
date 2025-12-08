"use client";
import "@/styles/forms.css";
import Image from "next/image";
import countryList from "react-select-country-list";
import Select from "react-select";
import React, { useState, useMemo, useContext } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { mainContext } from "@/Contexts/mainContext";

import {
  LockKeyhole,
  Mail,
  Phone,
  Eye,
  UserRound,
  EyeOff,
  CircleAlert,
} from "lucide-react";

export default function Register() {
  const { screenSize } = useContext(mainContext);

  const [isLoginPage, setIsLoginPage] = useState(false);
  const [passEye, setPassEye] = useState({ password: false, confirm: false });
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password", "");

  function iconChanging(input) {
    setPassEye((prevState) => ({ ...prevState, [input]: !prevState[input] }));
  }

  const onSubmit = (data) => {
    if (!value) {
      setError("country", {
        type: "manual",
        message: "Please select your country",
      });
      return;
    }

    console.log("Form Data Submitted:", { ...data, country: value.label });
  };

  const options = useMemo(() => countryList().getData(), []);
  const [value, setValue] = useState(null);

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  return (
    <>
      <div className="register">
        {screenSize !== "small" && (
          <Image
            className="registerBackground"
            src={`/Slides/slide-002.jpg`}
            fill
            alt="background image"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>
            {isLoginPage ? "Login into your account" : "Create your account"}
          </h1>

          {/* Full name */}
          {!isLoginPage && (
            <div
              className="box forInput"
              onClick={() => document.getElementById("fullname").focus()}
            >
              <label htmlFor="fullname">Full Name</label>
              <div className="inputHolder">
                <div className="holder">
                  <UserRound />
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
          )}

          {/* Phone */}
          {!isLoginPage && (
            <div
              className="box forInput"
              onClick={() => document.getElementById("phone").focus()}
            >
              <label htmlFor="phone">Phone Number</label>
              <div className="inputHolder">
                <div className="holder">
                  <Phone />
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        // ✅ يقبل + و أي رقم (صيغ دولية مثل +20, +1, +44)
                        value: /^\+?[0-9\s-()]{7,20}$/,
                        message:
                          "Enter a valid phone number (e.g. +20 100 123 4567)",
                      },
                    })}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <span className="error">
                    <CircleAlert />
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
          )}
          {!isLoginPage && (
            <div className="box forInput">
              <label htmlFor="country">Nationality</label>
              <div className="inputHolder">
                <div
                  className="holder nationality"
                  style={{ padding: "0", border: "none" }}
                >
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: "Please select your country" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={options}
                        placeholder="Select your country"
                        classNamePrefix="custom-select"
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: "100%",
                          }),
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "transparent",
                            borderColor: "#a6a6a6",
                            borderRadius: "8px",
                            padding: "2px 5px",
                            minHeight: "44px",
                            boxShadow: "none",
                            "&:hover": "#a6a6a6",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#484848",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#717171ff",
                            fontSize: "13px",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            borderRadius: "8px",
                            zIndex: 10,
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#efb034" // background when selected
                              : state.isFocused
                              ? "#f0f0f0" // background when hovered
                              : "white", // default background
                            color: state.isSelected ? "white" : "#333", // text color
                            cursor: "pointer",
                            fontSize: "15px",
                          }),
                        }}
                        value={field.value}
                        onChange={(selected) => field.onChange(selected)}
                      />
                    )}
                  />
                </div>

                {errors.country && (
                  <span className="error">
                    <CircleAlert />
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Email */}
          <div
            className="box forInput"
            onClick={() => document.getElementById("email").focus()}
          >
            <label htmlFor="email">Email Address</label>
            <div className="inputHolder">
              <div className="holder">
                <Mail />
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <span className="error">
                  <CircleAlert />
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div
            className="box forInput"
            onClick={() => document.getElementById("password").focus()}
          >
            <label htmlFor="password">Password</label>
            <div className="inputHolder password">
              <div className="holder">
                <LockKeyhole />

                <input
                  type={passEye.password ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  placeholder="Enter your password"
                />
                {passEye.password ? (
                  <Eye
                    className="eye"
                    onClick={() => iconChanging("password")}
                  />
                ) : (
                  <EyeOff
                    className="eye"
                    onClick={() => iconChanging("password")}
                  />
                )}
              </div>
              {errors.password && (
                <span className="error">
                  <CircleAlert />
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          {!isLoginPage && (
            <div
              className="box forInput"
              onClick={() =>
                document.getElementById("passwordConfirmation").focus()
              }
            >
              <label htmlFor="confirm">Confirm Password</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />

                  <input
                    type={passEye.confirm ? "text" : "password"}
                    id="passwordConfirmation"
                    {...register("passwordConfirmation", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    placeholder="Confirm your password"
                  />
                  {passEye.confirm ? (
                    <Eye
                      className="eye"
                      onClick={() => iconChanging("confirm")}
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() => iconChanging("confirm")}
                    />
                  )}
                </div>
                {errors.passwordConfirmation && (
                  <span className="error">
                    <CircleAlert />
                    {errors.passwordConfirmation.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Forgot Password */}
          {isLoginPage && (
            <p className="didntHasAccount">
              Forgot your password?
              <button className="mineLink">reset password</button>
            </p>
          )}

          {/* Buttons */}

          <button
            className={`main-button ${loadingSpinner ? "loading" : ""}`}
            type="submit"
          >
            <div className="lds-dual-ring"></div>
            <span>{isLoginPage ? "Login" : "Create account"}</span>
          </button>

          <div className="otherWay">
            <hr />
            <span>Or continue with</span>
            <hr />
          </div>
          <div className="social-btns">
            <div className="btn">
              <Image
                src={`/google-icon.png`}
                width={24}
                height={24}
                alt="google icon"
              />
              Google
            </div>
            <div className="btn">
              <Image
                src={`/facebook-icon.png`}
                width={24}
                height={24}
                alt="facebook icon"
              />
              Facebook
            </div>
          </div>
          <div className="didntHasAccount">
            {isLoginPage ? "Didnt" : "Already"} have an account?{" "}
            <div
              className="mineLink"
              onClick={() => {
                setIsLoginPage((prev) => !prev);
                reset();
              }}
            >
              {isLoginPage ? "Create account" : "Log in"}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
