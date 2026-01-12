"use client";
import React, { useRef } from "react";

export default function OtpInputs({
  length = 5,
  value,
  onChange,
}) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const digit = e.target.value.replace(/\D/, "");
    if (!digit) return;

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(paste)) return;

    onChange(paste.split(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValue = [...value];
      newValue[index] = "";
      onChange(newValue);

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="otp-wrapper">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="box forInput">
          <div className="inputHolder">
            <div className="holder">
              <input
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={value[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onPaste={handlePaste}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
