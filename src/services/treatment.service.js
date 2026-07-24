import { api } from "./api";

export const treatmentService = {
  create: (payload) => api.post("/treatments", payload),
  getContext: (appointmentId) =>
    api.get(`/treatments/context/${appointmentId}`),
  startPlan: (appointmentId) =>
    api.post("/treatments/plans", { appointmentId }),
};
