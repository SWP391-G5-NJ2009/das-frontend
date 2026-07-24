import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useQueues } from "../../../hooks/useQueues";
import { scheduleService } from "../../../services/schedule.service";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./ReceptionistQueuePage.css";

const STATUS_OPTIONS = [
  { label: "Đang phục vụ", value: "active" },
  { label: "Đang chờ", value: "WAITING" },
  { label: "Đã phân công", value: "ASSIGNED" },
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
    ? `${queue.appointmentTime}${queue.appointmentTimeEnd ? ` - ${queue.appointmentTimeEnd}` : ""}`
    : "Chưa có giờ";
  return `${formatDate(queue.appointmentDate)} · ${time}`;
}

function ReceptionistQueuePage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "active",
    dentistId: "",
    roomId: "",
  });
  const [dentistMetadata, setDentistMetadata] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
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
            String(queue.dentistId) === String(filters.dentistId)) &&
          (!filters.roomId ||
            String(queue.roomId) === String(filters.roomId)),
      ),
    [fetchedQueues, filters.dentistId, filters.roomId],
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
        items.set(String(queue.dentistId), queue.dentistName);
      }
    });
    dentistMetadata.forEach((dentist) => {
      items.set(
        String(dentist.dentist_id),
        dentist.name || dentist.fullName || `Nha sĩ #${dentist.dentist_id}`,
      );
    });
    return [...items.entries()].map(([id, name]) => ({ id, name }));
  }, [dentistMetadata, fetchedQueues]);

  const rooms = useMemo(() => {
    const items = new Map();
    fetchedQueues.forEach((queue) => {
      if (queue.roomId) items.set(String(queue.roomId), queue.roomName);
    });
    dentistMetadata.forEach((dentist) => {
      if (dentist.room_id) {
        items.set(
          String(dentist.room_id),
          dentist.roomName || `Phòng #${dentist.room_id}`,
        );
      }
    });
    return [...items.entries()].map(([id, name]) => ({ id, name }));
  }, [dentistMetadata, fetchedQueues]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleDentistFilterChange = (dentistId) => {
    const dentist = dentistMetadata.find(
      (item) => String(item.dentist_id) === String(dentistId),
    );

    setFilters((current) => ({
      ...current,
      dentistId,
      roomId: dentistId && dentist?.room_id ? String(dentist.room_id) : "",
    }));
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

        <section className="receptionist-queue__toolbar" aria-label="Bộ lọc hàng đợi">
          <label className="receptionist-queue__search">
            <Search size={18} aria-hidden="true" />
            <span className="receptionist-queue__visually-hidden">Tìm bệnh nhân</span>
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
            onChange={(event) => handleDentistFilterChange(event.target.value)}
          >
            <option value="">Tất cả nha sĩ</option>
            {dentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>{dentist.name}</option>
            ))}
          </select>
          <select
            className="receptionist-queue__filter-select"
            aria-label="Lọc theo phòng"
            value={filters.roomId}
            onChange={(event) => updateFilter("roomId", event.target.value)}
          >
            <option value="">Tất cả phòng</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </section>

        <div className="receptionist-queue__status-tabs" role="group" aria-label="Trạng thái">
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
          <EmptyState message={error.message || "Không thể tải hàng đợi."} />
        )}
        {!isLoading && !error && queues.length === 0 && (
          <EmptyState message="Hàng đợi hiện đang trống. Bạn có thể làm mới lại sau." />
        )}

        {!isLoading && !error && queues.length > 0 && (
          <div className="receptionist-queue__table-wrap" role="region" aria-label="Danh sách hàng đợi">
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
                </tr>
              </thead>
              <tbody>
                {queues.map((queue, index) => (
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
                    <td>{queue.queueType === "WALK_IN" ? "Walk-in" : "Lịch hẹn"}</td>
                    <td>{formatAppointment(queue)}</td>
                    <td>{formatTime(queue.checkInTime)}</td>
                    <td>{queue.dentistName || "Chưa phân công"}</td>
                    <td>{queue.roomName || "Chưa phân phòng"}</td>
                    <td><Badge status={queue.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedQueue && (
          <section className="receptionist-queue__detail" aria-label="Chi tiết hàng đợi">
            <header>
              <div>
                <h2>{selectedQueue.patientName}</h2>
                <p>Queue #{selectedQueue.queueId}</p>
              </div>
              <button type="button" onClick={() => setSelectedQueue(null)} aria-label="Đóng chi tiết">
                <X size={18} />
              </button>
            </header>
            <dl>
              <div><dt>Điện thoại</dt><dd>{selectedQueue.patientPhone || "—"}</dd></div>
              <div><dt>Check-in</dt><dd>{formatTime(selectedQueue.checkInTime)}</dd></div>
              <div><dt>Lịch hẹn</dt><dd>{formatAppointment(selectedQueue)}</dd></div>
              <div><dt>Thời gian chờ</dt><dd>{selectedQueue.waitingMinutes} phút</dd></div>
              <div><dt>Nha sĩ</dt><dd>{selectedQueue.dentistName || "Chưa phân công"}</dd></div>
              <div><dt>Phòng</dt><dd>{selectedQueue.roomName || "Chưa phân phòng"}</dd></div>
              <div><dt>Dịch vụ</dt><dd>{selectedQueue.serviceName || "Walk-in"}</dd></div>
              <div><dt>Trạng thái</dt><dd><Badge status={selectedQueue.status} /></dd></div>
            </dl>
            {selectedQueue.note && <p className="receptionist-queue__detail-note">{selectedQueue.note}</p>}
          </section>
        )}
      </div>
    </ReceptionistPageShell>
  );
}

export default ReceptionistQueuePage;
