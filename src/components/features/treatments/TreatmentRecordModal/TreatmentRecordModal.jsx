import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import Spinner from "../../../common/Spinner/Spinner";
import { useTreatmentContext } from "../../../../hooks/useTreatmentContext";
import "./TreatmentRecordModal.css";

function formatDate(value) {
  if (!value) return "Chưa cập nhật";
  return value.split("-").reverse().join("/");
}

function getVisitStatus(visit) {
  if (visit.isEditable) return "Đang khám";
  if (visit.status === "Completed") return "Hoàn thành";
  return visit.status || "Chưa cập nhật";
}

function TreatmentRecordModal({
  appointment,
  error,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const {
    context,
    error: contextError,
    isLoading,
    isStartingPlan,
    startPlan,
  } = useTreatmentContext(appointment.id);
  const [clinicalExamination, setClinicalExamination] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    appointment.id,
  );
  const [treatmentNote, setTreatmentNote] = useState("");
  const [postTreatmentInstructions, setPostTreatmentInstructions] =
    useState("");

  const visits = useMemo(() => context?.visits || [], [context]);
  const selectedVisit =
    visits.find(
      (visit) =>
        String(visit.appointmentId) === String(selectedAppointmentId),
    ) || visits.find((visit) => visit.isCurrent);
  const canEdit = Boolean(selectedVisit?.isEditable);
  const canCompletePlan =
    canEdit && Boolean(context?.planId) && context?.planStatus === "Active";

  useEffect(() => {
    const currentVisit = visits.find((visit) => visit.isCurrent);
    if (currentVisit) setSelectedAppointmentId(currentVisit.appointmentId);
  }, [visits]);

  useEffect(() => {
    setClinicalExamination(selectedVisit?.clinicalExamination || "");
    setDiagnosis(selectedVisit?.diagnosis || "");
    setTreatmentNote(selectedVisit?.treatmentNote || "");
    setPostTreatmentInstructions(
      selectedVisit?.postTreatmentInstructions || "",
    );
  }, [selectedVisit]);

  useEffect(() => {
    const closeOnEscape = (event) =>
      event.key === "Escape" && !isSubmitting && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSubmitting, onClose]);

  const submit = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    const completePlan =
      event.nativeEvent.submitter?.value === "complete-plan";
    onSubmit({
      clinicalExamination,
      diagnosis,
      treatmentNote,
      postTreatmentInstructions,
      completePlan,
    });
  };

  const handleStartPlan = async () => {
    if (
      !window.confirm(
        "Bắt đầu lộ trình cho dịch vụ này và đặt lịch hiện tại thành Lần 1?",
      )
    ) {
      return;
    }
    try {
      await startPlan();
    } catch {
      // The hook exposes the request error in the modal state.
    }
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
            <X aria-hidden="true" />
          </button>
        </header>

        {isLoading && (
          <div className="treatment-record__state">
            <Spinner />
            <p>Đang tải các lần điều trị...</p>
          </div>
        )}

        {!isLoading && contextError && (
          <div className="treatment-record__state treatment-record__state--error">
            <p>
              {contextError.message ||
                "Không thể tải các lần điều trị. Vui lòng thử lại."}
            </p>
          </div>
        )}

        {!isLoading && !contextError && context && (
          <div className="treatment-record__workspace">
            <aside
              aria-label="Các lần điều trị"
              className="treatment-record__sidebar"
            >
              <button
                aria-expanded={isExpanded}
                className="treatment-record__accordion-trigger"
                onClick={() => setIsExpanded((expanded) => !expanded)}
                type="button"
              >
                <span>
                  <strong>{context.serviceName}</strong>
                  <small>
                    {visits.length} lần khám
                    {context.planStatus ? ` · ${context.planStatus}` : ""}
                  </small>
                </span>
                {isExpanded ? (
                  <ChevronDown aria-hidden="true" size={18} />
                ) : (
                  <ChevronRight aria-hidden="true" size={18} />
                )}
              </button>

              {!context.planId &&
                context.treatmentMode === "Multi-Visit" && (
                  <button
                    className="treatment-record__start-plan"
                    disabled={isStartingPlan || isSubmitting}
                    onClick={handleStartPlan}
                    type="button"
                  >
                    {isStartingPlan
                      ? "Đang tạo lộ trình..."
                      : "Bắt đầu lộ trình"}
                  </button>
                )}

              {isExpanded && (
                <div className="treatment-record__visit-list">
                  {visits.map((visit) => (
                    <button
                      aria-current={
                        String(visit.appointmentId) ===
                        String(selectedVisit?.appointmentId)
                          ? "true"
                          : undefined
                      }
                      className={`treatment-record__visit ${
                        String(visit.appointmentId) ===
                        String(selectedVisit?.appointmentId)
                          ? "treatment-record__visit--active"
                          : ""
                      }`}
                      key={visit.appointmentId}
                      onClick={() =>
                        setSelectedAppointmentId(visit.appointmentId)
                      }
                      type="button"
                    >
                      <span>
                        <strong>
                          Lần {visit.visitNumber}
                          {visit.isCurrent ? " (Hiện tại)" : ""}
                        </strong>
                        <small>
                          {formatDate(visit.treatmentDate)}
                          {visit.dentistName ? ` · ${visit.dentistName}` : ""}
                        </small>
                      </span>
                      <em
                        className={`treatment-record__status ${
                          visit.isEditable
                            ? "treatment-record__status--active"
                            : ""
                        }`}
                      >
                        {getVisitStatus(visit)}
                      </em>
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <form className="treatment-record__body" onSubmit={submit}>
              <label className="treatment-record__field">
                <span>Khám lâm sàng</span>
                <textarea
                  disabled={!canEdit || isSubmitting}
                  maxLength={2000}
                  onChange={(event) =>
                    setClinicalExamination(event.target.value)
                  }
                  placeholder="Nhập kết quả khám lâm sàng..."
                  readOnly={!canEdit}
                  rows={3}
                  value={clinicalExamination}
                />
              </label>

              <label className="treatment-record__field">
                <span>
                  Chẩn đoán <b aria-hidden="true">*</b>
                </span>
                <textarea
                  disabled={!canEdit || isSubmitting}
                  maxLength={1000}
                  onChange={(event) => setDiagnosis(event.target.value)}
                  placeholder="Nhập chẩn đoán của bác sĩ..."
                  readOnly={!canEdit}
                  required={canEdit}
                  rows={3}
                  value={diagnosis}
                />
              </label>
              <label className="treatment-record__field">
                <span>
                  Nội dung điều trị <b aria-hidden="true">*</b>
                </span>
                <textarea
                  disabled={!canEdit || isSubmitting}
                  maxLength={2000}
                  onChange={(event) => setTreatmentNote(event.target.value)}
                  placeholder="Mô tả quá trình và kết quả điều trị..."
                  readOnly={!canEdit}
                  required={canEdit}
                  rows={5}
                  value={treatmentNote}
                />
              </label>

              <label className="treatment-record__field">
                <span>Hướng dẫn sau điều trị</span>
                <textarea
                  disabled={!canEdit || isSubmitting}
                  maxLength={2000}
                  onChange={(event) =>
                    setPostTreatmentInstructions(event.target.value)
                  }
                  placeholder="Nhập hướng dẫn chăm sóc sau điều trị..."
                  readOnly={!canEdit}
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
                {canEdit && (
                  <>
                    <button
                      className="treatment-record__button treatment-record__button--submit"
                      disabled={isSubmitting}
                      type="submit"
                      value="complete-visit"
                    >
                      {isSubmitting ? "Đang lưu..." : "Hoàn tất lần khám"}
                    </button>
                    {canCompletePlan && (
                      <button
                        className="treatment-record__button treatment-record__button--complete-plan"
                        disabled={isSubmitting}
                        onClick={(event) => {
                          if (
                            !window.confirm(
                              "Bạn có chắc muốn hoàn tất lộ trình này? Các lịch đặt sau sẽ không còn thuộc lộ trình hiện tại.",
                            )
                          ) {
                            event.preventDefault();
                          }
                        }}
                        type="submit"
                        value="complete-plan"
                      >
                        Hoàn tất lộ trình
                      </button>
                    )}
                  </>
                )}
              </footer>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

TreatmentRecordModal.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
