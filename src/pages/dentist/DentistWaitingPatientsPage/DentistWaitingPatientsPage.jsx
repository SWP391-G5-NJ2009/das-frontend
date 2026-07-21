import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, ClipboardPlus, History, ListFilter, Search, X } from "lucide-react";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useAuth } from "../../../context/AuthContext";
import { useAllAppointments } from "../../../hooks/useAppointments";
import DentistPageShell from "../DentistPageShell";
import "./DentistWaitingPatientsPage.css";

const FILTERS = {
  all: {
    label: "All",
    title: "My Patients",
    countLabel: "patients",
    emptyMessage: "No patients to show right now.",
    statuses: ["Waiting", "Checked-in", "In-Treatment", "Completed"],
  },
  waiting: {
    label: "Waiting",
    title: "Waiting",
    countLabel: "waiting",
    emptyMessage: "No patients are waiting right now.",
    statuses: ["Waiting", "Checked-in"],
  },
  inTreatment: {
    label: "In treatment",
    title: "In Treatment",
    countLabel: "in treatment",
    emptyMessage: "No patients are currently in treatment.",
    statuses: ["In-Treatment"],
  },
  completed: {
    label: "Completed",
    title: "Completed",
    countLabel: "completed",
    emptyMessage: "No completed patients to show right now.",
    statuses: ["Completed"],
  },
};

function formatDate(date) {
  return date ? date.split("-").reverse().join("/") : "Not scheduled";
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultFollowUpForm() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    appointmentDate: toIsoDate(tomorrow),
    appointmentTime: "09:00",
    reason: "",
  };
}

function getPatientKey(appointment) {
  return appointment.patientId || appointment.patientPhone || appointment.id;
}

function getAppointmentDateTime(appointment) {
  return `${appointment.scheduledDate ?? ""} ${appointment.scheduledTime ?? ""}`;
}

function compareAppointmentsDesc(a, b) {
  return getAppointmentDateTime(b).localeCompare(getAppointmentDateTime(a));
}

function groupAppointmentsByPatient(appointments) {
  return appointments.reduce((groups, appointment) => {
    const key = getPatientKey(appointment);
    const patientAppointments = groups.get(key) || [];
    groups.set(key, [...patientAppointments, appointment]);
    return groups;
  }, new Map());
}

function getMatchingAppointment(appointments, statuses) {
  return appointments
    .filter((appointment) => statuses.includes(appointment.status))
    .sort(compareAppointmentsDesc)[0];
}

function buildPatientRow(patientAppointments, statuses) {
  const sortedAppointments = patientAppointments.slice().sort(compareAppointmentsDesc);
  const queueAppointment = getMatchingAppointment(sortedAppointments, statuses);

  if (!queueAppointment) return null;

  return {
    latestDate: queueAppointment.scheduledDate || "",
    latestTime: queueAppointment.scheduledTime || "",
    latestTimeEnd: queueAppointment.scheduledTimeEnd || "",
    patientId: queueAppointment.patientId,
    patientName: queueAppointment.patientName || "Unknown patient",
    patientPhone: queueAppointment.patientPhone || "",
    queueAppointment,
    queueStatus: queueAppointment.status || "Waiting",
    serviceName: queueAppointment.serviceName || "Not updated",
  };
}

function buildPatientRows(appointments, statuses) {
  return Array.from(groupAppointmentsByPatient(appointments).values())
    .map((patientAppointments) => buildPatientRow(patientAppointments, statuses))
    .filter(Boolean)
    .sort((a, b) =>
      getAppointmentDateTime(a.queueAppointment).localeCompare(
        getAppointmentDateTime(b.queueAppointment),
      ),
    );
}

function matchesSearch(patient, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) return true;

  return [
    patient.patientName,
    patient.patientPhone,
    patient.serviceName,
    patient.queueStatus,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedSearch));
}

