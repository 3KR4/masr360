"use client";
import React from "react";
import { FaUsers, FaGamepad, FaClipboardList, FaTrophy, FaEye } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";

const icons = {
  totalVisits: FaEye,
  totalWaitlist: FaUsers,
  totalGamePlayers: FaGamepad,
  totalFormSubmitters: FaClipboardList,
  totalLeaderboard: FaTrophy,
};

function StatsCards({ stats, loading }) {
  const t = useTranslate();
  if (loading) {
    return (
      <div className="analytics-stats-grid">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="analytics-stat-card skeleton">
            <div className="skeleton-icon" />
            <div className="skeleton-text" />
          </div>
        ))}
      </div>
    );
  }

  const labels = [
    { key: "totalVisits", label: t.analytics?.totalVisits || "Total Page Visits" },
    { key: "totalWaitlist", label: t.analytics?.totalWaitlist || "Waitlist Signups" },
    { key: "totalGamePlayers", label: t.analytics?.totalGamePlayers || "Game Players" },
    { key: "totalFormSubmitters", label: t.analytics?.totalFormSubmitters || "Form Submitters" },
    { key: "totalLeaderboard", label: t.analytics?.totalLeaderboard || "Leaderboard" },
  ];

  return (
    <div className="analytics-stats-grid">
      {labels.map(({ key, label }) => {
        const Icon = icons[key];
        return (
          <div key={key} className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <Icon />
            </div>
            <div className="analytics-stat-info">
              <span className="analytics-stat-value">{stats?.[key]?.toLocaleString() || 0}</span>
              <span className="analytics-stat-label">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
