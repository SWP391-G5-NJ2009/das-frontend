import { api } from "./api";

export const consultationService = {
  getAll: () => api.get("/consultations/consultation-requests"),
  create: (data) => api.post("/consultation", data),
  update: (id, data) =>
    api.put(`/receptionist/consultation-requests/${id}`, data),
};
