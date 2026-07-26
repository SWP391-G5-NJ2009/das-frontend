import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  ClipboardPlus,
  Eye,
  History,
  Play,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import Toast from "../../../components/common/Toast/Toast";
import TreatmentRecordModal from "../../../components/features/treatments/TreatmentRecordModal/TreatmentRecordModal";
import WalkInTreatmentRecordModal from "../../../components/features/treatments/WalkInTreatmentRecordModal/WalkInTreatmentRecordModal";
import { useAuth } from "../../../context/AuthContext";
import { useDentistQueue } from "../../../hooks/useQueues";
import { appointmentService } from "../../../services/appointment.service";
import { queueService } from "../../../services/queue.service";
import { treatmentService } from "../../../services/treatment.service";
import DentistPageShell from "../DentistPageShell";
import "./DentistQueuePage.css";

const STATUS_FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Đang chờ", value: "WAITING" },
  { label: "Đang khám", value: "IN_PROGRESS" },
];

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultFollowUpForm() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    appointmentDate: toIsoDate(tomorrow),
    appointmentTime: "09:00",
    reason: "",
  };
}

function formatDate(value) {
  return value ? value.split("-").reverse().join("/") : "Walk-in";
}

function formatQueueTime(queue) {
  if (!queue.appointmentId) return "Walk-in";
  return `${formatDate(queue.appointmentDate)} ${queue.appointmentTime || ""}${
    queue.appointmentTimeEnd ? ` - ${queue.appointmentTimeEnd}` : ""
  }`;
}

