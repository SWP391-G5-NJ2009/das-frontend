import { api } from "./api";

export const revenueService = {
    get: () => api.get("/reports/revenue"),
    getMonthly: () => api.get("/reports/revenue/monthly"),
}