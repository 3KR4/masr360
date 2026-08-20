"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";

import useTranslate from "@/Contexts/useTranslation";
export default function EventsPage() {
  const t = useTranslate();

  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.masr_events_page.mainTitle}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.masr_events_page.subTitle}
        </p>
      </div>

      <Navigations
        items={[
          {
            name: t.sectionsTitles.upcoming_events.title,
            href: "/events",
          },
        ]}
      />

      <DisplayContent type={"event"} />
    </div>
  );
}
