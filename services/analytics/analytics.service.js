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

export const getLeaderboard = (params = {}) => {
  const { page = 1, limit = 25, minCredits, q, search, city } = params;
  const query = { page, limit };
  if (minCredits) query.minCredits = minCredits;
  if (q) query.q = q;
  if (search) query.search = search;
  if (city) query.city = city;
  return analyticsApi.get("/analytics/leaderboard", { params: query });
};
