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
            Delete room
          </h2>
          <p className="delete-room-modal__subtitle">
            This action cannot be undone.
          </p>
        </div>

        <div className="delete-room-modal__body">
          <section
            className="delete-room-modal__details"
            aria-label="Room details"
          >
            <h3 className="delete-room-modal__details-title">Room details:</h3>
            <div className="delete-room-modal__detail-grid">
              <div className="delete-room-modal__detail-item">
                <span className="delete-room-modal__detail-label">
                  Room name
                </span>
                <strong className="delete-room-modal__room-name">
                  {room.room_name}
                </strong>
              </div>
              <div className="delete-room-modal__detail-item">
                <span className="delete-room-modal__detail-label">
                  Dentist
                </span>
                <span className="delete-room-modal__detail-value">
                  {room.dentist?.full_name || "Unassigned"}
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
            <span>Make sure this room is no longer needed before deleting it.</span>
          </div>
        </div>

        <div className="delete-room-modal__actions">
          <button
            className="delete-room-modal__cancel-btn"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="delete-room-modal__delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} aria-hidden="true" />
            {isDeleting ? "Deleting" : "Delete"}
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
    dentist: PropTypes.shape({
      full_name: PropTypes.string,
    }),
    room_id: PropTypes.number.isRequired,
    room_name: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
};

export default DeleteRoomModal;
