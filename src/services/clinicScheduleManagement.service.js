import { api } from "./api";

export const clinicScheduleManagementService = {
    getWorkingHour: () => api.get("/schedule/management/workingHour"),
    getClinicSetting: () => api.get("/schedule/management/setting"),
    getClosures: () => api.get("/schedule/management/closures"),
    createClosure: (closureDate, reason) => api.post("/schedule/management/closures", { closureDate, reason }),
    deleteClosure: (id) => api.delete(`/schedule/management/closures/${id}`),
}