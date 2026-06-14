import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { X, AlertTriangle } from "lucide-react";
import "./CancelConfirmModal.css";

function CancelConfirmModal({
  isOpen,
  appointmentLabel,
  onConfirm,
  onClose,
  isLoading,
}) {
  const [reason, setReason] = useState("");
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  /* Trap focus & ESC key */
  useEffect(() => {
    if (!isOpen) return;
    setReason("");
    const timer = setTimeout(() => firstFocusRef.current?.focus(), 50);

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim());
  };

  return (
    <div
      className="cancel-modal__overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <dialog
        ref={dialogRef}
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
              Xác nhận hủy lịch hẹn
            </h2>
          </div>
          <button
            type="button"
            className="cancel-modal__close"
            aria-label="Đóng"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="cancel-modal__body">
          <p id="cancel-modal-desc" className="cancel-modal__desc">
            Bạn có chắc chắn muốn hủy lịch hẹn{" "}
            {appointmentLabel && (
              <strong>&ldquo;{appointmentLabel}&rdquo;</strong>
            )}
            ? Hành động này không thể hoàn tác.
          </p>

          <label htmlFor="cancel-reason" className="cancel-modal__label">
            Lý do hủy <span className="cancel-modal__optional">(tuỳ chọn)</span>
          </label>
          <textarea
            id="cancel-reason"
            ref={firstFocusRef}
            className="cancel-modal__textarea"
            rows={3}
            placeholder="Nhập lý do hủy lịch..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="cancel-modal__footer">
          <button
            type="button"
            className="cancel-modal__btn cancel-modal__btn--secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Giữ lịch hẹn
          </button>
          <button
            type="button"
            className="cancel-modal__btn cancel-modal__btn--danger"
            onClick={handleConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Đang hủy..." : "Xác nhận hủy"}
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
