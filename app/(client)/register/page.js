"use client";
import "@/styles/forms.css";
import Image from "next/image";
import countryList from "react-select-country-list";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import { GrLanguage } from "react-icons/gr";

import { FaRegCircleUser } from "react-icons/fa6";

import OtpInputs from "@/components/Otp";
import { MdMarkEmailUnread } from "react-icons/md";

import {
  LockKeyhole,
  Mail,
  Phone,
  Eye,
  UserRound,
  EyeOff,
  CircleAlert,
} from "lucide-react";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";

export default function Register() {
  const t = useTranslate();
  const auth = t.auth;

  console.log(t);

  const STEPS = {
    ACCOUNT: 1,
    LOGIN: 2,
    EMAIL_VERIFY: 3,
    FORGET_PASS_VERIFY: 4,
    VIEW_OR_UPDATE_PASS: 5,
  };
  const options = useMemo(() => countryList().getData(), []);
  const [step, setStep] = useState(STEPS.ACCOUNT);

  const [activeNational, setActiveNational] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const filteredCountries = options.filter((x) =>
    x.label.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password", "");
  const [passEye, setPassEye] = useState({ password: false, confirm: false });
  const newPassValue = watch("newPass");

  const OTP_LENGTH = 5;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  useEffect(() => {
    if (step === STEPS.PHONE_VERIFY || step === STEPS.EMAIL_VERIFY) {
      setOtp(Array(OTP_LENGTH).fill(""));
    }
  }, [step]);

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    if (step === STEPS.LOGIN) {
      console.log("LOGIN DATA", data);
      return;
    }

    if (step === STEPS.ACCOUNT) {
      setStep(STEPS.EMAIL_VERIFY);
      return;
    }
    if (step === STEPS.FORGET_PASS_VERIFY) {
      setStep(STEPS.VIEW_OR_UPDATE_PASS);
      return;
    }

    console.log("FINAL REQUEST", {
      userData: data,
    });
  };

  const titles = {
    [STEPS.ACCOUNT]: auth.createAccount,
    [STEPS.LOGIN]: auth.loginToAccount,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmail,
    [STEPS.FORGET_PASS_VERIFY]: auth.forgetPass,
    [STEPS.VIEW_OR_UPDATE_PASS]: auth.userVerified,
  };

  const descriptions = {
    [STEPS.ACCOUNT]: auth.accountDescription,
    [STEPS.LOGIN]: auth.loginDescription || "",
    [STEPS.EMAIL_VERIFY]: auth.emailDescription,
    [STEPS.FORGET_PASS_VERIFY]: auth.emailDescription,
    [STEPS.VIEW_OR_UPDATE_PASS]: auth.userVerifiedDescription,
  };

  const buttonLabels = {
    [STEPS.ACCOUNT]: auth.createAccountBtn,
    [STEPS.LOGIN]: auth.login,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmailBtn,
    [STEPS.FORGET_PASS_VERIFY]: auth.forgetPassBtn,
    [STEPS.VIEW_OR_UPDATE_PASS]: newPassValue
      ? auth.update_pass_and_continue
      : auth.login,
  };

  return (
    <div className="form-holder">
      <form onSubmit={handleSubmit(onSubmit)}>
        {[STEPS.EMAIL_VERIFY, STEPS.FORGET_PASS_VERIFY].includes(step) && (
          <MdMarkEmailUnread className="big-ico" />
        )}
        <div className="top">
          <h1>{titles[step]}</h1>
          <p>{descriptions[step]}</p>
        </div>

        {/* ================= LOGIN ================= */}
        {step === STEPS.LOGIN && (
          <>
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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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

            <div className="box forInput">
              <label>{auth.password}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("loginPassword", {
                      required: auth.errors.requiredPassword,
                    })}
                    placeholder={auth.placeholders.password}
                  />
                  {passEye.password ? (
                    <Eye
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
                    />
                  )}
                </div>
                {errors.loginPassword && (
                  <span className="error">
                    <CircleAlert />
                    {errors.loginPassword.message}
                  </span>
                )}
              </div>
            </div>
            <div
              className="have-problem"
              onClick={() => {
                setStep(STEPS.FORGET_PASS_VERIFY);
                reset();
              }}
            >
              {auth.forgetPassword}{" "}
              <span className="mineLink">{auth.password}</span>
            </div>
          </>
        )}

        {/* ================= REGISTER STEP 1 ================= */}
        {step === STEPS.ACCOUNT && (
          <>
            {/* Full name */}
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

            {/* Phone */}
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
            <div
              className="box forInput"
              onClick={() => document.getElementById("nationality").focus()}
            >
              <label htmlFor="phone">nationality</label>
              <div className="filters for-cats">
                <div className="btn">
                  <GrLanguage />
                  <h4
                    onClick={() => setActiveNational(true)}
                    className="ellipsis"
                  >
                    {activeNational ? (
                      <input
                        autoFocus
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Select your country"
                        className="search-input"
                        id="nationality"
                      />
                    ) : !selectedCountry ? (
                      "Select your country"
                    ) : (
                      `Country: ${selectedCountry}`
                    )}
                  </h4>

                  {activeNational ? (
                    <IoMdClose
                      className="main-ico"
                      onClick={() => setActiveNational(false)}
                    />
                  ) : (
                    <IoIosArrowDown
                      className="main-ico"
                      onClick={() => setActiveNational(true)}
                    />
                  )}
                </div>

                <div className={`menu ${activeNational ? "active" : ""}`}>
                  {filteredCountries?.length > 0 ? (
                    filteredCountries.map((country, index) => (
                      <button
                        key={index}
                        className={`${
                          selectedCountry === country.label ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedCountry(
                            selectedCountry === country.label
                              ? ""
                              : country.label
                          );
                          setActiveNational(false);
                          setCountrySearch("");
                        }}
                      >
                        {country.label}
                      </button>
                    ))
                  ) : (
                    <div className="no-results">No results</div>
                  )}
                </div>
              </div>
            </div>

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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
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
                      onClick={() =>
                        setPassEye((p) => ({ ...p, confirm: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, confirm: true }))
                      }
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
          </>
        )}

        {/* ================= VIEW/UPDATE PASSWORD ================= */}
        {step === STEPS.VIEW_OR_UPDATE_PASS && (
          <>
            <div className="box forInput">
              <label>{auth.viewYourCurrentPassword}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    value={"Aa123456@"}
                    readOnly
                  />
                  {passEye.password ? (
                    <Eye
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="box forInput">
              <label>
                {auth.makeNewPassword} <span>({auth.optional})</span>
              </label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("newPass", {
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?~\-]).{8,}$/,
                        message: t.auth.errors.passwordWeak,
                      },
                    })}
                    placeholder={auth.placeholders.newPassword}
                  />
                  {passEye.password ? (
                    <Eye
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
                    />
                  )}
                </div>
                {errors.newPass && (
                  <span className="error">
                    <CircleAlert />
                    {errors.newPass.message}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* ================= OTP VERIFICATION ================= */}
        {(step === STEPS.EMAIL_VERIFY || step === STEPS.FORGET_PASS_VERIFY) && (
          <>
            <OtpInputs length={OTP_LENGTH} value={otp} onChange={setOtp} />
          </>
        )}

        {/* ================= SUBMIT BUTTON ================= */}
        <button type="submit" className="main-button">
          {buttonLabels[step]}
        </button>

        {/* ================= SOCIAL LOGIN ================= */}
        {(step === STEPS.ACCOUNT || step === STEPS.LOGIN) && (
          <>
            <div className="otherWay">
              <hr />
              <span>
                {step === STEPS.LOGIN ? auth.orLoginWith : auth.orContinueWith}
              </span>
              <hr />
            </div>
            <div className="social-btns">
              <div className="btn">
                <Image
                  src={`/google-icon.png`}
                  width={22}
                  height={22}
                  alt="google icon"
                />
                {auth.google}
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
          </>
        )}

        {/* ================= SWITCH BETWEEN LOGIN/REGISTER ================= */}
        {(step === STEPS.ACCOUNT || step === STEPS.LOGIN) && (
          <div
            className="have-problem"
            onClick={() => {
              setStep(step === STEPS.ACCOUNT ? STEPS.LOGIN : STEPS.ACCOUNT);
              reset();
            }}
          >
            {step === STEPS.LOGIN ? auth.noAccount : auth.haveAccount}{" "}
            <span className="mineLink">
              {step === STEPS.LOGIN ? auth.createAccountBtn : auth.login}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
