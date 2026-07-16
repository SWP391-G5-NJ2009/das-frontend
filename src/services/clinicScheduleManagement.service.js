import { api } from "./api";

export const clinicScheduleManagementService = {
    getWorkingHour: () => api.get("/schedule/management/workingHour"),
    updateWorkingHours: (versionId, hours) =>
        api.put("/schedule/management/workingHour", { versionId, hours }),
    saveAll: (versionId, hours, { force = false } = {}) =>
        api.put("/schedule/management/save-all", { versionId, hours, force }),
    deleteVersion: (id) => api.delete(`/schedule/management/versions/${id}`),
    getVersionById: (id) => api.get(`/schedule/management/versions/${id}`),
    updateEffectiveDate: (id, effectiveDate) =>
        api.patch(`/schedule/management/versions/${id}/effective-date`, { effectiveDate }),
    getMinEffectiveDate: () => api.get("/schedule/management/min-effective-date"),
    createVersionWithHours: (name, effectiveDate, hours) =>
        api.post("/schedule/management/versions-with-hours", { name, effectiveDate, hours }),
};
