"use client";
import React, { useState, useContext } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";
import { govs, tourismCategories } from "@/data";

export default function CreatePlace() {
  const { setisSubmited, tags, images, specifications, selectedCat } =
    useContext(forms);
  const t = useTranslate();

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
            <label htmlFor="title">{t.dashboard.forms.title}</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  id="title"
                  {...register("title", {
                    required: t.dashboard.forms.errors.titleRequired,
                    minLength: {
                      value: 3,
                      message: t.dashboard.forms.errors.titleMinLength,
                    },
                  })}
                  placeholder={t.dashboard.forms.titlePlaceholder}
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

          <SelectOptions
            label={t.dashboard.forms.governorate}
            placeholder={t.dashboard.forms.selectGovernorate}
            options={govs.map((g) => ({ name: g }))}
            value={selectedGov}
            onChange={(g) => setSelectedGov(g.name)}
          />
        </div>

        <div className="row-holder two-column">
          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.selectCategory}
            options={tourismCategories}
            value={selectedCategory?.name}
            onChange={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory("");
            }}
          />
          <SelectOptions
            label={t.dashboard.forms.subCategory}
            placeholder={t.dashboard.forms.selectSubCategory}
            options={selectedCategory?.subcategories || []}
            value={selectedSubCategory}
            disabled={!selectedCategory}
            onChange={(sub) => setSelectedSubCategory(sub.name)}
          />
        </div>
        <div className="row-holder two-column">
          <div className="box forInput">
            <label htmlFor="startDate">Start Date</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="datetime-local"
                  id="startDate"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                />
              </div>
              {errors.startDate && (
                <span className="error">
                  <CircleAlert />
                  {errors.startDate.message}
                </span>
              )}
            </div>
          </div>

          <div className="box forInput">
            <label htmlFor="endDate">End Date</label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="datetime-local"
                  id="endDate"
                  {...register("endDate", { required: "End date is required" })}
                />
              </div>
              {errors.endDate && (
                <span className="error">
                  <CircleAlert />
                  {errors.endDate.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="box forInput">
          <label htmlFor="description">{t.dashboard.forms.description}</label>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="description"
                {...register("description")}
                placeholder={t.dashboard.forms.descriptionPlaceholder}
              />
            </div>
          </div>
        </div>

        <div className="row-holder two-column">
          <div className="box forInput">
            <label htmlFor="locationLink">
              {t.dashboard.forms.googleMapsLink}
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="url"
                  id="locationLink"
                  placeholder={t.dashboard.forms.googleMapsLinkPlaceholder}
                  {...register("location.link", {
                    required: t.dashboard.forms.errors.googleMapsLinkRequired,
                    pattern: {
                      value: /^https?:\/\/(www\.)?maps\.app\.goo\.gl\/.+$/i,
                      message: t.dashboard.forms.errors.googleMapsLinkInvalid,
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

          <div className="box forInput">
            <label htmlFor="locationIframe">
              {t.dashboard.forms.googleMapsIframe}
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="url"
                  id="locationIframe"
                  placeholder={t.dashboard.forms.googleMapsIframePlaceholder}
                  {...register("location.iFrame", {
                    required: t.dashboard.forms.errors.googleMapsIframeRequired,
                    pattern: {
                      value:
                        /^https?:\/\/www\.google\.com\/maps\/embed\?pb=.*/i,
                      message: t.dashboard.forms.errors.googleMapsIframeInvalid,
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
            <label>{t.dashboard.forms.tickets}</label>
            <div className="row-holder two-column spec-list">
              <div className="ticket-type">
                <label
                  className={`ticket-option ${!tickets.free ? "active" : ""}`}
                  onClick={() => selectTicketType(false)}
                >
                  {!tickets.free && <span>✔</span>}
                  {t.dashboard.forms.paidTickets}
                </label>
                <label
                  className={`ticket-option ${tickets.free ? "active" : ""}`}
                  onClick={() => selectTicketType(true)}
                >
                  {tickets.free && <span>✔</span>}
                  {t.dashboard.forms.freeEntry}
                </label>
              </div>

              {!tickets.free && <hr />}

              {!tickets.free && (
                <div className="tickets-prices">
                  {["students", "adults", "seniors"].map((group) => (
                    <div className="ticket-group" key={group}>
                      <label>{t.dashboard.forms[group]}</label>
                      <div className="spec-item">
                        <input
                          type="number"
                          placeholder={t.dashboard.forms.egyptian}
                          value={tickets[group].egyptian}
                          onChange={(e) =>
                            handleTicketChange(
                              group,
                              "egyptian",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="number"
                          placeholder={t.dashboard.forms.foreigner}
                          value={tickets[group].foreigner}
                          onChange={(e) =>
                            handleTicketChange(
                              group,
                              "foreigner",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Images />
        </div>

        <button
          className="main-button"
          type="submit"
          onClick={() => setisSubmited(true)}
        >
          <span>{t.dashboard.forms.createPlace}</span>
        </button>
      </form>
    </div>
  );
}
