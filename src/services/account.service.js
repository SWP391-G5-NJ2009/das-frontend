import { api } from "./api";

export const accountService = {
    getAll: () => api.get("/admin/accounts"),
    create: (data) => api.post("/admin/accounts", data),
    update: (id, data) => api.put(`/admin/accounts/${id}`, data),
}