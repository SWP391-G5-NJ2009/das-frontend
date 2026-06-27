import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Edit, Trash2, X } from "lucide-react";
import Button from "../../../components/common/Button/Button";
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

function RoomsPageContent({ canManage }) {
  const { createRoom, deleteRoom, error, isLoading, rooms, updateRoom } =
    useRooms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
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

  const handleDeleteRoom = async (room) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete room "${room.room_name}"?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteRoom(room.room_id);
    } catch (err) {
      window.alert(err.message || "Unable to delete room.");
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
          <Button type="button" variant="primary" onClick={openAddModal}>
            Create new room
          </Button>
        )}
      </div>

      <div className="table-responsive">
        {isLoading ? (
          <div className="loading-container">
            <Spinner />
          </div>
        ) : (
          <table className="catalog-table">
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
                          onClick={() => handleDeleteRoom(room)}
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
