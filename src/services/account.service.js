import { api } from "./api";

export const accountService = {
    getAll: () => api.get("/admin/accounts"),
}