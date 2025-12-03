import apiClient from "../apiClient";

export const getService = {
  getGovernorates: async (limit = 100) => apiClient.get(`/governorates`),

  getSingleGovernorate: async (id) => apiClient.get(`/governorates/${id}`),

  getPlaces: async (limit = 100) => apiClient.get(`/places?limit=${limit}`),

  getSinglePlace: async (id) => apiClient.get(`/places/${id}`),

  getProducts: async (limit = 100) => apiClient.get(`/products?limit=${limit}`),

  getSingleProduct: async (id) => apiClient.get(`/products/${id}`),
};
