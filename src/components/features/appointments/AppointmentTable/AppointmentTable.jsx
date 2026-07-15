import PropTypes from "prop-types";
import {
  Ban,
  MessageSquare,
  Pencil,
  ShieldBan,
  UnlockKeyhole,
} from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./AppointmentTable.css";

const CANCELLABLE_STATUSES = ["Confirmed", "Checked-in", "Conflict"];

/** BR-13: returns true if appointment starts within 24 hours from now */
function isWithin24Hours(scheduledDate, scheduledTime) {
  if (!scheduledDate || !scheduledTime) return false;
  const slotDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
  const diffMs = slotDateTime.getTime() - Date.now();
  return diffMs < 24 * 60 * 60 * 1000;
}

function AppointmentTable({
  appointments,
  onCancel,
  onWithin24hCancel,
  onEdit,
  onLiftBan,
  showPatientInfo,
  actorRole,
}) {
  if (appointments.length === 0) return null;

  return (
    <div
      className="appt-table__wrap"
      role="region"
      aria-label="Danh sách lịch hẹn"
    >
      <table className="appt-table">
        <thead className="appt-table__head">
          <tr>
            <th className="appt-table__th" scope="col">
              #
            </th>
            {showPatientInfo && (
              <th className="appt-table__th" scope="col">
                Bệnh nhân
              </th>
            )}
            <th className="appt-table__th" scope="col">
              Dịch vụ
            </th>
            <th className="appt-table__th" scope="col">
              Nha sĩ
            </th>
            <th className="appt-table__th appt-table__th--sortable" scope="col">
              <span>Ngày &amp; Giờ</span>
            </th>
            <th className="appt-table__th" scope="col">
              Trạng thái
            </th>
            <th className="appt-table__th appt-table__th--actions" scope="col">
              Thao tác
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
                    {appt.patientAccountStatus === "Restricted" && (
                      <span
                        className="appt-table__booking-banned"
                        title="Tài khoản này bị hạn chế do 3 lần không đến khám"
                      >
                        <ShieldBan size={10} aria-hidden="true" />
                        Tài khoản bị hạn chế
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
                      {appt.slotOccupied} ca
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
                    <span
                      className="appt-table__view-only"
                      aria-label="Chỉ xem"
                    >
                      —
                    </span>
                  ) : (
                    <div className="appt-table__action-group">
                      <button
                        id={`tbl-edit-${appt.id}`}
                        type="button"
                        className="appt-table__action-btn appt-table__action-btn--edit"
                        aria-label={`Chỉnh sửa lịch hẹn của ${appt.patientName}`}
                        title="Tính năng chỉnh sửa sắp ra mắt"
                        disabled
                        onClick={() => onEdit?.(appt)}
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      {/* Lift Ban button — only for restricted patients, only for receptionist */}
                      {appt.patientAccountStatus === "Restricted" &&
                        actorRole === "receptionist" && (
                          <button
                            id={`tbl-liftban-${appt.id}`}
                            type="button"
                            className="appt-table__action-btn appt-table__action-btn--lift-ban"
                            aria-label={`Gỡ bỏ hạn chế tài khoản của ${appt.patientName}`}
                            title="Gỡ bỏ hạn chế tài khoản"
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
                              ? "Không thể hủy — trong vòng 24 giờ"
                              : `Hủy lịch hẹn của ${appt.patientName}`
                          }
                          title={
                            within24h
                              ? "Trong vòng 24 giờ — liên hệ lễ tân để hủy"
                              : "Hủy lịch hẹn"
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
      patientAccountStatus: PropTypes.string,
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
