import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import ReceptionistPageShell from "../ReceptionistPageShell";
import Spinner from "../../../components/common/Spinner/Spinner";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import AppointmentFilters from "../../../components/features/appointments/AppointmentFilters/AppointmentFilters";
import AppointmentTable from "../../../components/features/appointments/AppointmentTable/AppointmentTable";
import CancelConfirmModal from "../../../components/features/appointments/CancelConfirmModal/CancelConfirmModal";
import { useAllAppointments } from "../../../hooks/useAppointments";
import "./ReceptionistAppointmentsPage.css";

function ReceptionistAppointmentsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    search: "",
  });

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { appointments, isLoading, error, cancelAppointment } =
    useAllAppointments(filters);

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
    <ReceptionistPageShell
      contentClassName="receptionist-appointments"
      contentLabelledBy="receptionist-appointments-title"
    >
      {/* ── Page Header ── */}
      <div className="receptionist-appointments__header">
        <div className="receptionist-appointments__heading">
          <h1 id="receptionist-appointments-title">Danh sách lịch hẹn</h1>
          <p>Quản lý và theo dõi tất cả lịch hẹn của phòng khám.</p>
        </div>

        <button
          id="book-appointment-nav-btn"
          type="button"
          className="receptionist-appointments__book-btn"
          onClick={() => navigate("/receptionist/book-appointment")}
          aria-label="Đặt lịch mới"
        >
          <CalendarPlus size={18} aria-hidden="true" />
          Đặt lịch mới
        </button>
      </div>

      {/* ── Filters ── */}
      <AppointmentFilters
        filters={filters}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onSearchChange={handleSearchChange}
      />

      {/* ── Content states ── */}
      {isLoading && <Spinner />}

      {!isLoading && error && (
        <EmptyState message="Không thể tải danh sách lịch hẹn. Vui lòng thử lại." />
      )}

      {!isLoading && !error && appointments.length === 0 && (
        <EmptyState message="Không tìm thấy lịch hẹn nào." />
      )}

      {!isLoading && !error && appointments.length > 0 && (
        <AppointmentTable
          appointments={appointments}
          onCancel={handleRequestCancel}
        />
      )}

      {/* ── Cancel Modal ── */}
      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        appointmentLabel={
          appointmentToCancel
            ? `${appointmentToCancel.serviceName} — ${
                appointmentToCancel.scheduledDate
                  ?.split("-")
                  .reverse()
                  .join("/")
              } lúc ${appointmentToCancel.scheduledTime} (${appointmentToCancel.patientName})`
            : ""
        }
        onConfirm={handleConfirmCancel}
        onClose={handleCloseModal}
        isLoading={isCancelling}
      />
    </ReceptionistPageShell>
  );
}

ReceptionistAppointmentsPage.propTypes = {};

export default ReceptionistAppointmentsPage;
