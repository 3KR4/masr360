"use client";
import React, { useState, useContext } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";

export default function CreatePlace() {
  const { setisSubmited, tags, images, specifications, selectedCat } =
    useContext(forms);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [tickets, setTickets] = useState({
    free: false,
    students: { egyptian: "", foreigner: "" },
    adults: { egyptian: "", foreigner: "" },
    seniors: { egyptian: "", foreigner: "" },
  });

  const selectTicketType = (isFree) => {
    if (isFree) {
      setTickets({
        free: true,
        students: { egyptian: "", foreigner: "" },
        adults: { egyptian: "", foreigner: "" },
        seniors: { egyptian: "", foreigner: "" },
      });
    } else {
      setTickets((prev) => ({
        ...prev,
        free: false,
      }));
    }
  };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  // SUBMIT VALIDATION --------------------------------------
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      images: images,
      category: selectedCat,
      subCategory: selectedCat,
      Governorate: selectedCat,
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
          {/* GOVERNORATE */}
          <SelectOptions
            label="Governorate"
            placeholder="Select governorate"
            options={govs.map((g) => ({ name: g }))}
            value={selectedGov}
            onChange={(g) => setSelectedGov(g.name)}
          />
        </div>
        <div className="row-holder two-column">
          <SelectOptions
            label="Category"
            placeholder="Select category"
            options={tourismCategories}
            value={selectedCategory?.name}
            onChange={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory("");
            }}
          />
          <SelectOptions
            label="Sub Category"
            placeholder="Select sub category"
            options={selectedCategory?.subcategories || []}
            value={selectedSubCategory}
            disabled={!selectedCategory}
            onChange={(sub) => setSelectedSubCategory(sub.name)}
          />
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
          {/* GOOGLE MAPS LINK */}
          <div className="box forInput">
            <label htmlFor="locationLink">Google Maps Link</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="url"
                  id="locationLink"
                  placeholder="https://maps.app.goo.gl/..."
                  {...register("location.link", {
                    required: "Google Maps link is required",
                    pattern: {
                      value: /^https?:\/\/(www\.)?maps\.app\.goo\.gl\/.+$/i,
                      message: "Please enter a valid Google Maps link",
                    },
                  })}
                />
              </div>

              {errors?.location?.link && (
                <span className="error">
                  <CircleAlert />
                  {errors.location.link.message}
                </span>
              )}
            </div>
          </div>

          {/* GOOGLE MAPS IFRAME */}
          <div className="box forInput">
            <label htmlFor="locationIframe">Google Maps Embed URL</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="url"
                  id="locationIframe"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  {...register("location.iFrame", {
                    required: "Google Maps embed link is required",
                    pattern: {
                      value:
                        /^https?:\/\/www\.google\.com\/maps\/embed\?pb=.*/i,
                      message: "Please enter a valid Google Maps embed URL",
                    },
                  })}
                />
              </div>

              {errors?.location?.iFrame && (
                <span className="error">
                  <CircleAlert />
                  {errors.location.iFrame.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="row-holder two-column">
          <div className="box forInput ticket">
            <label htmlFor="tickets">Tickets</label>
            <div className="row-holder two-column spec-list">
              {/* SELECT FREE OR PAID */}
              <div className="ticket-type">
                <label
                  className={`ticket-option ${!tickets.free ? "active" : ""}`}
                  onClick={() => selectTicketType(false)}
                >
                  {!tickets.free && <FaCheck />}
                  Paid Tickets
                </label>
                <label
                  className={`ticket-option ${tickets.free ? "active" : ""}`}
                  onClick={() => selectTicketType(true)}
                >
                  {tickets.free && <FaCheck />}
                  Free Entry
                </label>
              </div>
              {!tickets.free && <hr />}
              {/* PAID TICKETS FORM */}
              {!tickets.free && (
                <div className="tickets-prices">
                  {/* STUDENTS */}
                  <div className="ticket-group">
                    <label>Students</label>
                    <div className="spec-item">
                      <input
                        type="number"
                        placeholder="Egyptian"
                        value={tickets.students.egyptian}
                        onChange={(e) =>
                          handleTicketChange(
                            "students",
                            "egyptian",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="Foreigner"
                        value={tickets.students.foreigner}
                        onChange={(e) =>
                          handleTicketChange(
                            "students",
                            "foreigner",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* ADULTS */}
                  <div className="ticket-group">
                    <label>Adults</label>
                    <div className="spec-item">
                      <input
                        type="number"
                        placeholder="Egyptian"
                        value={tickets.adults.egyptian}
                        onChange={(e) =>
                          handleTicketChange(
                            "adults",
                            "egyptian",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="Foreigner"
                        value={tickets.adults.foreigner}
                        onChange={(e) =>
                          handleTicketChange(
                            "adults",
                            "foreigner",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* SENIORS */}
                  <div className="ticket-group">
                    <label>Seniors</label>
                    <div className="spec-item">
                      <input
                        type="number"
                        placeholder="Egyptian"
                        value={tickets.seniors.egyptian}
                        onChange={(e) =>
                          handleTicketChange(
                            "seniors",
                            "egyptian",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="Foreigner"
                        value={tickets.seniors.foreigner}
                        onChange={(e) =>
                          handleTicketChange(
                            "seniors",
                            "foreigner",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
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
          <span>Create place</span>
        </button>
      </form>
    </div>
  );
}
import { FaCheck } from "react-icons/fa";
import { govs, tourismCategories } from "@/data";
