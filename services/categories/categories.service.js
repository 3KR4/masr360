import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const create = (payload) => {
  return api.post(ENDPOINTS.CATEGORIES.CREATE, payload);
};
export const update = (id, payload) => {
  return api.put(ENDPOINTS.CATEGORIES.UPDATE(id), payload);
};
export const remove = (id) => {
  return api.delete(ENDPOINTS.CATEGORIES.DELETE(id));
};
export const getAll = ({ type = "product", lang = "EN" }) => {
  return api.get(ENDPOINTS.CATEGORIES.GET_ALL(type, lang));
};
export const getOne = (id) => {
  return api.get(ENDPOINTS.CATEGORIES.GET_ONE(id));
};
