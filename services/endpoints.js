export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    SEND_MAIL: `/auth/verify`,
    VERIFY_OTP: `/auth/validateOtp`,
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    GET_CURENT_USER: "/users/me",
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
    DELETE_IMAGE: (imgId, type, typeId) =>
      `/images/${imgId}?entityType=${type}&entityId=${typeId}`,
    GET_ALL: (
  search,
  page,
  limit,
  minPrice,
  maxPrice,
  stock,
  sort,
  categoryId,
  subCategoryId,
  lang
) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (lang) params.append("lang", lang);

  params.append("page", page);
  params.append("limit", limit);

  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (stock) params.append("stock", stock);
  if (sort) params.append("sort", sort);
  if (categoryId) params.append("categoryId", categoryId);
  if (subCategoryId) params.append("subCategoryId", subCategoryId);

  return `/products?${params.toString()}`;
},    GET_ONE: (id) => `/products/${id}`,
  },
 Places: {
  CREATE: "/places",
  UPDATE: (id) => `/places/${id}`,
  DELETE: (id) => `/places/${id}`,
  DELETE_IMAGE: (imgId, type, typeId) =>
    `/images/${imgId}?entityType=${type}&entityId=${typeId}`,

  GET_ALL: (
    search,
    page,
    limit,
    lang,
    sort,
    governorateId,
    categoryId,
    subCategoryId
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (lang) params.append("lang", lang);
    params.append("page", page);
    params.append("limit", limit);
    if (sort) params.append("sort", sort);
    if (governorateId) params.append("governorateId", governorateId);
    if (categoryId) params.append("categoryId", categoryId);
    if (subCategoryId) params.append("subCategoryId", subCategoryId);
    return `/places?${params.toString()}`;
  },

  GET_ONE: (id) => `/places/${id}`,
},
NIGHTS: {
  CREATE: "/nights",
  UPDATE: (id) => `/nights/${id}`,
  DELETE: (id) => `/nights/${id}`,
  DELETE_IMAGE: (imgId, type, typeId) =>
    `/images/${imgId}?entityType=${type}&entityId=${typeId}`,
  GET_ALL: (
    search,
    page,
    limit,
    lang,
    sort,
    governorateId,
    categoryId,
    subCategoryId
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (lang) params.append("lang", lang);
    params.append("page", page);
    params.append("limit", limit);
    if (sort) params.append("sort", sort);
    if (governorateId) params.append("governorateId", governorateId);
    if (categoryId) params.append("categoryId", categoryId);
    if (subCategoryId) params.append("subCategoryId", subCategoryId);
    return `/nights?${params.toString()}`;
  },
  GET_ONE: (id) => `/nights/${id}`,
},
EVENTS: {
  CREATE: "/events",
  UPDATE: (id) => `/events/${id}`,
  DELETE: (id) => `/events/${id}`,
  DELETE_IMAGE: (imgId, type, typeId) =>
    `/images/${imgId}?entityType=${type}&entityId=${typeId}`,
  GET_ALL: (
    search,
    page,
    limit,
    lang,
    sort,
    governorateId,
    from,
    to,
    status
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (lang) params.append("lang", lang);
    params.append("page", page);
    params.append("limit", limit);
    if (sort) params.append("sort", sort);
    if (governorateId) params.append("governorate", governorateId);
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (status) params.append("status", status);
    return `/events?${params.toString()}`;
  },
  GET_ONE: (id) => `/events/${id}`,
},
CATEGORIES: {
  CREATE: "/categories",
  UPDATE: (id) => `/categories/${id}`,
  DELETE: (id) => `/categories/${id}`,
  GET_ALL: (type, lang) => `categories?type=${type}&lang=${lang}`,
  GET_ONE: (id) => `/categories/${id}`,
},
CART: {
  GET: "/cart",
  ADD: "/cart",
  UPDATE: (id) => `/cart/items/${id}`,
  REMOVE: (id) => `/cart/${id}`,
  CLEAR: "/cart/clear",
},
FAVOURITES: {
  TOGGLE: "/favourites",
  GET_ALL: (type) => `/favourites?type=${type}`,
},
REVIEWS: {
  GET_ALL: ({ type, targetId, sort, page, limit }) => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (targetId) params.append("targetId", targetId);
    if (sort) params.append("sort", sort);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    return `/reviews?${params.toString()}`;
  },
  CREATE: "/reviews",
  UPDATE: (id) => `/reviews/${id}`,
  DELETE: (id) => `/reviews/${id}`,
},
};

