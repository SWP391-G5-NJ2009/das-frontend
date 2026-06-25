import { api } from "./api";

export const slotService = {
  /**
   * Get available slots for a dentist on a specific date.
   * @param {string} dentistId
   * @param {string} date - "YYYY-MM-DD"
   * @returns {Promise<Array<{ id, time, timeEnd, status }>>}
   */
  getAvailable: (dentistId, date) =>
    api.get(`/slots?dentistId=${dentistId}&date=${date}`),
};
