import { api } from "./api";

export const clinicScheduleManagementService = {
    getWorkingHour: () => api.get("/schedule/management/workingHour"),
    updateWorkingHours: (hours, effectiveDate) =>
        api.put("/schedule/management/workingHour", { hours, effectiveDate }),
    cancelPendingWorkingHours: () => api.delete("/schedule/management/workingHour/pending"),
    getClinicSetting: () => api.get("/schedule/management/setting"),
    updateClinicSetting: (settingId, fields, effectiveDate) =>
        api.put("/schedule/management/setting", { settingId, ...fields, effectiveDate }),
    cancelPendingClinicSetting: () => api.delete("/schedule/management/setting/pending"),
    getClosures: () => api.get("/schedule/management/closures"),
    createClosure: (closureDate, reason) => api.post("/schedule/management/closures", { closureDate, reason }),
    deleteClosure: (id) => api.delete(`/schedule/management/closures/${id}`),
};
