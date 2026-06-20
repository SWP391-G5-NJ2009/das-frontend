import { api } from "./api";

export const patientService = {
  getMyProfile: () => api.get("/patients/me"),
  updateMyProfile: (payload) => api.patch("/patients/me", payload),
  getMyTreatmentHistory: () => api.get("/patients/me/treatments"),
};
