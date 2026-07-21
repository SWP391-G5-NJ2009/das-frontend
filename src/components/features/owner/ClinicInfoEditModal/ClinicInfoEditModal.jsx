import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./ClinicInfoEditModal.css";

function ClinicInfoEditModal({ error, formData, isSaving, onChange, onClose, onSubmit }) {
  return (
    <div className="clinic-edit-modal__overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="clinic-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clinic-edit-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="clinic-edit-modal__header">
          <div>
            <h2 className="clinic-edit-modal__title" id="clinic-edit-modal-title">
              Chỉnh sửa thông tin phòng khám
            </h2>
          </div>
          <button
            className="clinic-edit-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ chỉnh sửa"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form className="clinic-edit-modal__form" onSubmit={onSubmit}>
          {error && <p className="clinic-edit-modal__error" role="alert">{error}</p>}

          <label className="clinic-edit-modal__field" htmlFor="clinic-name">
            <span>Tên phòng khám</span>
            <input
              id="clinic-name"
              name="clinicName"
              value={formData.clinicName}
              onChange={onChange}
              maxLength={120}
              required
            />
          </label>

          <label className="clinic-edit-modal__field" htmlFor="clinic-address">
            <span>Địa chỉ</span>
            <textarea
              id="clinic-address"
              name="address"
              value={formData.address}
              onChange={onChange}
              maxLength={255}
              rows={3}
              required
            />
          </label>

          <label className="clinic-edit-modal__field" htmlFor="clinic-hotline">
            <span>Hotline</span>
            <input
              id="clinic-hotline"
              name="hotline"
              type="tel"
              value={formData.hotline}
              onChange={onChange}
              maxLength={20}
              required
            />
          </label>

          <div className="clinic-edit-modal__time-grid">
            <label className="clinic-edit-modal__field" htmlFor="clinic-open-time">
              <span>Giờ mở cửa</span>
              <input
                id="clinic-open-time"
                name="openTime"
                type="time"
                value={formData.openTime}
                onChange={onChange}
                required
              />
            </label>

            <label className="clinic-edit-modal__field" htmlFor="clinic-close-time">
              <span>Giờ đóng cửa</span>
              <input
                id="clinic-close-time"
                name="closeTime"
                type="time"
                value={formData.closeTime}
                onChange={onChange}
                required
              />
            </label>
          </div>

          <footer className="clinic-edit-modal__actions">
            <button
              className="clinic-edit-modal__button clinic-edit-modal__button--cancel"
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              className="clinic-edit-modal__button clinic-edit-modal__button--save"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

ClinicInfoEditModal.propTypes = {
  error: PropTypes.string,
  formData: PropTypes.shape({
    clinicName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    hotline: PropTypes.string.isRequired,
    openTime: PropTypes.string.isRequired,
    closeTime: PropTypes.string.isRequired,
  }).isRequired,
  isSaving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

ClinicInfoEditModal.defaultProps = { error: "" };

export default ClinicInfoEditModal;
