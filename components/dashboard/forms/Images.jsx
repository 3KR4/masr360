import React, { useState, useContext, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";

function Images({ limit = 5 }) {
  const t = useTranslate();
  const { images, setImages, isSubmited } = useContext(forms);

  const inputFileRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);

  // ✅ Add images with limit control
  const addImages = (newFiles) => {
    setImages((prevImages) => {
      const availableSlots = limit - prevImages.length;

      if (availableSlots <= 0) return prevImages;

      const filesToAdd = newFiles.slice(0, availableSlots);

      return [...prevImages, ...filesToAdd];
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    addImages(imageFiles);
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    addImages(imageFiles);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const isLimitReached = images.length >= limit;
  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.url) return image.url; // صورة قديمة من السيرفر
    if (image instanceof File) return URL.createObjectURL(image); // صورة جديدة
    return "";
  };
  return (
    <div className="box forInput">
      <label>
        {t.dashboard.forms.images}
        <span
          style={{
            marginLeft: "10px",
            fontSize: "14px",
          }}
        >
          {images.length} / {limit}
        </span>
      </label>

      <div className="productImages">
        <div
          className={`uploadlabel ${isDrag ? "active" : ""} ${
            isLimitReached ? "disabled" : ""
          }`}
          style={{
            height: images.length === 0 && !isSubmited ? "100%" : "",
            border: `2px dashed ${
              images.length === 0 && isSubmited ? "#f43521" : "#a6a6a6"
            }`,
            opacity: isLimitReached ? 0.6 : 1,
            cursor: isLimitReached ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            if (!isLimitReached) {
              inputFileRef.current.click();
            }
          }}
          onDrop={handleDrop}
          onDragOver={(e) => {
            if (!isLimitReached) {
              e.preventDefault();
              setIsDrag(true);
            }
          }}
        >
          <FaCloudUploadAlt
            style={{
              color: images.length === 0 && isSubmited ? "red" : "#a6a6a6",
            }}
          />

          <p
            style={{
              color: images.length === 0 && isSubmited ? "red" : "#9b9b9b",
            }}
          >
            {limit == 1
              ? t.dashboard.forms.imagesHint1
              : t.dashboard.forms.imagesHintmany}
          </p>

          <h1
            style={{
              color: images.length === 0 && isSubmited ? "#df3a3a" : "#9b9b9b",
            }}
          >
            {isLimitReached
              ? t.dashboard.forms.limitReached || "Limit reached"
              : isDrag
                ? t.dashboard.forms.dropHere
                : t.dashboard.forms.clickHere}
          </h1>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={inputFileRef}
          onChange={handleInputChange}
        />

        {images.length === 0 && isSubmited && (
          <span className="error">
            <CircleAlert />
            {t.dashboard.forms.errors.imagesRequired}
          </span>
        )}

        <div className="imgHolder">
          {images.map((image, index) => (
            <div className="uploaded" key={index}>
              <Image
                src={getImageSrc(image)}
                alt={`Image-${index}`}
                width={150}
                height={150}
              />
              <p>{index + 1}</p>
              <IoClose
                onClick={() => handleRemoveImage(index)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Images;
