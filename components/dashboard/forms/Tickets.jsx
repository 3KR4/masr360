import React, { useState, useContext } from "react";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";

function Tickets() {
  const t = useTranslate();
  const { tickets, setTickets, compsErrors, updateCompsError } =
    useContext(forms);

  const selectTicketType = (type) => {
    switch (type) {
      case "free":
        setTickets({ type: "free" });
        break;
      case "static":
        setTickets({ type: "static", prices: { staticPrice: "" } });
        break;
      case "staticEgFr":
        setTickets({ type: "pricePerRegion", prices: { pricePerRegion: { egyptian: "", foreign: "" } } });
        break;
      case "regionAge":
        setTickets({
          type: "pricePerAge",
          prices: {
            pricePerAge: {
              children: "",
              adults: "",
              seniors: "",
            }
          },
        });
        break;
      case "regionAgeEgFr":
        setTickets({
          type: "ageAndRegion",
          prices: {
            ageAndRegion: {
              students: { egyptian: "", foreign: "" },
              adults: { egyptian: "", foreign: "" },
              seniors: { egyptian: "", foreign: "" },
            }
          },
        });
        break;
      default:
        setTickets({ type: "free" });
    }
  };

  const handleTicketChange = (group, key, value) => {
    if (tickets.type === "static") {
      setTickets((prev) => ({
        ...prev,
        prices: { staticPrice: value }
      }));
    } else if (tickets.type === "pricePerRegion") {
      setTickets((prev) => ({
        ...prev,
        prices: {
          pricePerRegion: {
            ...prev.prices.pricePerRegion,
            [group]: value
          }
        }
      }));
    } else if (tickets.type === "pricePerAge") {
      setTickets((prev) => ({
        ...prev,
        prices: {
          pricePerAge: {
            ...prev.prices.pricePerAge,
            [group]: value
          }
        }
      }));
    } else if (tickets.type === "ageAndRegion") {
      setTickets((prev) => ({
        ...prev,
        prices: {
          ageAndRegion: {
            ...prev.prices.ageAndRegion,
            [group]: {
              ...prev.prices.ageAndRegion[group],
              [key]: value
            }
          }
        }
      }));
    }
  };

  const getActiveValue = (type) => {
    switch (type) {
      case "static": return "static";
      case "pricePerRegion": return "staticEgFr";
      case "pricePerAge": return "regionAge";
      case "ageAndRegion": return "regionAgeEgFr";
      case "free": return "free";
      default: return "free";
    }
  };

  return (
    <div className="box forInput ticket">
      <label>{t.dashboard.forms.tickets}</label>
      <div className="row-holder two-column spec-list">
        {/* اختيار نوع التذاكر */}
        <div className="ticket-type">
          {[
            { label: t.dashboard.forms.freeEntry, value: "free" },
            { label: t.dashboard.forms.staticPrice, value: "static" },
            { label: t.dashboard.forms.staticEgFr, value: "staticEgFr" },
            { label: t.dashboard.forms.regionAge, value: "regionAge" },
            { label: t.dashboard.forms.regionAgeEgFr, value: "regionAgeEgFr" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`ticket-option ${
                getActiveValue(tickets.type) === opt.value ? "active" : ""
              }`}
              onClick={() => selectTicketType(opt.value)}
            >
              {getActiveValue(tickets.type) === opt.value && <span>✔</span>} {opt.label}
            </label>
          ))}
        </div>

        {!String(tickets?.type || "free").startsWith("free") && <hr />}

        {/* عرض الحقول بناءً على الاختيار */}
        {tickets.type === "static" && (
          <div className="tickets-prices">
            <div className="ticket-group">
              <label>{t.dashboard.forms.price}</label>
              <input
                type="number"
                placeholder={t.dashboard.forms.price}
                value={tickets.prices?.staticPrice || ""}
                onChange={(e) =>
                  handleTicketChange("staticPrice", null, e.target.value)
                }
              />
            </div>
          </div>
        )}

        {tickets.type === "pricePerRegion" && (
          <div className="tickets-prices">
            <div className="ticket-group">
              <label>{t.dashboard.forms.price}</label>
              <div className="spec-item">
                <input
                  type="number"
                  placeholder={t.dashboard.forms.egyptian}
                  value={tickets.prices?.pricePerRegion?.egyptian || ""}
                  onChange={(e) =>
                    handleTicketChange("egyptian", null, e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder={t.dashboard.forms.foreigner}
                  value={tickets.prices?.pricePerRegion?.foreign || ""}
                  onChange={(e) =>
                    handleTicketChange("foreign", null, e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {(tickets.type === "pricePerAge" || tickets.type === "ageAndRegion") && (
          <div className="tickets-prices">
            {(tickets.type === "pricePerAge" ? ["children", "adults", "seniors"] : ["students", "adults", "seniors"]).map((group) => (
              <div className="ticket-group" key={group}>
                <label>{t.dashboard.forms[group]}</label>
                <div className="spec-item">
                  {(tickets.type === "pricePerAge"
                    ? ["egyptian"]
                    : ["egyptian", "foreign"]
                  ).map((key) => (
                    <input
                      key={key}
                      type="number"
                      placeholder={
                        tickets.type === "pricePerAge"
                          ? t.dashboard.forms.egyptian
                          : `${t.dashboard.forms[key]} (${
                              key === "egyptian" ? "Local" : "Foreign"
                            })`
                      }
                      value={tickets.type === "pricePerAge" ? (tickets.prices?.pricePerAge?.[group] || "") : (tickets.prices?.ageAndRegion?.[group]?.[key] || "")}
                      onChange={(e) =>
                        handleTicketChange(group, key, e.target.value)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tickets;
