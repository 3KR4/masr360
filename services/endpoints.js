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
    GET_ALL: (search, lang) => `/governorates?search=${search}&lang=${lang}`,
    GET_ONE: (id) => `/governorates/${id}`,
  },
};
