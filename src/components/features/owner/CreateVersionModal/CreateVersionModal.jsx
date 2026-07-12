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
            setError("Please enter a version name.");
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
                    <h2 className="create-version-modal__title">Create New Version</h2>
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
                        Create a new version of the clinic schedule. The current active
                        schedule will be copied into this version so you can edit it before
                        it takes effect.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label className="create-version-modal__field">
                            <span className="create-version-modal__label">Version Name *</span>
                            <input
                                type="text"
                                className="create-version-modal__input"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError(null);
                                }}
                                placeholder="e.g. default, Summer 2026, etc."
                                maxLength={100}
                            />
                            {isFirstVersion && (
                                <span className="create-version-modal__hint">
                                    Suggested: &quot;default&quot; for your first schedule.
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
                                Cancel
                            </button>
                            <button
                                className="create-version-modal__btn create-version-modal__btn--confirm"
                                type="submit"
                            >
                                Create Version
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
