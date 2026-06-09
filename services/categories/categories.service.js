import api from "../axios";
import { ENDPOINTS } from "../endpoints";

const normalizeCategoriesResponse = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) {
    return { ...res, data };
  }
  if (Array.isArray(data?.data)) {
    return { ...res, data: data.data };
  }
  return { ...res, data: [] };
};

export const create = (payload) => {
  return api.post(ENDPOINTS.CATEGORIES.CREATE, payload);
};

export const update = (id, payload) => {
  return api.put(ENDPOINTS.CATEGORIES.UPDATE(id), payload);
};

export const remove = (id) => {
  return api.delete(ENDPOINTS.CATEGORIES.DELETE(id));
};

export const getAll = async ({ type = "product", lang = "EN" }) => {
  const language = String(lang || "EN").toLowerCase();
  const res = await api.get(ENDPOINTS.CATEGORIES.GET_ALL(type, language), {
    skipAuth: true,
  });
  return normalizeCategoriesResponse(res);
};

export const getOne = (id) => {
  return api.get(ENDPOINTS.CATEGORIES.GET_ONE(id));
};
