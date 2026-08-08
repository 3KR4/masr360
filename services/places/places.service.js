import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { normalizePlace, normalizeTicket } from "../normalizers/productNormalizer";

const normalizePlacesResponse = (res) => {
  const data = res?.data;

  if (Array.isArray(data?.data)) {
    return {
      places: (data.data || []).map(normalizePlace),
      totalCount: data.total || data.count || 0,
    };
  }

  if (Array.isArray(data) && data[0]?.data) {
    return {
      places: (data[0].data || []).map(normalizePlace),
      totalCount: data[0].totalCount?.[0]?.count || 0,
    };
  }

  return {
    places: Array.isArray(data) ? data.map(normalizePlace) : [],
    totalCount: 0,
  };
};

export const create = (payload) => {
  return api.post(ENDPOINTS.Places.CREATE, payload);
};

export const update = (id, payload) => {
  return api.put(ENDPOINTS.Places.UPDATE(id), payload);
};

export const remove = (id) => {
  return api.delete(ENDPOINTS.Places.DELETE(id));
};

export const getAll = async (
  search = "",
  page = 1,
  limit = 10,
  lang = "EN",
  sort = "createdAt,desc",
  governorateId = "",
  categoryId = "",
  subCategoryId = ""
) => {
  const language = String(lang || "EN").toLowerCase();
  const res = await api.get(
    ENDPOINTS.Places.GET_ALL(
      search,
      page,
      limit,
      language,
      sort,
      governorateId,
      categoryId,
      subCategoryId
    )
  );
  return normalizePlacesResponse(res);
};

export const getOne = async (id) => {
  const res = await api.get(ENDPOINTS.Places.GET_ONE(id));
  const rawPlace = res?.data?.place;
  const rawTicket = res?.data?.ticket;
  return {
    ...res,
    data: {
      place: normalizePlace({ ...rawPlace, ticket: rawTicket }),
      ticket: normalizeTicket(rawTicket),
    },
  };
};

export const removeImage = (imgId, type, typeId) => {
  return api.delete(ENDPOINTS.Places.DELETE_IMAGE(imgId, type, typeId));
};
