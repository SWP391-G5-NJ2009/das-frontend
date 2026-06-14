import PropTypes from "prop-types";
import { ArrowUpDown, Ban, Pencil } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./AppointmentTable.css";

const CANCELLABLE_STATUSES = ["Confirmed", "Waiting", "Checked-in"];

function AppointmentTable({ appointments, onCancel, onEdit }) {
  if (appointments.length === 0) return null;

  return (
    <div className="appt-table__wrap" role="region" aria-label="Danh sách lịch hẹn">
      <table className="appt-table">
        <thead className="appt-table__head">
          <tr>
            <th className="appt-table__th" scope="col">#</th>
            <th className="appt-table__th" scope="col">Bệnh nhân</th>
            <th className="appt-table__th" scope="col">Dịch vụ</th>
            <th className="appt-table__th" scope="col">Bác sĩ phụ trách</th>
            <th className="appt-table__th appt-table__th--sortable" scope="col">
              <span>Ngày &amp; Giờ</span>
              <ArrowUpDown size={14} aria-hidden="true" />
            </th>
            <th className="appt-table__th" scope="col">Trạng thái</th>
            <th className="appt-table__th appt-table__th--actions" scope="col">
              Hành động
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

                <td className="appt-table__td">
                  <span className="appt-table__patient-name">
                    {appt.patientName}
                  </span>
                  <span className="appt-table__patient-phone">
                    {appt.patientPhone}
                  </span>
                </td>

                <td className="appt-table__td appt-table__td--service">
                  {appt.serviceName}
                </td>

                <td className="appt-table__td appt-table__td--dentist">
                  {appt.dentistName}
                </td>

                <td className="appt-table__td appt-table__td--datetime">
                  <span className="appt-table__date">{displayDate}</span>
                  <span className="appt-table__time">{appt.scheduledTime}</span>
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
                      aria-label={`Chỉnh sửa lịch hẹn của ${appt.patientName}`}
                      title="Tính năng chỉnh sửa sẽ ra mắt sớm"
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
                        aria-label={`Hủy lịch hẹn của ${appt.patientName}`}
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
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
};

AppointmentTable.defaultProps = {
  onCancel: null,
  onEdit: null,
};

export default AppointmentTable;
