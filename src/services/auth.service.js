import { api } from "./api";

export const authService = {
  patientLogin: (payload) => api.post("/auth/patient/login", payload),
  staffLogin: (payload) => api.post("/auth/staff/login", payload),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  staffForgotPassword: (payload) =>
    api.post("/auth/forgot-password/staff", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  changePassword: (payload) => api.patch("/auth/change-password", payload),
};