function FollowUpReminderModal({
  error,
  form,
  patient,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!patient) return null;

  return (
    <div className="dentist-waiting-patients__modal-overlay" role="presentation">
      <section
        className="dentist-waiting-patients__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-up-title"
      >
        <header className="dentist-waiting-patients__modal-header">
          <div>
            <h2 id="follow-up-title">Schedule Follow-up Appointment</h2>
            <p>{patient.patientName}</p>
          </div>
          <button
            className="dentist-waiting-patients__modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close follow-up reminder"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form className="dentist-waiting-patients__follow-up-form" onSubmit={onSubmit}>
          {error && (
            <div className="dentist-waiting-patients__form-error">
              {error}
            </div>
          )}

          <div className="dentist-waiting-patients__form-grid">
            <label>
              <span>Appointment date</span>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                min={toIsoDate(new Date())}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <span>Appointment time</span>
              <input
                type="time"
                name="appointmentTime"
                value={form.appointmentTime}
                onChange={onChange}
                required
              />
            </label>
          </div>

          <label>
            <span>Treatment reason</span>
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              rows="4"
              maxLength={500}
              placeholder="Treatment progress check, recovery monitoring..."
              required
            />
          </label>

          <footer className="dentist-waiting-patients__modal-actions">
            <button
              className="dentist-waiting-patients__modal-btn dentist-waiting-patients__modal-btn--secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="dentist-waiting-patients__modal-btn dentist-waiting-patients__modal-btn--primary"
              type="submit"
            >
              Confirm Reminder
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function DentistWaitingPatientsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("inTreatment");
  const [followUpError, setFollowUpError] = useState("");
  const [followUpForm, setFollowUpForm] = useState(getDefaultFollowUpForm);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [followUpTarget, setFollowUpTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filterConfig = FILTERS[activeFilter];
  const { appointments, error, isLoading } = useAllAppointments({});

  const visiblePatients = useMemo(() => {
    const ownAppointments = user?.profileId
      ? appointments.filter(
          (appointment) =>
            String(appointment.dentistId) === String(user.profileId),
        )
      : appointments;

    return buildPatientRows(ownAppointments, filterConfig.statuses).filter(
      (patient) => matchesSearch(patient, searchTerm),
    );
  }, [appointments, filterConfig.statuses, searchTerm, user?.profileId]);

  const openFollowUpModal = (patient) => {
    setFollowUpTarget(patient);
    setFollowUpForm(getDefaultFollowUpForm());
    setFollowUpError("");
    setFollowUpMessage("");
  };

  const handleFollowUpChange = (event) => {
    const { name, value } = event.target;
    setFollowUpForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFollowUpSubmit = (event) => {
    event.preventDefault();

    const reason = followUpForm.reason.trim();
    const followUpDateTime = new Date(
      `${followUpForm.appointmentDate}T${followUpForm.appointmentTime}:00`,
    );

    if (!reason) {
      setFollowUpError("Treatment reason is required.");
      return;
    }

    if (Number.isNaN(followUpDateTime.getTime()) || followUpDateTime <= new Date()) {
      setFollowUpError("Follow-up date and time must be in the future.");
      return;
    }

    setFollowUpMessage(
      `The follow-up appointment has been successfully scheduled for ${formatDate(
        followUpForm.appointmentDate,
      )} at ${followUpForm.appointmentTime}. Reminder message will be shown to patient a day before follow-up appointment.`,
    );
    setFollowUpTarget(null);
    setFollowUpError("");
  };

  return (
    <DentistPageShell>
      <section
        className="dentist-waiting-patients"
        aria-labelledby="dentist-waiting-patients-title"
      >
        <div className="dentist-waiting-patients__header">
          <div>
            <h1
              className="dentist-waiting-patients__title"
              id="dentist-waiting-patients-title"
            >
              {filterConfig.title}
            </h1>
          </div>
          <div className="dentist-waiting-patients__header-actions">
            <span className="dentist-waiting-patients__count">
              {visiblePatients.length} {filterConfig.countLabel}
            </span>
          </div>
        </div>

        <div className="dentist-waiting-patients__toolbar">
          <label
            className="dentist-waiting-patients__search"
            htmlFor="dentist-patient-search"
          >
            <Search aria-hidden="true" size={16} />
            <input
              id="dentist-patient-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name, phone, status..."
              type="search"
              value={searchTerm}
            />
          </label>

          <button
            className="dentist-waiting-patients__toolbar-button"
            type="button"
          >
            <ListFilter aria-hidden="true" size={16} />
            <span>Filter</span>
          </button>
        </div>

        <div className="dentist-waiting-patients__tabs">
            <div
              className="dentist-waiting-patients__filter-group"
              aria-label="Filter patient queue"
              role="group"
            >
              {Object.entries(FILTERS).map(([key, filter]) => (
                <button
                  className={`dentist-waiting-patients__filter-button${
                    activeFilter === key
                      ? " dentist-waiting-patients__filter-button--active"
                      : ""
                  }`}
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
        </div>

        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState message="Unable to load waiting patients. Please try again." />
        )}

        {followUpMessage && (
          <div className="dentist-waiting-patients__notice">
            {followUpMessage}
          </div>
        )}

        {!isLoading && !error && visiblePatients.length === 0 && (
          <EmptyState message={filterConfig.emptyMessage} />
        )}

        {!isLoading && !error && visiblePatients.length > 0 && (
          <div
            className="dentist-waiting-patients__table-wrap"
            role="region"
            aria-label={`${filterConfig.title} list`}
          >
            <table className="dentist-waiting-patients__table">
              <thead className="dentist-waiting-patients__table-head">
                <tr>
                  <th scope="col">Patient Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Service</th>
                  <th scope="col">Latest Visit</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visiblePatients.map((patient) => (
                  <tr key={patient.patientId || patient.patientPhone}>
                    <td>
                      <span className="dentist-waiting-patients__patient-name">
                        {patient.patientName}
                      </span>
                    </td>
                    <td>
                      <span className="dentist-waiting-patients__time">
                        {patient.patientPhone || "Not updated"}
                      </span>
                    </td>
                    <td>
                      <span className="dentist-waiting-patients__time">
                        {patient.serviceName}
                      </span>
                    </td>
                    <td>
                      <span className="dentist-waiting-patients__time">
                        {patient.latestTime || "No time"}
                        {patient.latestTimeEnd && ` - ${patient.latestTimeEnd}`}
                      </span>
                      <span className="dentist-waiting-patients__muted-info">
                        {formatDate(patient.latestDate)}
                      </span>
                    </td>
                    <td>
                      <Badge status={patient.queueStatus} />
                    </td>
                    <td>
                      <div className="dentist-waiting-patients__actions">
                        <button
                          aria-label={`View treatment history for ${patient.patientName}`}
                          className="dentist-waiting-patients__action-button"
                          disabled={!patient.patientId}
                          onClick={() =>
                            navigate(
                              `/dentist/patients/${patient.patientId}/treatment-history`,
                              { state: { patient: patient.queueAppointment } },
                            )
                          }
                          title="View treatment history"
                          type="button"
                        >
                          <History aria-hidden="true" size={15} />
                        </button>
                        <button
                          aria-label={`Schedule follow-up for ${patient.patientName}`}
                          className="dentist-waiting-patients__icon-action dentist-waiting-patients__icon-action--follow-up"
                          onClick={() => openFollowUpModal(patient)}
                          title="Schedule follow-up reminder"
                          type="button"
                        >
                          <CalendarPlus aria-hidden="true" size={15} />
                        </button>
                        <button
                          className="dentist-waiting-patients__icon-action"
                          disabled
                          title="Open treatment record"
                          type="button"
                        >
                          <ClipboardPlus aria-hidden="true" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <FollowUpReminderModal
          error={followUpError}
          form={followUpForm}
          patient={followUpTarget}
          onChange={handleFollowUpChange}
          onClose={() => setFollowUpTarget(null)}
          onSubmit={handleFollowUpSubmit}
        />
      </section>
    </DentistPageShell>
  );
}

DentistWaitingPatientsPage.propTypes = {};

export default DentistWaitingPatientsPage;
