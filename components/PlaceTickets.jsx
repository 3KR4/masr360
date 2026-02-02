"use client";
import formatCurrency from "@/utlies/curancy";
import useTranslate from "@/Contexts/useTranslation";

export default function PlaceTickets({ tickets }) {
  const t = useTranslate();
  if (!tickets || tickets.type === "free") {
    return;
  }

  return (
    <div className="tickets">
      <div className="top">
        <h4>{t.singelPages.TicketsPrice}</h4>
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
              title={t.dashboard.forms.students}
              price={tickets.prices.pricePerAge.children}
            />
            <TicketGroup
              title={t.dashboard.forms.adults}
              price={tickets.prices.pricePerAge.adults}
            />
            <TicketGroup
              title={t.dashboard.forms.seniors}
              price={tickets.prices.pricePerAge.seniors}
            />
          </>
        )}

        {/* PRICE PER REGION */}
        {tickets.type === "pricePerRegion" && (
          <div>
            <h5>{t.dashboard.forms.Visitors}</h5>
            <ul>
              <li className="egyption">
                {t.dashboard.forms.egyptian}{" "}
                {formatCurrency(tickets.prices.pricePerRegion.egyptian)}
              </li>
              <li>
                {t.dashboard.forms.foreigner}{" "}
                {formatCurrency(tickets.prices.pricePerRegion.foreign)}
              </li>
            </ul>
          </div>
        )}

        {/* AGE + REGION */}
        {tickets.type === "ageAndRegion" && (
          <>
            <RegionGroup
              title={t.dashboard.forms.students}
              data={tickets.prices.ageAndRegion.students}
              t={t}
            />
            <RegionGroup
              title={t.dashboard.forms.adults}
              data={tickets.prices.ageAndRegion.adults}
              t={t}
            />
            <RegionGroup
              title={t.dashboard.forms.seniors}
              data={tickets.prices.ageAndRegion.seniors}
              t={t}
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

function RegionGroup({ title, data, t }) {
  return (
    <div>
      <h5>{title}</h5>
      <ul>
        <li className="egyption">
          {t.dashboard.forms.egyptian} {formatCurrency(data.egyptian)}
        </li>
        <li>
          {t.dashboard.forms.foreigner} {formatCurrency(data.foreign)}
        </li>
      </ul>
    </div>
  );
}
