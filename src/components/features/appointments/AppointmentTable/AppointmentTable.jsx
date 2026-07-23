import PropTypes from "prop-types";
import { Ban, ClipboardPlus, MessageSquare, Play, ShieldBan, UnlockKeyhole, UserCheck } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./AppointmentTable.css";

const CANCELLABLE_STATUSES = ["Confirmed", "Checked-in", "Conflict", "No-Show"];

// Map room_id → color variant (r1–r5) via modulo — works for any room_id
function getRoomColorClass(roomId) {
  if (!roomId) return "";
  const variant = ((roomId % 5) || 5);
  return `appt-table__room-badge--r${variant}`;
}

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
  onLiftBan,
  onCheckIn,
  checkingInId,
  onStartTreatment,
  startingTreatmentId,
  onRecordTreatment,
  showPatientInfo,
  showRoom,
  actorRole,
}) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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
            {showRoom && (
              <th className="appt-table__th" scope="col">
                Phòng
              </th>
            )}
            <th className="appt-table__th appt-table__th--sortable" scope="col">
              <span>Ngày và giờ</span>
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
                    {appt.patientNoShowCount >= 3 && (
                      <span
                        className="appt-table__booking-banned"
                        title="Tài khoản bệnh nhân bị hạn chế do vắng mặt từ 3 lần trở lên"
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

                {showRoom && (
                  <td className="appt-table__td appt-table__td--room">
                    {appt.roomName ? (
                      <span
                        className={[
                          "appt-table__room-badge",
                          getRoomColorClass(appt.roomId),
                        ]
                          .join(" ")
                          .trim()}
                      >
                        {appt.roomName}
                      </span>
                    ) : (
                      <span className="appt-table__room-empty">—</span>
                    )}
                  </td>
                )}

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
                    appt.status === "Checked-in" ? (
                      <button
                        id={`tbl-start-treatment-${appt.id}`}
                        type="button"
                        className="appt-table__start-treatment"
                        aria-label={`Bắt đầu điều trị cho ${appt.patientName}`}
                        disabled={startingTreatmentId === appt.id}
                        onClick={() => onStartTreatment?.(appt)}
                      >
                        <span>{startingTreatmentId === appt.id ? "Đang xử lý..." : "Bắt đầu điều trị"}</span>
                      </button>
                    ) : appt.status === "In-Treatment" ? (
                      <button
                        id={`tbl-record-treatment-${appt.id}`}
                        type="button"
                        className="appt-table__record-treatment"
                        aria-label={`Ghi kết quả điều trị cho ${appt.patientName}`}
                        onClick={() => onRecordTreatment?.(appt)}
                      >
                        <ClipboardPlus size={15} aria-hidden="true" />
                        <span>Ghi kết quả</span>
                      </button>
                    ) : (
                      <span className="appt-table__view-only" aria-label="Chỉ xem">—</span>
                    )
                  ) : (
                    <div className="appt-table__action-group">
                      {actorRole === "receptionist" &&
                        ["Confirmed", "No-Show"].includes(appt.status) &&
                        appt.scheduledDate && (
                        <button
                          id={`tbl-checkin-${appt.id}`}
                          type="button"
                          className="appt-table__action-btn appt-table__action-btn--check-in"
                          aria-label={`Check-in bệnh nhân ${appt.patientName}`}
                          title={
                            appt.scheduledDate === today
                              ? "Check-in"
                              : "Chỉ có thể check-in trong ngày hẹn"
                          }
                          disabled={
                            checkingInId === appt.id ||
                            appt.scheduledDate !== today
                          }
                          onClick={() => onCheckIn?.(appt)}
                        >
                          <UserCheck size={16} aria-hidden="true" />
                        </button>
                      )}
                      {/* Lift Ban button — only for patients with no_show_count >= 3, only for receptionist */}
                      {appt.patientNoShowCount >= 3 &&
                        actorRole === "receptionist" && (
                          <button
                            id={`tbl-liftban-${appt.id}`}
                            type="button"
                            className="appt-table__action-btn appt-table__action-btn--lift-ban"
                            aria-label={`Gỡ hạn chế tài khoản của ${appt.patientName}`}
                            title="Gỡ hạn chế tài khoản"
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
                              ? "Không thể hủy - lịch hẹn còn dưới 24 giờ"
                              : `Hủy lịch hẹn của ${appt.patientName}`
                          }
                          title={
                            within24h
                              ? "Dưới 24 giờ - liên hệ lễ tân để hủy"
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
      roomId: PropTypes.number,
      roomName: PropTypes.string,
    }),
  ).isRequired,
  onCancel: PropTypes.func,
  onWithin24hCancel: PropTypes.func,
  onLiftBan: PropTypes.func,
  onCheckIn: PropTypes.func,
  checkingInId: PropTypes.string,
  onStartTreatment: PropTypes.func,
  startingTreatmentId: PropTypes.string,
  onRecordTreatment: PropTypes.func,
  showPatientInfo: PropTypes.bool,
  showRoom: PropTypes.bool,
  actorRole: PropTypes.string,
};

AppointmentTable.defaultProps = {
  onCancel: null,
  onWithin24hCancel: null,
  onLiftBan: null,
  onCheckIn: null,
  checkingInId: null,
  onStartTreatment: null,
  startingTreatmentId: null,
  onRecordTreatment: null,
  showPatientInfo: true,
  showRoom: true,
  actorRole: "receptionist",
};

export default AppointmentTable;
