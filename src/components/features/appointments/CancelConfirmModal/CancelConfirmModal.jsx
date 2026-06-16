import { useState } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, X } from "lucide-react";
import "./CancelConfirmModal.css";

function CancelConfirmModal({
  isOpen,
  appointmentLabel,
  onConfirm,
  onClose,
  isLoading,
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div
      className="cancel-modal__overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <dialog
        className="cancel-modal"
        open
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        aria-describedby="cancel-modal-desc"
      >
        {/* Header */}
        <div className="cancel-modal__header">
          <div className="cancel-modal__title-row">
            <span className="cancel-modal__icon" aria-hidden="true">
              <AlertTriangle size={20} />
            </span>
            <h2 id="cancel-modal-title" className="cancel-modal__title">
              Cancel Appointment
            </h2>
          </div>
          <button
            type="button"
            className="cancel-modal__close"
            aria-label="Close"
            onClick={handleClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="cancel-modal__body">
          <p id="cancel-modal-desc" className="cancel-modal__desc">
            Are you sure you want to cancel{" "}
            {appointmentLabel && (
              <strong>&ldquo;{appointmentLabel}&rdquo;</strong>
            )}
            ? This action cannot be undone.
          </p>

          <label htmlFor="cancel-reason" className="cancel-modal__label">
            Reason <span className="cancel-modal__optional">(optional)</span>
          </label>
          <textarea
            id="cancel-reason"
            className="cancel-modal__textarea"
            rows={3}
            placeholder="Enter cancellation reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="cancel-modal__footer">
          <button
            type="button"
            className="cancel-modal__btn cancel-modal__btn--secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Keep Appointment
          </button>
          <button
            type="button"
            className="cancel-modal__btn cancel-modal__btn--danger"
            onClick={handleConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </dialog>
    </div>
  );
}

CancelConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  appointmentLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

CancelConfirmModal.defaultProps = {
  appointmentLabel: "",
  isLoading: false,
};

export default CancelConfirmModal;
