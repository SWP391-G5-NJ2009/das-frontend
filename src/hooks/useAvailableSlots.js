import { useState, useEffect, useCallback } from "react";
import { slotService } from "../services/slot.service";

/**
 * Fetch available time slots for a dentist on a specific date.
 * Re-fetches automatically whenever dentistId or date changes.
 *
 * @param {string|null} dentistId
 * @param {string|null} date - "YYYY-MM-DD"
 *
 * Returns:
 *  - slots: Array<{ id, time, timeEnd, status }>
 *  - isLoading: boolean
 *  - error: Error | null
 */
export function useAvailableSlots(dentistId, date) {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(async () => {
    if (!dentistId || !date) {
      setSlots([]);
      return;
    }
    // Normalize to "YYYY-MM-DD" using LOCAL date parts to avoid UTC timezone shift.
    // toISOString() converts to UTC which rolls back 1 day for UTC+7 timezones.
    const d = date instanceof Date ? date : new Date(date);
    const isoDate = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
    // Clear stale slots immediately so old data doesn't show while fetching
    setSlots([]);
    setIsLoading(true);
    setError(null);
    try {
      const data = await slotService.getAvailable(dentistId, isoDate);
      setSlots(data || []);
    } catch (err) {
      setError(err);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [dentistId, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slots, isLoading, error, refetch: fetchSlots };
}
