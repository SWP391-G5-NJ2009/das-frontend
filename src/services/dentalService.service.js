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
  getOwnerCatalog: (filters = {}) => {
    const query = toQueryString(filters);
    return api.get(`/services/owner/catalog${query ? `?${query}` : ""}`);
  },
  getCategories: () => api.get("/services/categories"),
  create: (payload) => api.post("/services", payload),
  update: (serviceId, payload) => api.put(`/services/${serviceId}`, payload),
  delete: (serviceId) => api.delete(`/services/${serviceId}`),
};
