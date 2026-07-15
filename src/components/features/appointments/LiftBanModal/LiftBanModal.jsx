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
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div className="lift-ban-modal">
        {/* Header */}
        <div className="lift-ban-modal__header">
          <div className="lift-ban-modal__title-row">
            <div className="lift-ban-modal__icon" aria-hidden="true">
              <ShieldBan size={18} />
            </div>
            <h2 id="lift-ban-modal-title" className="lift-ban-modal__title">
              Gỡ bỏ hạn chế đặt lịch
            </h2>
          </div>
          <button
            id="lift-ban-modal-close"
            type="button"
            className="lift-ban-modal__close-btn"
            aria-label="Đóng cửa sổ"
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
              <span className="lift-ban-modal__patient-name">
                {patient.patientName}
              </span>
            </div>
          </div>

          <div className="lift-ban-modal__reason-box">
            <strong>Lý do hạn chế:</strong> Tự động hạn chế do 3 lần không đến khám.
            Tài khoản bệnh nhân đã được chuyển sang trạng thái <strong>Bị hạn chế</strong>,
            ngăn chặn đăng nhập và đặt lịch trực tuyến.
          </div>

          <div className="lift-ban-modal__info-callout">
            <Info
              size={15}
              className="lift-ban-modal__info-icon"
              aria-hidden="true"
            />
            <p className="lift-ban-modal__info-text">
              Khi gỡ bỏ hạn chế này, các bản ghi không đến khám hiện tại sẽ được đánh dấu
              là <strong>&quot;Đã xử lý không đến&quot;</strong> và trạng thái tài khoản
              của bệnh nhân sẽ được khôi phục về <strong>Hoạt động</strong>, cho phép
              họ đăng nhập và đặt lịch hẹn trở lại.
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
            {isLoading ? "Đang xử lý…" : "Gỡ bỏ hạn chế & Xử lý"}
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
