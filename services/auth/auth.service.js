import api, { plainApi } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const registerUser = (payload) => {
  return plainApi.post(ENDPOINTS.AUTH.REGISTER, payload);
};

export const sendVerficationMail = (payload) => {
  return plainApi.post(ENDPOINTS.AUTH.SEND_MAIL, payload);
};

export const verefyOtp = (payload) => {
  return plainApi.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);
};

export const loginUser = (payload) => {
  return plainApi.post(ENDPOINTS.AUTH.LOGIN, payload);
};

export const refreshAuthSession = () => {
  return plainApi.post(ENDPOINTS.AUTH.REFRESH);
};

export const getCurentUser = () => {
  return api.get(ENDPOINTS.AUTH.GET_CURENT_USER);
};
