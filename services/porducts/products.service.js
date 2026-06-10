import api from "../axios";
import { ENDPOINTS } from "../endpoints";

const normalizeProductsResponse = (res) => {
  const data = res?.data;

  if (Array.isArray(data?.products)) {
    return {
      products: data.products,
      totalCount: data.count || 0,
    };
  }

  if (Array.isArray(data?.data)) {
    return {
      products: data.data,
      totalCount: data.count || 0,
    };
  }

  return {
    products: Array.isArray(data) ? data : [],
    totalCount: 0,
  };
};

export const create = (payload) => {
  return api.post(ENDPOINTS.PRODUCTS.CREATE, payload);
};

export const update = (id, payload) => {
  return api.put(ENDPOINTS.PRODUCTS.UPDATE(id), payload);
};

export const remove = (id) => {
  return api.delete(ENDPOINTS.PRODUCTS.DELETE(id));
};

export const getAll = async ({
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
  const language = String(lang || "en").toLowerCase();
  const res = await api.get(
    ENDPOINTS.PRODUCTS.GET_ALL(
      search,
      page,
      limit,
      minPrice,
      maxPrice,
      stock,
      sort,
      category,
      language,
    ),
  );
  return normalizeProductsResponse(res);
};

export const getOne = (id) => {
  return api.get(ENDPOINTS.PRODUCTS.GET_ONE(id));
};

export const removeImage = (imgId, type, typeId) => {
  return api.delete(ENDPOINTS.PRODUCTS.DELETE_IMAGE(imgId, type, typeId));
};
