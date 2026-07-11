import { api } from "./api";

export const patientAnalyticsService = {
    getNewPatient: () => api.get("/reports/patient/newPatient"),
    getNoShowRate: () => api.get("/reports/patient/noShowRate"),
    getReturningPatient: () => api.get("/reports/patient/returningPatient"),
    getMonthlyNewPatient: () => api.get("/reports/patient/newPatientMonthly"),
    getMonthlyReturningPatient: () => api.get("/reports/patient/returningPatientMonthly")
}