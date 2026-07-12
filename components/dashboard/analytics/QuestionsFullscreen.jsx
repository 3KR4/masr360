"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaSearch, FaStar, FaStarHalfAlt, FaRegStar, FaFileExcel } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { LuScanText } from "react-icons/lu";
import { IoMdCheckboxOutline, IoIosArrowDown, IoMdClose } from "react-icons/io";
import * as XLSX from "xlsx";
import { getFormQuestionsSummary } from "@/services/analytics/analytics.service";
import useTranslate from "@/Contexts/useTranslation";
import Pagination from "@/components/settings/Pagination";

const PAGE_LIMIT = 11;
const TYPES = ["stars", "options", "text", "checkboxes"];

const typeIcons = {
  stars: <FaRegStar />,
  options: <CiBoxList />,
  text: <LuScanText />,
  checkboxes: <IoMdCheckboxOutline />,
};

function StarRating({ value }) {
  const max = 5;
  return (
    <span style={{ display: "inline-flex", gap: 2, color: "#f59e0b" }}>
      {Array.from({ length: max }, (_, i) => {
        if (value >= i + 1) return <FaStar key={i} />;
        if (value >= i + 0.5) return <FaStarHalfAlt key={i} />;
        return <FaRegStar key={i} />;
      })}
    </span>
  );
}

