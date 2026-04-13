import api from "../axios";
import { ENDPOINTS } from "../endpoints";

// Helper function to normalize governorates API response
const normalizeGovernoratesResponse = (res) => {
  const data = res?.data;
  
  // API returns: [{ data: [...], totalCount: [...] }]
  if (Array.isArray(data) && data[0]?.data) {
    return {
      governorates: data[0].data,
      totalCount: data[0].totalCount?.[0]?.count || 0,
    };
  }
  
  // Fallback for other formats
  return {
    governorates: Array.isArray(data) ? data : [],
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
  const res = await api.get(ENDPOINTS.GOVS.GET_ALL(search, page, limit, language));
  return normalizeGovernoratesResponse(res);
};
export const getOne = (id) => {
  return api.get(ENDPOINTS.GOVS.GET_ONE(id));
};
export const removeImage = (imgId, type, typeId) => {
  return api.deleteImage(ENDPOINTS.GOVS.DELETE_IMAGE(imgId, type, typeId));
};
