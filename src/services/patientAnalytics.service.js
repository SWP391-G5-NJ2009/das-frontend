import { api } from "./api";

export const patientAnalyticsService = {
    getNewPatient: () => api.get("/reports/patient/newPatient"),
    getNoShowRate: () => api.get("/reports/patient/noShowRate"),
    getReturningPatient: () => api.get("/reports/patient/returningPatient"),
    getMonthlyNewPatient: (mCurrent, mOffset = 0) => api.get(`/reports/patient/newPatientMonthly?m_current=${mCurrent}&m_offset=${mOffset}`),
    getMonthlyReturningPatient: (mCurrent, mOffset = 0) => api.get(`/reports/patient/returningPatientMonthly?m_current=${mCurrent}&m_offset=${mOffset}`),
    getMonthlyNoShowRate: () => api.get("/reports/patient/noShowRateMonthly"),
}