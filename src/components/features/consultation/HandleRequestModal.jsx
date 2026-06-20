import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../services/account.service";
import "./HandleRequestModal.css";
import { consultationService } from "../../../services/consultation.service";

const STATUSES = ["Pending", "Resolved", "Fail-to-contact", "Spam", "Other"];

function HandleRequestModal({ request, onClose, onSuccess }) {
  const [form, setForm] = useState({
    id: request.id || "",
    full_name: request.full_name || "",
    email: request.email || "",
    phone: request.phone || "",
    description: request.description,
    created_at: request.created_at,
    status: request.status || "Pending",
    note: request.note || "",
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
      await consultationService.update(request.id, {...form});
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="handle-request-modal__overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="handle-request-modal">
        <div className="handle-request-modal__header">
          <h3 className="handle-request-modal__title">Handle request</h3>
          <button className="handle-request-modal__close" type="button" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="handle-request-modal__form" onSubmit={handleSubmit}>
          {error && <p className="handle-request-modal__error">{error}</p>}

          <div className="handle-request-modal__column handle-request-modal__column--readonly">
            <span className="handle-request-modal__submitted-at">Submitted at {new Date(request.created_at).toLocaleString("en-US")}</span>

            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Full name</span>
              <input name="full_name" value={form.full_name} readOnly/>
            </label>

            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Email</span>
              <input name="email" type="email" value={form.email} readOnly/>
            </label>

            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Phone number</span>
              <input name="phone" type="tel" value={form.phone} readOnly/>
            </label>

            <label className="handle-request-modal__field handle-request-modal__field--description">
              <span className="handle-request-modal__label">Description</span>
              <textarea name="description" value={form.description} readOnly/>
            </label>
          </div>

          <div className="handle-request-modal__column handle-request-modal__column--editable">
            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="handle-request-modal__field handle-request-modal__field--note">
              <span className="handle-request-modal__label">Note</span>
              <textarea name="note" value={form.note} onChange={handleChange} />
            </label>

            <button className="handle-request-modal__btn handle-request-modal__btn--schedule" type="button">
              Book appointment
            </button>

            <div className="handle-request-modal__actions">
              <button className="handle-request-modal__btn handle-request-modal__btn--cancel" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="handle-request-modal__btn handle-request-modal__btn--submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

HandleRequestModal.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default HandleRequestModal;
