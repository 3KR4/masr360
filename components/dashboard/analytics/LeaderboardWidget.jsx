"use client";
import React from "react";
import useTranslate from "@/Contexts/useTranslation";
import { FaTrophy, FaExpand } from "react-icons/fa";

function LeaderboardWidget({ entries, loading, onFullscreen }) {
  const t = useTranslate();

  if (loading) {
    return (
      <div className="analytics-card">
        <h3 className="analytics-card-title">{t.analytics?.leaderboard || "Leaderboard"}</h3>
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
          <h3 className="analytics-card-title"><FaTrophy /> {t.analytics?.leaderboard || "Leaderboard"}</h3>
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
              <th>#</th>
              <th>{t.analytics?.name || "Name"}</th>
              <th>{t.analytics?.email || "Email"}</th>
              <th className="analytics-cell-center">{t.analytics?.credits || "Total Credits"}</th>
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
                  <td className="analytics-cell-center">{i + 1}</td>
                  <td>{r.name || "-"}</td>
                  <td className="analytics-cell-mono">{r.email}</td>
                  <td className="analytics-cell-center">{r.totalCredits || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardWidget;
