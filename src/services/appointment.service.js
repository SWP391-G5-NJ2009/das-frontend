import { api } from "./api";

function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  return query.toString();
}

export const appointmentService = {
  /** Patient: fetch own appointments */
  getMyAppointments: (filters = {}) => {
    const query = toQueryString(filters);
    return api.get(`/appointments/my${query ? `?${query}` : ""}`);
  },

  /** Receptionist/Admin: fetch all clinic appointments */
  getAll: (filters = {}) => {
    const query = toQueryString(filters);
    return api.get(`/appointments${query ? `?${query}` : ""}`);
  },

  /** Cancel an appointment */
  cancel: (appointmentId, reason = "") =>
    api.patch(`/appointments/${appointmentId}/cancel`, { reason }),

  /** Receptionist: check in a confirmed appointment */
  checkIn: (appointmentId) =>
    api.patch(`/appointments/${appointmentId}/checkin`),

  /** Dentist: start treatment for an assigned checked-in appointment */
  startTreatment: (appointmentId) =>
    api.patch(`/appointments/${appointmentId}/start-treatment`),

  /** Edit an appointment (service, dentist, or slot) — FE stub only, BE not yet implemented */
  edit: (appointmentId, payload) =>
    api.patch(`/appointments/${appointmentId}`, payload),

  book: (payload) => api.post("/appointments", payload),

  /**
   * Patient: get list of { date, startTime } for all active appointments.
   * Used to disable already-booked time slots in the booking UI.
   */
  getMyBookedTimes: () => api.get("/appointments/my/booked-times"),

  /**
   * Receptionist: get list of { date, startTime } for a specific patient's active appointments.
   */
  getPatientBookedTimes: (patientId) =>
    api.get(`/appointments/patient-booked-times?patientId=${patientId}`),

  /**
   * Receptionist: manually mark a Confirmed appointment as No-Show.
   */
  markNoShow: (appointmentId) =>
    api.patch(`/appointments/${appointmentId}/no-show`),
};

