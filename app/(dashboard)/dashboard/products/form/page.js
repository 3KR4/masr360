"use client";
import React, { useRef, useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Tags from "@/components/dashboard/forms/Tags";
import Images from "@/components/dashboard/forms/Images";
import Specs from "@/components/dashboard/forms/Specs";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";

export default function CreateProduct() {
  const { setisSubmited, tags, images, specifications, selectedCat } =
    useContext(forms);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const defaultSpecs = [];

  // SUBMIT VALIDATION --------------------------------------
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      tags,
      images: images,
      category: selectedCat,
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
        <div className="row-holder two-column">
          <div className="box forInput">
            {/* PRODUCT TITLE */}
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
          <SelectOptions />
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

        <div className="row-holder two-column">
          <div className="column-holder">
            <Tags />

            {/* SPECIFICATIONS */}
            <Specs />
          </div>

          <Images />
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
