import { useState, useCallback, useMemo } from "react";
import { AlertTriangle, CalendarPlus } from "lucide-react";
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
import LiftBanModal from "../../../components/features/appointments/LiftBanModal/LiftBanModal";
import Toast from "../../../components/common/Toast/Toast";
import Pagination from "../../../components/common/Pagination/Pagination";
import {
  useMyAppointments,
  useAllAppointments,
} from "../../../hooks/useAppointments";
import { patientService } from "../../../services/patient.service";
import "./AppointmentsPage.css";

const PAGE_SIZE = 10;

const ROLE_CONFIG = {
  patient: {
    title: "My Appointments",
    subtitle: "View and manage your scheduled appointments.",
    bookRoute: "/patient/booking",
    bookBtnId: "patient-book-new-btn",
    headingId: "appts-page-title",
    showPatientInfo: false,
    statusOptions: null,
  },
  receptionist: {
    title: "Appointment List",
    subtitle: "Manage and track all clinic appointments.",
    bookRoute: "/receptionist/book-appointment",
    bookBtnId: "book-appointment-nav-btn",
    headingId: "appts-page-title",
    showPatientInfo: true,
    statusOptions: null,
  },
};

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

function AppointmentsPage() {
  const { user } = useAuth();
  const role = user?.role ?? "patient";
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.patient;
  const isReceptionist = role === "receptionist";
  const navigate = useNavigate();

  const today = new Date();
  const todayYear = String(today.getFullYear());
  const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayDay = String(today.getDate()).padStart(2, "0");

  const [dateParts, setDateParts] = useState({
    year: todayYear,
    month: todayMonth,
    day: todayDay,
  });

  const [filters, setFilters] = useState({
    status: "all",
    date: `${todayYear}-${todayMonth}-${todayDay}`,
    month: "",
    year: "",
    search: "",
  });

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [liftBanTarget, setLiftBanTarget] = useState(null);
  const [isLiftingBan, setIsLiftingBan] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { appointments, isLoading, error, cancelAppointment } =
    useAppointmentsByRole(role, filters);
  const conflictAlerts = useAllAppointments(
    isReceptionist ? { status: "Conflict" } : {},
    { enabled: isReceptionist },
  );

  const handleStatusChange = useCallback(
    (status) => {
      setFilters((prev) => ({ ...prev, status }));
      setCurrentPage(1);
    },
    [],
  );

  const handleDatePartsChange = useCallback(
    ({ year, month, day }) => {
      setDateParts({ year, month, day });
      setFilters((prev) => ({
        ...prev,
        date: year && month && day ? `${year}-${month}-${day}` : "",
        month: year && month && !day ? `${year}-${month}` : "",
        year: year && !month ? year : "",
      }));
      setCurrentPage(1);
    },
    [],
  );

  const handleSearchChange = useCallback(
    (search) => {
      setFilters((prev) => ({ ...prev, search }));
      setCurrentPage(1);
    },
    [],
  );

  const handleViewConflictAppointments = useCallback(() => {
    setDateParts({ year: "", month: "", day: "" });
    setFilters((prev) => ({
      ...prev,
      status: "Conflict",
      date: "",
      month: "",
      year: "",
    }));
    setCurrentPage(1);
  }, []);

  const handleTodayClick = useCallback(() => {
    setDateParts({ year: todayYear, month: todayMonth, day: todayDay });
    setFilters((prev) => ({
      ...prev,
      date: `${todayYear}-${todayMonth}-${todayDay}`,
      month: "",
      year: "",
    }));
    setCurrentPage(1);
  }, [todayYear, todayMonth, todayDay]);

  const isTodayActive =
    filters.date === `${todayYear}-${todayMonth}-${todayDay}`;

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

  const handleWithin24hCancel = useCallback(() => {
    setToast({
      type: "warning",
      message:
        "Appointments can only be cancelled at least 24 hours in advance. Please contact the receptionist directly for assistance.",
    });
  }, []);

  const handleDismissToast = useCallback(() => setToast(null), []);

  const handleRequestLiftBan = useCallback((appt) => {
    setLiftBanTarget(appt);
  }, []);

  const handleConfirmLiftBan = useCallback(async () => {
    if (!liftBanTarget) return;
    setIsLiftingBan(true);
    try {
      await patientService.liftBan(liftBanTarget.patientId);
      setToast({ type: "success", message: "Update form status successfully." });
      setLiftBanTarget(null);
      window.location.reload();
    } catch {
      setToast({ type: "error", message: "Failed to lift booking ban. Please try again." });
    } finally {
      setIsLiftingBan(false);
    }
  }, [liftBanTarget]);

  const handleCloseLiftBanModal = useCallback(() => {
    if (!isLiftingBan) setLiftBanTarget(null);
  }, [isLiftingBan]);

  const totalPage = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
  const paginatedAppointments = useMemo(
    () => appointments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [appointments, currentPage],
  );

  return (
    <PageShell role={role}>
      <section
        className="appts-page__section"
        aria-labelledby={config.headingId}
      >
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

        {isReceptionist && conflictAlerts.appointments.length > 0 && (
          <div className="appts-page__urgent-alert" role="alert">
            <AlertTriangle size={20} aria-hidden="true" />
            <div className="appts-page__urgent-copy">
              <strong>Urgent rescheduling task</strong>
              <span>
                {conflictAlerts.appointments.length} conflict appointment
                {conflictAlerts.appointments.length === 1 ? "" : "s"} need
                receptionist follow-up.
              </span>
            </div>
            <button
              className="appts-page__urgent-action"
              type="button"
              onClick={handleViewConflictAppointments}
            >
              View conflicts
            </button>
          </div>
        )}

        <AppointmentFilters
          filters={{ ...filters, ...dateParts }}
          onStatusChange={handleStatusChange}
          onDatePartsChange={handleDatePartsChange}
          onSearchChange={handleSearchChange}
          onTodayClick={handleTodayClick}
          isTodayActive={isTodayActive}
          statusOptions={config.statusOptions}
        />

        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState message="Unable to load appointments. Please try again." />
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <EmptyState message="No appointments found." />
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <>
            <AppointmentTable
              appointments={paginatedAppointments}
              onCancel={handleRequestCancel}
              onWithin24hCancel={handleWithin24hCancel}
              onLiftBan={role === "receptionist" ? handleRequestLiftBan : null}
              showPatientInfo={config.showPatientInfo}
              actorRole={role}
            />
            <div className="appts-page__pagination">
              <p className="appts-page__pagination-info">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, appointments.length)} of {appointments.length} appointments
              </p>
              <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </section>

      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        appointment={appointmentToCancel}
        actorRole={role}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseModal}
        isLoading={isCancelling}
      />

      <LiftBanModal
        isOpen={!!liftBanTarget}
        patient={liftBanTarget}
        onConfirm={handleConfirmLiftBan}
        onClose={handleCloseLiftBanModal}
        isLoading={isLiftingBan}
      />

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
