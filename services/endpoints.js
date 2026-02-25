export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    SEND_MAIL: `/auth/verify`,
    VERIFY_OTP: `/auth/validateOtp`,
    LOGIN: "/auth/login",
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
};
