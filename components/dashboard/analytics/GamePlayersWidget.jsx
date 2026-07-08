"use client";
import React from "react";
import useTranslate from "@/Contexts/useTranslation";
import { FaGamepad, FaExpand } from "react-icons/fa";

function GamePlayersWidget({ entries, loading, onFullscreen }) {
  const t = useTranslate();

  if (loading) {
    return (
      <div className="analytics-card">
        <h3 className="analytics-card-title">{t.analytics?.gamePlayers || "Game Players"}</h3>
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
          <h3 className="analytics-card-title"><FaGamepad /> {t.analytics?.gamePlayers || "Game Players"}</h3>
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
              <th className="analytics-cell-center">{t.analytics?.credits || "Credits"}</th>
              <th className="analytics-cell-center">{t.analytics?.status || "Status"}</th>
              <th className="analytics-cell-center">{t.analytics?.date || "Date"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="analytics-empty">{t.analytics?.noData || "No data available"}</td>
              </tr>
            ) : (
              rows.slice(0, 5).map((r, i) => (
                <tr key={r.email || i}>
                  <td>{r.name || "-"}</td>
                  <td className="analytics-cell-mono">{r.email}</td>
                  <td className="analytics-cell-center">{r.gameCredits || 0}</td>
                  <td className="analytics-cell-center">
                    <span className={`analytics-badge ${r.gameComplete ? "complete" : "partial"}`}>
                      {r.gameComplete ? "Complete" : "Partial"}
                    </span>
                  </td>
                  <td className="analytics-cell-center">
                    {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "-"}
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

export default GamePlayersWidget;
