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

export const accountService = {
    get: (filters = {}) => {
        const query = toQueryString(filters);
        return api.get(`/admin/accounts${query ? `?${query}` : ""}`);
    },
    getAll: () => api.get("/admin/accounts"),
    create: (data) => api.post("/admin/accounts", data),
    update: (id, data) => api.put(`/admin/accounts/${id}`, data),
    delete: (id) => api.delete(`/admin/accounts/${id}`),
}