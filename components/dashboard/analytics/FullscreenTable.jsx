"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaFileExcel, FaArrowLeft, FaSearch } from "react-icons/fa";
import { FaListOl } from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import * as XLSX from "xlsx";
import Pagination from "@/components/settings/Pagination";
import {
  getVisits, getWaitlistOnly, getGamePlayers,
  getFormSubmitters, getLeaderboard, getQuestionsSubmits,
  getPlacesReport, getNightsReport, getProductsReport,
  getCategoriesReport, getGovernoratesReport,
} from "@/services/analytics/analytics.service";

const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45+"];
const COUNTRIES = [
  "Egypt", "United Arab Emirates", "Saudi Arabia", "United States", "United Kingdom",
  "Germany", "France", "Canada", "Australia", "Italy", "Spain", "Netherlands",
  "Switzerland", "Austria", "Belgium", "Sweden", "Norway", "Denmark", "Finland",
  "Ireland", "Portugal", "Greece", "Poland", "Czech Republic", "Romania", "Hungary",
  "Turkey", "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan", "Lebanon", "Morocco",
  "Tunisia", "Algeria", "Libya", "Sudan", "Iraq", "Iran", "Pakistan", "India",
  "Bangladesh", "Malaysia", "Indonesia", "Singapore", "Thailand", "Vietnam",
  "Philippines", "Japan", "South Korea", "China", "Taiwan", "Hong Kong", "Brazil",
  "Mexico", "Argentina", "Colombia", "Chile", "Peru", "South Africa", "Nigeria",
  "Kenya", "Ghana", "Tanzania", "Ethiopia", "Uganda", "New Zealand", "Russia",
  "Ukraine", "Kazakhstan", "Georgia", "Azerbaijan", "Armenia", "Serbia", "Croatia",
  "Slovenia", "Bulgaria", "Slovakia", "Lithuania", "Latvia", "Estonia", "Iceland",
  "Luxembourg", "Malta", "Cyprus", "Nepal", "Sri Lanka", "Myanmar", "Cambodia",
  "Laos", "Mongolia", "Fiji", "Other",
];

