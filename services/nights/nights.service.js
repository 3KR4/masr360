import api from "../axios";
import { ENDPOINTS } from "../endpoints";

const normalizeNightsResponse = (res) => {
  const data = res?.data;

  if (Array.isArray(data?.data)) {
    return {
      nights: data.data,
      totalCount: data.count || 0,
    };
  }

  if (Array.isArray(data) && data[0]?.data) {
    return {
      nights: data[0].data,
      totalCount: data[0].totalCount?.[0]?.count || 0,
    };
  }

  return {
    nights: Array.isArray(data) ? data : [],
    totalCount: 0,
  };
};

export const create = (payload) => api.post(ENDPOINTS.NIGHTS.CREATE, payload);
export const update = (id, payload) => api.put(ENDPOINTS.NIGHTS.UPDATE(id), payload);
export const remove = (id) => api.delete(ENDPOINTS.NIGHTS.DELETE(id));
export const getAll = async (
  search = "",
  page = 1,
  limit = 10,
  lang = "EN",
  sort = "createdAt,desc",
  governorateId = "",
  categoryId = ""
) => {
  const language = String(lang || "EN").toLowerCase();
  const res = await api.get(
    ENDPOINTS.NIGHTS.GET_ALL(
      search,
      page,
      limit,
      language,
      sort,
      governorateId,
      categoryId
    )
  );
  return normalizeNightsResponse(res);
};
export const getOne = (id) => api.get(ENDPOINTS.NIGHTS.GET_ONE(id));
export const removeImage = (imgId, type, typeId) =>
  api.delete(ENDPOINTS.NIGHTS.DELETE_IMAGE(imgId, type, typeId));
