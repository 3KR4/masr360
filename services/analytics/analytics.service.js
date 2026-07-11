import axios from "axios";

const analyticsApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const getStats = (params = {}) => {
  return analyticsApi.get("/analytics/stats", { params });
};

export const getVisits = (params = {}) => {
  const { page = 1, limit = 20, sort, ip, minVisits, from, to } = params;
  const query = { page, limit };
  if (sort) query.sort = sort;
  if (ip) query.ip = ip;
  if (minVisits) query.minVisits = minVisits;
  if (from) query.from = from;
  if (to) query.to = to;
  return analyticsApi.get("/analytics/visits", { params: query });
};

export const getWaitlistOnly = (params = {}) => {
  const { page = 1, limit = 20, q, search, city, ageRange, from, to } = params;
  const query = { page, limit };
  if (q) query.q = q;
  if (search) query.search = search;
  if (city) query.city = city;
  if (ageRange) query.ageRange = ageRange;
  if (from) query.from = from;
  if (to) query.to = to;
  return analyticsApi.get("/analytics/waitlist-only", { params: query });
};

export const getGamePlayers = (params = {}) => {
  const { page = 1, limit = 20, status, minCredits, q, search, city, ageRange, from, to } = params;
  const query = { page, limit };
  if (status) query.status = status;
  if (minCredits) query.minCredits = minCredits;
  if (q) query.q = q;
  if (search) query.search = search;
  if (city) query.city = city;
  if (ageRange) query.ageRange = ageRange;
  if (from) query.from = from;
  if (to) query.to = to;
  return analyticsApi.get("/analytics/game-players", { params: query });
};

export const getFormSubmitters = (params = {}) => {
  const { page = 1, limit = 20, q, search, city, ageRange, minCredits, from, to, includeFormData } = params;
  const query = { page, limit };
  if (q) query.q = q;
  if (search) query.search = search;
  if (city) query.city = city;
  if (ageRange) query.ageRange = ageRange;
  if (minCredits) query.minCredits = minCredits;
  if (from) query.from = from;
  if (to) query.to = to;
  if (includeFormData) query.includeFormData = "true";
  return analyticsApi.get("/analytics/form-submitters", { params: query });
};

export const getQuestionsSubmits = (params = {}) => {
  return getFormSubmitters({ ...params, includeFormData: true });
};

export const getFormQuestionsSummary = (params = {}) => {
  return analyticsApi.get("/analytics/form-questions-summary", { params });
};

export const getLeaderboard = (params = {}) => {
  const { page = 1, limit = 25, minCredits, q, search, city } = params;
  const query = { page, limit };
  if (minCredits) query.minCredits = minCredits;
  if (q) query.q = q;
  if (search) query.search = search;
  if (city) query.city = city;
  return analyticsApi.get("/analytics/leaderboard", { params: query });
};

// ---- CRUD Report Wrappers ----

import { getAll as getPlacesAll } from "@/services/places/places.service";
import { getAll as getNightsAll } from "@/services/nights/nights.service";
import { getAll as getProductsAll } from "@/services/porducts/products.service";
import { getAll as getCategoriesAll } from "@/services/categories/categories.service";
import { getAll as getGovernoratesAll } from "@/services/govenorates/govenorates.service";

export const getPlacesReport = async (params = {}) => {
  const { page = 1, limit = 12, search, sort, governorateId, categoryId } = params;
  try {
    const res = await getPlacesAll(search || "", page, limit, "EN", sort || "createdAt,desc", governorateId || "", categoryId || "");
    const total = res.data?.total || 0;
    return { data: { entries: res.data?.data || [], total, totalPages: Math.ceil(total / limit) } };
  } catch { return { data: { entries: [], total: 0, totalPages: 0 } }; }
};

export const getNightsReport = async (params = {}) => {
  const { page = 1, limit = 12, search, sort, governorateId, categoryId, lang } = params;
  try {
    const res = await getNightsAll(search || "", page, limit, lang || "EN", sort || "createdAt,desc", governorateId || "", categoryId || "");
    const total = res.totalCount || 0;
    return { data: { entries: res.nights || [], total, totalPages: Math.ceil(total / limit) } };
  } catch { return { data: { entries: [], total: 0, totalPages: 0 } }; }
};

export const getProductsReport = async (params = {}) => {
  const { page = 1, limit = 12, search, sort, minPrice, maxPrice, stock, category, lang } = params;
  try {
    const res = await getProductsAll({ page, limit, search, sort, minPrice, maxPrice, stock: stock === "" ? undefined : stock, category, lang: lang || "en" });
    const total = res.totalCount || 0;
    return { data: { entries: res.products || [], total, totalPages: Math.ceil(total / limit) } };
  } catch { return { data: { entries: [], total: 0, totalPages: 0 } }; }
};

export const getCategoriesReport = async (params = {}) => {
  const { type = "place", lang = "EN" } = params;
  try {
    const res = await getCategoriesAll({ type, lang });
    const entries = res.data || [];
    return { data: { entries, total: entries.length } };
  } catch { return { data: { entries: [], total: 0 } }; }
};

export const getGovernoratesReport = async (params = {}) => {
  const { page = 1, limit = 12, search, lang = "EN" } = params;
  try {
    const res = await getGovernoratesAll(search || "", page, limit, lang);
    const total = res.totalCount || 0;
    return { data: { entries: res.governorates || [], total, totalPages: Math.ceil(total / limit) } };
  } catch { return { data: { entries: [], total: 0, totalPages: 0 } }; }
};
