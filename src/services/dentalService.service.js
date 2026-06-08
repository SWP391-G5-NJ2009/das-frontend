import { api } from "./api";

function toQueryString(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return query.toString();
}

export const dentalServiceService = {
  getOwnerCatalog: (filters = {}) => {
    const query = toQueryString(filters);
    return api.get(`/services/owner/catalog${query ? `?${query}` : ""}`);
  },
};
