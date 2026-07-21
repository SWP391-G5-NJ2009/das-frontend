import { api } from "./api";

export const staffService = {
    createStaffProfile: (payload) => api.post("/staff/profiles", payload),
    getAvailableStaffAccounts: () => api.get("/staff/accounts/available"),
    createDentistProfile: (payload) => api.post("/staff/dentists", payload),
    updateDentistProfile: (dentistId, payload) => api.patch(`/staff/dentists/${dentistId}`, payload),
    updateReceptionistProfile: (receptionistId, payload) => api.patch(`/staff/receptionists/${receptionistId}`, payload),
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
