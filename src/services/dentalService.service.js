import { api } from "./api";

function toQueryString(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return query.toString();
}

export const dentalServiceService = {
  getAll: (filters = {}) => {
    const query = toQueryString(filters);
    return api.get(`/services${query ? `?${query}` : ""}`);
  },
  getPublic: () => api.get("/services/public"),
  getCategories: () => api.get("/services/categories"),
  getDentistsByService: (serviceId) => api.get(`/services/${serviceId}/dentists`),
  create: (payload) => api.post("/services", payload),
  update: (serviceId, payload) => api.put(`/services/${serviceId}`, payload),
  delete: (serviceId) => api.delete(`/services/${serviceId}`),
};
