import { api } from "./api";

export const paymentService = {
  getAllPayments: () => api.get("/payments"),
};
