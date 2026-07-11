"use client";
import React from "react";
import { FaMapMarkerAlt, FaMoon, FaBox, FaTags, FaGlobeAfrica } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";

const REPORTS = [
  { key: "places", label: "Places", icon: <FaMapMarkerAlt />, color: "#3b82f6" },
  { key: "nights", label: "Nights", icon: <FaMoon />, color: "#8b5cf6" },
  { key: "products", label: "Products", icon: <FaBox />, color: "#10b981" },
  { key: "categories", label: "Categories", icon: <FaTags />, color: "#f59e0b" },
  { key: "governorates", label: "Governorates", icon: <FaGlobeAfrica />, color: "#ef4444" },
];

function DataReportsWidget({ data, loading, onOpen }) {
  const t = useTranslate();

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <h3>{t.analytics?.dataReports || "Data Reports"}</h3>
      </div>
      <div className="analytics-reports-grid">
        {REPORTS.map((r) => {
          const count = data?.[r.key]?.total ?? data?.[r.key]?.length ?? "...";
          return (
            <button key={r.key} className="analytics-report-card" onClick={() => onOpen(r.key)}>
              <span className="analytics-report-icon" style={{ color: r.color }}>{r.icon}</span>
              <div className="analytics-report-info">
                <span className="analytics-report-label">{r.label}</span>
                <span className="analytics-report-count">{loading ? "..." : count}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DataReportsWidget;
