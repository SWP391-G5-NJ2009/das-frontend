import PropTypes from "prop-types";
import { AlertCircle, Trash2 } from "lucide-react";
import "./DeleteRoomModal.css";

function formatRoomStatus(status) {
  if (status === "Active") return "Available";
  if (status === "Inactive") return "Unavailable";
  return status || "Available";
}

function DeleteRoomModal({ isDeleting, onClose, onConfirm, room }) {
  return (
    <div className="delete-room-modal__overlay" role="presentation">
      <div
        className="delete-room-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-room-title"
      >
        <div className="delete-room-modal__header">
          <h2 className="delete-room-modal__title" id="delete-room-title">
            Xóa phòng
          </h2>
          <p className="delete-room-modal__subtitle">
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="delete-room-modal__body">
          <section
            className="delete-room-modal__details"
            aria-label="Chi tiết phòng"
          >
            <h3 className="delete-room-modal__details-title">Chi tiết phòng:</h3>
            <div className="delete-room-modal__detail-grid">
              <div className="delete-room-modal__detail-item">
                <span className="delete-room-modal__detail-label">
                  Tên phòng
                </span>
                <strong className="delete-room-modal__room-name">
                  {room.room_name}
                </strong>
              </div>
              <div className="delete-room-modal__detail-item">
                <span className="delete-room-modal__detail-label">
                  Specialization
                </span>
                <span className="delete-room-modal__detail-value">
                  {room.specialization || "Unassigned"}
                </span>
              </div>
              <div className="delete-room-modal__detail-item">
                <span className="delete-room-modal__detail-label">Status</span>
                <span className="delete-room-modal__status">
                  <span className="delete-room-modal__status-dot" />
                  {formatRoomStatus(room.status)}
                </span>
              </div>
            </div>
          </section>

          <div className="delete-room-modal__warning" role="alert">
            <AlertCircle size={20} aria-hidden="true" />
            <span>
              Cảnh báo: Bạn cần chuyển toàn bộ lịch hẹn của phòng này trước
            </span>
          </div>
        </div>

        <div className="delete-room-modal__actions">
          <button
            className="delete-room-modal__cancel-btn"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Hủy
          </button>
          <button
            className="delete-room-modal__delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} aria-hidden="true" />
            {isDeleting ? "Đang xóa" : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteRoomModal.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  room: PropTypes.shape({
    room_id: PropTypes.number.isRequired,
    room_name: PropTypes.string.isRequired,
    specialization: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default DeleteRoomModal;
