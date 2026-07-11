import { api } from "./api";

export const staffService = {
    createDentistProfile: (payload) => api.post("/staff/dentists", payload),
    getAvailableDentistAccounts: () => api.get("/staff/dentist-accounts/available"),
    getAll: (filters = {}) => {
        const params = new URLSearchParams();

        if(filters.search) {
            params.set("search", filters.search)
        }
        if(filters.role && filters.role !== "all") {
            params.set("role", filters.role);
        }
        if(filters.status && filters.status !== "all") {
            params.set("status", filters.status);
        }

        const query = params.toString();
        return api.get(`/staff${query ? `?${query}` : ""}`)
    }
}
