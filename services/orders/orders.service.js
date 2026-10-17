import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getAllOrders = async (params = {}) => {
  const res = await api.get(ENDPOINTS.ORDERS.GET_ALL, { params });
  return res.data;
};

export const getOrder = async (orderId) => {
  const res = await api.get(ENDPOINTS.ORDERS.GET_ONE(orderId));
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await api.post(ENDPOINTS.ORDERS.CREATE, orderData);
  return res.data;
};

export const cancelOrder = async (orderId) => {
  // According to specification: Request body must be empty.
  const res = await api.put(ENDPOINTS.ORDERS.CANCEL(orderId));
  return res.data;
};

export const updateOrder = async (orderId, orderData) => {
  const res = await api.put(ENDPOINTS.ORDERS.UPDATE(orderId), orderData);
  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await api.delete(ENDPOINTS.ORDERS.DELETE(orderId));
  return res.data;
};
