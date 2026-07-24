import { useMemo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Spinner from "../../../components/common/Spinner/Spinner";
import DeleteRoomModal from "../../../components/features/room/DeleteRoomModal/DeleteRoomModal";
import RoomFormModal from "../../../components/features/room/RoomFormModal/RoomFormModal";
import { useRooms } from "../../../hooks/useRooms";
import { useStaff } from "../../../hooks/useStaff";
import ManagerPageShell from "../ManagerPageShell";
import "../ServiceCatalogPage/ServiceCatalogPage.css";
import "./RoomsPage.css";

const EMPTY_FORM = {
  room_name: "",
  dentist_id: "",
  status: "Available",
};

function formatRoomStatus(status) {
  if (status === "Active") return "Available";
  if (status === "Inactive") return "Unavailable";
  if (status === "Maintenance") return "Unavailable";
  if (status === "Occupied") return "Occupied";
  if (status === "Unavailable") return "Unavailable";
  return "Available";
}

function getStatusBadgeClass(status) {
  const normalizedStatus = formatRoomStatus(status).toLowerCase();

  if (normalizedStatus === "available") {
    return "badge badge--completed status-badge";
  }

  if (normalizedStatus === "occupied") {
    return "badge badge--failed status-badge";
  }

  return "badge badge--neutral status-badge";
}

function RoomsPageContent() {
  const { createRoom, deleteRoom, error, isLoading, rooms, updateRoom } =
    useRooms();
  const {
    staff: dentists,
    isLoading: areDentistsLoading,
    error: dentistError,
  } = useStaff({ role: "dentist", status: "Active" });
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

  const dentistOptions = useMemo(
    () =>
      [...dentists]
        .filter(
          (dentist) =>
            dentist.profileId &&
            String(dentist.status || "").toLowerCase() === "active",
        )
        .sort((firstDentist, secondDentist) =>
          String(firstDentist.fullName || "").localeCompare(
            String(secondDentist.fullName || ""),
          ),
        ),
    [dentists],
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
      dentist_id: room.dentist_id ? String(room.dentist_id) : "",
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

    const payload = {
      ...formData,
      dentist_id: formData.dentist_id ? Number(formData.dentist_id) : null,
    };

    try {
      if (isEditMode) {
        await updateRoom(currentRoomId, payload);
      } else {
        await createRoom(payload);
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

  const loadError = error || dentistError;

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div>
          <h1 id="rooms-page-title">Danh sách phòng</h1>
        </div>
        <button
          className="btn-add-service"
          type="button"
          onClick={openAddModal}
        >
          Thêm phòng mới
        </button>
      </div>

      <div className="table-responsive">
        {isLoading || areDentistsLoading ? (
          <div className="loading-container">
            <Spinner />
          </div>
        ) : (
          <table className="catalog-table rooms-table">
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Bác sĩ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loadError && (
                <tr>
                  <td className="empty-row" colSpan={4}>
                    {loadError.message || "Unable to load rooms."}
                  </td>
                </tr>
              )}
              {!loadError &&
                sortedRooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>
                      <span className="price-cell">{room.room_name}</span>
                    </td>
                    <td>{room.dentist?.full_name || "Unassigned"}</td>
                    <td>
                      <span className={getStatusBadgeClass(room.status)}>
                        {formatRoomStatus(room.status)}
                      </span>
                    </td>
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
                  </tr>
                ))}
              {!loadError && sortedRooms.length === 0 && (
                <tr>
                  <td className="empty-row" colSpan={4}>
                    Không tìm thấy phòng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <RoomFormModal
          dentistOptions={dentistOptions}
          formData={formData}
          isEditMode={isEditMode}
          onChange={handleInputChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
      {roomPendingDelete && (
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

RoomsPageContent.propTypes = {};

function RoomsPage() {
  return (
    <ManagerPageShell contentClassName="manager-catalog-page">
      <RoomsPageContent />
    </ManagerPageShell>
  );
}

RoomsPage.propTypes = {};

export default RoomsPage;
