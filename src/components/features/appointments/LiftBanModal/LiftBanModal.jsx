import PropTypes from "prop-types";
import { X, ShieldBan, Info } from "lucide-react";
import "./LiftBanModal.css";

/**
 * LiftBanModal — BR-12
 * Receptionist confirms lifting a booking ban for a patient.
 */
function LiftBanModal({ isOpen, patient, onConfirm, onClose, isLoading }) {
  if (!isOpen || !patient) return null;

  return (
    <div
      className="lift-ban-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lift-ban-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
    >
      <div className="lift-ban-modal">
        {/* Header */}
        <div className="lift-ban-modal__header">
          <div className="lift-ban-modal__title-row">
            <div className="lift-ban-modal__icon" aria-hidden="true">
              <ShieldBan size={18} />
            </div>
            <h2 id="lift-ban-modal-title" className="lift-ban-modal__title">
              Gỡ chặn đặt lịch
            </h2>
          </div>
          <button
            id="lift-ban-modal-close"
            type="button"
            className="lift-ban-modal__close-btn"
            aria-label="Đóng hộp thoại"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="lift-ban-modal__body">
          <div className="lift-ban-modal__patient-section">
            <span className="lift-ban-modal__patient-label">THÔNG TIN BỆNH NHÂN</span>
            <div className="lift-ban-modal__patient-info">
              <span className="lift-ban-modal__patient-name">{patient.patientName}</span>
            </div>
          </div>

          <div className="lift-ban-modal__reason-box">
            <strong>Lý do bị chặn:</strong> Tự động chặn do 3 lần vắng mặt.
            Tài khoản bệnh nhân đã được đặt thành <strong>Restricted</strong>,
            preventing login and online booking.
          </div>

          <div className="lift-ban-modal__info-callout">
            <Info size={15} className="lift-ban-modal__info-icon" aria-hidden="true" />
            <p className="lift-ban-modal__info-text">
              Khi gỡ chặn, các bản ghi vắng mặt hiện có sẽ được đánh dấu
              as <strong>"Đã xử lý vắng mặt"</strong> and the patient's
              trạng thái tài khoản sẽ được khôi phục thành <strong>Active</strong>, cho phép
              bệnh nhân đăng nhập và đặt lịch trở lại.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="lift-ban-modal__footer">
          <button
            id="lift-ban-modal-cancel"
            type="button"
            className="lift-ban-modal__btn lift-ban-modal__btn--cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            id="lift-ban-modal-confirm"
            type="button"
            className="lift-ban-modal__btn lift-ban-modal__btn--confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Lift Ban & Resolve"}
          </button>
        </div>
      </div>
    </div>
  );
}

LiftBanModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  patient: PropTypes.shape({
    patientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    patientName: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

LiftBanModal.defaultProps = {
  patient: null,
  isLoading: false,
};

export default LiftBanModal;
