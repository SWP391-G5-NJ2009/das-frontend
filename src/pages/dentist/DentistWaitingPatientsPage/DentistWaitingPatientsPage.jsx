import { useMemo, useState } from "react";
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
    title: "All Patients",
    countLabel: "patients",
    emptyMessage: "No patients to show right now.",
    apiFilters: {},
  },
  waiting: {
    label: "Waiting",
    title: "Waiting Patients",
    countLabel: "waiting",
    emptyMessage: "No patients are waiting right now.",
    apiFilters: { status: "Waiting" },
  },
};

function formatDate(date) {
  return date ? date.split("-").reverse().join("/") : "Not scheduled";
}

function DentistWaitingPatientsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("waiting");
  const filterConfig = FILTERS[activeFilter];
  const { appointments, error, isLoading } = useAllAppointments(
    filterConfig.apiFilters,
  );

  const visiblePatients = useMemo(() => {
    const ownAppointments = user?.profileId
      ? appointments.filter(
          (appointment) =>
            String(appointment.dentistId) === String(user.profileId),
        )
      : appointments;

    return ownAppointments.slice().sort((a, b) => {
      const timeA = `${a.scheduledDate ?? ""} ${a.scheduledTime ?? ""}`;
      const timeB = `${b.scheduledDate ?? ""} ${b.scheduledTime ?? ""}`;
      return timeA.localeCompare(timeB);
    });
  }, [appointments, user?.profileId]);

  return (
    <DentistPageShell>
      <section
        className="dentist-waiting-patients"
        aria-labelledby="dentist-waiting-patients-title"
      >
        <div className="dentist-waiting-patients__header">
          <div>
            <p className="dentist-waiting-patients__eyebrow">
              Patient queue
            </p>
            <h1
              className="dentist-waiting-patients__title"
              id="dentist-waiting-patients-title"
            >
              {filterConfig.title}
            </h1>
          </div>
          <div className="dentist-waiting-patients__header-actions">
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
            <span className="dentist-waiting-patients__count">
              {visiblePatients.length} {filterConfig.countLabel}
            </span>
          </div>
        </div>

        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState message="Unable to load waiting patients. Please try again." />
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
                  <th scope="col">Patient</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Service</th>
                  <th scope="col">Schedule</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {visiblePatients.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <span className="dentist-waiting-patients__patient-name">
                        {appointment.patientName || "Unknown patient"}
                      </span>
                    </td>
                    <td>{appointment.patientPhone || "Not updated"}</td>
                    <td>{appointment.serviceName || "Not updated"}</td>
                    <td>
                      <span className="dentist-waiting-patients__time">
                        {appointment.scheduledTime || "No time"}
                        {appointment.scheduledTimeEnd &&
                          ` - ${appointment.scheduledTimeEnd}`}
                      </span>
                      <span className="dentist-waiting-patients__date">
                        {formatDate(appointment.scheduledDate)}
                      </span>
                    </td>
                    <td>
                      <Badge status={appointment.status} />
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
