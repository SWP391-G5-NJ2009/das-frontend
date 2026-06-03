import {api} from "./api";

export const consultationService = {
    create: (data) => api.post("/consultation", data),
}