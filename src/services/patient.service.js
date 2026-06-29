import { api } from "./api";

export const patientService = {
  /**
   * Search patients by name or phone number.
   * @param {string} q - Search term (min 2 chars)
   * @returns {Promise<Array<{ id, fullName, phone, email, birthDate, gender }>>}
   */
  search: (q) => api.get(`/patients/search?q=${encodeURIComponent(q)}`),
  createPatientAccount: (payload) => api.post("/patients", payload),
  getMyTreatmentHistory: () => api.get("/patients/me/treatments"),
  /** BR-12: Lift booking ban — resolves all No-Show appointments for patient */
  liftBan: (patientId) => api.patch(`/patients/${patientId}/lift-ban`),
};

