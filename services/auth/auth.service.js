import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const registerUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.REGISTER, payload);
};
export const sendVerficationMail = (payload) => {
  return api.post(ENDPOINTS.AUTH.SEND_MAIL, payload);
};
export const verefyOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);
};
export const loginUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.LOGIN, payload);
};
