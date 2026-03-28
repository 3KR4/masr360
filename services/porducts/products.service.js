import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const create = (payload) => {
  return api.post(ENDPOINTS.PRODUCTS.CREATE, payload);
};
export const update = (id, payload) => {
  return api.put(ENDPOINTS.PRODUCTS.UPDATE(id), payload);
};
export const remove = (id) => {
  return api.delete(ENDPOINTS.PRODUCTS.DELETE(id));
};
export const getAll = ({
  page = 1,
  limit = 10,
  minPrice,
  maxPrice,
  stock,
  sort,
  search,
  category,
  lang = "en",
}) => {
  return api.get("/products", {
    params: {
      page,
      limit,
      minPrice,
      maxPrice,
      stock,
      sort,
      search,
      category,
      lang,
    },
  });
};
export const getOne = (id) => {
  return api.get(ENDPOINTS.PRODUCTS.GET_ONE(id));
};
export const removeImage = (imgId, type, typeId) => {
  return api.deleteImage(ENDPOINTS.PRODUCTS.DELETE_IMAGE(imgId, type, typeId));
};
