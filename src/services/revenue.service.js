import { api } from "./api";

export const revenueService = {
    get: () => api.get("/reports/revenue"),
    getMonthly: (mCurrent, mOffset = 0) =>
        api.get(`/reports/revenue/monthly?m_current=${mCurrent}&m_offset=${mOffset}`),
}