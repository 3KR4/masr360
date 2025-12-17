import React, { useState, useContext } from "react";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";

function Tickets() {
  const t = useTranslate();
  const { specifications, setSpecifications, compsErrors, updateCompsError } =
    useContext(forms);

  const [tickets, setTickets] = useState({
    type: "free", // "free" | "static" | "staticEgFr" | "regionAge" | "regionAgeEgFr"
    price: "",
    egyptian: "",
    foreigner: "",
    students: { egyptian: "", foreigner: "" },
    adults: { egyptian: "", foreigner: "" },
    seniors: { egyptian: "", foreigner: "" },
  });

  const selectTicketType = (type) => {
    switch (type) {
      case "free":
        setTickets({ type: "free" });
        break;
      case "static":
        setTickets({ type: "static", price: "" });
        break;
      case "staticEgFr":
        setTickets({ type: "staticEgFr", egyptian: "", foreigner: "" });
        break;
      case "regionAge":
        setTickets({
          type: "regionAge",
          students: { egyptian: "", foreigner: "" },
          adults: { egyptian: "", foreigner: "" },
          seniors: { egyptian: "", foreigner: "" },
        });
        break;
      case "regionAgeEgFr":
        setTickets({
          type: "regionAgeEgFr",
          students: { egyptian: "", foreigner: "" },
          adults: { egyptian: "", foreigner: "" },
          seniors: { egyptian: "", foreigner: "" },
        });
        break;
      default:
        setTickets({ type: "free" });
    }
  };

  const handleTicketChange = (group, key, value) => {
    if (group === "price") {
      setTickets((prev) => ({ ...prev, price: value }));
    } else if (group === "egyptian" || group === "foreigner") {
      setTickets((prev) => ({ ...prev, [group]: value }));
    } else {
      setTickets((prev) => ({
        ...prev,
        [group]: { ...prev[group], [key]: value },
      }));
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
                tickets.type === opt.value ? "active" : ""
              }`}
              onClick={() => selectTicketType(opt.value)}
            >
              {tickets.type === opt.value && <span>✔</span>} {opt.label}
            </label>
          ))}
        </div>

        {!tickets.type.startsWith("free") && <hr />}

        {/* عرض الحقول بناءً على الاختيار */}
        {tickets.type === "static" && (
          <div className="tickets-prices">
            <div className="ticket-group">
              <label>{t.dashboard.forms.price}</label>
              <input
                type="number"
                placeholder={t.dashboard.forms.price}
                value={tickets.price}
                onChange={(e) =>
                  handleTicketChange("price", null, e.target.value)
                }
              />
            </div>
          </div>
        )}

        {tickets.type === "staticEgFr" && (
          <div className="tickets-prices">
            <div className="ticket-group">
              <label>{t.dashboard.forms.price}</label>
              <div className="spec-item">
                <input
                  type="number"
                  placeholder={t.dashboard.forms.egyptian}
                  value={tickets.egyptian}
                  onChange={(e) =>
                    handleTicketChange("egyptian", null, e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder={t.dashboard.forms.foreigner}
                  value={tickets.foreigner}
                  onChange={(e) =>
                    handleTicketChange("foreigner", null, e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {(tickets.type === "regionAge" || tickets.type === "regionAgeEgFr") && (
          <div className="tickets-prices">
            {["students", "adults", "seniors"].map((group) => (
              <div className="ticket-group" key={group}>
                <label>{t.dashboard.forms[group]}</label>
                <div className="spec-item">
                  {(tickets.type === "regionAge"
                    ? ["egyptian"]
                    : ["egyptian", "foreigner"]
                  ).map((key) => (
                    <input
                      key={key}
                      type="number"
                      placeholder={
                        tickets.type === "regionAge"
                          ? t.dashboard.forms.egyptian
                          : `${t.dashboard.forms[key]} (${
                              key === "egyptian" ? "Local" : "Foreign"
                            })`
                      }
                      value={tickets[group][key]}
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
