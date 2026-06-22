import PropTypes from "prop-types";
import { X } from "lucide-react";
import { accountService } from "../../../services/account.service";
import "./AddAccountModal.css";

function DeleteConfirmModal({ account, onClose, onSuccess }) {
  const handleDelete = async () => {
    try {
      await accountService.delete(account.account_id);
      onSuccess();
    } catch (err) {
      onClose();
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
          <h3 className="add-account-modal__title">Delete account</h3>
          <button
            className="add-account-modal__close"
            type="button"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p
          style={{
            margin: "0 0 var(--space-6)",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-neutral-600)",
            lineHeight: "var(--line-height-relaxed)",
          }}
        >
          Are you sure you want to delete <strong>{account.username}</strong>?
          This action cannot be undone.
        </p>

        <div className="add-account-modal__actions">
          <button
            className="add-account-modal__btn add-account-modal__btn--cancel"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="add-account-modal__btn add-account-modal__btn--submit"
            type="button"
            onClick={handleDelete}
            style={{ backgroundColor: "var(--color-error)" }}
          >
            Delete
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
};

export default DeleteConfirmModal;
