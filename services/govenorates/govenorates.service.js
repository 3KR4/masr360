import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const create = (payload) => {
  return api.post(ENDPOINTS.GOVS.CREATE, payload);
};
export const update = (id, payload) => {
  return api.put(ENDPOINTS.GOVS.UPDATE(id), payload);
};
export const remove = (id) => {
  return api.delete(ENDPOINTS.GOVS.DELETE(id));
};
export const getAll = (search = "", lang = "en") => {
  return api.get(ENDPOINTS.GOVS.GET_ALL(search, lang));
};
export const getOne = (id) => {
  return api.get(ENDPOINTS.GOVS.GET_ONE(id));
};
