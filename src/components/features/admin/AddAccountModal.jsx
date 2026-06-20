import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../services/account.service";
import "./AddAccountModal.css";

const ROLES = [
  { value: "Admin", label: "Quan tri vien" },
  { value: "Dentist", label: "Dentist" },
  { value: "Receptionist", label: "Le tan" },
  { value: "Owner", label: "Clinic Owner" },
  { value: "Patient", label: "Patient" },
];

function AddAccountModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role_name: "Admin",
    status: "Active",
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
    try {
      await accountService.create(form);
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
          <h3 className="add-account-modal__title">Add new account</h3>
          <button className="add-account-modal__close" type="button" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="add-account-modal__form" onSubmit={handleSubmit}>
          {error && <p className="add-account-modal__error">{error}</p>}

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Username *</span>
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Email *</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Phone number *</span>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Password *</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          <label className="add-account-modal__field">
            <span className="add-account-modal__label">Role *</span>
            <select name="role_name" value={form.role_name} onChange={handleChange}>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
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
              {isSubmitting ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddAccountModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddAccountModal;
