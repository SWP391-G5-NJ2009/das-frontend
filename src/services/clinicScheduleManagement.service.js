import { api } from "./api";

export const clinicScheduleManagementService = {
    getWorkingHour: () => api.get("/schedule/management/workingHour"),
    getClinicSetting: () => api.get("/schedule/management/setting"),
    getVersions: () => api.get("/schedule/management/versions"),
    createVersion: (name, effectiveDate) =>
        api.post("/schedule/management/versions", { name, effectiveDate }),
    updateWorkingHours: (versionId, hours) =>
        api.put("/schedule/management/workingHour", { versionId, hours }),
    updateClinicSetting: (versionId, fields) =>
        api.put("/schedule/management/setting", { versionId, ...fields }),
    saveAll: (versionId, hours, settingFields, force = false) =>
        api.put("/schedule/management/save-all", { versionId, hours, settingFields, force }),
    cancelPendingVersion: () => api.delete("/schedule/management/pending"),
    deleteVersion: (id) => api.delete(`/schedule/management/versions/${id}`),
    getVersionById: (id) => api.get(`/schedule/management/versions/${id}`),
    updateEffectiveDate: (id, effectiveDate) =>
        api.patch(`/schedule/management/versions/${id}/effective-date`, { effectiveDate }),
    getMinEffectiveDate: () => api.get("/schedule/management/min-effective-date"),
    getClosures: () => api.get("/schedule/management/closures"),
    createClosure: (closureDate, reason) =>
        api.post("/schedule/management/closures", { closureDate, reason }),
    deleteClosure: (id) => api.delete(`/schedule/management/closures/${id}`),
};
