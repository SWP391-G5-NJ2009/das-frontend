import PropTypes from "prop-types";
import { User, Stethoscope, UserCheck, CalendarClock, Info } from "lucide-react";
import "./BookingSummary.css";

function BookingSummary({ patient, service, dentist, date, slot, onConfirm, onCancel, isSubmitting }) {
  const hasAll = patient && service && dentist && date && slot;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const formattedFee = service?.price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "VND" }).format(service.price)
    : null;

  return (
    <aside className="booking-summary" aria-label="Appointment summary">
      <div className="booking-summary__header">
        <CalendarClock size={18} aria-hidden="true" />
        <h3 className="booking-summary__title">Appointment summary</h3>
      </div>

      <div className="booking-summary__body">
        {/* Patient */}
        <div className={`booking-summary__row${patient ? "" : " booking-summary__row--empty"}`}>
          <div className="booking-summary__row-icon" aria-hidden="true">
            <User size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">PATIENT</span>
            {patient ? (
              <>
                <span className="booking-summary__row-value">{patient.fullName}</span>
                <span className="booking-summary__row-sub">{patient.phone}</span>
              </>
            ) : (
              <span className="booking-summary__row-placeholder">No patient selected</span>
            )}
          </div>
        </div>

        {/* Service */}
        <div className={`booking-summary__row${service ? "" : " booking-summary__row--empty"}`}>
          <div className="booking-summary__row-icon" aria-hidden="true">
            <Stethoscope size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">SERVICE</span>
            {service ? (
              <>
                <span className="booking-summary__row-value">{service.name}</span>
                <span className="booking-summary__row-sub">{service.duration} minutes</span>
              </>
            ) : (
              <span className="booking-summary__row-placeholder">No service selected</span>
            )}
          </div>
        </div>

        {/* Dentist */}
        <div className={`booking-summary__row${dentist ? "" : " booking-summary__row--empty"}`}>
          <div className="booking-summary__row-icon" aria-hidden="true">
            <UserCheck size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">DENTIST</span>
            {dentist ? (
              <span className="booking-summary__row-value">{dentist.fullName}</span>
            ) : (
              <span className="booking-summary__row-placeholder">No dentist selected</span>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className={`booking-summary__row${date && slot ? "" : " booking-summary__row--empty"}`}>
          <div className="booking-summary__row-icon" aria-hidden="true">
            <CalendarClock size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">TIME</span>
            {date && slot ? (
              <span className="booking-summary__row-value">
                {slot.time}, {formattedDate}
              </span>
            ) : (
              <span className="booking-summary__row-placeholder">No date/time selected</span>
            )}
          </div>
        </div>

        {/* Fee */}
        {formattedFee && (
          <div className="booking-summary__fee">
            <span className="booking-summary__fee-label">Estimated fee:</span>
            <span className="booking-summary__fee-value">{formattedFee}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="booking-summary__actions">
        <button
          type="button"
          id="confirm-booking-btn"
          className="booking-summary__confirm-btn"
          onClick={onConfirm}
          disabled={!hasAll || isSubmitting}
          aria-disabled={!hasAll || isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Confirm booking"}
        </button>
        <button
          type="button"
          id="cancel-booking-btn"
          className="booking-summary__cancel-btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {/* Notice */}
      <div className="booking-summary__notice" role="note">
        <Info size={14} aria-hidden="true" />
        <p className="booking-summary__notice-text">
          The system will automatically send an appointment confirmation email to the patient after you confirm.
        </p>
      </div>
    </aside>
  );
}

BookingSummary.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }),
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    price: PropTypes.number,
  }),
  dentist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }),
  date: PropTypes.instanceOf(Date),
  slot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

BookingSummary.defaultProps = {
  patient: null,
  service: null,
  dentist: null,
  date: null,
  slot: null,
};

export default BookingSummary;
