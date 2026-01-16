import React, { useEffect, useState, useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";

export default function CountDown({ eventStartAt, text = true }) {
  const { screenSize, locale } = useContext(mainContext);

  const [timeLeft, setTimeLeft] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const monthNames = {
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      ar: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
    };

    const labels = {
      en: {
        timeLeft: "Time Left",
        startedAt: "Event Started At",
        at: "at",
        d: "d",
        h: "h",
        m: "m",
        s: "s",
        am: "AM",
        pm: "PM",
      },
      ar: {
        timeLeft: "الوقت المتبقي",
        startedAt: "بدأ الحدث في",
        at: "الساعة",
        d: "ي",
        h: "س",
        m: "د",
        s: "ث",
        am: "ص",
        pm: "م",
      },
    };

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(eventStartAt);
      const diff = eventDate.getTime() - now;

      const t = labels[locale];

      if (diff <= 0) {
        // ====== EVENT STARTED ======
        const day = eventDate.getDate();
        const monthName = monthNames[locale][eventDate.getMonth()];
        const hour = eventDate.getHours();
        const minutes = eventDate.getMinutes().toString().padStart(2, "0");

        let hour12 = hour % 12 || 12;
        let ampm = hour >= 12 ? t.pm : t.am;

        setLabel(t.startedAt);
        setTimeLeft(`${day} ${monthName} ${t.at} ${hour12}:${minutes} ${ampm}`);
        clearInterval(interval);
        return;
      }

      // ====== TIME LEFT ======
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}${t.d}`);
      if (hours > 0) parts.push(`${hours}${t.h}`);
      if (minutes > 0) parts.push(`${minutes}${t.m}`);
      if (seconds > 0) parts.push(`${seconds}${t.s}`);

      setLabel(t.timeLeft);
      setTimeLeft(parts.join(" "));
    }, 1000);

    return () => clearInterval(interval);
  }, [eventStartAt, locale]);

  return (
    <div className="countdown" dir={locale === "ar" ? "rtl" : "ltr"}>
      {text && <span>{label}: </span>}
      <span
        className={
          label.includes("Time") || label.includes("الوقت") ? "main-color" : ""
        }
      >
        {timeLeft}
      </span>
    </div>
  );
}
