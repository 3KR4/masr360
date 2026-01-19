"use client";
import formatCurrency from "@/utlies/curancy";

export default function PlaceTickets({ tickets }) {
  if (!tickets || tickets.type === "free") {
    return;
  }

  return (
    <div className="tickets">
      <div className="top">
        <h4>Tickets Price</h4>
      </div>

      <div className="tickets-list">
        {/* STATIC PRICE */}
        {tickets.type === "static" && (
          <div className="single">
            <ul>
              <li>{formatCurrency(tickets.prices.staticPrice)}</li>
            </ul>
          </div>
        )}

        {/* PRICE PER AGE */}
        {tickets.type === "pricePerAge" && (
          <>
            <TicketGroup
              title="Children"
              price={tickets.prices.pricePerAge.children}
            />
            <TicketGroup
              title="Adults"
              price={tickets.prices.pricePerAge.adults}
            />
            <TicketGroup
              title="Seniors"
              price={tickets.prices.pricePerAge.seniors}
            />
          </>
        )}

        {/* PRICE PER REGION */}
        {tickets.type === "pricePerRegion" && (
          <div>
            <h5>Visitors</h5>
            <ul>
              <li className="egyption">
                Egyptian{" "}
                {formatCurrency(tickets.prices.pricePerRegion.egyptian)}
              </li>
              <li>
                Foreign {formatCurrency(tickets.prices.pricePerRegion.foreign)}
              </li>
            </ul>
          </div>
        )}

        {/* AGE + REGION */}
        {tickets.type === "ageAndRegion" && (
          <>
            <RegionGroup
              title="Students"
              data={tickets.prices.ageAndRegion.students}
            />
            <RegionGroup
              title="Adults"
              data={tickets.prices.ageAndRegion.adults}
            />
            <RegionGroup
              title="Seniors"
              data={tickets.prices.ageAndRegion.seniors}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function TicketGroup({ title, price }) {
  return (
    <div>
      <h5>{title}</h5>
      <ul>
        <li>{formatCurrency(price)}</li>
      </ul>
    </div>
  );
}

function RegionGroup({ title, data }) {
  return (
    <div>
      <h5>{title}</h5>
      <ul>
        <li className="egyption">Egyptian {formatCurrency(data.egyptian)}</li>
        <li>Foreign {formatCurrency(data.foreign)}</li>
      </ul>
    </div>
  );
}
