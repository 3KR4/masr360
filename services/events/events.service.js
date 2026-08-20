import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { normalizeEvent } from "../normalizers/productNormalizer";

const normalizeEventsResponse = (res) => {
  const data = res?.data;

  if (Array.isArray(data?.data)) {
    return {
      events: data.data.map(normalizeEvent),
      totalCount: data.total || data.count || 0,
    };
  }

  if (Array.isArray(data) && data[0]?.data) {
    return {
      events: (data[0].data || []).map(normalizeEvent),
      totalCount: data[0].totalCount?.[0]?.count || 0,
    };
  }

  return {
    events: Array.isArray(data) ? data.map(normalizeEvent) : [],
    totalCount: 0,
  };
};

export const create = (payload) => api.post(ENDPOINTS.EVENTS.CREATE, payload);
export const update = (id, payload) => api.put(ENDPOINTS.EVENTS.UPDATE(id), payload);
export const remove = (id) => api.delete(ENDPOINTS.EVENTS.DELETE(id));
export const getAll = async (
  search = "",
  page = 1,
  limit = 10,
  lang = "EN",
  sort = "createdAt,desc",
  governorateId = "",
  from = "",
  to = "",
  status = ""
) => {
  const language = String(lang || "EN").toLowerCase();
  const res = await api.get(
    ENDPOINTS.EVENTS.GET_ALL(
      search,
      page,
      limit,
      language,
      sort,
      governorateId,
      from,
      to,
      status
    )
  );
  return normalizeEventsResponse(res);
};
export const getOne = (id) => api.get(ENDPOINTS.EVENTS.GET_ONE(id));
export const removeImage = (imgId, type, typeId) =>
  api.delete(ENDPOINTS.EVENTS.DELETE_IMAGE(imgId, type, typeId));
