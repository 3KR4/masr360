"use client";
import { useState, useRef, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import Images from "@/components/dashboard/forms/Images";
import { FormsCompsProvider } from "@/Contexts/forms";
import Image from "next/image";
import "@/styles/dashboard/forms.css";
import useTranslate from "@/Contexts/useTranslation";

export default function GameStepsAccordion({ game }) {
  const t = useTranslate();
  const [openStep, setOpenStep] = useState(null);
  const stepRefs = useRef({});
  const contentRefs = useRef({});
  const [heights, setHeights] = useState({});

  const toggleStep = (stepNumber) => {
    setOpenStep((prev) => (prev === stepNumber ? null : stepNumber));
  };

  useEffect(() => {
    if (!openStep) return;

    const contentEl = contentRefs.current[openStep];
    const stepEl = stepRefs.current[openStep];

    if (!contentEl || !stepEl) return;

    const height = contentEl.scrollHeight;

    setHeights((prev) => ({
      ...prev,
      [openStep]: height,
    }));

    requestAnimationFrame(() => {
      const offset = 80; // المسافة الإضافية
      const elementTop =
        stepEl.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    });
  }, [openStep]);

  return (
    <div className="steps-accordion">
      {game?.steps?.map((step) => {
        const isOpen = openStep === step?.stepNumber;
        console.log(step);

        return (
          <div
            ref={(el) => (stepRefs.current[step?.stepNumber] = el)}
            className={`step-item ${isOpen ? "active" : ""}`}
            key={step?.stepNumber}
          >
            <div
              className={`step-header ${isOpen ? "open" : ""}`}
              onClick={() => toggleStep(step?.stepNumber)}
            >
              <h4>
                {step?.stepNumber}.{" "}
                {step?.type === "interactive"
                  ? step?.interactiveData?.title
                  : step?.questionData?.question}
              </h4>

              <span className="coins">
                {step?.coins} <FaMoneyBillWave />
              </span>
            </div>

            {isOpen && (
              <div
                ref={(el) => (contentRefs.current[step?.stepNumber] = el)}
                className="step-content"
                style={{
                  height: isOpen
                    ? `${heights[step?.stepNumber] || 0}px`
                    : "0px",
                }}
              >
                {step?.type === "interactive" && (
                  <>
                    <p>{step?.interactiveData?.description}</p>

                    {step?.interactiveData?.locationImage && (
                      <div className="location-image">
                        <Image
                          src={
                            `/footer-bg.png` ||
                            step?.interactiveData?.locationImage
                          }
                          alt={step?.interactiveData?.title}
                          fill
                        />
                      </div>
                    )}

                    <p>
                      <strong>{t.mainCard.location}:</strong>{" "}
                      {step?.interactiveData?.location}
                    </p>

                    {step?.interactiveData?.uploadType === "image" && (
                      <FormsCompsProvider>
                        <Images />
                      </FormsCompsProvider>
                    )}
                  </>
                )}

                {step?.type === "question" && (
                  <div className="question">
                    <p>{step?.questionData?.question}</p>

                    <div className="options">
                      {step?.questionData?.options?.map((opt) => (
                        <button key={opt?.id} className="option">
                          {opt?.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
