import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getReviews = async ({ type, targetId, sort = "createdAt,desc", page = 1, limit = 5 } = {}) => {
  const res = await api.get(ENDPOINTS.REVIEWS.GET_ALL({ type, targetId, sort, page, limit }));
  const data = res.data;
  if (Array.isArray(data)) return { reviews: data, total: data.length };
  if (data?.reviews) return data;
  if (data?.data) return { reviews: data.data, total: data.total || data.data.length };
  return { reviews: [], total: 0 };
};

export const createReview = async ({ rate, title, desc, type, targetId }) => {
  const res = await api.post(ENDPOINTS.REVIEWS.CREATE, { rate, title, desc, type, targetId });
  return res.data;
};

export const updateReview = async (id, { rate, title, desc }) => {
  const res = await api.put(ENDPOINTS.REVIEWS.UPDATE(id), { rate, title, desc });
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(ENDPOINTS.REVIEWS.DELETE(id));
  return res.data;
};
