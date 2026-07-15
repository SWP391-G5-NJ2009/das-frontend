import { useState } from "react";
import PropTypes from "prop-types";
import { GitBranch, X } from "lucide-react";
import "./CreateVersionModal.css";

function CreateVersionModal({ isFirstVersion, onConfirm, onCancel }) {
    const [name, setName] = useState(isFirstVersion ? "default" : "");
    const [error, setError] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();

        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("Vui lòng nhập tên phiên bản.");
            return;
        }

        setError(null);
        onConfirm(trimmedName);
    }

    return (
        <div className="create-version-modal__overlay" onClick={onCancel}>
            <div
                className="create-version-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="create-version-modal__header">
                    <GitBranch size={24} className="create-version-modal__icon" />
                    <h2 className="create-version-modal__title">Tạo phiên bản mới</h2>
                    <button
                        className="create-version-modal__close"
                        type="button"
                        onClick={onCancel}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="create-version-modal__body">
                        <p className="create-version-modal__description">
                        Tạo phiên bản mới của lịch phòng khám. Lịch hiện tại đang hoạt động
                        sẽ được sao chép vào phiên bản này để bạn chỉnh sửa trước khi
                        nó có hiệu lực.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label className="create-version-modal__field">
                            <span className="create-version-modal__label">Tên phiên bản *</span>
                            <input
                                type="text"
                                className="create-version-modal__input"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError(null);
                                }}
                                placeholder="VD: mặc định, Hè 2026, ..."
                                maxLength={100}
                            />
                            {isFirstVersion && (
                                <span className="create-version-modal__hint">
                                    Gợi ý: "mặc định" cho lịch đầu tiên.
                                </span>
                            )}
                        </label>

                        {error && (
                            <p className="create-version-modal__error">{error}</p>
                        )}

                        <div className="create-version-modal__actions">
                            <button
                                className="create-version-modal__btn create-version-modal__btn--cancel"
                                type="button"
                                onClick={onCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="create-version-modal__btn create-version-modal__btn--confirm"
                                type="submit"
                            >
                                Tạo phiên bản
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

CreateVersionModal.propTypes = {
    isFirstVersion: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

CreateVersionModal.defaultProps = {
    isFirstVersion: false,
};

export default CreateVersionModal;