const CONFIGS = {
  visits: {
    title: "Visits",
    fetch: (p, filters) => getVisits({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getVisits({ page: p, limit: l }),
    cols: [
      { key: "ip", label: "IP" },
      { key: "userAgent", label: "User Agent" },
      { key: "visits", label: "Visits" },
      { key: "firstSeen", label: "First Seen" },
      { key: "lastSeen", label: "Last Seen" },
    ],
    filters: ["sort", "ip", "minVisits"],
  },
  waitlist: {
    title: "Waitlist",
    fetch: (p, filters) => getWaitlistOnly({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getWaitlistOnly({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "ageRange", label: "Age Range" },
      { key: "createdAt", label: "Date" },
    ],
    filters: ["search", "city", "ageRange"],
  },
  "game-players": {
    title: "Game Players",
    fetch: (p, filters) => getGamePlayers({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getGamePlayers({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "ageRange", label: "Age Range" },
      { key: "gameCredits", label: "Credits" },
      { key: "gameComplete", label: "Status" },
      { key: "submittedAt", label: "Date" },
    ],
    filters: ["search", "city", "ageRange", "status", "minCredits"],
  },
  "form-submitters": {
    title: "Form Submitters",
    fetch: (p, filters) => getFormSubmitters({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getFormSubmitters({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "formCredits", label: "Form Credits" },
      { key: "totalCredits", label: "Total Credits" },
      { key: "submittedAt", label: "Date" },
    ],
    filters: ["search", "city", "ageRange", "includeFormData"],
  },
  leaderboard: {
    title: "Leaderboard",
    fetch: (p, filters) => getLeaderboard({ page: p, limit: 9, ...filters }),
    exportFetch: (p, l) => getLeaderboard({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "progress", label: "Credits  /  Interaction" },
    ],
    filters: ["search", "city", "minCredits"],
  },
  "questions-submits": {
    title: "Questions Submits",
    fetch: (p, filters) => getQuestionsSubmits({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getQuestionsSubmits({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "formCredits", label: "Form Credits" },
      { key: "totalCredits", label: "Total Credits" },
      { key: "submittedAt", label: "Date" },
    ],
    filters: ["search", "city"],
  },
  places: {
    title: "Places",
    fetch: (p, filters) => getPlacesReport({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getPlacesReport({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "governorate", label: "Governorate" },
      { key: "category", label: "Category" },
      { key: "createdAt", label: "Created" },
    ],
    filters: ["search", "sort", "governorateId", "categoryId"],
  },
  nights: {
    title: "Nights",
    fetch: (p, filters) => getNightsReport({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getNightsReport({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "governorate", label: "Governorate" },
      { key: "category", label: "Category" },
      { key: "avgRating", label: "Rating" },
      { key: "reviewsCount", label: "Reviews" },
      { key: "createdAt", label: "Created" },
    ],
    filters: ["search", "sort", "governorateId", "categoryId", "lang"],
  },
  products: {
    title: "Products",
    fetch: (p, filters) => getProductsReport({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getProductsReport({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "price", label: "Price" },
      { key: "discount", label: "Discount" },
      { key: "priceAfterDiscount", label: "After Discount" },
      { key: "category", label: "Category" },
      { key: "avgRating", label: "Rating" },
      { key: "reviewsCount", label: "Reviews" },
      { key: "createdAt", label: "Created" },
    ],
    filters: ["search", "sort", "minPrice", "maxPrice", "stock", "categoryId", "lang"],
  },
  categories: {
    title: "Categories",
    fetch: (p, filters) => getCategoriesReport({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getCategoriesReport({ page: p, limit: l, ...filters }),
    cols: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "icon", label: "Icon" },
      { key: "subCategories", label: "Sub Categories" },
    ],
    filters: ["typeFilter", "lang"],
  },
  governorates: {
    title: "Governorates",
    fetch: (p, filters) => getGovernoratesReport({ page: p, limit: 17, ...filters }),
    exportFetch: (p, l) => getGovernoratesReport({ page: p, limit: l }),
    cols: [
      { key: "name", label: "Name" },
      { key: "createdAt", label: "Created" },
    ],
    filters: ["search", "lang"],
  },
};

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

function formatCell(row, col) {
  const val = row[col.key];
  if (col.key === "gameComplete") return val ? "Complete" : "Partial";
  if (col.key === "formComplete") return val ? "Yes" : "No";
  if (["submittedAt", "createdAt", "firstSeen", "lastSeen"].includes(col.key)) {
    return val ? new Date(val).toLocaleDateString() : "-";
  }
  if (col.key === "progress") {
    return (
      <div className="progress-cell">
        <div className="progress-row">
          <span className={`progress-pill ${row.gameComplete ? "done" : "empty"}`}>
            <IoGameController className="progress-pill-icon" />
            <span className="progress-pill-label">game:</span> {row.gameCredits ?? 0}
          </span>
          <span className={`progress-pill ${row.formComplete ? "done" : "empty"}`}>
            <FaListOl className="progress-pill-icon" />
            <span className="progress-pill-label">form:</span> {row.formCredits ?? 0}
          </span>
        </div>
        <div className="progress-total">total: {row.totalCredits ?? 0}</div>
      </div>
    );
  }
  if (col.key === "governorate") return val?.name ?? "-";
  if (col.key === "category") return val?.name ?? "-";
  if (col.key === "subCategories") return Array.isArray(val) ? val.length : 0;
  if (col.key === "icon") return val || "-";
  if (["price", "discount", "priceAfterDiscount"].includes(col.key)) {
    if (col.key === "discount") return val ? `${val}%` : "0%";
    return val != null ? `${Number(val).toLocaleString()} EGP` : "-";
  }
  if (col.key === "avgRating") return val != null ? Number(val).toFixed(1) : "0.0";
  if (col.key === "reviewsCount") return val ?? 0;
  return val ?? "-";
}

function formatExportVal(row, col) {
  const val = row[col.key];
  if (["submittedAt", "createdAt", "firstSeen", "lastSeen"].includes(col.key)) {
    return val ? new Date(val).toISOString().split("T")[0] : "";
  }
  if (col.key === "gameComplete") return val ? "Complete" : "Partial";
  if (col.key === "formComplete") return val ? "Yes" : "No";
  if (col.key === "progress") return `game:${row.gameCredits ?? 0}/${row.gameComplete ? "done" : "no"} form:${row.formCredits ?? 0}/${row.formComplete ? "done" : "no"} total:${row.totalCredits ?? 0}`;
  if (col.key === "governorate") return val?.name ?? "";
  if (col.key === "category") return val?.name ?? "";
  if (col.key === "subCategories") return Array.isArray(val) ? val.length : 0;
  if (col.key === "icon") return val || "";
  if (["price", "discount", "priceAfterDiscount"].includes(col.key)) {
    if (col.key === "discount") return val ? `${val}%` : "0%";
    return val != null ? String(val) : "";
  }
  if (col.key === "avgRating") return val != null ? Number(val).toFixed(1) : "0";
  if (col.key === "reviewsCount") return val ?? 0;
  return val ?? "";
}

async function fetchAllPages(fetchFn, limit = 500) {
  const first = await fetchFn(1, limit);
  const total = first.data?.total || 0;
  const all = [...(first.data?.entries || [])];

  if (total > limit) {
    const pages = Math.ceil(total / limit);
    const rest = await Promise.all(
      Array.from({ length: pages - 1 }, (_, i) => fetchFn(i + 2, limit))
    );
    rest.forEach((r) => all.push(...(r.data?.entries || [])));
  }

  return all;
}

function FullscreenTable({ type, onClose }) {
  const cfg = CONFIGS[type] || CONFIGS.visits;
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minCredits, setMinCredits] = useState("");
  const [ipFilter, setIpFilter] = useState("");
  const [searchIp, setSearchIp] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [ageRangeFilter, setAgeRangeFilter] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [includeFormData, setIncludeFormData] = useState(false);
  const [governorateFilter, setGovernorateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const limit = 17;

  const buildFilters = useCallback(() => {
    const f = {};
    if (cfg.filters?.includes("search") && searchText) f.search = searchText;
    if (cfg.filters?.includes("q") && searchText) f.q = searchText;
    if (cfg.filters?.includes("ip") && ipFilter) f.ip = ipFilter;
    if (cfg.filters?.includes("sort") && sortBy) f.sort = sortBy;
    if (cfg.filters?.includes("status") && statusFilter) f.status = statusFilter;
    if (cfg.filters?.includes("minCredits") && minCredits) f.minCredits = minCredits;
    if (cfg.filters?.includes("minVisits") && minCredits) f.minVisits = minCredits;
    if (cfg.filters?.includes("city") && cityFilter) f.city = cityFilter;
    if (cfg.filters?.includes("ageRange") && ageRangeFilter) f.ageRange = ageRangeFilter;
    if (cfg.filters?.includes("includeFormData") && includeFormData) f.includeFormData = "true";
    if (cfg.filters?.includes("governorateId") && governorateFilter) f.governorateId = governorateFilter;
    if (cfg.filters?.includes("categoryId") && categoryFilter) f.categoryId = categoryFilter;
    if (cfg.filters?.includes("minPrice") && minPriceFilter) f.minPrice = minPriceFilter;
    if (cfg.filters?.includes("maxPrice") && maxPriceFilter) f.maxPrice = maxPriceFilter;
    if (cfg.filters?.includes("stock") && stockFilter) f.stock = stockFilter;
    if (cfg.filters?.includes("typeFilter") && typeFilter) f.type = typeFilter;
    if (cfg.filters?.includes("lang") && langFilter) f.lang = langFilter;
    return f;
  }, [cfg.filters, searchText, ipFilter, sortBy, statusFilter, minCredits, cityFilter, ageRangeFilter, includeFormData, governorateFilter, categoryFilter, minPriceFilter, maxPriceFilter, stockFilter, typeFilter, langFilter]);

  const fetchData = useCallback(async (p) => {
    setLoading(true);
    try {
      const filters = buildFilters();
      const res = await cfg.fetch(p + 1, filters);
      setData(res.data);
    } catch {
      setData({ entries: [], total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [cfg, buildFilters]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  useEffect(() => {
    setPage(0);
  }, [searchText, sortBy, statusFilter, minCredits, ipFilter, cityFilter, ageRangeFilter, includeFormData, governorateFilter, categoryFilter, minPriceFilter, maxPriceFilter, stockFilter, typeFilter, langFilter]);

  const entries = data?.entries || [];
  const totalPages = data?.totalPages || 0;
  const total = data?.total || 0;

  const handleExportAll = async () => {
    try {
      const allData = await fetchAllPages(cfg.exportFetch);
      const wsData = [
        cfg.cols.map((c) => c.label),
        ...allData.map((r) => cfg.cols.map((c) => formatExportVal(r, c))),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, cfg.title);
      XLSX.writeFile(wb, `${cfg.title.toLowerCase().replace(/\s+/g, "-")}.xlsx`);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const renderFilters = () => {
    const available = cfg.filters || [];
    const filterMap = {
      search: () => (
        <div key="search" className="analytics-filter-search">
          <FaSearch />
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search..." className="search-input" />
          {searchText && <IoMdClose className="main-ico" onClick={() => setSearchText("")} />}
        </div>
      ),
      q: () => (
        <div key="q" className="analytics-filter-search">
          <FaSearch />
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search..." className="search-input" />
          {searchText && <IoMdClose className="main-ico" onClick={() => setSearchText("")} />}
        </div>
      ),
      city: () => {
        const filteredCities = citySearch ? COUNTRIES.filter((c) => c.toLowerCase().includes(citySearch.toLowerCase())) : COUNTRIES;
        return (
          <FilterMenu key="city" label="City" value={cityFilter || "City"} active={activeMenu === "city"} onOpen={() => { setActiveMenu("city"); setCitySearch(""); }} onClose={() => setActiveMenu(null)}>
            <div className="toolbar-filter-search">
              <FaSearch />
              <input autoFocus value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..." className="search-input" />
            </div>
            <div className="toolbar-filter-options">
              {filteredCities.length ? filteredCities.map((c) => (
                <button key={c} className={cityFilter === c ? "active" : ""} onClick={() => { setCityFilter(cityFilter === c ? "" : c); setActiveMenu(null); }}>{c}</button>
              )) : <div className="no-results">No results</div>}
            </div>
          </FilterMenu>
        );
      },
      ageRange: () => (
        <FilterMenu key="ageRange" label="Age" value={ageRangeFilter || "Age Range"} active={activeMenu === "ageRange"} onOpen={() => setActiveMenu("ageRange")} onClose={() => setActiveMenu(null)}>
          <div className="toolbar-filter-options">
            {AGE_RANGES.map((a) => (
              <button key={a} className={ageRangeFilter === a ? "active" : ""} onClick={() => { setAgeRangeFilter(ageRangeFilter === a ? "" : a); setActiveMenu(null); }}>{a}</button>
            ))}
          </div>
        </FilterMenu>
      ),
      status: () => (
        <FilterMenu key="status" label="Status" value={statusFilter ? (statusFilter === "complete" ? "Complete" : "Partial") : "Status"} active={activeMenu === "status"} onOpen={() => setActiveMenu("status")} onClose={() => setActiveMenu(null)}>
          <div className="toolbar-filter-options">
            {["complete", "partial"].map((opt) => (
              <button key={opt} className={statusFilter === opt ? "active" : ""} onClick={() => { setStatusFilter(statusFilter === opt ? "" : opt); setActiveMenu(null); }}>{opt === "complete" ? "Complete" : "Partial"}</button>
            ))}
          </div>
        </FilterMenu>
      ),
      minCredits: () => (
        <div key="credits" className="analytics-filter-input">
          <input type="number" value={minCredits} onChange={(e) => setMinCredits(e.target.value)} placeholder="Min credits" className="search-input" />
        </div>
      ),
      sort: () => {
        const isCrud = ["places", "nights", "products"].includes(type);
        const crudOptions = [
          { value: "createdAt,desc", label: "Newest" },
          { value: "createdAt,asc", label: "Oldest" },
          { value: "name,asc", label: "Name A-Z" },
          { value: "name,desc", label: "Name Z-A" },
        ];
        const visitsOptions = [
          { value: "recent", label: "Most Recent" },
          { value: "visits", label: "Most Visits" },
          { value: "oldest", label: "Oldest" },
        ];
        const options = isCrud ? crudOptions : visitsOptions;
        const currentLabel = options.find((o) => o.value === sortBy)?.label;
        return (
          <FilterMenu key="sort" label="Sort" value={currentLabel || "Sort"} active={activeMenu === "sort"} onOpen={() => setActiveMenu("sort")} onClose={() => setActiveMenu(null)}>
            <div className="toolbar-filter-options">
              {options.map((opt) => (
                <button key={opt.value} className={sortBy === opt.value ? "active" : ""} onClick={() => { setSortBy(sortBy === opt.value ? "" : opt.value); setActiveMenu(null); }}>{opt.label}</button>
              ))}
            </div>
          </FilterMenu>
        );
      },
      ip: () => (
        <div key="ip" className="analytics-filter-search">
          <FaSearch />
          <input value={searchIp} onChange={(e) => setSearchIp(e.target.value)} placeholder="Filter IP..." className="search-input" onBlur={() => setIpFilter(searchIp)} />
        </div>
      ),
      includeFormData: () => (
        <div key="includeFormData" className="analytics-filter-checkbox-wrapper">
          <label className="analytics-filter-checkbox">
            <input type="checkbox" checked={includeFormData} onChange={(e) => setIncludeFormData(e.target.checked)} />
            Include form data
          </label>
        </div>
      ),
      governorateId: () => (
        <div key="gov" className="analytics-filter-input">
          <input value={governorateFilter} onChange={(e) => setGovernorateFilter(e.target.value)} placeholder="Governorate ID..." className="search-input" />
        </div>
      ),
      categoryId: () => (
        <div key="cat" className="analytics-filter-input">
          <input value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} placeholder="Category ID..." className="search-input" />
        </div>
      ),
      minPrice: () => (
        <div key="minPrice" className="analytics-filter-input">
          <input type="number" value={minPriceFilter} onChange={(e) => setMinPriceFilter(e.target.value)} placeholder="Min price" className="search-input" />
        </div>
      ),
      maxPrice: () => (
        <div key="maxPrice" className="analytics-filter-input">
          <input type="number" value={maxPriceFilter} onChange={(e) => setMaxPriceFilter(e.target.value)} placeholder="Max price" className="search-input" />
        </div>
      ),
      stock: () => (
        <FilterMenu key="stock" label="Stock" value={stockFilter ? (stockFilter === "in" ? "In Stock" : "Out of Stock") : "Stock"} active={activeMenu === "stock"} onOpen={() => setActiveMenu("stock")} onClose={() => setActiveMenu(null)}>
          <div className="toolbar-filter-options">
            {[
              { value: "in", label: "In Stock" },
              { value: "out", label: "Out of Stock" },
            ].map((opt) => (
              <button key={opt.value} className={stockFilter === opt.value ? "active" : ""} onClick={() => { setStockFilter(stockFilter === opt.value ? "" : opt.value); setActiveMenu(null); }}>{opt.label}</button>
            ))}
          </div>
        </FilterMenu>
      ),
      typeFilter: () => (
        <FilterMenu key="typeFilter" label="Type" value={typeFilter ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) : "Type"} active={activeMenu === "typeFilter"} onOpen={() => setActiveMenu("typeFilter")} onClose={() => setActiveMenu(null)}>
          <div className="toolbar-filter-options">
            {["place", "night", "product"].map((opt) => (
              <button key={opt} className={typeFilter === opt ? "active" : ""} onClick={() => { setTypeFilter(typeFilter === opt ? "" : opt); setActiveMenu(null); }}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</button>
            ))}
          </div>
        </FilterMenu>
      ),
      lang: () => (
        <div key="lang" className="analytics-filter-input">
          <input value={langFilter} onChange={(e) => setLangFilter(e.target.value)} placeholder="Lang (en/ar/fr)..." className="search-input" />
        </div>
      ),
    };

    return available.filter((k) => filterMap[k]).map((k) => filterMap[k]());
  };

  return (
    <div className="analytics-fullscreen">
      <div className="analytics-fullscreen-header">
        <button className="analytics-back-btn" onClick={onClose}>
          <FaArrowLeft /> Back
        </button>
        <h2>{cfg.title}</h2>
        <button className="analytics-excel-btn" onClick={handleExportAll}>
          <FaFileExcel /> Export ({total}) row{total !== 1 ? "s" : ""}
        </button>
      </div>

      <div className="analytics-filter-bar">
        {renderFilters()}
      </div>

      <div className="analytics-table-wrap">
        <table className="analytics-table fullscreen">
          <thead>
            <tr>
              {cfg.cols.map((col) => <th key={col.key} className={["totalCredits","progress","formCredits","gameCredits","gameComplete","ageRange","createdAt","submittedAt","lastSeen","firstSeen","visits","city","avgRating","reviewsCount","price","discount","priceAfterDiscount","icon","type","subCategories"].includes(col.key) ? "analytics-cell-center" : ""}>{col.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={cfg.cols.length} className="analytics-empty">Loading...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={cfg.cols.length} className="analytics-empty">No data available</td></tr>
            ) : (
              entries.map((row, i) => (
                <tr key={row._id || row.email || row.ip || i}>
                  {cfg.cols.map((col) => (
                    <td key={col.key} className={["totalCredits","progress","formCredits","gameCredits","gameComplete","ageRange","createdAt","submittedAt","lastSeen","firstSeen","visits","city","avgRating","reviewsCount","price","discount","priceAfterDiscount","icon","type","subCategories"].includes(col.key) ? "analytics-cell-center" : ""}>
                      {formatCell(row, col)}
                    </td>
                  ))}
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

export default FullscreenTable;
