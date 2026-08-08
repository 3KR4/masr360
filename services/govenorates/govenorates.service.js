import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const normalizeGovernorate = (g) => ({
  id: g?._id || g?.id,
  _id: g?._id || g?.id,
  name: g?.translations?.EN?.name || g?.name || "",
  desc: g?.desc || "",
  image: g?.img?.url || g?.image || "",
  img: g?.img || null,
  count: g?.placesCount || g?.count || 0,
  placesCount: g?.placesCount || g?.count || 0,
  description: g?.translations?.EN?.desc || g?.desc || "",
  translations: g?.translations || null,
});

const normalizeGovernoratesResponse = (res) => {
  const data = res?.data;

  if (Array.isArray(data?.data)) {
    return {
      governorates: (data.data || []).map(normalizeGovernorate),
      totalCount: data.count || 0,
    };
  }

  if (Array.isArray(data) && data[0]?.data) {
    return {
      governorates: (data[0].data || []).map(normalizeGovernorate),
      totalCount: data[0].totalCount?.[0]?.count || 0,
    };
  }

  return {
    governorates: Array.isArray(data) ? data.map(normalizeGovernorate) : [],
    totalCount: 0,
  };
};

export const create = (payload) => {
  return api.post(ENDPOINTS.GOVS.CREATE, payload);
};

export const update = (id, payload) => {
  return api.put(ENDPOINTS.GOVS.UPDATE(id), payload);
};

export const remove = (id) => {
  return api.delete(ENDPOINTS.GOVS.DELETE(id));
};

export const getAll = async (search = "", page = 1, limit = 10, lang = "EN") => {
  const language = String(lang || "EN").toLowerCase();
  const res = await api.get(
    ENDPOINTS.GOVS.GET_ALL(search, page, limit, language),
    {
      skipAuth: true,
    },
  );
  return normalizeGovernoratesResponse(res);
};

export const getOne = async (id) => {
  const res = await api.get(ENDPOINTS.GOVS.GET_ONE(id));
  const gov = res?.data?.governorate;
  return {
    ...res,
    data: {
      governorate: normalizeGovernorate({ ...gov, placesCount: gov?.places?.length }),
      places: gov?.places || [],
    },
  };
};

export const removeImage = (imgId, type, typeId) => {
  return api.delete(
    ENDPOINTS.GOVS.DELETE_IMAGE(imgId, type, typeId),
  );
};
