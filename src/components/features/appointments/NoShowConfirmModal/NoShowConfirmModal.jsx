import PropTypes from "prop-types";
import { UserX, X, User, Stethoscope, Calendar, Clock } from "lucide-react";
import "./NoShowConfirmModal.css";

function formatDisplayDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="noshow-modal__summary-row">
      <span className="noshow-modal__summary-icon" aria-hidden="true">
        <Icon size={14} />
      </span>
      <span className="noshow-modal__summary-label">{label}</span>
      <span className="noshow-modal__summary-value">{value || "—"}</span>
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

function NoShowConfirmModal({ isOpen, appointment, onConfirm, onClose, isLoading }) {
  if (!isOpen || !appointment) return null;

  const timeRange = appointment.scheduledTime
    ? `${appointment.scheduledTime}${appointment.scheduledTimeEnd ? ` – ${appointment.scheduledTimeEnd}` : ""}`
    : "—";

  return (
    <div
      className="noshow-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="noshow-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
    >
      <div className="noshow-modal">
        <div className="noshow-modal__header">
          <div className="noshow-modal__title-row">
            <span className="noshow-modal__icon" aria-hidden="true">
              <UserX size={18} />
            </span>
            <h2 id="noshow-modal-title" className="noshow-modal__title">
              Đánh dấu No-Show
            </h2>
          </div>
          <button
            id="noshow-modal-close-btn"
            type="button"
            className="noshow-modal__close"
            aria-label="Đóng"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        <div className="noshow-modal__body">
          <div className="noshow-modal__warning" role="alert">
            <UserX size={16} aria-hidden="true" />
            <p>
              Bệnh nhân sẽ bị ghi nhận <strong>vắng mặt</strong>. Nếu đây là
              lần thứ 3 trở lên, tài khoản sẽ bị hạn chế đặt lịch trực tuyến.
            </p>
          </div>

          <div className="noshow-modal__summary-card">
            <SummaryRow icon={User} label="Bệnh nhân" value={appointment.patientName} />
            <SummaryRow icon={Stethoscope} label="Nha sĩ" value={appointment.dentistName} />
            <SummaryRow icon={Calendar} label="Ngày khám" value={formatDisplayDate(appointment.scheduledDate)} />
            <SummaryRow icon={Clock} label="Giờ khám" value={timeRange} />
          </div>
        </div>

        <div className="noshow-modal__footer">
          <button
            id="noshow-modal-cancel-btn"
            type="button"
            className="noshow-modal__btn noshow-modal__btn--secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </button>
          <button
            id="noshow-modal-confirm-btn"
            type="button"
            className="noshow-modal__btn noshow-modal__btn--confirm"
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            <UserX size={15} aria-hidden="true" />
            {isLoading ? "Đang xử lý..." : "Xác nhận No-Show"}
          </button>
        </div>
      </div>
    </div>
  );
}

NoShowConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patientName: PropTypes.string,
    dentistName: PropTypes.string,
    scheduledDate: PropTypes.string,
    scheduledTime: PropTypes.string,
    scheduledTimeEnd: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

NoShowConfirmModal.defaultProps = {
  appointment: null,
  isLoading: false,
};

export default NoShowConfirmModal;
