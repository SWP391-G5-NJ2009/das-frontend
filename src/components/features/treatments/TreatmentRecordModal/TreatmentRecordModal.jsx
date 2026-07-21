import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./TreatmentRecordModal.css";

function TreatmentRecordModal({
  appointment,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentNote, setTreatmentNote] = useState("");

  useEffect(() => {
    const closeOnEscape = (event) =>
      event.key === "Escape" && !isSubmitting && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSubmitting, onClose]);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ diagnosis, treatmentNote });
  };

  return (
    <div
      className="treatment-record__overlay"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSubmitting && onClose()
      }
      role="presentation"
    >
      <section
        aria-labelledby="treatment-record-title"
        aria-modal="true"
        className="treatment-record"
        role="dialog"
      >
        <header className="treatment-record__header">
          <div>
            <h2 id="treatment-record-title">Ghi kết quả điều trị</h2>
            <p>
              {appointment.patientName} · {appointment.serviceName}
            </p>
          </div>
          <button
            aria-label="Đóng"
            className="treatment-record__close"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <X />
          </button>
        </header>

        <form className="treatment-record__body" onSubmit={submit}>
          <label className="treatment-record__field">
            <span>
              Chẩn đoán <b aria-hidden="true">*</b>
            </span>
            <textarea
              maxLength={1000}
              onChange={(event) => setDiagnosis(event.target.value)}
              placeholder="Nhập chẩn đoán của bác sĩ..."
              required
              rows={3}
              value={diagnosis}
            />
          </label>
          <label className="treatment-record__field">
            <span>
              Nội dung điều trị <b aria-hidden="true">*</b>
            </span>
            <textarea
              maxLength={2000}
              onChange={(event) => setTreatmentNote(event.target.value)}
              placeholder="Mô tả quá trình và kết quả điều trị..."
              required
              rows={5}
              value={treatmentNote}
            />
          </label>

          {error && (
            <p className="treatment-record__error" role="alert">
              {error.message}
            </p>
          )}
          <footer className="treatment-record__actions">
            <button
              className="treatment-record__button treatment-record__button--cancel"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="treatment-record__button treatment-record__button--submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Đang lưu..." : "Hoàn tất điều trị"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

TreatmentRecordModal.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patientName: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
  }).isRequired,
  error: PropTypes.instanceOf(Error),
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

TreatmentRecordModal.defaultProps = { error: null };

export default TreatmentRecordModal;
