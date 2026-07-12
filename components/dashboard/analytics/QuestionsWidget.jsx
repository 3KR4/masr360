"use client";
import React from "react";
import useTranslate from "@/Contexts/useTranslation";
import { FaQuestionCircle, FaExpand, FaRegStar } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { LuScanText } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";

const typeIcons = {
  stars: <FaRegStar />,
  options: <CiBoxList />,
  text: <LuScanText />,
  checkboxes: <IoMdCheckboxOutline />,
};

function QuestionsWidget({ data, loading, onFullscreen, onQuestionClick }) {
  const t = useTranslate();
  const questions = data?.questions || [];

  if (loading) {
    return (
      <div className="analytics-card">
        <h3 className="analytics-card-title">{t.analytics?.questions || "Questions"}</h3>
        <div className="analytics-table-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  function renderSummary(q) {
    if (q.type === "stars") {
      return (
        <span className="analytics-badge partial">
          {q.average?.toFixed(1)} avg
        </span>
      );
    }
    if (q.type === "options") {
      return (
        <span className="analytics-badge partial">
          {q.topAnswer || "-"}
        </span>
      );
    }
    if (q.type === "checkboxes" && q.distribution) {
      const top = Object.entries(q.distribution).sort((a, b) => b[1] - a[1])[0];
      return top ? (
        <span className="analytics-badge partial">
          {top[0]}
        </span>
      ) : null;
    }
    return null;
  }

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div className="analytics-card-title-wrap" onClick={onFullscreen}>
          <h3 className="analytics-card-title"><FaQuestionCircle /> {t.analytics?.questions || "Questions"}</h3>
        </div>
        <div className="analytics-fullscreen-group" onClick={onFullscreen}>
          <span className="analytics-total-badge">{data?.total ?? questions.length}</span>
          <button className="analytics-fullscreen-btn" title="Fullscreen">
            <FaExpand />
          </button>
        </div>
      </div>
      <div className="analytics-table-wrap">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>{t.analytics?.question || "Question"}</th>
              <th className="analytics-cell-center">{t.analytics?.type || "Type"}</th>
              <th className="analytics-cell-center">{t.analytics?.responses || "Responses"}</th>
              <th className="analytics-cell-center">{t.analytics?.summary || "Summary"}</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="analytics-empty">{t.analytics?.noData || "No data available"}</td>
              </tr>
            ) : (
              questions.map((q, i) => (
                <tr key={i} className="analytics-clickable-row" onClick={() => onQuestionClick(q)}>
                  <td className="analytics-cell-truncate" title={q.question}>{q.question}</td>
                  <td className="analytics-cell-center">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {typeIcons[q.type] || null} {q.type}
                    </span>
                  </td>
                  <td className="analytics-cell-center">{q.responses?.length || 0}</td>
                  <td className="analytics-cell-center">{renderSummary(q)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuestionsWidget;
