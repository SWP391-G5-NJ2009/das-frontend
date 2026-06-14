import { useState, useCallback } from "react";
import { CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientPageShell from "../PatientPageShell";
import Spinner from "../../../components/common/Spinner/Spinner";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import AppointmentFilters from "../../../components/features/appointments/AppointmentFilters/AppointmentFilters";
import AppointmentCard from "../../../components/features/appointments/AppointmentCard/AppointmentCard";
import CancelConfirmModal from "../../../components/features/appointments/CancelConfirmModal/CancelConfirmModal";
import { useMyAppointments } from "../../../hooks/useAppointments";
import "./AppointmentsPage.css";

const PATIENT_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Waiting", label: "Chờ xác nhận" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Completed", label: "Hoàn thành" },
  { value: "Cancelled", label: "Đã hủy" },
];

function AppointmentsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    search: "",
  });

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { appointments, isLoading, error, cancelAppointment } =
    useMyAppointments(filters);

  /* ── Filter handlers ── */
  const handleStatusChange = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setFilters((prev) => ({ ...prev, date }));
  }, []);

  const handleSearchChange = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  /* ── Cancel handlers ── */
  const handleRequestCancel = useCallback((appointment) => {
    setAppointmentToCancel(appointment);
  }, []);

  const handleConfirmCancel = useCallback(
    async (reason) => {
      if (!appointmentToCancel) return;
      setIsCancelling(true);
      try {
        await cancelAppointment(appointmentToCancel.id, reason);
      } finally {
        setIsCancelling(false);
        setAppointmentToCancel(null);
      }
    },
    [appointmentToCancel, cancelAppointment],
  );

  const handleCloseModal = useCallback(() => {
    if (!isCancelling) setAppointmentToCancel(null);
  }, [isCancelling]);

  return (
    <PatientPageShell>
      <section
        className="patient-appts"
        aria-labelledby="patient-appts-title"
      >
        {/* Page header */}
        <div className="patient-appts__header">
          <div className="patient-appts__heading">
            <h1 id="patient-appts-title">Lịch hẹn của tôi</h1>
            <p>Xem và quản lý các lịch hẹn của bạn.</p>
          </div>
          <button
            id="patient-book-new-btn"
            type="button"
            className="patient-appts__book-btn"
            onClick={() => navigate("/patient/booking")}
            aria-label="Đặt lịch mới"
          >
            <CalendarPlus size={18} aria-hidden="true" />
            Đặt lịch mới
          </button>
        </div>

        {/* Filters */}
        <AppointmentFilters
          filters={filters}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
          statusOptions={PATIENT_STATUS_OPTIONS}
        />

        {/* Content states */}
        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState message="Không thể tải danh sách lịch hẹn. Vui lòng thử lại." />
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <EmptyState message="Không tìm thấy lịch hẹn nào." />
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <div className="patient-appts__grid">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onCancel={handleRequestCancel}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cancel Modal */}
      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        appointmentLabel={
          appointmentToCancel
            ? `${appointmentToCancel.serviceName} — ${
                appointmentToCancel.scheduledDate?.split("-").reverse().join("/")
              } lúc ${appointmentToCancel.scheduledTime}`
            : ""
        }
        onConfirm={handleConfirmCancel}
        onClose={handleCloseModal}
        isLoading={isCancelling}
      />
    </PatientPageShell>
  );
}

export default AppointmentsPage;
