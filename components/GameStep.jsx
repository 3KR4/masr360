"use client";
import { useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import Images from "@/components/dashboard/forms/Images";
import { FormsCompsProvider } from "@/Contexts/forms";
import Image from "next/image";
import "@/styles/dashboard/forms.css";
export default function GameStepsAccordion({ game }) {
  const [openStep, setOpenStep] = useState(null);

  const toggleStep = (stepNumber) => {
    setOpenStep((prev) => (prev === stepNumber ? null : stepNumber));
  };

  return (
    <div className="steps-accordion">
      {game.steps.map((step) => {
        const isOpen = openStep === step.stepNumber;

        return (
          <div
            className={`step-item ${isOpen ? "active" : ""}`}
            key={step.stepNumber}
          >
            <div
              className={`step-header ${isOpen ? "open" : ""}`}
              onClick={() => toggleStep(step.stepNumber)}
            >
              <h4>
                {step.stepNumber}.{" "}
                {step.type === "interactive"
                  ? step.interactiveData.title
                  : step.questionData.question}
              </h4>

              <span className="coins">
                {step.coins} <FaMoneyBillWave />
              </span>
            </div>

            {isOpen && (
              <div className="step-content">
                {step.type === "interactive" && (
                  <>
                    <p>{step.interactiveData.description}</p>
                    {step.interactiveData.locationImage && (
                      <div className="location-image">
                        <Image
                          src={
                            `/footer-bg.png` ||
                            step.interactiveData.locationImage
                          }
                          alt={step.interactiveData.title}
                          fill
                        />
                      </div>
                    )}
                    <p>
                      <strong>Location:</strong> {step.interactiveData.location}
                    </p>

                    {step.interactiveData.uploadType === "image" && (
                      <FormsCompsProvider>
                        <Images />
                      </FormsCompsProvider>
                    )}
                  </>
                )}

                {step.type === "question" && (
                  <div className="question">
                    <p>{step.questionData.question}</p>

                    <div className="options">
                      {step.questionData.options.map((opt) => (
                        <button key={opt.id} className="option">
                          {opt.text}
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
