import { api } from "./api";

export const treatmentService = {
  create: (payload) => api.post("/treatments", payload),
};
