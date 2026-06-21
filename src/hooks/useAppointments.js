import { useState, useEffect, useCallback, useMemo } from "react";
import { appointmentService } from "../services/appointment.service";

/* ─────────────────────────────────────────────────────────────────────────────
   Patient hook — own appointments (calls GET /api/appointments/my)
───────────────────────────────────────────────────────────────────────────── */
export function useMyAppointments(filters = {}) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getMyAppointments(filters);
      const sorted = (data || []).slice().sort((a, b) => {
        const dateA = `${a.scheduledDate ?? ""} ${a.scheduledTime ?? ""}`;
        const dateB = `${b.scheduledDate ?? ""} ${b.scheduledTime ?? ""}`;
        return dateB.localeCompare(dateA);
      });
      setAppointments(sorted);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedFilters]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(
    async (appointmentId, reason) => {
      await appointmentService.cancel(appointmentId, reason);
      await fetchAppointments();
    },
    [fetchAppointments],
  );

  return {
    appointments,
    isLoading,
    error,
    cancelAppointment,
    refetch: fetchAppointments,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Receptionist / Admin / Owner hook — all clinic appointments
   (calls GET /api/appointments)
───────────────────────────────────────────────────────────────────────────── */
export function useAllAppointments(filters = {}) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAll(filters);
      const sorted = (data || []).slice().sort((a, b) => {
        const dateA = `${a.scheduledDate ?? ""} ${a.scheduledTime ?? ""}`;
        const dateB = `${b.scheduledDate ?? ""} ${b.scheduledTime ?? ""}`;
        return dateB.localeCompare(dateA);
      });
      setAppointments(sorted);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedFilters]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(
    async (appointmentId, reason) => {
      await appointmentService.cancel(appointmentId, reason);
      await fetchAppointments();
    },
    [fetchAppointments],
  );

  return {
    appointments,
    isLoading,
    error,
    cancelAppointment,
    refetch: fetchAppointments,
  };
}
