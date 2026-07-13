import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardPlus, History, ListFilter, Search } from "lucide-react";
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

function DentistWaitingPatientsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("inTreatment");
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
              placeholder="Tìm theo tên, số điện thoại, trạng thái..."
              type="search"
              value={searchTerm}
            />
          </label>

          <button
            className="dentist-waiting-patients__toolbar-button"
            type="button"
          >
            <ListFilter aria-hidden="true" size={16} />
            <span>Lọc</span>
          </button>
        </div>

        <div className="dentist-waiting-patients__tabs">
            <div
              className="dentist-waiting-patients__filter-group"
              aria-label="Lọc hàng đợi bệnh nhân"
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
          <EmptyState message="Không thể tải danh sách bệnh nhân đang chờ. Vui lòng thử lại." />
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
                  <th scope="col">Tên bệnh nhân</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Service</th>
                  <th scope="col">Lần khám gần nhất</th>
                  <th scope="col">Status</th>
                  <th scope="col">Thao tác</th>
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
                          title="Xem lịch sử điều trị"
                          type="button"
                        >
                          <History aria-hidden="true" size={15} />
                        </button>
                        <button
                          className="dentist-waiting-patients__icon-action"
                          disabled
                          title="Mở hồ sơ điều trị"
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
      </section>
    </DentistPageShell>
  );
}

DentistWaitingPatientsPage.propTypes = {};

export default DentistWaitingPatientsPage;
