import { useState, useEffect, useCallback, useMemo } from "react";
import { appointmentService } from "../services/appointment.service";

export function useMyAppointments(filters = {}, options = {}) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = options.enabled ?? true;

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAppointments = useCallback(
    async (isBackground = false) => {
      if (!isEnabled) {
        setAppointments([]);
        if (!isBackground) setIsLoading(false);
        setError(null);
        return;
      }

      if (!isBackground) setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentService.getMyAppointments(filters);
        const _now = new Date();
        const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;
        const sorted = (data || []).slice().sort((a, b) => {
          const dateA = a.scheduledDate ?? null;
          const dateB = b.scheduledDate ?? null;
          const timeA = a.scheduledTime ?? "99:99";
          const timeB = b.scheduledTime ?? "99:99";
          const aIsFuture = dateA !== null && dateA >= today;
          const bIsFuture = dateB !== null && dateB >= today;
          const aIsNull = dateA === null;
          const bIsNull = dateB === null;
          // null ⇒ cuối cùng
          if (aIsNull && bIsNull) return 0;
          if (aIsNull && !bIsNull) return 1;
          if (!aIsNull && bIsNull) return -1;
          // tương lai trước quá khứ
          if (aIsFuture && !bIsFuture) return -1;
          if (!aIsFuture && bIsFuture) return 1;
          if (aIsFuture) {
            // cả 2 tương lai: ASC ngày, ASC giờ
            const dc = dateA.localeCompare(dateB);
            return dc !== 0 ? dc : timeA.localeCompare(timeB);
          } else {
            // cả 2 quá khứ: DESC ngày (gần nhất trước), ASC giờ
            const dc = dateB.localeCompare(dateA);
            return dc !== 0 ? dc : timeA.localeCompare(timeB);
          }
        });
        setAppointments(sorted);
      } catch (err) {
        if (!isBackground) setError(err);
      } finally {
        if (!isBackground) setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isEnabled, serializedFilters],
  );

  useEffect(() => {
    fetchAppointments();

    // Polling: auto-refresh every 30 seconds silently
    const interval = setInterval(() => {
      fetchAppointments(true);
    }, 30000);

    return () => clearInterval(interval);
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

export function useAllAppointments(filters = {}, options = {}) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = options.enabled ?? true;

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAppointments = useCallback(
    async (isBackground = false) => {
      if (!isEnabled) {
        setAppointments([]);
        if (!isBackground) setIsLoading(false);
        setError(null);
        return;
      }

      if (!isBackground) setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentService.getAll(filters);
        const _now = new Date();
        const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;
        const sorted = (data || []).slice().sort((a, b) => {
          const dateA = a.scheduledDate ?? null;
          const dateB = b.scheduledDate ?? null;
          const timeA = a.scheduledTime ?? "99:99";
          const timeB = b.scheduledTime ?? "99:99";
          const aIsFuture = dateA !== null && dateA >= today;
          const bIsFuture = dateB !== null && dateB >= today;
          const aIsNull = dateA === null;
          const bIsNull = dateB === null;
          // null ⇒ cuối cùng
          if (aIsNull && bIsNull) return 0;
          if (aIsNull && !bIsNull) return 1;
          if (!aIsNull && bIsNull) return -1;
          // tương lai trước quá khứ
          if (aIsFuture && !bIsFuture) return -1;
          if (!aIsFuture && bIsFuture) return 1;
          if (aIsFuture) {
            // cả 2 tương lai: ASC ngày, ASC giờ
            const dc = dateA.localeCompare(dateB);
            return dc !== 0 ? dc : timeA.localeCompare(timeB);
          } else {
            // cả 2 quá khứ: DESC ngày (gần nhất trước), ASC giờ
            const dc = dateB.localeCompare(dateA);
            return dc !== 0 ? dc : timeA.localeCompare(timeB);
          }
        });

        setAppointments(sorted);
      } catch (err) {
        if (!isBackground) setError(err);
      } finally {
        if (!isBackground) setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isEnabled, serializedFilters],
  );

  useEffect(() => {
    fetchAppointments();

    // Polling: auto-refresh every 30 seconds silently
    const interval = setInterval(() => {
      fetchAppointments(true);
    }, 30000);

    // Window focus refetch: refresh immediately when user switches back to this tab
    const handleFocus = () => fetchAppointments(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
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
