import { useState, useCallback } from "react";
import { CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthContext";
import PatientPageShell from "../../patient/PatientPageShell";
import ReceptionistPageShell from "../../receptionist/ReceptionistPageShell";
import Spinner from "../../../components/common/Spinner/Spinner";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import AppointmentFilters from "../../../components/features/appointments/AppointmentFilters/AppointmentFilters";
import AppointmentTable from "../../../components/features/appointments/AppointmentTable/AppointmentTable";
import CancelConfirmModal from "../../../components/features/appointments/CancelConfirmModal/CancelConfirmModal";
import {
  useMyAppointments,
  useAllAppointments,
} from "../../../hooks/useAppointments";
import "./AppointmentsPage.css";

/* ── Role-specific config ── */
const PATIENT_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Conflict", label: "Conflict" },
  { value: "Cancelled", label: "Cancelled" },
];

const ROLE_CONFIG = {
  patient: {
    title: "My Appointments",
    subtitle: "View and manage your scheduled appointments.",
    bookRoute: "/patient/booking",
    bookBtnId: "patient-book-new-btn",
    headingId: "appts-page-title",
    showPatientInfo: false,
    statusOptions: PATIENT_STATUS_OPTIONS,
  },
  receptionist: {
    title: "Appointment List",
    subtitle: "Manage and track all clinic appointments.",
    bookRoute: "/receptionist/book-appointment",
    bookBtnId: "book-appointment-nav-btn",
    headingId: "appts-page-title",
    showPatientInfo: true,
    statusOptions: null, // use AppointmentFilters default (all statuses)
  },
};

/* ── Hook selector ── */
function useAppointmentsByRole(role, filters) {
  const patient = useMyAppointments(role === "patient" ? filters : {});
  const receptionist = useAllAppointments(
    role === "receptionist" ? filters : {},
  );
  return role === "patient" ? patient : receptionist;
}

/* ── Shell selector ── */
function PageShell({ role, children }) {
  if (role === "receptionist") {
    return (
      <ReceptionistPageShell
        contentClassName="appts-page"
        contentLabelledBy="appts-page-title"
      >
        {children}
      </ReceptionistPageShell>
    );
  }
  return <PatientPageShell>{children}</PatientPageShell>;
}

PageShell.propTypes = {
  role: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/* ── Main component ── */
function AppointmentsPage() {
  const { user } = useAuth();
  const role = user?.role ?? "patient";
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.patient;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    search: "",
  });
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { appointments, isLoading, error, cancelAppointment } =
    useAppointmentsByRole(role, filters);

  /* ── Filter handlers ── */
  const handleStatusChange = useCallback(
    (status) => setFilters((prev) => ({ ...prev, status })),
    [],
  );
  const handleDateChange = useCallback(
    (date) => setFilters((prev) => ({ ...prev, date })),
    [],
  );
  const handleSearchChange = useCallback(
    debounce((search) => setFilters((prev) => ({ ...prev, search })), 400),
    [],
  );

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

  /* ── Cancel label ── */
  const cancelLabel = appointmentToCancel
    ? role === "receptionist"
      ? `${appointmentToCancel.serviceName} — ${appointmentToCancel.scheduledDate
          ?.split("-")
          .reverse()
          .join(
            "/",
          )} lúc ${appointmentToCancel.scheduledTime} (${appointmentToCancel.patientName})`
      : `${appointmentToCancel.serviceName} — ${appointmentToCancel.scheduledDate
          ?.split("-")
          .reverse()
          .join("/")} lúc ${appointmentToCancel.scheduledTime}`
    : "";

  return (
    <PageShell role={role}>
      <section
        className="appts-page__section"
        aria-labelledby={config.headingId}
      >
        {/* Page header */}
        <div className="appts-page__header">
          <div className="appts-page__heading">
            <h1 id={config.headingId}>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>

          <button
            id={config.bookBtnId}
            type="button"
            className="appts-page__book-btn"
            onClick={() => navigate(config.bookRoute)}
            aria-label="Book new appointment"
          >
            <CalendarPlus size={18} aria-hidden="true" />
            Book New Appointment
          </button>
        </div>

        {/* Filters */}
        <AppointmentFilters
          filters={filters}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
          statusOptions={config.statusOptions}
        />

        {/* Content states */}
        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState message="Unable to load appointments. Please try again." />
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <EmptyState message="No appointments found." />
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <AppointmentTable
            appointments={appointments}
            onCancel={handleRequestCancel}
            showPatientInfo={config.showPatientInfo}
          />
        )}
      </section>

      {/* Cancel Modal */}
      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        appointmentLabel={cancelLabel}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseModal}
        isLoading={isCancelling}
      />
    </PageShell>
  );
}

export default AppointmentsPage;
