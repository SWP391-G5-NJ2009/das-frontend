import { useState, useEffect, useCallback, useMemo } from "react";
import { appointmentService } from "../services/appointment.service";

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA — matches DB shape; replace with real API once BE is ready.
   Status values must match Badge component: Confirmed | Waiting | Checked-in |
   Cancelled | No-Show | Conflict | In-Treatment | Completed
───────────────────────────────────────────────────────────────────────────── */
const MOCK_APPOINTMENTS = [
  {
    id: "appt-001",
    patientName: "Trần Văn Nam",
    patientPhone: "0901234567",
    serviceName: "Khám tổng quát",
    dentistName: "BS. Nguyễn Thị Lan",
    scheduledDate: "2026-06-20",
    scheduledTime: "09:00",
    status: "Confirmed",
    notes: "",
  },
  {
    id: "appt-002",
    patientName: "Nguyễn Thị Lan",
    patientPhone: "0912345678",
    serviceName: "Niềng răng",
    dentistName: "BS. Trần Văn Minh",
    scheduledDate: "2026-06-22",
    scheduledTime: "14:00",
    status: "Waiting",
    notes: "Bệnh nhân yêu cầu gây tê",
  },
  {
    id: "appt-003",
    patientName: "Lê Quốc Bảo",
    patientPhone: "0923456789",
    serviceName: "Tẩy trắng răng",
    dentistName: "BS. Nguyễn Thị Lan",
    scheduledDate: "2026-06-18",
    scheduledTime: "10:30",
    status: "Checked-in",
    notes: "",
  },
  {
    id: "appt-004",
    patientName: "Phạm Thị Hoa",
    patientPhone: "0934567890",
    serviceName: "Nhổ răng khôn",
    dentistName: "BS. Lê Hoàng Anh",
    scheduledDate: "2026-06-15",
    scheduledTime: "08:30",
    status: "Cancelled",
    notes: "",
  },
  {
    id: "appt-005",
    patientName: "Hoàng Minh Tuấn",
    patientPhone: "0945678901",
    serviceName: "Trám răng",
    dentistName: "BS. Trần Văn Minh",
    scheduledDate: "2026-06-10",
    scheduledTime: "15:00",
    status: "Completed",
    notes: "",
  },
  {
    id: "appt-006",
    patientName: "Võ Thị Mai",
    patientPhone: "0956789012",
    serviceName: "Cạo vôi răng",
    dentistName: "BS. Lê Hoàng Anh",
    scheduledDate: "2026-06-25",
    scheduledTime: "11:00",
    status: "Confirmed",
    notes: "",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK flag — set to false when real API is available
───────────────────────────────────────────────────────────────────────────── */
const USE_MOCK = true;

function applyFilters(list, filters) {
  let result = [...list];

  if (filters.status && filters.status !== "all") {
    result = result.filter((a) => a.status === filters.status);
  }
  if (filters.date) {
    result = result.filter((a) => a.scheduledDate === filters.date);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.patientName?.toLowerCase().includes(q) ||
        a.serviceName?.toLowerCase().includes(q) ||
        a.dentistName?.toLowerCase().includes(q) ||
        a.patientPhone?.includes(q),
    );
  }
  return result;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Patient hook — own appointments
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
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400)); // simulate latency
        // Patient sees only own 3 appointments from mock
        const patientMock = MOCK_APPOINTMENTS.filter((a) =>
          ["appt-001", "appt-002", "appt-004", "appt-005"].includes(a.id),
        );
        setAppointments(applyFilters(patientMock, filters));
      } else {
        const data = await appointmentService.getMyAppointments(filters);
        setAppointments(data || []);
      }
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
      if (USE_MOCK) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, status: "Cancelled" } : a,
          ),
        );
        return;
      }
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
   Receptionist hook — all clinic appointments
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
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setAppointments(applyFilters(MOCK_APPOINTMENTS, filters));
      } else {
        const data = await appointmentService.getAll(filters);
        setAppointments(data || []);
      }
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
      if (USE_MOCK) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, status: "Cancelled" } : a,
          ),
        );
        return;
      }
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
