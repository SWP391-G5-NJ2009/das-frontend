import { api } from "./api";

export const clinicScheduleManagementService = {
    getWorkingHour: () => api.get("/schedule/management/workingHour"),
    getClinicSetting: () => api.get("/schedule/management/setting"),
}