import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, UserPlus, X, XCircle } from "lucide-react";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import Toast from "../../../components/common/Toast/Toast";
import PatientSearchSection from "../../../components/features/booking/PatientSearchSection/PatientSearchSection";
import AddPatientModal from "../../../components/features/patient/AddPatientModal/AddPatientModal";
import { usePatientSearch } from "../../../hooks/usePatientSearch";
import { useQueues } from "../../../hooks/useQueues";
import { queueService } from "../../../services/queue.service";
import { scheduleService } from "../../../services/schedule.service";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./ReceptionistQueuePage.css";

const STATUS_OPTIONS = [
  { label: "Hiện tại", value: "active" },
  { label: "Đang chờ", value: "WAITING" },
  { label: "Đang khám", value: "IN_PROGRESS" },
  { label: "Tất cả", value: "all" },
];

function formatDate(value) {
  return value ? value.split("-").reverse().join("/") : "Walk-in";
}

function formatTime(value) {
  if (!value) return "Chưa cập nhật";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  });
}

function formatAppointment(queue) {
  if (!queue.appointmentId) return "Walk-in";
  const time = queue.appointmentTime
    ? `${queue.appointmentTime}${
        queue.appointmentTimeEnd ? ` - ${queue.appointmentTimeEnd}` : ""
      }`
    : "Chưa có giờ";
  return `${formatDate(queue.appointmentDate)} · ${time}`;
}

