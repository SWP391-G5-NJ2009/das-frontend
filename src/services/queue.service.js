import { api } from "./api";

function toQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  return query.toString();
}

function withQuery(path, filters) {
  const query = toQueryString(filters);
  return `${path}${query ? `?${query}` : ""}`;
}

export const queueService = {
  getAll: (filters = {}) => api.get(withQuery("/queues", filters)),
  getMine: (filters = {}) => api.get(withQuery("/queues/mine", filters)),
  getDetail: (queueId) => api.get(`/queues/${queueId}`),
  createFollowUp: (queueId, payload) =>
    api.post(`/queues/${queueId}/follow-ups`, payload),
};
