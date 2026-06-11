import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../services/account.service";
import "./AddAccountModal.css";

const ROLES = ["Admin", "Dentist", "Receptionist", "Owner", "Patient"];

function EditAccountModal({ account, onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: account.username || "",
    email: account.email || "",
    phone: account.phone || "",
    password: "",
    role_name: account.role?.role_name || "Patient",
    status: account.status || "Active",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = { ...form };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await accountService.update(account.account_id, payload);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-account-modal__overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="add-account-modal">
        <div className="add-account-modal__header">
          <h3 className="add-account-modal__title">Edit Account</h3>
          <button className="add-account-modal__close" type="button" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="add-account-modal__form" onSubmit={handleSubmit}>
          {error && <p className="add-account-modal__error">{error}</p>}

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Username</span>
            <input name="username" value={form.username} onChange={handleChange} />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Phone</span>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">New Password (leave blank to keep current)</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Role</span>
            <select name="role_name" value={form.role_name} onChange={handleChange}>
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </select>
          </label>

          <div className="add-account-modal__actions">
            <button className="add-account-modal__btn add-account-modal__btn--cancel" type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="add-account-modal__btn add-account-modal__btn--submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
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
