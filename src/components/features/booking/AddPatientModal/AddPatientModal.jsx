import { useState, useCallback } from "react";
import { X, UserPlus } from "lucide-react";
import PropTypes from "prop-types";
import "./AddPatientModal.css";

function AddPatientModal({ isOpen, onClose, onSave }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const next = {};
    if (!fullName.trim()) next.fullName = "Vui lòng nhập họ và tên.";
    if (!phone.trim()) {
      next.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      next.phone = "Nhập số điện thoại hợp lệ (9-11 chữ số).";
    }
    return next;
  }, [fullName, phone]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      onSave({ fullName: fullName.trim(), phone: phone.trim() });
      setFullName("");
      setPhone("");
      setErrors({});
      onClose();
    },
    [fullName, phone, validate, onSave, onClose],
  );

  const handleClose = useCallback(() => {
    setFullName("");
    setPhone("");
    setErrors({});
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="add-patient-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-patient-modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="add-patient-modal__panel">
        {/* Header */}
        <div className="add-patient-modal__header">
          <div className="add-patient-modal__title-row">
            <UserPlus size={20} aria-hidden="true" className="add-patient-modal__title-icon" />
            <h2 id="add-patient-modal-title" className="add-patient-modal__title">
              Thêm bệnh nhân mới
            </h2>
          </div>
          <button
            type="button"
            className="add-patient-modal__close-btn"
            onClick={handleClose}
            aria-label="Đóng hộp thoại"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form className="add-patient-modal__form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="add-patient-modal__field">
            <label htmlFor="new-patient-fullname" className="add-patient-modal__label">
              Họ và tên <span aria-hidden="true">*</span>
            </label>
            <input
              id="new-patient-fullname"
              type="text"
              className={`add-patient-modal__input${errors.fullName ? " add-patient-modal__input--error" : ""}`}
              placeholder="Nhập họ tên bệnh nhân"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              autoComplete="off"
              autoFocus
            />
            {errors.fullName && (
              <span className="add-patient-modal__error" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="add-patient-modal__field">
            <label htmlFor="new-patient-phone" className="add-patient-modal__label">
              Số điện thoại <span aria-hidden="true">*</span>
            </label>
            <input
              id="new-patient-phone"
              type="tel"
              className={`add-patient-modal__input${errors.phone ? " add-patient-modal__input--error" : ""}`}
              placeholder="e.g. 0901234567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              autoComplete="off"
            />
            {errors.phone && (
              <span className="add-patient-modal__error" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="add-patient-modal__actions">
            <button
              type="button"
              className="add-patient-modal__btn add-patient-modal__btn--cancel"
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="add-patient-modal__btn add-patient-modal__btn--save"
            >
              Thêm bệnh nhân
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddPatientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddPatientModal;
