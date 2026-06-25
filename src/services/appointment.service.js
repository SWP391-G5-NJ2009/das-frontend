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

  /** Edit an appointment (service, dentist, or slot) — FE stub only, BE not yet implemented */
  edit: (appointmentId, payload) =>
    api.patch(`/appointments/${appointmentId}`, payload),

  /**
   * Book a new appointment.
   * @param {{ slotId, serviceId, note, patientId? }} payload
   *   patientId is only required when called by a receptionist.
   */
  book: (payload) => api.post("/appointments", payload),
};
