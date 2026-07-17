import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./RoomFormModal.css";

function RoomFormModal({
  dentistOptions,
  formData,
  isEditMode,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="room-form-modal__overlay" role="presentation">
      <div
        className="room-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-form-title"
      >
        <div className="room-form-modal__header">
          <h2 className="room-form-modal__title" id="room-form-title">
            {isEditMode ? "Update room" : "Create room"}
          </h2>
          <button
            className="room-form-modal__close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close room form"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="room-form-modal__field">
            <label className="room-form-modal__label" htmlFor="room-name">
              Room name
            </label>
            <input
              className="room-form-modal__input"
              id="room-name"
              name="room_name"
              type="text"
              value={formData.room_name}
              onChange={onChange}
              required
              placeholder="101"
            />
          </div>

          <div className="room-form-modal__field">
            <label className="room-form-modal__label" htmlFor="room-dentist">
              Dentist
            </label>
            <select
              className="room-form-modal__input"
              id="room-dentist"
              name="dentist_id"
              value={formData.dentist_id}
              onChange={onChange}
            >
              <option value="">Unassigned</option>
              {dentistOptions.map((dentist) => (
                <option key={dentist.profileId} value={dentist.profileId}>
                  {dentist.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="room-form-modal__field">
            <label className="room-form-modal__label" htmlFor="room-status">
              Status
            </label>
            <select
              className="room-form-modal__input"
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

          <div className="room-form-modal__actions">
            <button
              className="room-form-modal__cancel-btn"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="room-form-modal__save-btn" type="submit">
              {isEditMode ? "Save changes" : "Save room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

RoomFormModal.propTypes = {
  dentistOptions: PropTypes.arrayOf(
    PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      profileId: PropTypes.number.isRequired,
    }),
  ).isRequired,
  formData: PropTypes.shape({
    room_name: PropTypes.string.isRequired,
    dentist_id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RoomFormModal;
