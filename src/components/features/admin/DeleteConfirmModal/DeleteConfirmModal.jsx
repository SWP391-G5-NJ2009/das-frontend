import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../../services/account.service";
import "./DeleteConfirmModal.css";

function DeleteConfirmModal({ account, onClose, onSuccess, onError }) {
  const handleDelete = async () => {
    try {
      await accountService.delete(account.account_id);
      onSuccess();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div
      className="delete-confirm-modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="delete-confirm-modal">
        <div className="delete-confirm-modal__header">
          <h3 className="delete-confirm-modal__title">Xóa tài khoản</h3>
          <button
            className="delete-confirm-modal__close"
            type="button"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className="delete-confirm-modal__description">
          Bạn có chắc muốn xóa <strong>{account.username}</strong>?
          Hành động này không thể hoàn tác.
        </p>

        <div className="delete-confirm-modal__actions">
          <button
            className="delete-confirm-modal__btn delete-confirm-modal__btn--cancel"
            type="button"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="delete-confirm-modal__btn delete-confirm-modal__btn--delete"
            type="button"
            onClick={handleDelete}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmModal.propTypes = {
  account: PropTypes.shape({
    account_id: PropTypes.string.isRequired,
    username: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
