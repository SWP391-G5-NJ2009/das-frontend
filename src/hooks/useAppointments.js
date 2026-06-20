import { useState, useEffect, useCallback, useMemo } from "react";
import { appointmentService } from "../services/appointment.service";

/* ─────────────────────────────────────────────────────────────────────────────
   Patient hook — own appointments (calls GET /api/appointments/my)
───────────────────────────────────────────────────────────────────────────── */
export function useMyAppointments(filters = {}, options = {}) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = options.enabled ?? true;

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAppointments = useCallback(async () => {
    if (!isEnabled) {
      setAppointments([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getMyAppointments(filters);
      setAppointments(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, serializedFilters]);

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
export function useAllAppointments(filters = {}, options = {}) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = options.enabled ?? true;

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAppointments = useCallback(async () => {
    if (!isEnabled) {
      setAppointments([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAll(filters);
      setAppointments(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, serializedFilters]);

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
