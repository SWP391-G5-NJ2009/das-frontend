import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./RoomFormModal.css";

function RoomFormModal({ formData, isEditMode, onChange, onClose, onSubmit }) {
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
            {isEditMode ? "Cập nhật phòng" : "Tạo phòng mới"}
          </h2>
          <button
            className="room-form-modal__close-btn"
            type="button"
            onClick={onClose}
            aria-label="Đóng biểu mẫu phòng"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="room-form-modal__field">
            <label className="room-form-modal__label" htmlFor="room-name">
              Tên phòng
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
            <label
              className="room-form-modal__label"
              htmlFor="room-specialization"
            >
              Specialization
            </label>
            <input
              className="room-form-modal__input"
              id="room-specialization"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={onChange}
              placeholder="Khám tổng quát"
            />
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
              <option value="Available">Có thể sử dụng</option>
              <option value="Maintenance">Bảo trì</option>
              <option value="Unavailable">Không khả dụng</option>
            </select>
          </div>

          <div className="room-form-modal__actions">
            <button
              className="room-form-modal__cancel-btn"
              type="button"
              onClick={onClose}
            >
              Hủy
            </button>
            <button className="room-form-modal__save-btn" type="submit">
              {isEditMode ? "Lưu thay đổi" : "Lưu phòng"}
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

export default RoomFormModal;