function formatCheckInTime(value) {
  if (!value) return "Chưa cập nhật";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  });
}

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function FollowUpReminderModal({
  error,
  form,
  patient,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!patient) return null;

  return (
    <div className="dentist-queue__modal-overlay" role="presentation">
      <section
        className="dentist-queue__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dentist-queue-follow-up-title"
      >
        <header className="dentist-queue__modal-header">
          <div>
            <h2 id="dentist-queue-follow-up-title">Tạo nhắc lịch tái khám</h2>
            <p>{patient.patientName}</p>
          </div>
          <button
            className="dentist-queue__modal-close"
            type="button"
            onClick={onClose}
            aria-label="Đóng nhắc lịch tái khám"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form className="dentist-queue__follow-up-form" onSubmit={onSubmit}>
          {error && <div className="dentist-queue__form-error">{error}</div>}

          <div className="dentist-queue__form-grid">
            <label>
              <span>Ngày tái khám</span>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                min={toIsoDate(new Date())}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <span>Giờ tái khám</span>
              <input
                type="time"
                name="appointmentTime"
                value={form.appointmentTime}
                onChange={onChange}
                required
              />
            </label>
          </div>

          <label>
            <span>Lý do tái khám</span>
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              rows="4"
              maxLength={500}
              placeholder="Nhập lý do tái khám"
              required
            />
          </label>

          <footer className="dentist-queue__modal-actions">
            <button
              className="dentist-queue__modal-btn dentist-queue__modal-btn--secondary"
              type="button"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="dentist-queue__modal-btn dentist-queue__modal-btn--primary"
              type="submit"
            >
              Xác nhận
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function DentistQueuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { queues, isLoading, error, refetch } = useDentistQueue(
    {},
    { enabled: Boolean(user?.profileId) },
  );
  const [actionId, setActionId] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [followUpError, setFollowUpError] = useState("");
  const [followUpForm, setFollowUpForm] = useState(getDefaultFollowUpForm);
  const [followUpTarget, setFollowUpTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [treatmentError, setTreatmentError] = useState(null);
  const [treatmentTarget, setTreatmentTarget] = useState(null);
  const [isSavingTreatment, setIsSavingTreatment] = useState(false);

  const filteredQueues = useMemo(() => {
    const keyword = normalizeSearchValue(searchTerm);
    return queues.filter((queue) => {
      const statusMatched = statusFilter === "all" || queue.status === statusFilter;
      const searchMatched =
        !keyword ||
        [queue.patientName, queue.patientPhone, queue.serviceName, queue.note].some(
          (value) => normalizeSearchValue(value).includes(keyword),
        );
      return statusMatched && searchMatched;
    });
  }, [queues, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: queues.length,
      waiting: queues.filter((queue) => queue.status === "WAITING").length,
      inProgress: queues.filter((queue) => queue.status === "IN_PROGRESS").length,
    }),
    [queues],
  );

  useEffect(() => {
    setFollowUpForm(getDefaultFollowUpForm());
  }, [followUpTarget]);

  const dismissToast = () => setToast(null);

  const handleStartTreatment = async (queue) => {
    setActionId(queue.queueId);
    try {
      if (queue.appointmentId) {
        await appointmentService.startTreatment(queue.appointmentId);
      } else {
        await queueService.updateStatus(queue.queueId, "IN_PROGRESS");
      }
      await refetch();
      setToast({
        type: "success",
        message: "Đã bắt đầu khám cho bệnh nhân.",
      });
    } catch (requestError) {
      setToast({
        type: "error",
        message: requestError.message || "Không thể bắt đầu khám.",
      });
    } finally {
      setActionId(null);
    }
  };

  const handleRecordTreatment = (queue) => {
    const isWalkIn = queue.queueType === "WALK_IN";
    if (isWalkIn && queue.status !== "IN_PROGRESS") {
      setToast({
        type: "warning",
        message: "Vui lòng bắt đầu khám trước khi ghi kết quả.",
      });
      return;
    }

    if (!isWalkIn && queue.appointmentStatus !== "In-Treatment") {
      setToast({
        type: "warning",
        message: "Vui lòng bắt đầu điều trị trước khi ghi kết quả.",
      });
      return;
    }

    setTreatmentError(null);
    setTreatmentTarget({
      id: queue.appointmentId || `walk-in-${queue.queueId}`,
      queueId: isWalkIn ? queue.queueId : null,
      patientName: queue.patientName,
      serviceName: queue.serviceName || "Dịch vụ nha khoa",
      treatmentDate: queue.checkInTime?.slice(0, 10),
      dentistName: queue.dentistName,
    });
  };

  const handleSaveTreatment = async (values) => {
    if (!treatmentTarget) return;
    setIsSavingTreatment(true);
    setTreatmentError(null);
    try {
      if (treatmentTarget.queueId) {
        await queueService.recordTreatment(treatmentTarget.queueId, values);
      } else {
        await treatmentService.create({
          appointmentId: treatmentTarget.id,
          ...values,
        });
      }
      setTreatmentTarget(null);
      await refetch();
      setToast({
        type: "success",
        message: "Đã lưu kết quả điều trị, tạo hóa đơn và hoàn tất lượt khám.",
      });
    } catch (requestError) {
      setTreatmentError(requestError);
    } finally {
      setIsSavingTreatment(false);
    }
  };

  const openFollowUp = (queue) => {
    setFollowUpTarget(queue);
    setFollowUpError("");
  };

  const handleFollowUpChange = (event) => {
    const { name, value } = event.target;
    setFollowUpForm((current) => ({ ...current, [name]: value }));
  };

  const handleFollowUpSubmit = async (event) => {
    event.preventDefault();
    const reason = followUpForm.reason.trim();
    const followUpDateTime = new Date(
      `${followUpForm.appointmentDate}T${followUpForm.appointmentTime}:00`,
    );

    if (!reason) {
      setFollowUpError("Vui lòng nhập lý do tái khám.");
      return;
    }

    if (
      Number.isNaN(followUpDateTime.getTime()) ||
      followUpDateTime <= new Date()
    ) {
      setFollowUpError("Ngày và giờ tái khám phải ở trong tương lai.");
      return;
    }

    try {
      await queueService.createFollowUp(followUpTarget.queueId, {
        scheduledFor: followUpDateTime.toISOString(),
        reason,
      });
      setToast({
        type: "success",
        message: `Đã tạo thông báo tái khám ngày ${formatDate(
          followUpForm.appointmentDate,
        )} lúc ${followUpForm.appointmentTime}.`,
      });
      setFollowUpTarget(null);
      setFollowUpError("");
    } catch (requestError) {
      setFollowUpError(
        requestError.message || "Không thể tạo thông báo tái khám.",
      );
    }
  };

  return (
    <DentistPageShell>
      <section className="dentist-queue" aria-labelledby="dentist-queue-title">
        <header className="dentist-queue__header">
          <div>
            <p className="dentist-queue__eyebrow">Hàng đợi</p>
            <h1 id="dentist-queue-title">Hàng đợi của tôi</h1>
            <p>Danh sách bệnh nhân đã nhận bệnh và walk-in được phân công cho bạn.</p>
          </div>
          <button
            className="dentist-queue__button dentist-queue__button--secondary"
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Làm mới
          </button>
        </header>

        <section className="dentist-queue__summary" aria-label="Queue summary">
          <div>
            <span>{stats.total}</span>
            <p>Tổng lượt của tôi</p>
          </div>
          <div>
            <span>{stats.waiting}</span>
            <p>Đang chờ</p>
          </div>
          <div>
            <span>{stats.inProgress}</span>
            <p>Đang khám</p>
          </div>
        </section>

        <section className="dentist-queue__toolbar" aria-label="Queue filters">
          <label className="dentist-queue__search">
            <Search aria-hidden="true" size={18} />
            <span className="dentist-queue__visually-hidden">Tìm trong hàng đợi</span>
            <input
              autoComplete="off"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm bệnh nhân, số điện thoại, dịch vụ..."
              type="search"
              value={searchTerm}
            />
          </label>
          <div className="dentist-queue__status-tabs" role="group" aria-label="Status filter">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.value}
                className={
                  statusFilter === item.value
                    ? "dentist-queue__status-tab dentist-queue__status-tab--active"
                    : "dentist-queue__status-tab"
                }
                type="button"
                onClick={() => setStatusFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {isLoading && <Spinner />}
        {!isLoading && error && (
          <EmptyState message={error.message || "Không thể tải hàng đợi."} />
        )}
        {!isLoading && !error && filteredQueues.length === 0 && (
          <EmptyState message="Chưa có bệnh nhân nào trong hàng đợi của bạn." />
        )}

        {!isLoading && !error && filteredQueues.length > 0 && (
          <div className="dentist-queue__list">
            {filteredQueues.map((queue, index) => {
              const canStart = queue.status === "WAITING";
              const canRecord =
                (queue.queueType === "WALK_IN" && queue.status === "IN_PROGRESS") ||
                (Boolean(queue.appointmentId) &&
                  queue.appointmentStatus === "In-Treatment");
              return (
                <article className="dentist-queue__item" key={queue.queueId}>
                  <div className="dentist-queue__order">
                    <span>{index + 1}</span>
                    <small>{formatCheckInTime(queue.checkInTime)}</small>
                  </div>

                  <div className="dentist-queue__patient">
                    <strong>{queue.patientName}</strong>
                    <span>{queue.patientPhone || "Không có số điện thoại"}</span>
                    {queue.note && <em title={queue.note}>{queue.note}</em>}
                  </div>

                  <div className="dentist-queue__meta">
                    <span>{queue.serviceName || "Walk-in"}</span>
                    <small>{formatQueueTime(queue)}</small>
                    <small>
                      {queue.roomName || "Chưa phân phòng"} · Chờ {queue.waitingMinutes} phút
                    </small>
                  </div>

                  <div className="dentist-queue__status">
                    <Badge status={queue.status} />
                    {queue.appointmentStatus && (
                      <small>Appointment: {queue.appointmentStatus}</small>
                    )}
                  </div>

                  <div className="dentist-queue__actions">
                    <button
                      className="dentist-queue__icon-action"
                      type="button"
                      onClick={() => setDetailTarget(queue)}
                      title="Chi tiết lượt khám"
                      aria-label={`Xem chi tiết lượt khám của ${queue.patientName}`}
                    >
                      <Eye size={15} aria-hidden="true" />
                    </button>
                    <button
                      className="dentist-queue__icon-action"
                      type="button"
                      onClick={() =>
                        navigate(`/dentist/patients/${queue.patientId}/treatment-history`, {
                          state: { patient: queue },
                        })
                      }
                      disabled={!queue.patientId}
                      title="Lịch sử điều trị"
                      aria-label={`Xem lịch sử điều trị của ${queue.patientName}`}
                    >
                      <History size={15} aria-hidden="true" />
                    </button>
                    {canStart && (
                      <button
                        className="dentist-queue__button dentist-queue__button--primary"
                        type="button"
                        onClick={() => handleStartTreatment(queue)}
                        disabled={actionId === queue.queueId}
                      >
                        <Play size={15} aria-hidden="true" />
                        {actionId === queue.queueId ? "Đang bắt đầu..." : "Bắt đầu khám"}
                      </button>
                    )}
                    <button
                      className="dentist-queue__button dentist-queue__button--secondary"
                      type="button"
                      onClick={() => handleRecordTreatment(queue)}
                      disabled={!canRecord}
                      title={
                        canRecord
                          ? "Ghi kết quả điều trị"
                          : queue.appointmentId
                            ? "Record treatment requires an In-Treatment appointment"
                            : "Walk-in does not have an appointment treatment record"
                      }
                    >
                      <ClipboardPlus size={15} aria-hidden="true" />
                      Ghi kết quả
                    </button>
                    <button
                      className="dentist-queue__icon-action dentist-queue__icon-action--follow-up"
                      type="button"
                      onClick={() => openFollowUp(queue)}
                      title="Tạo nhắc lịch tái khám"
                      aria-label={`Tạo nhắc lịch tái khám cho ${queue.patientName}`}
                    >
                      <CalendarPlus size={15} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <FollowUpReminderModal
          error={followUpError}
          form={followUpForm}
          patient={followUpTarget}
          onChange={handleFollowUpChange}
          onClose={() => setFollowUpTarget(null)}
          onSubmit={handleFollowUpSubmit}
        />

        {detailTarget && (
          <div
            className="dentist-queue__modal-overlay"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setDetailTarget(null);
            }}
          >
            <section
              className="dentist-queue__modal dentist-queue__detail"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dentist-queue-detail-title"
            >
              <header>
                <div>
                  <h2 id="dentist-queue-detail-title">{detailTarget.patientName}</h2>
                  <p>Lượt khám #{detailTarget.queueId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailTarget(null)}
                  aria-label="Đóng chi tiết lượt khám"
                >
                  <X size={18} />
                </button>
              </header>
              <dl>
                <div><dt>Điện thoại</dt><dd>{detailTarget.patientPhone || "—"}</dd></div>
                <div><dt>Giờ nhận bệnh</dt><dd>{formatCheckInTime(detailTarget.checkInTime)}</dd></div>
                <div><dt>Thời gian chờ</dt><dd>{detailTarget.waitingMinutes} phút</dd></div>
                <div><dt>Lịch hẹn</dt><dd>{formatQueueTime(detailTarget)}</dd></div>
                <div><dt>Phòng</dt><dd>{detailTarget.roomName || "Chưa phân phòng"}</dd></div>
                <div><dt>Dịch vụ</dt><dd>{detailTarget.serviceName || "Walk-in"}</dd></div>
                <div><dt>Trạng thái</dt><dd><Badge status={detailTarget.status} /></dd></div>
                <div><dt>Nha sĩ</dt><dd>{detailTarget.dentistName || "Chưa phân công"}</dd></div>
              </dl>
              {detailTarget.note && (
                <p className="dentist-queue__detail-note">{detailTarget.note}</p>
              )}
            </section>
          </div>
        )}

        {treatmentTarget && !treatmentTarget.queueId && (
          <TreatmentRecordModal
            appointment={treatmentTarget}
            error={treatmentError}
            isSubmitting={isSavingTreatment}
            onClose={() => {
              if (!isSavingTreatment) setTreatmentTarget(null);
            }}
            onSubmit={handleSaveTreatment}
          />
        )}

        {treatmentTarget?.queueId && (
          <WalkInTreatmentRecordModal
            queue={treatmentTarget}
            error={treatmentError}
            isSubmitting={isSavingTreatment}
            onClose={() => {
              if (!isSavingTreatment) setTreatmentTarget(null);
            }}
            onSubmit={handleSaveTreatment}
          />
        )}

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={dismissToast}
            duration={5000}
          />
        )}
      </section>
    </DentistPageShell>
  );
}

export default DentistQueuePage;
