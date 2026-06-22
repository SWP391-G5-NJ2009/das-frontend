import PropTypes from "prop-types";
import { ArrowUpDown, Ban, Pencil } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./AppointmentTable.css";

const CANCELLABLE_STATUSES = ["Confirmed", "Checked-in"];

function AppointmentTable({ appointments, onCancel, onEdit, showPatientInfo }) {
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

                <td className="appt-table__td">
                  <Badge status={appt.status} />
                </td>

                <td className="appt-table__td appt-table__td--actions">
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
                    {canCancel && (
                      <button
                        id={`tbl-cancel-${appt.id}`}
                        type="button"
                        className="appt-table__action-btn appt-table__action-btn--cancel"
                        aria-label={`Cancel appointment for ${appt.patientName}`}
                        onClick={() => onCancel?.(appt)}
                      >
                        <Ban size={15} aria-hidden="true" />
                      </button>
                    )}
                  </div>
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
      serviceName: PropTypes.string.isRequired,
      dentistName: PropTypes.string.isRequired,
      scheduledDate: PropTypes.string.isRequired,
      scheduledTime: PropTypes.string.isRequired,
      scheduledTimeEnd: PropTypes.string,
      slotOccupied: PropTypes.number,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
  showPatientInfo: PropTypes.bool,
};

AppointmentTable.defaultProps = {
  onCancel: null,
  onEdit: null,
  showPatientInfo: true,
};

export default AppointmentTable;
