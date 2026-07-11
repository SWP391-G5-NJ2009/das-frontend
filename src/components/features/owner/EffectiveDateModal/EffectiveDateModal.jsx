import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { CalendarDays, X } from "lucide-react";
import "./EffectiveDateModal.css";

function EffectiveDateModal({ lastBookedDate, onConfirm, onCancel }) {
  const minDate = useMemo(() => {
    if (!lastBookedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().slice(0, 10);
    }
    const d = new Date(lastBookedDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [lastBookedDate]);

  const [selectedDate, setSelectedDate] = useState(minDate);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDate) {
      setError("Please select an effective date.");
      return;
    }
    if (selectedDate < minDate) {
      setError(`Date must be after ${minDate}.`);
      return;
    }
    setError(null);
    onConfirm(selectedDate);
  }

  return (
    <div className="effective-date-modal__overlay" onClick={onCancel}>
      <div
        className="effective-date-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="effective-date-modal__header">
          <CalendarDays size={24} className="effective-date-modal__icon" />
          <h2 className="effective-date-modal__title">Set Effective Date</h2>
          <button
            className="effective-date-modal__close"
            type="button"
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>

        <div className="effective-date-modal__body">
          <p className="effective-date-modal__description">
            There are existing booked appointments in the system. To avoid
            conflicts, changes will be scheduled to take effect on a future date.
            The current schedule remains active until then.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="effective-date-modal__field">
              <span className="effective-date-modal__label">
                Effective Date
              </span>
              <input
                type="date"
                className="effective-date-modal__input"
                value={selectedDate}
                min={minDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setError(null);
                }}
              />
            </label>

            {error && (
              <p className="effective-date-modal__error">{error}</p>
            )}

            <div className="effective-date-modal__actions">
              <button
                className="effective-date-modal__btn effective-date-modal__btn--cancel"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="effective-date-modal__btn effective-date-modal__btn--confirm"
                type="submit"
              >
                Schedule Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

EffectiveDateModal.propTypes = {
  lastBookedDate: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

EffectiveDateModal.defaultProps = {
  lastBookedDate: null,
};

export default EffectiveDateModal;
