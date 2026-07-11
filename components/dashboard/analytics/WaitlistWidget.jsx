"use client";
import React from "react";
import useTranslate from "@/Contexts/useTranslation";
import { FaUserPlus, FaExpand } from "react-icons/fa";

function WaitlistWidget({ entries, loading, title, onFullscreen }) {
  const t = useTranslate();
  const label = title || t.analytics?.recentWaitlist || "Recent Waitlist Signups";

  if (loading) {
    return (
      <div className="analytics-card">
        <h3 className="analytics-card-title">{label}</h3>
        <div className="analytics-table-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  const rows = entries?.entries || entries || [];

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div className="analytics-card-title-wrap" onClick={onFullscreen}>
          <h3 className="analytics-card-title"><FaUserPlus /> {label}</h3>
        </div>
        <div className="analytics-fullscreen-group" onClick={onFullscreen}>
          <span className="analytics-total-badge">{entries?.total ?? 0}</span>
          <button className="analytics-fullscreen-btn" title="Fullscreen">
            <FaExpand />
          </button>
        </div>
      </div>
      <div className="analytics-table-wrap">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>{t.analytics?.name || "Name"}</th>
              <th>{t.analytics?.email || "Email"}</th>
              <th className="analytics-cell-center">{t.analytics?.city || "City"}</th>
              <th className="analytics-cell-center">{t.analytics?.date || "Date"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="analytics-empty">{t.analytics?.noData || "No data available"}</td>
              </tr>
            ) : (
              rows.slice(0, 7).map((r, i) => (
                <tr key={r.email || i}>
                  <td>{r.name || "-"}</td>
                  <td className="analytics-cell-mono">{r.email}</td>
                  <td className="analytics-cell-center">{r.city || "-"}</td>
                  <td className="analytics-cell-center">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WaitlistWidget;
