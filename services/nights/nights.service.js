import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const create = (payload) => api.post(ENDPOINTS.NIGHTS.CREATE, payload);
export const update = (id, payload) => api.put(ENDPOINTS.NIGHTS.UPDATE(id), payload);
export const remove = (id) => api.delete(ENDPOINTS.NIGHTS.DELETE(id));
export const getAll = (
  page = 1,
  limit = 10,
  lang = "EN",
  sort = "createdAt,desc",
  governorateId = "",
  categoryId = ""
) => {
  return api.get(
    ENDPOINTS.NIGHTS.GET_ALL(page, limit, lang, sort, governorateId, categoryId)
  );
};
export const getOne = (id) => api.get(ENDPOINTS.NIGHTS.GET_ONE(id));
