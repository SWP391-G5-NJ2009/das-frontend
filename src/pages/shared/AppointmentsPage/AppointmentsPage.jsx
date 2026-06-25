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
import Toast from "../../../components/common/Toast/Toast";
import {
  useMyAppointments,
  useAllAppointments,
} from "../../../hooks/useAppointments";
import "./AppointmentsPage.css";


/* ── Role-specific config ── */
const ROLE_CONFIG = {
  patient: {
    title: "My Appointments",
    subtitle: "View and manage your scheduled appointments.",
    bookRoute: "/patient/booking",
    bookBtnId: "patient-book-new-btn",
    headingId: "appts-page-title",
    showPatientInfo: false,
    statusOptions: null, // use AppointmentFilters default (all statuses)
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
  const isPatient = role === "patient";
  const isReceptionist = role === "receptionist";
  const patient = useMyAppointments(isPatient ? filters : {}, {
    enabled: isPatient,
  });
  const receptionist = useAllAppointments(isReceptionist ? filters : {}, {
    enabled: isReceptionist,
  });
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

  const today = new Date();
  const todayYear = String(today.getFullYear());
  const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayDay = String(today.getDate()).padStart(2, "0");

  // Display state for the three dropdowns
  const [dateParts, setDateParts] = useState({
    year: todayYear,
    month: todayMonth,
    day: todayDay,
  });

  // Backend filter state derived from dateParts
  const [filters, setFilters] = useState({
    status: "all",
    date: `${todayYear}-${todayMonth}-${todayDay}`, // exact day YYYY-MM-DD
    month: "",        // YYYY-MM (set when day is empty)
    year: "",         // YYYY   (set when month is empty too)
    search: "",
  });

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  const { appointments, isLoading, error, cancelAppointment } =
    useAppointmentsByRole(role, filters);


  /* ── Filter handlers ── */
  const handleStatusChange = useCallback(
    (status) => setFilters((prev) => ({ ...prev, status })),
    [],
  );

  /**
   * Called by AppointmentFilters when any of year/month/day changes.
   * Updates both the dropdown display state and the backend filter state.
   */
  const handleDatePartsChange = useCallback(
    ({ year, month, day }) => {
      setDateParts({ year, month, day });
      setFilters((prev) => ({
        ...prev,
        // Exact day match
        date: year && month && day ? `${year}-${month}-${day}` : "",
        // Month match (YYYY-MM) — only when day is empty
        month: year && month && !day ? `${year}-${month}` : "",
        // Year match — only when both month and day are empty
        year: year && !month ? year : "",
      }));
    },
    [],
  );

  const handleSearchChange = useCallback(
    (search) => setFilters((prev) => ({ ...prev, search })),
    [],
  );

  /* ── Today shortcut ── */
  const handleTodayClick = useCallback(() => {
    setDateParts({ year: todayYear, month: todayMonth, day: todayDay });
    setFilters((prev) => ({
      ...prev,
      date: `${todayYear}-${todayMonth}-${todayDay}`,
      month: "",
      year: "",
    }));
  }, [todayYear, todayMonth, todayDay]);

  const isTodayActive =
    filters.date === `${todayYear}-${todayMonth}-${todayDay}`;

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
        setToast({
          type: "success",
          message:
            "The appointment has been cancelled successfully! A notification email has been sent to the patient.",
        });
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

  /* ── Within-24h toast ── */
  const handleWithin24hCancel = useCallback(() => {
    setToast({
      type: "warning",
      message:
        "Appointments can only be cancelled at least 24 hours in advance. Please contact the receptionist directly for assistance.",
    });
  }, []);

  const handleDismissToast = useCallback(() => setToast(null), []);



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
          filters={{ ...filters, ...dateParts }}
          onStatusChange={handleStatusChange}
          onDatePartsChange={handleDatePartsChange}
          onSearchChange={handleSearchChange}
          onTodayClick={handleTodayClick}
          isTodayActive={isTodayActive}
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
            onWithin24hCancel={handleWithin24hCancel}
            showPatientInfo={config.showPatientInfo}
            actorRole={role}
          />
        )}
      </section>

      {/* Cancel Modal */}
      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        appointment={appointmentToCancel}
        actorRole={role}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseModal}
        isLoading={isCancelling}
      />

      {/* Within-24h warning toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleDismissToast}
          duration={5000}
        />
      )}
    </PageShell>
  );
}

export default AppointmentsPage;