function FilterMenu({ label, value, active, onOpen, onClose, children }) {
  return (
    <div className="toolbar-filter-menu">
      <button
        type="button"
        className="toolbar-filter-trigger"
        onClick={() => (active ? onClose() : onOpen())}
      >
        <div className="toolbar-filter-copy">
          <strong className="ellipsis">{value || label}</strong>
        </div>
        {active ? <IoMdClose className="main-ico" /> : <IoIosArrowDown className="main-ico" />}
      </button>
      <div className={`toolbar-filter-dropdown ${active ? "active" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function QuestionsFullscreen({ onClose, preSelected, onQuestionSelect }) {
  const t = useTranslate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(preSelected || null);
  useEffect(() => {
    setSelectedQuestion(preSelected || null);
  }, [preSelected]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [page, setPage] = useState(0);

  const buildParams = useCallback(() => {
    const params = { page: page + 1, limit: PAGE_LIMIT };
    if (search) params.search = search;
    if (typeFilter) params.type = typeFilter;
    return params;
  }, [page, search, typeFilter]);

  useEffect(() => {
    setPage(0);
  }, [search, typeFilter]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getFormQuestionsSummary(buildParams());
        const d = res.data;
        if (Array.isArray(d)) {
          setData({ questions: d, total: d.length, page: page + 1, limit: PAGE_LIMIT });
        } else if (d?.questions || d?.data) {
          setData({
            questions: d.questions || d.data,
            total: d?.pagination?.total || d.total || 0,
            page: d?.pagination?.page || d.page || page + 1,
            limit: d?.pagination?.limit || d.limit || PAGE_LIMIT,
          });
        } else {
          setData({ questions: [], total: 0, page: 1, limit: PAGE_LIMIT });
        }
      } catch {
        setData({ questions: [], total: 0, page: 1, limit: PAGE_LIMIT });
      } finally {
        setLoading(false);
      }
    })();
  }, [buildParams]);

  const questions = data?.questions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const handleExportAll = async () => {
    try {
      const params = { page: 1, limit: 500, search, type: typeFilter };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await getFormQuestionsSummary(params);
      const d = res.data;
      const all = Array.isArray(d) ? d : d?.questions || d?.data || [];
      const wsData = [
        ["Question", "Type", "Responses", "Summary"],
        ...all.map((q) => [
          q.question,
          q.type,
          q.responses?.length || 0,
          q.type === "stars" ? q.average?.toFixed(1) || "" : q.type === "options" ? q.topAnswer || "" : "",
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Questions");
      XLSX.writeFile(wb, "questions.xlsx");
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  if (selectedQuestion) {
    const q = selectedQuestion;
    return (
      <div className="analytics-fullscreen">
        <div className="analytics-fullscreen-header">
          <button className="analytics-back-btn" onClick={() => { setSelectedQuestion(null); onQuestionSelect?.(null); }}>
            <FaArrowLeft /> {t.analytics?.back || "Back"}
          </button>
          <h2>{t.analytics?.questionDetails || "Question Details"}</h2>
          <div />
        </div>

        <div className="analytics-question-detail-title">{q.question}</div>

        <div className="analytics-summary-cards">
          {q.type === "stars" && (
            <>
              <div className="analytics-summary-card">
                <div className="analytics-summary-card-label">{t.analytics?.average || "Average"}</div>
                <div className="analytics-summary-card-value">
                  <StarRating value={q.average} />
                  <span>{q.average?.toFixed(2)}</span>
                </div>
              </div>
              <div className="analytics-summary-card">
                <div className="analytics-summary-card-label">{t.analytics?.responses || "Responses"}</div>
                <div className="analytics-summary-card-value">{q.count || q.responses?.length || 0}</div>
              </div>
            </>
          )}

          {(q.type === "options" || q.type === "checkboxes") && q.distribution && Object.keys(q.distribution).length > 0 && (
            Object.entries(q.distribution).map(([key, val]) => {
              const topKey = q.topAnswer || Object.entries(q.distribution).sort((a, b) => b[1] - a[1])[0]?.[0];
              return (
                <div key={key} className={`analytics-summary-card${key === topKey ? " top" : ""}`}>
                  <div className="analytics-summary-card-label">{key}</div>
                  <div className="analytics-summary-card-value">{val}</div>
                </div>
              );
            })
          )}

          {q.type === "text" && (
            <div className="analytics-summary-card">
              <div className="analytics-summary-card-label">{t.analytics?.responses || "Responses"}</div>
              <div className="analytics-summary-card-value">{q.responses?.length || 0}</div>
            </div>
          )}
        </div>

        <div className="analytics-answers-grid">
          <h3 style={{ gridColumn: "1 / -1", fontSize: 16, fontWeight: 600, margin: 0 }}>
            {t.analytics?.individualResponses || "Individual Responses"} ({q.responses?.length || 0})
          </h3>
          {q.responses?.length === 0 ? (
            <div className="analytics-empty">{t.analytics?.noData || "No answers yet"}</div>
          ) : (
            q.responses.map((r, i) => (
              <div key={i} className="analytics-answer-card">
                <div className={`analytics-answer-body${q.type === "text" ? " column" : ""}`}>
                  <div className="analytics-answer-user">
                    <div className="name">{r.name || r.email}</div>
                    <div className="analytics-answer-email">{r.email}</div>
                  </div>
                  <div className="analytics-answer-rate">
                    {q.type === "stars" ? (
                      <StarRating value={typeof r.value === "number" ? r.value : parseInt(r.value)} />
                    ) : (
                      <span className="answer">
                        {Array.isArray(r.value) ? r.value.join(", ") : String(r.value)}
                      </span>
                    )}
                  </div>
                </div>
                {r.suggestion && (
                  <div className="analytics-answer-suggestion">{r.suggestion}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-fullscreen">
      <div className="analytics-fullscreen-header">
        <button className="analytics-back-btn" onClick={onClose}>
          <FaArrowLeft /> {t.analytics?.back || "Back"}
        </button>
        <h2>{t.analytics?.questions || "Questions"}</h2>
        <button className="analytics-excel-btn" onClick={handleExportAll}>
          <FaFileExcel /> Export ({total}) row{total !== 1 ? "s" : ""}
        </button>
      </div>

      <div className="analytics-filter-bar">
        <div className="analytics-filter-search">
          <FaSearch />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.analytics?.search || "Search..."} className="search-input" />
          {search && <IoMdClose className="main-ico" onClick={() => setSearch("")} />}
        </div>
        <FilterMenu label="Type" value={typeFilter ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) : "Type"} active={activeMenu === "type"} onOpen={() => setActiveMenu("type")} onClose={() => setActiveMenu(null)}>
          <div className="toolbar-filter-options">
            {TYPES.map((opt) => (
              <button key={opt} className={typeFilter === opt ? "active" : ""} onClick={() => { setTypeFilter(typeFilter === opt ? "" : opt); setActiveMenu(null); }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {typeIcons[opt]} {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </FilterMenu>
      </div>

      <div className="analytics-table-wrap">
        <table className="analytics-table fullscreen">
          <thead>
            <tr>
              <th>{t.analytics?.question || "Question"}</th>
              <th className="analytics-cell-center">{t.analytics?.type || "Type"}</th>
              <th className="analytics-cell-center">{t.analytics?.responses || "Responses"}</th>
              <th className="analytics-cell-center">{t.analytics?.summary || "Summary"}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="analytics-empty">Loading...</td></tr>
            ) : questions.length === 0 ? (
              <tr><td colSpan={4} className="analytics-empty">{t.analytics?.noData || "No data available"}</td></tr>
            ) : (
              questions.map((q, i) => (
                <tr key={i} className="analytics-clickable-row" onClick={() => { setSelectedQuestion(q); onQuestionSelect?.(q); }}>
                  <td style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.question}</td>
                  <td className="analytics-cell-center">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {typeIcons[q.type] || null} {q.type}
                    </span>
                  </td>
                  <td className="analytics-cell-center">{q.responses?.length || 0}</td>
                  <td className="analytics-cell-center">
                    {q.type === "stars" ? (
                      <span className="analytics-badge partial">{q.average?.toFixed(1)}</span>
                    ) : q.type === "options" ? (
                      <span className="analytics-badge partial">{q.topAnswer || "-"}</span>
                    ) : q.type === "checkboxes" && q.distribution ? (
                      <span className="analytics-badge partial">
                        {Object.entries(q.distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="analytics-fullscreen-footer">
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            screenSize="large"
            isDashBoard
            onPageChange={(e) => setPage(e.selected)}
          />
        )}
      </div>
    </div>
  );
}

export default QuestionsFullscreen;
