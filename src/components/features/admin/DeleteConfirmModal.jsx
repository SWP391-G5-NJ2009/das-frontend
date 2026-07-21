import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../services/account.service";
import "./AddAccountModal.css";

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
      className="add-account-modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="add-account-modal">
        <div className="add-account-modal__header">
          <h3 className="add-account-modal__title">Xóa tài khoản</h3>
          <button
            className="add-account-modal__close"
            type="button"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className="add-account-modal__description">
          Bạn có chắc muốn xóa <strong>{account.username}</strong>?
          Hành động này không thể hoàn tác.
        </p>

        <div className="add-account-modal__actions">
          <button
            className="add-account-modal__btn add-account-modal__btn--cancel"
            type="button"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="add-account-modal__btn add-account-modal__btn--delete"
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
