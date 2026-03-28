import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const create = (payload) => {
  return api.post(ENDPOINTS.Places.CREATE, payload);
};

export const update = (id, payload) => {
  return api.put(ENDPOINTS.Places.UPDATE(id), payload);
};

export const remove = (id) => {
  return api.delete(ENDPOINTS.Places.DELETE(id));
};

export const getAll = (
  search = "",
  page = 1,
  limit = 10,
  lang = "EN",
  sort = "createdAt,desc",
  governorateId = "",
  categoryId = ""
) => {
  return api.get(
    ENDPOINTS.Places.GET_ALL(
      search,
      page,
      limit,
      lang,
      sort,
      governorateId,
      categoryId
    )
  );
};

export const getOne = (id) => {
  return api.get(ENDPOINTS.Places.GET_ONE(id));
};