function ReceptionistQueuePage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "active",
    dentistId: "",
  });
  const [dentistMetadata, setDentistMetadata] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [walkInDentistId, setWalkInDentistId] = useState("");
  const [walkInNote, setWalkInNote] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);
  const {
    searchQuery,
    searchResults,
    isSearching,
    selectedPatient,
    handleSearchChange,
    handleSelectPatient,
    handleClearPatient,
  } = usePatientSearch();
  const {
    queues: fetchedQueues,
    isLoading,
    error,
    refetch,
  } = useQueues({
    search: filters.search,
    status: filters.status,
  });

  const queues = useMemo(
    () =>
      fetchedQueues.filter(
        (queue) =>
          (!filters.dentistId ||
            String(queue.dentistId) === String(filters.dentistId)),
      ),
    [fetchedQueues, filters.dentistId],
  );

  useEffect(() => {
    let isMounted = true;
    scheduleService
      .getDentists()
      .then((data) => {
        if (isMounted) setDentistMetadata(data || []);
      })
      .catch(() => {
        if (isMounted) setDentistMetadata([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const dentists = useMemo(() => {
    const items = new Map();
    fetchedQueues.forEach((queue) => {
      if (queue.dentistId) {
        items.set(String(queue.dentistId), {
          id: String(queue.dentistId),
          name: queue.dentistName,
          roomId: queue.roomId ? String(queue.roomId) : "",
          roomName: queue.roomName || "",
        });
      }
    });
    dentistMetadata.forEach((dentist) => {
      items.set(
        String(dentist.dentist_id),
        {
          id: String(dentist.dentist_id),
          name:
            dentist.name ||
            dentist.fullName ||
            `Nha sĩ #${dentist.dentist_id}`,
          roomId: dentist.room_id ? String(dentist.room_id) : "",
          roomName: dentist.roomName || "",
        },
      );
    });
    return [...items.values()];
  }, [dentistMetadata, fetchedQueues]);

  const selectedWalkInDentist = dentists.find(
    (dentist) => dentist.id === walkInDentistId,
  );

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleCreatedPatient = (patient) => {
    handleSelectPatient(patient);
    setToast({
      type: "success",
      message: "Đã tạo hồ sơ bệnh nhân. Bấm “Thêm vào hàng đợi” để check-in.",
    });
  };

  const handleAddWalkIn = async (event) => {
    event.preventDefault();
    if (!selectedPatient) {
      setToast({
        type: "warning",
        message: "Vui lòng tìm hoặc tạo hồ sơ bệnh nhân trước.",
      });
      return;
    }
    if (!walkInDentistId) {
      setToast({
        type: "warning",
        message: "Vui lòng chọn nha sĩ.",
      });
      return;
    }
    if (!selectedWalkInDentist?.roomId) {
      setToast({
        type: "warning",
        message: "Nha sĩ đã chọn chưa được gắn phòng khám.",
      });
      return;
    }

    setIsAddingWalkIn(true);
    try {
      await queueService.createWalkIn({
        patientId: Number(selectedPatient.id),
        dentistId: Number(walkInDentistId),
        note: walkInNote.trim() || null,
      });
      handleClearPatient();
      setWalkInDentistId("");
      setWalkInNote("");
      await refetch();
      setToast({
        type: "success",
        message: "Đã check-in bệnh nhân walk-in vào hàng đợi.",
      });
    } catch (requestError) {
      setToast({
        type: "error",
        message:
          requestError.message ||
          "Không thể thêm bệnh nhân walk-in vào hàng đợi.",
      });
    } finally {
      setIsAddingWalkIn(false);
    }
  };

  const handleCancelWalkIn = async (queue) => {
    if (
      !window.confirm(
        `Hủy lượt walk-in của ${queue.patientName}? Thao tác này không thể hoàn tác trên màn hình Queue.`,
      )
    ) {
      return;
    }
    setActionId(queue.queueId);
    try {
      await queueService.updateStatus(queue.queueId, "CANCELLED");
      if (selectedQueue?.queueId === queue.queueId) setSelectedQueue(null);
      await refetch();
      setToast({ type: "success", message: "Đã hủy lượt walk-in." });
    } catch (requestError) {
      setToast({
        type: "error",
        message: requestError.message || "Không thể hủy lượt walk-in.",
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <ReceptionistPageShell
      contentClassName="receptionist-queue-page"
      contentLabelledBy="receptionist-queue-title"
    >
      <div className="receptionist-queue">
        <header className="receptionist-queue__header">
          <div>
            <p className="receptionist-queue__eyebrow">Patient Queue</p>
            <h1 id="receptionist-queue-title">Hàng đợi bệnh nhân</h1>
            <p>Theo dõi bệnh nhân đã check-in và walk-in theo thứ tự đến.</p>
          </div>
          <button
            className="receptionist-queue__button receptionist-queue__button--secondary"
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Làm mới
          </button>
        </header>

        <section
          className="receptionist-queue__walk-in"
          aria-labelledby="walk-in-title"
        >
          <header className="receptionist-queue__walk-in-header">
            <div>
              <h2 id="walk-in-title">Thêm bệnh nhân walk-in</h2>
              <p>
                Dùng lại hồ sơ có sẵn hoặc tạo hồ sơ mới không cần tài khoản,
                không cần lịch hẹn.
              </p>
            </div>
            <UserPlus size={22} aria-hidden="true" />
          </header>

          <form onSubmit={handleAddWalkIn}>
            <PatientSearchSection
              isReceptionist
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchResults={searchResults}
              selectedPatient={selectedPatient}
              onSelectPatient={handleSelectPatient}
              onClearPatient={handleClearPatient}
              onAddNewPatient={() => setIsAddPatientOpen(true)}
              isSearching={isSearching}
              phoneNumber={selectedPatient?.phone || ""}
            />

            <div className="receptionist-queue__walk-in-controls">
              <label>
                <span>Nha sĩ</span>
                <select
                  value={walkInDentistId}
                  onChange={(event) => setWalkInDentistId(event.target.value)}
                  required
                >
                  <option value="">Chọn nha sĩ</option>
                  {dentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Phòng của nha sĩ</span>
                <input
                  type="text"
                  value={
                    selectedWalkInDentist?.roomName ||
                    (walkInDentistId
                      ? "Nha sĩ chưa có phòng"
                      : "Tự động theo nha sĩ")
                  }
                  readOnly
                />
              </label>
              <label>
                <span>Ghi chú</span>
                <input
                  type="text"
                  value={walkInNote}
                  onChange={(event) => setWalkInNote(event.target.value)}
                  maxLength={1000}
                  placeholder="Lý do đến khám..."
                />
              </label>
              <button
                className="receptionist-queue__button receptionist-queue__button--primary"
                type="submit"
                disabled={isAddingWalkIn}
              >
                <UserPlus size={16} aria-hidden="true" />
                {isAddingWalkIn ? "Đang thêm..." : "Thêm vào hàng đợi"}
              </button>
            </div>
          </form>
        </section>

        <section
          className="receptionist-queue__toolbar"
          aria-label="Bộ lọc hàng đợi"
        >
          <label className="receptionist-queue__search">
            <Search size={18} aria-hidden="true" />
            <span className="receptionist-queue__visually-hidden">
              Tìm bệnh nhân
            </span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Tìm theo tên hoặc số điện thoại..."
            />
          </label>
          <select
            className="receptionist-queue__filter-select"
            aria-label="Lọc theo nha sĩ"
            value={filters.dentistId}
            onChange={(event) =>
              updateFilter("dentistId", event.target.value)
            }
          >
            <option value="">Tất cả nha sĩ</option>
            {dentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.name}
              </option>
            ))}
          </select>
        </section>

        <div
          className="receptionist-queue__status-tabs"
          role="group"
          aria-label="Trạng thái"
        >
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={
                filters.status === option.value
                  ? "receptionist-queue__status-tab receptionist-queue__status-tab--active"
                  : "receptionist-queue__status-tab"
              }
              type="button"
              onClick={() => updateFilter("status", option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isLoading && <Spinner />}
        {!isLoading && error && (
          <EmptyState
            message={error.message || "Không thể tải hàng đợi."}
          />
        )}
        {!isLoading && !error && queues.length === 0 && (
          <EmptyState message="Hàng đợi hiện đang trống. Bạn có thể làm mới lại sau." />
        )}

        {!isLoading && !error && queues.length > 0 && (
          <div
            className="receptionist-queue__table-wrap"
            role="region"
            aria-label="Danh sách hàng đợi"
          >
            <table className="receptionist-queue__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bệnh nhân</th>
                  <th>Loại</th>
                  <th>Giờ hẹn</th>
                  <th>Check-in</th>
                  <th>Nha sĩ</th>
                  <th>Phòng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {queues.map((queue, index) => {
                  const canCancel =
                    queue.queueType === "WALK_IN" &&
                    queue.status === "WAITING";
                  return (
                    <tr
                      key={queue.queueId}
                      className="receptionist-queue__selectable-row"
                      onClick={() => setSelectedQueue(queue)}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <strong>{queue.patientName}</strong>
                        <span>{queue.patientPhone || "Không có SĐT"}</span>
                      </td>
                      <td>
                        {queue.queueType === "WALK_IN"
                          ? "Walk-in"
                          : "Lịch hẹn"}
                      </td>
                      <td>{formatAppointment(queue)}</td>
                      <td>{formatTime(queue.checkInTime)}</td>
                      <td>{queue.dentistName || "—"}</td>
                      <td>{queue.roomName || "—"}</td>
                      <td>
                        <Badge status={queue.status} />
                      </td>
                      <td>
                        {canCancel && (
                          <button
                            className="receptionist-queue__row-action"
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCancelWalkIn(queue);
                            }}
                            disabled={actionId === queue.queueId}
                            title="Hủy lượt walk-in"
                            aria-label={`Hủy lượt của ${queue.patientName}`}
                          >
                            <XCircle size={15} aria-hidden="true" />
                            Hủy
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedQueue && (
          <section
            className="receptionist-queue__detail"
            aria-label="Chi tiết hàng đợi"
          >
            <header>
              <div>
                <h2>{selectedQueue.patientName}</h2>
                <p>Queue #{selectedQueue.queueId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQueue(null)}
                aria-label="Đóng chi tiết"
              >
                <X size={18} />
              </button>
            </header>
            <dl>
              <div>
                <dt>Điện thoại</dt>
                <dd>{selectedQueue.patientPhone || "—"}</dd>
              </div>
              <div>
                <dt>Check-in</dt>
                <dd>{formatTime(selectedQueue.checkInTime)}</dd>
              </div>
              <div>
                <dt>Lịch hẹn</dt>
                <dd>{formatAppointment(selectedQueue)}</dd>
              </div>
              <div>
                <dt>Thời gian chờ</dt>
                <dd>
                  {selectedQueue.waitingMinutes == null
                    ? "—"
                    : `${selectedQueue.waitingMinutes} phút`}
                </dd>
              </div>
              <div>
                <dt>Nha sĩ</dt>
                <dd>{selectedQueue.dentistName || "Chưa phân công"}</dd>
              </div>
              <div>
                <dt>Phòng</dt>
                <dd>{selectedQueue.roomName || "Chưa phân phòng"}</dd>
              </div>
              <div>
                <dt>Dịch vụ</dt>
                <dd>{selectedQueue.serviceName || "Walk-in"}</dd>
              </div>
              <div>
                <dt>Trạng thái</dt>
                <dd>
                  <Badge status={selectedQueue.status} />
                </dd>
              </div>
            </dl>
            {selectedQueue.note && (
              <p className="receptionist-queue__detail-note">
                {selectedQueue.note}
              </p>
            )}
          </section>
        )}

        <AddPatientModal
          isOpen={isAddPatientOpen}
          onClose={() => setIsAddPatientOpen(false)}
          onSave={handleCreatedPatient}
        />

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            duration={5000}
          />
        )}
      </div>
    </ReceptionistPageShell>
  );
}

export default ReceptionistQueuePage;
