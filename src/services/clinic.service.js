import { api } from "./api";

export const clinicService = {
  getInfo: () => api.get("/clinic-info"),
};
