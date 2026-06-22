import { api } from "./api";

export const patientService = {
  /**
   * Search patients by name or phone number.
   * @param {string} q - Search term (min 2 chars)
   * @returns {Promise<Array<{ id, fullName, phone, email, dob, gender }>>}
   */
  search: (q) => api.get(`/patients/search?q=${encodeURIComponent(q)}`),
  createPatientAccount: (payload) => api.post("/patients", payload),
  getMyProfile: () => api.get("/patients/me"),
  updateMyProfile: (payload) => api.patch("/patients/me", payload),
  getMyTreatmentHistory: () => api.get("/patients/me/treatments"),
};
