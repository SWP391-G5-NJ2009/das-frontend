import { api } from "./api";

export const profileService = {
  getMe: () => api.get("/profile/me"),
  updateMe: (payload) => api.patch("/profile/me", payload),
};
