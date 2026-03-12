import api from "../axios";
import { ENDPOINTS } from "../endpoints";

// export const create = (payload) => {
//   return api.post(ENDPOINTS.PRODUCTS.CREATE, payload);
// };
// export const update = (id, payload) => {
//   return api.put(ENDPOINTS.PRODUCTS.UPDATE(id), payload);
// };
// export const remove = (id) => {
//   return api.delete(ENDPOINTS.PRODUCTS.DELETE(id));
// };
export const getAll = (type, lang = "EN") => {
  return api.get(ENDPOINTS.CATEGORIES.GET_ALL(type, lang));
};
// export const getOne = (id) => {
//   return api.get(ENDPOINTS.PRODUCTS.GET_ONE(id));
// };
// export const removeImage = (imgId, type, typeId) => {
//   return api.deleteImage(ENDPOINTS.PRODUCTS.DELETE_IMAGE(imgId, type, typeId));
// };
