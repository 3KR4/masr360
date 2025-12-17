import React from "react";
import { useState, useContext, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { FaCloudUploadAlt, FaHashtag, FaLink } from "react-icons/fa";
import Image from "next/image";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";

function Images() {
  const t = useTranslate();
  const { images, setImages, isSubmited } = useContext(forms);

  const inputFileRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      return updatedImages;
    });
  };
  return (
    <div className="box forInput">
      <label htmlFor="">{t.dashboard.forms.images}</label>
      <div className="productImages">
        <div
          className={`uploadlabel ${isDrag ? "active" : null}`}
          style={{
            height: `${
              images.length === 0 && isSubmited
                ? ""
                : images.length === 0
                ? "100%"
                : ""
            }`,
            border: `2px dashed ${
              images.length === 0 && isSubmited ? "#f43521" : "#a6a6a6"
            }`,
          }}
          onClick={() => inputFileRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDrag(true);
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
            {t.dashboard.forms.imagesHint}
          </p>
          <h1
            style={{
              color: images.length === 0 && isSubmited ? "#df3a3a" : "#9b9b9b",
            }}
          >
            {isDrag ? t.dashboard.forms.dropHere : t.dashboard.forms.clickHere}
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
                src={
                  typeof image === "string"
                    ? image
                    : image?.url
                    ? image.url
                    : URL.createObjectURL(image)
                }
                alt={image.originalname || image.name || `Image-${index}`}
                width={150}
                height={150}
              />
              <p>{index + 1}</p>
              <IoClose onClick={() => handleRemoveImage(index)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Images;
