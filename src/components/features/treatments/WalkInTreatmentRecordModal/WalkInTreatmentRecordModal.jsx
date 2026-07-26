import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import "../TreatmentRecordModal/TreatmentRecordModal.css";

function WalkInTreatmentRecordModal({
  queue,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [clinicalExamination, setClinicalExamination] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentNote, setTreatmentNote] = useState("");
  const [postTreatmentInstructions, setPostTreatmentInstructions] =
    useState("");

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSubmitting, onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      clinicalExamination,
      diagnosis,
      treatmentNote,
      postTreatmentInstructions,
    });
  };

  return (
    <div
      className="treatment-record__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="walk-in-treatment-record-title"
        aria-modal="true"
        className="treatment-record"
        role="dialog"
      >
        <header className="treatment-record__header">
          <div>
            <h2 id="walk-in-treatment-record-title">Ghi kết quả điều trị</h2>
            <p>{queue.patientName} · {queue.serviceName}</p>
          </div>
          <button
            aria-label="Đóng"
            className="treatment-record__close"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="treatment-record__workspace">
          <aside className="treatment-record__sidebar">
            <div className="treatment-record__accordion-trigger">
              <span>
                <strong>{queue.serviceName}</strong>
                <small>Lượt khám walk-in</small>
              </span>
            </div>
          </aside>

          <form className="treatment-record__body" onSubmit={handleSubmit}>
            <label className="treatment-record__field">
              <span>Khám lâm sàng</span>
              <textarea
                disabled={isSubmitting}
                maxLength={2000}
                onChange={(event) => setClinicalExamination(event.target.value)}
                placeholder="Nhập kết quả khám lâm sàng..."
                rows={3}
                value={clinicalExamination}
              />
            </label>
            <label className="treatment-record__field">
              <span>Chẩn đoán <b aria-hidden="true">*</b></span>
              <textarea
                disabled={isSubmitting}
                maxLength={1000}
                onChange={(event) => setDiagnosis(event.target.value)}
                placeholder="Nhập chẩn đoán của nha sĩ..."
                required
                rows={3}
                value={diagnosis}
              />
            </label>
            <label className="treatment-record__field">
              <span>Nội dung điều trị <b aria-hidden="true">*</b></span>
              <textarea
                disabled={isSubmitting}
                maxLength={2000}
                onChange={(event) => setTreatmentNote(event.target.value)}
                placeholder="Mô tả quá trình và kết quả điều trị..."
                required
                rows={5}
                value={treatmentNote}
              />
            </label>
            <label className="treatment-record__field">
              <span>Hướng dẫn sau điều trị</span>
              <textarea
                disabled={isSubmitting}
                maxLength={2000}
                onChange={(event) =>
                  setPostTreatmentInstructions(event.target.value)
                }
                placeholder="Nhập hướng dẫn chăm sóc sau điều trị..."
                rows={3}
                value={postTreatmentInstructions}
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
                {isSubmitting ? "Đang lưu..." : "Hoàn tất lượt khám"}
              </button>
            </footer>
          </form>
        </div>
      </section>
    </div>
  );
}

WalkInTreatmentRecordModal.propTypes = {
  queue: PropTypes.shape({
    patientName: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
  }).isRequired,
  error: PropTypes.instanceOf(Error),
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

WalkInTreatmentRecordModal.defaultProps = { error: null };

export default WalkInTreatmentRecordModal;
