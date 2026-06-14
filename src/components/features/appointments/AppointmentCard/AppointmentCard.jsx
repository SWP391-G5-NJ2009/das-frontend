import PropTypes from "prop-types";
import { CalendarClock, Clock3, Stethoscope, User, Ban, Pencil } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./AppointmentCard.css";

const CANCELLABLE_STATUSES = ["Confirmed", "Waiting"];
const EDITABLE_STATUSES = ["Confirmed", "Waiting"];

function AppointmentCard({ appointment, onCancel, onEdit }) {
  const {
    id,
    serviceName,
    dentistName,
    scheduledDate,
    scheduledTime,
    status,
    notes,
  } = appointment;

  const canCancel = CANCELLABLE_STATUSES.includes(status);
  const canEdit = EDITABLE_STATUSES.includes(status);

  /* Format date: "2026-06-20" → "20/06/2026" */
  const displayDate = scheduledDate
    ? scheduledDate.split("-").reverse().join("/")
    : "";

  return (
    <article
      className={`appt-card appt-card--${status.toLowerCase().replace("-", "")}`}
      aria-label={`Lịch hẹn ${serviceName} vào ${displayDate}`}
    >
      {/* Top row: service name + badge */}
      <div className="appt-card__top">
        <h2 className="appt-card__service">{serviceName}</h2>
        <Badge status={status} />
      </div>

      {/* Info rows */}
      <div className="appt-card__info">
        <p className="appt-card__info-row">
          <User size={15} className="appt-card__info-icon" aria-hidden="true" />
          <span>{dentistName}</span>
        </p>
        <p className="appt-card__info-row">
          <Stethoscope size={15} className="appt-card__info-icon" aria-hidden="true" />
          <span>{serviceName}</span>
        </p>
        <div className="appt-card__meta">
          <span className="appt-card__meta-item">
            <CalendarClock size={15} className="appt-card__info-icon" aria-hidden="true" />
            {displayDate}
          </span>
          <span className="appt-card__meta-item">
            <Clock3 size={15} className="appt-card__info-icon" aria-hidden="true" />
            {scheduledTime}
          </span>
        </div>
        {notes && (
          <p className="appt-card__notes">{notes}</p>
        )}
      </div>

      {/* Actions */}
      {(canCancel || canEdit) && (
        <div className="appt-card__actions">
          {canEdit && (
            <button
              id={`edit-btn-${id}`}
              type="button"
              className="appt-card__btn appt-card__btn--edit"
              onClick={() => onEdit?.(appointment)}
              aria-label={`Chỉnh sửa lịch ${serviceName}`}
              title="Tính năng chỉnh sửa sẽ ra mắt sớm"
              disabled
            >
              <Pencil size={15} aria-hidden="true" />
              Chỉnh sửa
            </button>
          )}
          {canCancel && (
            <button
              id={`cancel-btn-${id}`}
              type="button"
              className="appt-card__btn appt-card__btn--cancel"
              onClick={() => onCancel?.(appointment)}
              aria-label={`Hủy lịch ${serviceName}`}
            >
              <Ban size={15} aria-hidden="true" />
              Hủy lịch
            </button>
          )}
        </div>
      )}
    </article>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
    dentistName: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isRequired,
    scheduledTime: PropTypes.string.isRequired,
    status: PropTypes.oneOf([
      "Confirmed",
      "Waiting",
      "Checked-in",
      "In-Treatment",
      "Cancelled",
      "No-Show",
      "Conflict",
      "Completed",
    ]).isRequired,
    notes: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
};

AppointmentCard.defaultProps = {
  onCancel: null,
  onEdit: null,
};

export default AppointmentCard;
