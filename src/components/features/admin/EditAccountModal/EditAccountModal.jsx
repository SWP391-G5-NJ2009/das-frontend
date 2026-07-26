import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../../services/account.service";
import "./EditAccountModal.css";

const ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Dentist", label: "Nha sĩ" },
  { value: "Receptionist", label: "Lễ tân" },
  { value: "Manager", label: "Quản lý" },
  { value: "Patient", label: "Bệnh nhân" },
];

function EditAccountModal({ account, userAccount, onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: account.username || "",
    email: account.email || "",
    phone: account.phone || "",
    password: "",
    role_name: account.role?.role_name || "",
    status: account.status || "Active",
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = name === "phone" ? value.replace(/\D/g, "") : value;
    setForm((prev) => ({ ...prev, [name]: cleaned }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    e.target.setCustomValidity('');
  };

  function handleInvalid(e) {
    const v = e.target.validity;

    if (v.valueMissing) {
      e.target.setCustomValidity('Vui lòng nhập thông tin này');
    } else if (v.patternMismatch) {
      e.target.setCustomValidity('Số điện thoại phải từ 10 đến 11 chữ số');
    } else if (v.typeMismatch) {
      e.target.setCustomValidity('Vui lòng email đúng định dạng (VD: abc@gmail.com)');
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = { ...form };
    if (!payload.email) {
      delete payload.email;
    }
    if (!payload.phone) {
      delete payload.phone;
    }
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await accountService.update(account.account_id, payload);
      onSuccess();
    } catch (err) {
      if (err.code === "VALIDATION_ERROR") {
        setFieldErrors(err.details);
      } else if (err.code === "DUPLICATE_USERNAME") {
        setFieldErrors({ username: [err.message] });
      } else if (err.code === "DUPLICATE_EMAIL") {
        setFieldErrors({ email: [err.message] });
      } else if (err.code === "INVALID_ROLE") {
        setFieldErrors({ role_name: [err.message] });
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="add-account-modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="add-account-modal">
        <div className="add-account-modal__header">
          <h3 className="add-account-modal__title">Chỉnh sửa tài khoản</h3>
          <button
            className="add-account-modal__close"
            type="button"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="add-account-modal__form" onSubmit={handleSubmit}>
          {error && <p className="add-account-modal__error">{error}</p>}

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Tên đăng nhập</span>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onInvalid={handleInvalid}
            />
            {fieldErrors?.username && (
              <span className="add-account-modal__field-error">
                {fieldErrors.username[0]}
              </span>
            )}
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onInvalid={handleInvalid}
            />
            {fieldErrors?.email && (
              <span className="add-account-modal__field-error">
                {fieldErrors.email[0]}
              </span>
            )}
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Số điện thoại</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.phone}
              onChange={handleChange}
              onInvalid={handleInvalid}
            />
            {fieldErrors?.phone && (
              <span className="add-account-modal__field-error">
                {fieldErrors.phone[0]}
              </span>
            )}
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">
              Mật khẩu mới (để trống nếu giữ nguyên)
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onInvalid={handleInvalid}
            />
            {fieldErrors?.password && (
              <span className="add-account-modal__field-error">
                {fieldErrors.password[0]}
              </span>
            )}
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Role</span>
            <select
              name="role_name"
              value={form.role_name}
              onChange={handleChange}
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {fieldErrors?.role_name && (
              <span className="add-account-modal__field-error">
                {fieldErrors.role_name[0]}
              </span>
            )}
          </label>

          {account.account_id !== userAccount &&
            <label className="add-account-modal__field">
              <span className="add-account-modal__label">Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}>
                <option value="Active">Hoạt động</option>
                <option value="Deactivated">Ngừng hoạt động</option>
              </select>
            </label>}

          <div className="add-account-modal__actions">
            <button
              className="add-account-modal__btn add-account-modal__btn--cancel"
              type="button"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="add-account-modal__btn add-account-modal__btn--submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditAccountModal.propTypes = {
  account: PropTypes.shape({
    account_id: PropTypes.string.isRequired,
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    status: PropTypes.string,
    role: PropTypes.shape({
      role_name: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default EditAccountModal;
