import api from "../axios";

export const update = (id, payload) => {
  return api.put(`/tickets/${id}`, payload);
};