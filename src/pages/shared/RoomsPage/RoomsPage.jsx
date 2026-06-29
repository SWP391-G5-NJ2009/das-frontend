import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AlertCircle, Edit, Trash2, X } from "lucide-react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useAuth } from "../../../context/AuthContext";
import { useRooms } from "../../../hooks/useRooms";
import OwnerPageShell from "../../owner/OwnerPageShell";
import ReceptionistPageShell from "../../receptionist/ReceptionistPageShell";
import "../../owner/ServiceCatalogPage/ServiceCatalogPage.css";
import "./RoomsPage.css";

const EMPTY_FORM = {
  room_name: "",
  specialization: "",
  status: "Available",
};

function formatRoomStatus(status) {
  if (status === "Active") return "Available";
  if (status === "Inactive") return "Unavailable";
  return status || "Available";
}

function getStatusBadgeClass(status) {
  const normalizedStatus = formatRoomStatus(status).toLowerCase();

  if (normalizedStatus === "available") {
    return "badge badge--completed status-badge";
  }

  if (normalizedStatus === "maintenance") {
    return "badge badge--pending status-badge";
  }

  return "badge badge--neutral status-badge";
}

function RoomFormModal({ formData, isEditMode, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-form-title"
      >
        <div className="modal-header">
          <h2 id="room-form-title">
            {isEditMode ? "Update Room" : "Create New Room"}
          </h2>
          <button
            className="close-modal-btn"
            type="button"
            onClick={onClose}
            aria-label="Close room form"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="room-name">Room Name</label>
            <input
              id="room-name"
              name="room_name"
              type="text"
              value={formData.room_name}
              onChange={onChange}
              required
              placeholder="101"
            />
          </div>

          <div className="form-group">
            <label htmlFor="room-specialization">Specialization</label>
            <input
              id="room-specialization"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={onChange}
              placeholder="General examination"
            />
          </div>

          <div className="form-group">
            <label htmlFor="room-status">Status</label>
            <select
              id="room-status"
              name="status"
              value={formData.status}
              onChange={onChange}
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              {isEditMode ? "Save Changes" : "Save Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

RoomFormModal.propTypes = {
  formData: PropTypes.shape({
    room_name: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function DeleteRoomModal({ isDeleting, onClose, onConfirm, room }) {
  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="rooms-delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-room-title"
      >
        <div className="rooms-delete-modal__header">
          <h2 className="rooms-delete-modal__title" id="delete-room-title">
            Delete room
          </h2>
          <p className="rooms-delete-modal__subtitle">
            This action can not be undo.
          </p>
        </div>

        <div className="rooms-delete-modal__body">
          <section
            className="rooms-delete-modal__details"
            aria-label="Room details"
          >
            <h3 className="rooms-delete-modal__details-title">
              Room details:
            </h3>
            <div className="rooms-delete-modal__detail-grid">
              <div className="rooms-delete-modal__detail-item">
                <span className="rooms-delete-modal__detail-label">
                  Room name
                </span>
                <strong className="rooms-delete-modal__room-name">
                  {room.room_name}
                </strong>
              </div>
              <div className="rooms-delete-modal__detail-item">
                <span className="rooms-delete-modal__detail-label">
                  Specialization
                </span>
                <span className="rooms-delete-modal__detail-value">
                  {room.specialization || "Unassigned"}
                </span>
              </div>
              <div className="rooms-delete-modal__detail-item">
                <span className="rooms-delete-modal__detail-label">
                  Status
                </span>
                <span className="rooms-delete-modal__status">
                  <span className="rooms-delete-modal__status-dot" />
                  {formatRoomStatus(room.status)}
                </span>
              </div>
            </div>
          </section>

          <div className="rooms-delete-modal__warning" role="alert">
            <AlertCircle size={24} aria-hidden="true" />
            <span>
              Warning: You have to move all the appointments of this room first
            </span>
          </div>
        </div>

        <div className="rooms-delete-modal__actions">
          <button
            className="rooms-delete-modal__cancel-btn"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="rooms-delete-modal__delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={18} aria-hidden="true" />
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
    room_id: PropTypes.number.isRequired,
    room_name: PropTypes.string.isRequired,
    specialization: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

function RoomsPageContent({ canManage }) {
  const { createRoom, deleteRoom, error, isLoading, rooms, updateRoom } =
    useRooms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [roomPendingDelete, setRoomPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const sortedRooms = useMemo(
    () =>
      [...rooms].sort((firstRoom, secondRoom) =>
        String(firstRoom.room_name || "").localeCompare(
          String(secondRoom.room_name || ""),
          undefined,
          { numeric: true },
        ),
      ),
    [rooms],
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentRoomId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setIsEditMode(true);
    setCurrentRoomId(room.room_id);
    setFormData({
      room_name: room.room_name || "",
      specialization: room.specialization || "",
      status: formatRoomStatus(room.status),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentRoomId(null);
    setFormData(EMPTY_FORM);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEditMode) {
        await updateRoom(currentRoomId, formData);
      } else {
        await createRoom(formData);
      }

      closeModal();
    } catch (err) {
      window.alert(err.message || "Unable to save room.");
    }
  };

  const openDeleteModal = (room) => {
    setRoomPendingDelete(room);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setRoomPendingDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roomPendingDelete) return;

    setIsDeleting(true);
    try {
      await deleteRoom(roomPendingDelete.room_id);
      setRoomPendingDelete(null);
    } catch (err) {
      window.alert(err.message || "Unable to delete room.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div>
          <h1 id="rooms-page-title">Rooms</h1>
          <p className="subtitle">
            {canManage
              ? "Manage treatment rooms and their availability."
              : "View current treatment room availability."}
          </p>
        </div>
        {canManage && (
          <button className="btn-add-service" type="button" onClick={openAddModal}>
            Create new room
          </button>
        )}
      </div>

      <div className="table-responsive">
        {isLoading ? (
          <div className="loading-container">
            <Spinner />
          </div>
        ) : (
          <table
            className={`catalog-table rooms-table${canManage ? "" : " rooms-table--readonly"}`}
          >
            <thead>
              <tr>
                <th>Room</th>
                <th>Specialization</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td className="empty-row" colSpan={canManage ? 4 : 3}>
                    {error.message || "Unable to load rooms."}
                  </td>
                </tr>
              )}
              {!error &&
                sortedRooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>
                      <span className="price-cell">{room.room_name}</span>
                    </td>
                    <td>{room.specialization || "Unassigned"}</td>
                    <td>
                      <span className={getStatusBadgeClass(room.status)}>
                        {formatRoomStatus(room.status)}
                      </span>
                    </td>
                    {canManage && (
                      <td className="actions-cell">
                        <button
                          className="action-btn edit-btn"
                          type="button"
                          title="Edit room"
                          aria-label={`Edit room ${room.room_name}`}
                          onClick={() => openEditModal(room)}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          type="button"
                          title="Delete room"
                          aria-label={`Delete room ${room.room_name}`}
                          onClick={() => openDeleteModal(room)}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              {!error && sortedRooms.length === 0 && (
                <tr>
                  <td className="empty-row" colSpan={canManage ? 4 : 3}>
                    No rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {canManage && isModalOpen && (
        <RoomFormModal
          formData={formData}
          isEditMode={isEditMode}
          onChange={handleInputChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
      {canManage && roomPendingDelete && (
        <DeleteRoomModal
          isDeleting={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          room={roomPendingDelete}
        />
      )}
    </div>
  );
}

RoomsPageContent.propTypes = {
  canManage: PropTypes.bool.isRequired,
};

function RoomsPage() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const content = <RoomsPageContent canManage={canManage} />;

  if (canManage) {
    return (
      <OwnerPageShell contentClassName="owner-catalog-page">
        {content}
      </OwnerPageShell>
    );
  }

  return (
    <ReceptionistPageShell
      contentClassName="owner-catalog-page"
      contentLabelledBy="rooms-page-title"
    >
      {content}
    </ReceptionistPageShell>
  );
}

RoomsPage.propTypes = {};

export default RoomsPage;
