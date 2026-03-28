export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    SEND_MAIL: `/auth/verify`,
    VERIFY_OTP: `/auth/validateOtp`,
    LOGIN: "/auth/login",
  },
  CATEGORIES: {
    GET_ALL: (type, lang) => `categories?type=${type}&lang=${lang}`,
  },
  GOVS: {
    CREATE: "/governorates",
    UPDATE: (id) => `/governorates/${id}`,
    DELETE: (id) => `/governorates/${id}`,
    GET_ALL: (search, page, limit, lang) =>
      `/governorates?search=${search}&lang=${lang}&page=${page}&limit=${limit}`,
    GET_ONE: (id) => `/governorates/${id}`,
    DELETE_IMAGE: (imgId, type, typeId) =>
      `/images/${imgId}?entityType=${type}&entityId=${typeId}`,
  },
  PRODUCTS: {
    CREATE: "/products",
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    GET_ALL: (search, page, limit, minPrice, maxPrice, stock, sort, lang) =>
      `/products?search=${search}&lang=${lang}&page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}&stock=${stock}&sort=${sort}`,
    GET_ONE: (id) => `/products/${id}`,
  },
 Places: {
  CREATE: "/places",
  UPDATE: (id) => `/places/${id}`,
  DELETE: (id) => `/places/${id}`,

  GET_ALL: (
    search,
    page,
    limit,
    lang,
    sort,
    governorateId,
    categoryId
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (lang) params.append("lang", lang);
    params.append("page", page);
    params.append("limit", limit);
    if (sort) params.append("sort", sort);
    if (governorateId) params.append("governorateId", governorateId);
    if (categoryId) params.append("categoryId", categoryId);
    return `/places?${params.toString()}`;
  },

  GET_ONE: (id) => `/places/${id}`,
}
};