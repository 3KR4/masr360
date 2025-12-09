import React, { useEffect, useState } from "react";

export default function CountDown({ eventStartAt, text = true }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [label, setLabel] = useState("Time Left");

  useEffect(() => {
    const monthNames = [
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
    ];

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(eventStartAt);
      const diff = eventDate.getTime() - now;

      if (diff <= 0) {
        // ====== EVENT HAS STARTED ======
        const day = eventDate.getDate();
        const monthName = monthNames[eventDate.getMonth()];
        const hour = eventDate.getHours();
        const minutes = eventDate.getMinutes().toString().padStart(2, "0");
        let hour12 = hour % 12 || 12;
        let ampm = hour >= 12 ? "PM" : "AM";
        setLabel("Event Started At");

        setTimeLeft(`${day} ${monthName} at ${hour12}:${minutes} ${ampm}`);
        clearInterval(interval);
        return;
      }

      // ====== TIME LEFT ======
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0) parts.push(`${seconds}s`);

      setLabel("Time Left");
      setTimeLeft(parts.join(" "));
    }, 1000);

    return () => clearInterval(interval);
  }, [eventStartAt]);

  return (
    <div className="countdown">
      {text && <span>{label}:</span>}

      <span className={`${label === "Time Left" ? "main-color" : ""}`}>
        {timeLeft}
      </span>
    </div>
  );
}
