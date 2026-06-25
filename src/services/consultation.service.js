import { api } from "./api";

function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  return query.toString();
}

export const consultationService = {
  get: (filters = {}) => {
    const query = toQueryString(filters);
    return api.get(`/consultations/consultation-requests${query ? `?${query}` : ""}`);
  },
  getAll: () => api.get("/consultations/consultation-requests"),
  create: (data) => api.post("/consultations", data),
  update: (id, data) =>
    api.put(`/consultations/consultation-requests/${id}`, data),
};
