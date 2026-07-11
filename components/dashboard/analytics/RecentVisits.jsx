"use client";
import React from "react";
import useTranslate from "@/Contexts/useTranslation";
import { FaGlobeAmericas, FaExpand, FaEye } from "react-icons/fa";
import { MdDevices } from "react-icons/md";

function RecentVisits({ visits, loading, onFullscreen }) {
  const t = useTranslate();

  if (loading) {
    return (
      <div className="analytics-card">
        <h3 className="analytics-card-title"><FaEye /> {t.analytics?.recentVisits || "Recent Visits"}</h3>
        <div className="analytics-table-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  const entries = visits?.entries || [];

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div className="analytics-card-title-wrap" onClick={onFullscreen}>
          <h3 className="analytics-card-title"><FaEye /> {t.analytics?.recentVisits || "Recent Visits"}</h3>
        </div>
        <div className="analytics-fullscreen-group" onClick={onFullscreen}>
          <span className="analytics-total-badge">{visits?.total ?? 0}</span>
          <button className="analytics-fullscreen-btn" title="Fullscreen">
            <FaExpand />
          </button>
        </div>
      </div>
      <div className="analytics-table-wrap">
        <table className="analytics-table">
          <thead>
            <tr>
              <th><FaGlobeAmericas /> {t.analytics?.ip || "IP"}</th>
              <th><MdDevices /> {t.analytics?.userAgent || "User Agent"}</th>
              <th className="analytics-cell-center">{t.analytics?.visits || "Visits"}</th>
              <th className="analytics-cell-center">{t.analytics?.lastSeen || "Last Seen"}</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="analytics-empty">{t.analytics?.noData || "No data available"}</td>
              </tr>
            ) : (
              entries.slice(0, 7).map((v, i) => (
                <tr key={v.ip || i}>
                  <td className="analytics-cell-mono">{v.ip}</td>
                  <td className="analytics-cell-truncate" title={v.userAgent}>
                    {v.userAgent?.length > 40 ? v.userAgent.slice(0, 40) + "..." : v.userAgent || "-"}
                  </td>
                  <td className="analytics-cell-center">{v.visits}</td>
                  <td className="analytics-cell-center">
                    {v.lastSeen ? new Date(v.lastSeen).toLocaleDateString() : "-"}
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

export default RecentVisits;
