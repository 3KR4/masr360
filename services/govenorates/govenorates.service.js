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
export const getAll = (search = "", page = 1, limit = 10, lang = "EN") => {
  return api.get(ENDPOINTS.GOVS.GET_ALL(search, page, limit, lang));
};
export const getOne = (id) => {
  return api.get(ENDPOINTS.GOVS.GET_ONE(id));
};
export const removeImage = (imgId, type, typeId) => {
  return api.deleteImage(ENDPOINTS.GOVS.DELETE_IMAGE(imgId, type, typeId));
};
