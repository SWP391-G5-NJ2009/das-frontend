import PropTypes from "prop-types";
import { Ban, MessageSquare, Pencil, ShieldBan, UnlockKeyhole } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./AppointmentTable.css";

const CANCELLABLE_STATUSES = ["Confirmed", "Checked-in"];

/** BR-13: returns true if appointment starts within 24 hours from now */
function isWithin24Hours(scheduledDate, scheduledTime) {
  if (!scheduledDate || !scheduledTime) return false;
  const slotDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
  const diffMs = slotDateTime.getTime() - Date.now();
  return diffMs < 24 * 60 * 60 * 1000;
}

function AppointmentTable({ appointments, onCancel, onWithin24hCancel, onEdit, onLiftBan, showPatientInfo, actorRole }) {
  if (appointments.length === 0) return null;

  return (
    <div
      className="appt-table__wrap"
      role="region"
      aria-label="Appointment list"
    >
      <table className="appt-table">
        <thead className="appt-table__head">
          <tr>
            <th className="appt-table__th" scope="col">
              #
            </th>
            {showPatientInfo && (
              <th className="appt-table__th" scope="col">
                Patient
              </th>
            )}
            <th className="appt-table__th" scope="col">
              Service
            </th>
            <th className="appt-table__th" scope="col">
              Dentist
            </th>
            <th className="appt-table__th appt-table__th--sortable" scope="col">
              <span>Date &amp; Time</span>
            </th>
            <th className="appt-table__th" scope="col">
              Status
            </th>
            <th className="appt-table__th appt-table__th--actions" scope="col">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="appt-table__body">
          {appointments.map((appt, idx) => {
            const displayDate = appt.scheduledDate
              ? appt.scheduledDate.split("-").reverse().join("/")
              : "";
            const canCancel = CANCELLABLE_STATUSES.includes(appt.status);
            const within24h =
              actorRole === "patient" &&
              isWithin24Hours(appt.scheduledDate, appt.scheduledTime);

            return (
              <tr key={appt.id} className="appt-table__row">
                <td className="appt-table__td appt-table__td--index">
                  {idx + 1}
                </td>

                {showPatientInfo && (
                  <td className="appt-table__td">
                    <span className="appt-table__patient-name">
                      {appt.patientName}
                    </span>
                    <span className="appt-table__patient-phone">
                      {appt.patientPhone}
                    </span>
                    {appt.patientNoShowCount >= 3 && (
                      <span className="appt-table__booking-banned" title="This patient is banned from booking online (3+ no-shows)">
                        <ShieldBan size={10} aria-hidden="true" />
                        Booking Banned
                      </span>
                    )}
                  </td>
                )}

                <td className="appt-table__td appt-table__td--service">
                  {appt.serviceName}
                </td>

                <td className="appt-table__td appt-table__td--dentist">
                  {appt.dentistName}
                </td>

                <td className="appt-table__td appt-table__td--datetime">
                  <span className="appt-table__date">{displayDate}</span>
                  <span className="appt-table__time">
                    {appt.scheduledTime}
                    {appt.scheduledTimeEnd && ` – ${appt.scheduledTimeEnd}`}
                  </span>
                  {appt.slotOccupied > 1 && (
                    <span className="appt-table__slot-count">
                      {appt.slotOccupied} slots
                    </span>
                  )}
                </td>

                <td className="appt-table__td appt-table__td--status">
                  <Badge status={appt.status} />
                  {appt.notes && (
                    <span
                      className="appt-table__cancel-note"
                      title={appt.notes}
                    >
                      <MessageSquare size={11} aria-hidden="true" />
                      <span className="appt-table__cancel-note-text">
                        {appt.notes}
                      </span>
                    </span>
                  )}
                </td>

                <td className="appt-table__td appt-table__td--actions">
                  {actorRole === "dentist" ? (
                    <span className="appt-table__view-only" aria-label="View only">—</span>
                  ) : (
                    <div className="appt-table__action-group">
                      <button
                        id={`tbl-edit-${appt.id}`}
                        type="button"
                        className="appt-table__action-btn appt-table__action-btn--edit"
                        aria-label={`Edit appointment for ${appt.patientName}`}
                        title="Edit feature coming soon"
                        disabled
                        onClick={() => onEdit?.(appt)}
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      {/* Lift Ban button — only for banned patients, only for receptionist */}
                      {appt.patientNoShowCount >= 3 && actorRole === "receptionist" && (
                        <button
                          id={`tbl-liftban-${appt.id}`}
                          type="button"
                          className="appt-table__action-btn appt-table__action-btn--lift-ban"
                          aria-label={`Lift booking ban for ${appt.patientName}`}
                          title="Lift Booking Ban"
                          onClick={() => onLiftBan?.(appt)}
                        >
                          <UnlockKeyhole size={15} aria-hidden="true" />
                        </button>
                      )}
                      {canCancel && (
                        <button
                          id={`tbl-cancel-${appt.id}`}
                          type="button"
                          className={
                            within24h
                              ? "appt-table__action-btn appt-table__action-btn--cancel appt-table__action-btn--restricted"
                              : "appt-table__action-btn appt-table__action-btn--cancel"
                          }
                          aria-label={
                            within24h
                              ? "Cannot cancel — within 24 hours of appointment"
                              : `Cancel appointment for ${appt.patientName}`
                          }
                          title={
                            within24h
                              ? "Within 24 hours — contact reception to cancel"
                              : "Cancel appointment"
                          }
                          onClick={() =>
                            within24h ? onWithin24hCancel?.() : onCancel?.(appt)
                          }
                        >
                          <Ban size={15} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

AppointmentTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      patientName: PropTypes.string.isRequired,
      patientPhone: PropTypes.string,
      patientNoShowCount: PropTypes.number,
      serviceName: PropTypes.string.isRequired,
      dentistName: PropTypes.string.isRequired,
      scheduledDate: PropTypes.string.isRequired,
      scheduledTime: PropTypes.string.isRequired,
      scheduledTimeEnd: PropTypes.string,
      slotOccupied: PropTypes.number,
      status: PropTypes.string.isRequired,
      notes: PropTypes.string,
    }),
  ).isRequired,
  onCancel: PropTypes.func,
  onWithin24hCancel: PropTypes.func,
  onEdit: PropTypes.func,
  onLiftBan: PropTypes.func,
  showPatientInfo: PropTypes.bool,
  actorRole: PropTypes.string,
};

AppointmentTable.defaultProps = {
  onCancel: null,
  onWithin24hCancel: null,
  onEdit: null,
  onLiftBan: null,
  showPatientInfo: true,
  actorRole: "receptionist",
};

export default AppointmentTable;
