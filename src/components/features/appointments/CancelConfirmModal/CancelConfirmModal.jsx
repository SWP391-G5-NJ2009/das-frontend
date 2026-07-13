import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, X, User, Stethoscope, Phone, Calendar, Clock, TriangleAlert } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./CancelConfirmModal.css";

/**
 * Compute whether the appointment is within the 24-hour BR-13 window.
 * Returns true if the scheduled time is less than 24 hours away.
 */
function isWithin24Hours(scheduledDate, scheduledTime) {
  if (!scheduledDate || !scheduledTime) return false;
  const slotDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
  const diffMs = slotDateTime.getTime() - Date.now();
  return diffMs < 24 * 60 * 60 * 1000;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Appointment Summary Card — read-only section displayed at the top of the modal
───────────────────────────────────────────────────────────────────────────── */
function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="cancel-modal__summary-row">
      <span className="cancel-modal__summary-icon" aria-hidden="true">
        <Icon size={14} />
      </span>
      <span className="cancel-modal__summary-label">{label}</span>
      <span className="cancel-modal__summary-value">{value || "—"}</span>
    </div>
  );
}

SummaryRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

SummaryRow.defaultProps = {
  value: "",
};

/* ─────────────────────────────────────────────────────────────────────────────
   CancelConfirmModal — Main component
───────────────────────────────────────────────────────────────────────────── */
function CancelConfirmModal({ isOpen, appointment, onConfirm, onClose, isLoading, actorRole }) {
  const [note, setNote] = useState("");

  const within24h = useMemo(
    () =>
      actorRole === "patient" &&
      isWithin24Hours(appointment?.scheduledDate, appointment?.scheduledTime),
    [actorRole, appointment?.scheduledDate, appointment?.scheduledTime],
  );

  const isCancelDisabled = isLoading || within24h;

  if (!isOpen || !appointment) return null;

  const handleConfirm = () => {
    if (isCancelDisabled) return;
    onConfirm(note.trim());
    setNote("");
  };

  const handleClose = () => {
    if (isLoading) return;
    setNote("");
    onClose();
  };

  const timeDisplay = appointment.scheduledTime
    ? `${appointment.scheduledTime}${appointment.scheduledTimeEnd ? ` – ${appointment.scheduledTimeEnd}` : ""}`
    : "—";

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
      >
        {/* ── Header ── */}
        <div className="cancel-modal__header">
          <div className="cancel-modal__title-row">
            <span className="cancel-modal__icon" aria-hidden="true">
              <AlertTriangle size={20} />
            </span>
            <h2 id="cancel-modal-title" className="cancel-modal__title">
              Hủy lịch hẹn
            </h2>
          </div>
          <button
            type="button"
            className="cancel-modal__close"
            aria-label="Close"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="cancel-modal__body">

          {/* Appointment Summary Card */}
          <section
            className="cancel-modal__summary-card"
            aria-label="Chi tiết lịch hẹn"
          >
            <div className="cancel-modal__summary-header">
              <span className="cancel-modal__summary-heading">Tóm tắt lịch hẹn</span>
              <Badge status={appointment.status || "Confirmed"} />
            </div>

            <div className="cancel-modal__summary-rows">
              <SummaryRow
                icon={User}
                label="Bệnh nhân"
                value={appointment.patientName}
              />
              <SummaryRow
                icon={Phone}
                label="Phone"
                value={appointment.patientPhone}
              />
              <SummaryRow
                icon={Stethoscope}
                label="Nha sĩ"
                value={appointment.dentistName}
              />
              <SummaryRow
                icon={Stethoscope}
                label="Service"
                value={appointment.serviceName}
              />
              <SummaryRow
                icon={Calendar}
                label="Date"
                value={formatDisplayDate(appointment.scheduledDate)}
              />
              <SummaryRow
                icon={Clock}
                label="Time"
                value={timeDisplay}
              />
            </div>
          </section>

          {/* BR-13 warning — shown to patients only when within 24h */}
          {within24h && (
            <div className="cancel-modal__br13-notice" role="alert">
              <TriangleAlert size={16} aria-hidden="true" />
              <p>
                <strong>Không thể tự hủy lịch</strong> trong vòng 24 giờ
                trước lịch hẹn. Vui lòng liên hệ trực tiếp lễ tân để được hỗ trợ.
              </p>
            </div>
          )}

          {/* Operational Warning Box */}
          <div className="cancel-modal__warning-box" role="note">
            <AlertTriangle size={16} aria-hidden="true" className="cancel-modal__warning-icon" />
            <p className="cancel-modal__warning-text">
              <strong>Lưu ý:</strong> Xác nhận hủy lịch sẽ{" "}
              <strong>giải phóng ngay</strong> khung giờ liên quan và mở lại
              it for public booking. A cancellation notification email will also be
              sent to the patient automatically.
            </p>
          </div>

          {/* Additional Note */}
          <div className="cancel-modal__note-field">
            <label htmlFor="cancel-modal-note" className="cancel-modal__label">
              Ghi chú bổ sung{" "}
              <span className="cancel-modal__optional">(không bắt buộc)</span>
            </label>
            <textarea
              id="cancel-modal-note"
              className="cancel-modal__textarea"
              rows={3}
              placeholder="Ghi lại ngữ cảnh hoặc lưu ý cụ thể từ khách hàng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isCancelDisabled}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="cancel-modal__footer">
          <button
            type="button"
            className="cancel-modal__btn cancel-modal__btn--secondary"
            onClick={handleClose}
            disabled={isLoading}
            id="cancel-modal-back-btn"
          >
            Back
          </button>
          <button
            type="button"
            className="cancel-modal__btn cancel-modal__btn--danger"
            onClick={handleConfirm}
            disabled={isCancelDisabled}
            aria-busy={isLoading}
            title={
              within24h
                ? "Không thể tự hủy trong vòng 24 giờ - hãy liên hệ lễ tân"
                : "Confirm appointment cancellation"
            }
            id="cancel-modal-confirm-btn"
          >
            {isLoading ? "Đang hủy..." : "Hủy lịch hẹn"}
          </button>
        </div>
      </dialog>
    </div>
  );
}

CancelConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  appointment: PropTypes.shape({
    id: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    dentistName: PropTypes.string,
    serviceName: PropTypes.string,
    scheduledDate: PropTypes.string,
    scheduledTime: PropTypes.string,
    scheduledTimeEnd: PropTypes.string,
    status: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  actorRole: PropTypes.string,
};

CancelConfirmModal.defaultProps = {
  appointment: null,
  isLoading: false,
  actorRole: "receptionist",
};

export default CancelConfirmModal;
