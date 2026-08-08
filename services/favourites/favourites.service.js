import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const toggleFavourite = async (type, targetId) => {
  const res = await api.post(ENDPOINTS.FAVOURITES.TOGGLE, { type, targetId });
  return res.data;
};

export const getMyFavourites = async (type) => {
  const res = await api.get(ENDPOINTS.FAVOURITES.GET_ALL(type));
  return res.data?.favourites || [];
};
