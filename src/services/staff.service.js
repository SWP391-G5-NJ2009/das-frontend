import { api } from "./api";

export const staffService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();

        if(filters.search) {
            params.set("search", filters.search)
        }
        if(filters.role && filters.role !== "all") {
            params.set("role", filters.role);
        }

        const query = params.toString();
        return api.get(`/staff${query ? `?${query}` : ""}`)
    }
}