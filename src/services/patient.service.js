import { api } from "./api";

export const patientService = {
  /**
   * Search patients by name or phone number.
   * @param {string} q - Search term (min 2 chars)
   * @returns {Promise<Array<{ id, fullName, phone, email, birthDate, gender }>>}
   */
  search: (q) => api.get(`/patients/search?q=${encodeURIComponent(q)}`),
  createWalkInPatient: (payload) => api.post("/patients/walk-in", payload),
  createPatientAccount: (payload) => api.post("/patients", payload),
  getMyTreatmentHistory: () => api.get("/patients/me/treatments"),
  getMyTreatedPatients: () => api.get("/patients/dentist/mine"),
  getTreatmentHistory: (patientId) =>
    api.get(`/patients/${patientId}/treatments`),
  liftBan: (patientId) => api.patch(`/patients/${patientId}/lift-ban`),
};
