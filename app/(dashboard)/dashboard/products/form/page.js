"use client";
import React, { useRef, useState } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { CircleAlert } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import { IoClose } from "react-icons/io5";
import { FaCloudUploadAlt, FaHashtag, FaLink } from "react-icons/fa";

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");

  const defaultSpecs = [];
  const [specifications, setSpecifications] = useState(defaultSpecs);
  const [specError, setSpecError] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();

    if (!trimmed || trimmed.length < 3) {
      setTagError("the tag must be at least 3 characters");
      return;
    }

    if (tags.includes(trimmed.toLowerCase())) {
      setTagError("this tag has already been added before");
      return;
    }

    setTags([...tags, trimmed.toLowerCase()]);
    setTagInput("");
    setTagError("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    setTagError("");
  };

  // SPECIFICATIONS VALIDATION ------------------------------
  const updateSpec = (index, field, value) => {
    const updated = [...specifications];

    // check length
    if (value.trim().length > 0 && value.trim().length < 3) {
      setSpecError("specification key/value must be at least 3 characters");
    } else {
      setSpecError("");
    }

    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addSpecification = () => {
    // check if any existing spec is invalid
    for (let s of specifications) {
      if (
        !s.key.trim() ||
        !s.value.trim() ||
        s.key.trim().length < 3 ||
        s.value.trim().length < 3
      ) {
        setSpecError(
          "complete the existing specifications before adding a new one"
        );
        return;
      }
    }

    setSpecError("");
    setSpecifications([...specifications, { key: "", value: "" }]);
  };
  const removeSpecs = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
    setSpecError("");
  };

  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  const [addImages, setAddImages] = useState(false);
  const inputFileRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [isSubmited, setisSubmited] = useState(false);
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
      const removed = prevImages[index];

      // Filter out the image at the given index
      const updatedImages = prevImages.filter((_, i) => i !== index);

      // If it's a previously uploaded image and we're editing the post
      if (removed?.publicid && openForm.mode === "edit") {
        setRemovedImages((prev) => [...prev, removed.publicid]);
      }

      // If no images left after removal, hide the image section
      if (updatedImages.length === 0) {
        setAddImages(false);
      }

      return updatedImages;
    });
  };

  // SUBMIT VALIDATION --------------------------------------
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      tags,
      specifications: specifications.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
    };

    console.log("FINAL DATA:", finalData);
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PRODUCT TITLE */}
        <div className="box forInput">
          <label htmlFor="title">title</label>
          <div className="inputHolder">
            <div className="holder">
              <input
                type="text"
                id="title"
                {...register("title", {
                  required: "the product title is required",
                  minLength: {
                    value: 3,
                    message: "the product title must be at least 3 letters",
                  },
                })}
                placeholder="Enter product title"
              />
            </div>
            {errors.title && (
              <span className="error">
                <CircleAlert />
                {errors.title.message}
              </span>
            )}
          </div>
        </div>
        <div className="row-holder">
          {/* STOCK */}
          <div className="box forInput">
            <label htmlFor="stock">stock</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="number"
                  id="stock"
                  defaultValue={1}
                  {...register("stock", {
                    required: "stock is required",
                    min: { value: 1, message: "minimum stock is 1" },
                  })}
                  placeholder="enter Stock quantity"
                />
              </div>
              {errors.stock && (
                <span className="error">
                  <CircleAlert />
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>

          {/* PRICE */}
          <div className="box forInput">
            <label htmlFor="price">price</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="number"
                  id="price"
                  {...register("price", {
                    required: "price is required",
                    min: { value: 1, message: "price must be more than 0" },
                  })}
                  placeholder="Enter product price"
                />
              </div>
              {errors.price && (
                <span className="error">
                  <CircleAlert />
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          {/* SALE */}
          <div className="box forInput">
            <label htmlFor="sale">sale (%)</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="number"
                  id="sale"
                  {...register("sale", {
                    validate: (v) =>
                      v == "" || v <= 90 || "sale cannot exceed 90%",
                  })}
                  placeholder="Enter sale percentage"
                />
              </div>
              {errors.sale && (
                <span className="error">
                  <CircleAlert />
                  {errors.sale.message}
                </span>
              )}
            </div>
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
                placeholder="Enter product description"
              />
            </div>
          </div>
        </div>

        <div className="row-holder for-tags-specs">
          <div className="column-holder">
            {/* TAGS */}
            <div className="box forInput">
              <label>tags</label>
              <div className="inputHolder tags">
                <div className="holder flex">
                  <input
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setTagError("");
                    }}
                    placeholder="enter your tags"
                  />
                  <button
                    className="main-button for-tags"
                    type="button"
                    onClick={addTag}
                  >
                    Add
                  </button>
                </div>
                {tagError && (
                  <span className="error">
                    <CircleAlert />
                    {tagError}
                  </span>
                )}
                {tags.length > 0 && (
                  <div className="tagsList">
                    {tags.map((t, i) => (
                      <span
                        key={i}
                        className="tag"
                        onClick={() => removeTag(i)}
                      >
                        {t}
                        <IoClose />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SPECIFICATIONS */}
            <div className="box forInput">
              <label>specifications</label>

              <ul className="spec-list">
                {specifications.map((spec, i) => (
                  <li className="spec-item" key={i}>
                    <input
                      type="text"
                      placeholder="key"
                      value={spec.key}
                      onChange={(e) => updateSpec(i, "key", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="value"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                    />
                    <IoClose onClick={() => removeSpecs(i)} />
                  </li>
                ))}
                {specError && (
                  <span className="error">
                    <CircleAlert />
                    {specError}
                  </span>
                )}
                <button
                  type="button"
                  className="main-button for-specs"
                  onClick={addSpecification}
                >
                  Add specification
                </button>
              </ul>
            </div>
          </div>

          <div className="box forInput">
            <label>Images</label>
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
                    color:
                      images.length === 0 && isSubmited
                        ? "red"
                        : "#a6a6a6",
                  }}
                />
                <p
                  style={{
                    color:
                      images.length === 0 && isSubmited ? "red" : "#9b9b9b",
                  }}
                >
                  click or drop images her
                </p>
                <h1
                  style={{
                    color:
                      images.length === 0 && isSubmited ? "#df3a3a" : "#9b9b9b",
                  }}
                >
                  {isDrag ? "drop her" : "click her"}
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
                  you must upload at least 1 image
                </span>
              )}
              <div className="imgHolder">
                {images.map((image, index) => (
                  <div className="uploaded" key={index}>
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : image?.url
                          ? image.url
                          : URL.createObjectURL(image)
                      }
                      alt={image.originalname || image.name || `Image-${index}`}
                      width="150"
                    />
                    <p>{index + 1}</p>
                    <IoClose onClick={() => handleRemoveImage(index)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          className="main-button"
          type="submit"
          onClick={() => {
            setisSubmited(true);
          }}
        >
          <span>Create product</span>
        </button>
      </form>
    </div>
  );
}
