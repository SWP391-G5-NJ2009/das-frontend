import { api } from "./api";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
}

export const scheduleService = {
  getMeta: () => api.get("/schedules/meta"),
  getMine: (params) => api.get(`/schedules/me${buildQuery(params)}`),
  submitMine: (payload) => api.post("/schedules/me/requests", payload),
  updateAvailability: (payload) =>
    api.patch("/schedules/me/availability", payload),
  getRequests: (params) => api.get(`/schedules/requests${buildQuery(params)}`),
  approve: (scheduleId) =>
    api.patch(`/schedules/requests/${scheduleId}/approve`),
  deny: (scheduleId, payload) =>
    api.patch(`/schedules/requests/${scheduleId}/deny`, payload),
};
