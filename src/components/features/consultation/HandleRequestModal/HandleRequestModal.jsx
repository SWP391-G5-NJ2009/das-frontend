import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./HandleRequestModal.css";
import { consultationService } from "../../../../services/consultation.service";
import BookingFromConsultationModal from "../BookingFromConsultationModal/BookingFromConsultationModal";

const STATUS_LABELS = {
  Pending: "Đang chờ",
  Resolved: "Đã xử lý",
  Booked: "Đã đặt lịch",
  "Follow-up": "Cần gọi lại",
  "Fail-to-contact": "Không liên hệ được",
  Spam: "Spam",
  Other: "Khác",
};

const STATUSES = ["Pending", "Resolved", "Follow-up", "Fail-to-contact", "Spam", "Other"];

function HandleRequestModal({ request, onClose, onSuccess, refetch }) {

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
  const [fieldErrors, setFieldErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { status, note } = form;
      await consultationService.update(request.id, { status, note });
      onSuccess();
    } catch (err) {
      if (err.details) {
        setFieldErrors(err.details);
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="handle-request-modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="handle-request-modal">
        <div className="handle-request-modal__header">
          <h3 className="handle-request-modal__title">Xử lý yêu cầu</h3>
          <button
            className="handle-request-modal__close"
            type="button"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="handle-request-modal__form" onSubmit={handleSubmit}>
          {error && <p className="handle-request-modal__error">{error}</p>}

          <div className="handle-request-modal__column handle-request-modal__column--readonly">
            <span className="handle-request-modal__submitted-at">
              Gửi lúc{" "}
              {new Date(request.created_at).toLocaleString("en-US")}
            </span>

            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Họ và tên</span>
              <input name="full_name" value={form.full_name} readOnly />
            </label>

            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Email</span>
              <input name="email" type="email" value={form.email} readOnly />
            </label>

            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Số điện thoại</span>
              <input name="phone" type="tel" value={form.phone} readOnly />
            </label>

            <label className="handle-request-modal__field handle-request-modal__field--description">
              <span className="handle-request-modal__label">Mô tả</span>
              <textarea name="description" value={form.description} readOnly />
            </label>
          </div>

          <div className="handle-request-modal__column handle-request-modal__column--editable">
            <label className="handle-request-modal__field">
              <span className="handle-request-modal__label">Trạng thái</span>
              {form.status !== "Booked" &&
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status] || status}
                    </option>
                  ))}
                </select>
              }

              {form.status === "Booked" &&
                <select name="status" value={form.status} disabled>
                  <option key={form.status} value={form.status}>{STATUS_LABELS[form.status] || form.status}</option>
                </select>
              }

            </label>

            <label className="handle-request-modal__field handle-request-modal__field--note">
              <span className="handle-request-modal__label">Ghi chú</span>
              <textarea name="note" value={form.note} onChange={handleChange} />
              {fieldErrors?.note && (
                <span className="add-account-modal__field-error">
                  {fieldErrors.note[0]}
                </span>
              )}
            </label>

            <button
              className="handle-request-modal__btn handle-request-modal__btn--schedule"
              type="button"
              disabled={form.status === "Booked"}
              onClick={() => setIsBookingModalOpen(true)}
            >
              {form.status !== "Booked" ? "Đặt lịch hẹn" : "Đã đặt lịch hẹn"}
            </button>

            <div className="handle-request-modal__actions">
              <button
                className="handle-request-modal__btn handle-request-modal__btn--cancel"
                type="button"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                className="handle-request-modal__btn handle-request-modal__btn--submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {isBookingModalOpen && (
        <BookingFromConsultationModal
          request={request}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            setForm((prev) => ({ ...prev, status: "Booked" }));
            refetch();
          }}
        />
      )}
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
