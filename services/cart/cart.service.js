import api from "../axios";
import { ENDPOINTS } from "../endpoints";

const normalizeCartResponse = (res) => {
  const data = res?.data;
  if (data?.items) return data;
  if (data?.data?.items) return data.data;
  if (Array.isArray(data?.data)) {
    const cart = data.data.find((c) => c.items?.length > 0) || data.data[0] || null;
    return cart;
  }
  if (data?.data) return data.data;
  return data;
};

export const getCart = async (userId) => {
  const params = {};
  if (userId) params.userId = userId;
  const res = await api.get(ENDPOINTS.CART.GET, { params });
  return normalizeCartResponse(res);
};

export const addToCart = async (productId, cartQuantity = 1) => {
  const res = await api.post(ENDPOINTS.CART.ADD, { product: productId, cartQuantity });
  return normalizeCartResponse(res);
};

export const updateCartItem = async (productId, cartQuantity) => {
  const res = await api.put(ENDPOINTS.CART.UPDATE(productId), { cartQuantity });
  return normalizeCartResponse(res);
};

export const removeCartItem = async (productId) => {
  const res = await api.delete(ENDPOINTS.CART.REMOVE(productId));
  return normalizeCartResponse(res);
};

export const clearCart = async () => {
  const res = await api.delete(ENDPOINTS.CART.CLEAR);
  return normalizeCartResponse(res);
};
