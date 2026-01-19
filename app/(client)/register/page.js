"use client";

import "@/styles/forms.css";
import Image from "next/image";
import countryList from "react-select-country-list";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import { GrLanguage } from "react-icons/gr";

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
  const newPassValue = watch("newPass");
  const [passEye, setPassEye] = useState({ password: false, confirm: false });

  const OTP_LENGTH = 5;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  useEffect(() => {
    if (step === STEPS.EMAIL_VERIFY || step === STEPS.FORGET_PASS_VERIFY) {
      setOtp(Array(OTP_LENGTH).fill(""));
    }
  }, [step]);

  const onSubmit = (data) => {
    if (step === STEPS.LOGIN) {
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
    [STEPS.LOGIN]: auth.loginDescription || "", // اذا مش موجود هتضيفه في ملف الترجمة
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
        {/* ================= ICON FOR OTP STEPS ================= */}
        {[STEPS.EMAIL_VERIFY, STEPS.FORGET_PASS_VERIFY].includes(step) && (
          <MdMarkEmailUnread className="big-ico" />
        )}

        {/* ================= TITLE & DESCRIPTION ================= */}
        <div className="top">
          <h1>{titles[step]}</h1>
          <p>{descriptions[step]}</p>
        </div>

        {/* ================= LOGIN ================= */}
        {step === STEPS.LOGIN && (
          <>
            {/* EMAIL */}
            <div className="box forInput">
              <label>{auth.email}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: auth.errors.requiredEmail,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: auth.errors.invalidEmail,
                      },
                    })}
                    placeholder={auth.placeholders.email}
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

            {/* PASSWORD */}
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

        {/* ================= REGISTER ================= */}
        {step === STEPS.ACCOUNT && (
          <>
            {/* FULL NAME */}
            <div className="box forInput">
              <label>{auth.fullName}</label>
              <div className="inputHolder">
                <div className="holder">
                  <UserRound />
                  <input
                    {...register("fullname", {
                      required: auth.errors.requiredFullName,
                      validate: (value) => {
                        const words = value.trim().split(/\s+/);
                        if (words.length < 2)
                          return auth.errors.fullNameTwoWords;
                        return true;
                      },
                    })}
                    placeholder={auth.placeholders.fullName}
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

            {/* PHONE */}
            <div className="box forInput">
              <label>{auth.phone}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Phone />
                  <input
                    type="tel"
                    {...register("phone", {
                      required: auth.errors.requiredPhone,
                      pattern: {
                        value: /^\+?[0-9\s-()]{7,20}$/,
                        message: auth.errors.invalidPhone,
                      },
                    })}
                    placeholder={auth.placeholders.phone}
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

            {/* NATIONALITY */}
            <div className="box forInput">
              <label>{auth.chooseNationality}</label>
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
                        placeholder={auth.chooseNationality}
                        className="search-input"
                      />
                    ) : !selectedCountry ? (
                      auth.chooseNationality
                    ) : (
                      selectedCountry
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
                    <div className="no-results">
                      {auth.noResults || "No results"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="box forInput">
              <label>{auth.email}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: auth.errors.requiredEmail,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: auth.errors.invalidEmail,
                      },
                    })}
                    placeholder={auth.placeholders.email}
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

            {/* PASSWORD */}
            <div className="box forInput">
              <label>{auth.password}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("password", {
                      required: auth.errors.requiredPassword,
                      minLength: {
                        value: 8,
                        message: auth.errors.passwordWeak,
                      },
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
                {errors.password && (
                  <span className="error">
                    <CircleAlert />
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="box forInput">
              <label>{auth.confirmPassword}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.confirm ? "text" : "password"}
                    {...register("passwordConfirmation", {
                      required: auth.errors.passwordMismatch,
                      validate: (value) =>
                        value === password || auth.errors.passwordMismatch,
                    })}
                    placeholder={auth.placeholders.confirmPassword}
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

        {/* ================= VIEW OR UPDATE PASSWORD ================= */}
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
                        message: auth.errors.passwordWeak,
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

        {/* ================= OTP ================= */}
        {(step === STEPS.EMAIL_VERIFY || step === STEPS.FORGET_PASS_VERIFY) && (
          <OtpInputs length={OTP_LENGTH} value={otp} onChange={setOtp} />
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
              <div className="btn">Facebook</div>
            </div>
          </>
        )}

        {/* ================= SWITCH LOGIN/REGISTER ================= */}
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
